import io
import json
import base64
import torch
import clip
from PIL import Image
from readability import Document
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
from gradcam import generate_gradcam
import os
from groq import Groq

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

device = "cuda" if torch.cuda.is_available() else "cpu"
clip_model, preprocess = clip.load("ViT-B/32", device=device)


def extract_text_from_url(url):
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.goto(url, timeout=15000)
            page.wait_for_load_state("networkidle", timeout=10000)
            html = page.content()
            browser.close()

        doc = Document(html)
        title = doc.title() or "News Article"
        summary_html = doc.summary()

        soup = BeautifulSoup(summary_html, "html.parser")
        paragraphs = soup.find_all("p")

        text = " ".join([
            p.get_text().strip()
            for p in paragraphs
            if len(p.get_text().strip()) > 40
        ])

        if not text:
            return None

        soup_main = BeautifulSoup(html, "html.parser")
        meta_image = soup_main.find("meta", property="og:image")
        image_url = meta_image["content"] if meta_image and meta_image.get("content") else None

        return {
            "title": title.strip(),
            "content": text[:2000],
            "preview": text[:500],
            "image": image_url
        }

    except Exception:
        return None


def clip_check(image, text):
    image_input = preprocess(image).unsqueeze(0).to(device)
    text_input = clip.tokenize([text]).to(device)

    with torch.no_grad():
        image_features = clip_model.encode_image(image_input)
        text_features = clip_model.encode_text(text_input)
        similarity = torch.cosine_similarity(image_features, text_features).item()

    return similarity


def calculate_confidence(prediction, similarity=None, text=None):
    score = 0.5

    if text:
        length_factor = min(len(text) / 1000, 1.0)
        score += 0.2 * length_factor

    if similarity is not None:
        if similarity > 0.3:
            score += 0.3
        elif similarity > 0.2:
            score += 0.15
        else:
            score -= 0.2

    if prediction == "Fake":
        score += 0.1
    elif prediction == "Real":
        score += 0.05

    return max(0.0, min(score, 0.95))


def groq_fact_check(text):
    system_prompt = """
    You are an expert fact-checker.

    Return ONLY JSON:
    {
      "prediction": "Fake" | "Real",
      "reason": "Explanation"
    }
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ],
            temperature=0.1,
            max_tokens=300
        )

        reply = response.choices[0].message.content.strip()

        if reply.startswith("```"):
            reply = reply.replace("```json", "").replace("```", "").strip()

        return json.loads(reply)

    except Exception as e:
        return {
            "prediction": "Uncertain",
            "reason": str(e)
        }


def groq_multimodal_check(image, text):
    similarity = clip_check(image, text)

    if similarity < 0.2:
        hint = "Image does not match the text."
    elif similarity < 0.3:
        hint = "Weak alignment."
    else:
        hint = "Strong alignment."

    prompt = f"""
    Claim: {text}

    Image-text similarity: {similarity}
    Analysis: {hint}

    Decide if Fake or Real.
    Return JSON with prediction and reason.
    """

    result = groq_fact_check(prompt)

    confidence = calculate_confidence(
        result.get("prediction"),
        similarity,
        text
    )

    result["confidence"] = confidence
    return result


def groq_image_only_check(image):
    prompt = """
    Analyze if this image is Fake or Real.

    Return JSON:
    {
      "prediction": "Fake" | "Real",
      "reason": "Explain"
    }
    """

    result = groq_fact_check(prompt)

    confidence = calculate_confidence(
        result.get("prediction"),
        similarity=None,
        text=None
    )

    result["confidence"] = confidence
    return result


def predict(image=None, text=None):
    news_title = None
    news_preview = None
    news_image = None
    heatmap = None

    if text and text.startswith("http"):
        extracted = extract_text_from_url(text)
        if extracted:
            news_title = extracted["title"]
            news_preview = extracted["preview"]
            news_image = extracted["image"]
            text = extracted["content"]

    if image and text:
        llm_output = groq_multimodal_check(image, text)
        heatmap = generate_gradcam(image)

    elif text and not image:
        llm_output = groq_fact_check(text)
        llm_output["confidence"] = calculate_confidence(
            llm_output.get("prediction"),
            similarity=None,
            text=text
        )

    elif image and not text:
        llm_output = groq_image_only_check(image)
        heatmap = generate_gradcam(image)

    else:
        return {
            "prediction": "Error",
            "confidence": 0.0,
            "attention_heatmap": None,
            "explanation_summary": "No input provided",
            "news_title": None,
            "news_preview": None,
            "news_image": None
        }

    return {
        "prediction": llm_output.get("prediction", "Uncertain"),
        "confidence": round(llm_output.get("confidence", 0.0) * 100, 2),
        "attention_heatmap": heatmap,
        "explanation_summary": llm_output.get("reason", ""),
        "news_title": news_title,
        "news_preview": news_preview,
        "news_image": news_image
    }