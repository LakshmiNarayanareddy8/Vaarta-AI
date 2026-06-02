from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from model import predict
from PIL import Image
import io

app = FastAPI(title="Fake News Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "running",
        "service": "Fake News Detection API"
    }

@app.post("/predict")
async def analyze(
    image: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None)
):
    try:
        pil_image = None

        if image:
            image_bytes = await image.read()
            pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        result = predict(
            image=pil_image,
            text=text
        )

        return result

    except Exception as e:
        return {
            "prediction": "Error",
            "confidence": 0,
            "attention_heatmap": None,
            "explanation_summary": str(e),
            "news_title": None,
            "news_preview": None,
            "news_image": None
        }