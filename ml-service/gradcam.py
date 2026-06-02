import numpy as np
import cv2
from PIL import Image
import base64

def generate_gradcam(image):
    img_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]
    success, encoded_img = cv2.imencode('.jpg', img_cv, encode_param)
    if not success:
        return None

    resaved_img = cv2.imdecode(encoded_img, cv2.IMREAD_COLOR)

    diff = cv2.absdiff(img_cv, resaved_img)

    multiplier = 15
    ela = np.clip(diff * multiplier, 0, 255).astype(np.uint8)

    ela_gray = cv2.cvtColor(ela, cv2.COLOR_BGR2GRAY)

    if np.max(ela_gray) != 0:
        heatmap = (ela_gray / np.max(ela_gray) * 255.0).astype(np.uint8)
    else:
        heatmap = ela_gray

    heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    original = np.array(image)
    img_rgb_dim = cv2.addWeighted(original, 0.7, np.zeros_like(original), 0.3, 0)

    overlay = cv2.addWeighted(
        img_rgb_dim,
        0.5,
        cv2.cvtColor(heatmap_color, cv2.COLOR_BGR2RGB),
        0.5,
        0
    )

    success, buffer = cv2.imencode('.jpg', cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR))
    if not success:
        return None

    encoded = base64.b64encode(buffer).decode()

    return encoded