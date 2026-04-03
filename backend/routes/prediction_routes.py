from fastapi import APIRouter
from services.prediction_service import predict_diabetes, predict_heart, predict_lung
from schemas.prediction_schema import DiabetesInput, HeartInput, LungInput

router = APIRouter()


# ---------------- DIABETES ----------------
@router.post("/diabetes")
def diabetes_prediction(data: DiabetesInput):
    return predict_diabetes(data.dict())


# ---------------- HEART ----------------
@router.post("/heart")
def heart_prediction(data: HeartInput):
    return predict_heart(data.dict())


# ---------------- LUNG ----------------
@router.post("/lung")
def lung_prediction(data: LungInput):
    return predict_lung(data.dict())