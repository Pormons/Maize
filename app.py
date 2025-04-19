from fastapi import UploadFile, File
from PIL import Image
import torch
import torchvision.transforms as T
import io

# Configuration
NUM_CLASSES = 4  
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = resource_path("model.pth") 

# Load the model
def load_custom_model():
    model = create_model(num_classes=NUM_CLASSES, pretrained=False)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.to(DEVICE)
    model.eval()
    return model

detection_model = load_custom_model()

# Image transforms
transform = T.Compose([
    T.ToTensor()
])

@app.post("/detect/")
async def detect_objects(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image_tensor = transform(image).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        outputs = detection_model(image_tensor)[0]

    width, height = image.size
    predictions = []
    for box, label, score in zip(outputs["boxes"], outputs["labels"], outputs["scores"]):
        if score < 0.3:  # Confidence threshold
            continue
        x1, y1, x2, y2 = box
        predictions.append({
            "x": float((x1 + x2) / 2),
            "y": float((y1 + y2) / 2),
            "width": float(x2 - x1),
            "height": float(y2 - y1),
            "class": "helmet" if label.item() == 1 else f"class_{label.item()}",  # Adjust class logic as needed
            "confidence": float(score)
        })

    return {
        "predictions": predictions,
        "image": {
            "width": width,
            "height": height
        }
    }
