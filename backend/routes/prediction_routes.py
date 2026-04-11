from fastapi import APIRouter, File, UploadFile
from services.prediction_service import (
    predict_diabetes, predict_heart, predict_lung,
    predict_dermatosis, predict_pneumonia
)
from schemas.prediction_schema import DiabetesInput, HeartInput, LungInput

router = APIRouter()

# ── existing routes (mat chhuo) ──────────────────────────────────────────────
@router.post("/diabetes")
def diabetes_prediction(data: DiabetesInput):
    return predict_diabetes(data.dict())

@router.post("/heart")
def heart_prediction(data: HeartInput):
    return predict_heart(data.dict())

@router.post("/lung")
def lung_prediction(data: LungInput):
    return predict_lung(data.dict())

# ── NEW: Dermatosis ──────────────────────────────────────────────────────────
@router.post("/dermatosis")
async def dermatosis_prediction(file: UploadFile = File(...)):
    image_bytes = await file.read()
    return predict_dermatosis(image_bytes)

# ── NEW: Pneumonia ───────────────────────────────────────────────────────────
@router.post("/pneumonia")
async def pneumonia_prediction(file: UploadFile = File(...)):
    image_bytes = await file.read()
    return predict_pneumonia(image_bytes)