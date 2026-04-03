from fastapi import APIRouter, UploadFile, File
from services.report_extraction import extract_report_data
import os

router = APIRouter()


# ---------------- UPLOAD REPORT ----------------
@router.post("/upload-report")
async def upload_report(file: UploadFile = File(...)):

    os.makedirs("uploads", exist_ok=True)

    content = await file.read()

    with open(f"uploads/{file.filename}", "wb") as f:
        f.write(content)

    return {"message": "Report uploaded successfully"}


# ---------------- EXTRACT DATA ----------------
@router.post("/extract")
async def extract_report(file: UploadFile = File(...)):
    return await extract_report_data(file)


@router.post("/analyze")
async def analyze_report(file: UploadFile = File(...)):
    from services.prediction_service import (
        predict_diabetes,
        predict_heart,
        predict_lung
    )

    extracted = await extract_report_data(file)
    structured = extracted["structured_data"]

    lab = structured.get("lab_values", {})

    # ---------------- DIABETES INPUT ----------------
    diabetes_input = {
        "pregnancies": 0,
        "glucose": lab.get("glucose", 0),
        "blood_pressure": lab.get("blood_pressure", 0),
        "skin_thickness": 0,
        "insulin": 0,
        "bmi": 0,
        "diabetes_pedigree": 0,
        "age": structured.get("age", 0)
    }

    # ---------------- HEART INPUT ----------------
    heart_input = {
        "age": structured.get("age", 0),
        "sex": 1,
        "cp": 0,
        "trestbps": lab.get("blood_pressure", 0),
        "chol": lab.get("cholesterol", 0),
        "fbs": 0,
        "restecg": 1,
        "thalach": 150,
        "exang": 0,
        "oldpeak": 1.0,
        "slope": 2,
        "ca": 0,
        "thal": 2
    }

    # ---------------- LUNG INPUT ----------------
    lung_input = {
        "age": structured.get("age", 0),
        "smoking": 1 if "smoking" in structured.get("medical_info", {}) else 0,
        "yellow_fingers": 0,
        "anxiety": 0,
        "peer_pressure": 0,
        "chronic_disease": 0,
        "fatigue": 1 if "fatigue" in structured.get("symptoms", []) else 0,
        "allergy": 0,
        "wheezing": 0,
        "alcohol_consuming": 0,
        "coughing": 1 if "cough" in structured.get("symptoms", []) else 0,
        "shortness_of_breath": 1 if "shortness of breath" in structured.get("symptoms", []) else 0,
        "swallowing_difficulty": 0,
        "chest_pain": 1 if "chest pain" in structured.get("symptoms", []) else 0
    }

    # ---------------- PREDICTIONS ----------------
    diabetes_result = predict_diabetes(diabetes_input)
    heart_result = predict_heart(heart_input)
    lung_result = predict_lung(lung_input)

    return {
        "extracted_data": structured,
        "predictions": {
            "diabetes": diabetes_result,
            "heart": heart_result,
            "lung": lung_result
        }
    }