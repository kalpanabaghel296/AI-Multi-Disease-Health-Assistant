import joblib
import torch

diabetes_model = joblib.load("ml_models/diabetes_model.joblib")
diabetes_scaler = joblib.load("ml_models/diabetes_scaler.joblib")
heart_model = joblib.load("ml_models/heart_ensemble_model.joblib")
heart_scaler = joblib.load("ml_models/heart_scaler.joblib")
heart_selector = joblib.load("ml_models/heart_feature_selector.joblib")
lung_model = joblib.load("ml_models/lung_risk_model.joblib")
lung_scaler = joblib.load("ml_models/lung_risk_scaler.joblib")
# dermatosis_model =joblib.load("ml_models/dermatosis_model.pth")
# pneumonia_model=joblib.load("ml_models/pneumonia_model.pth")

# CNN models will be loaded later in prediction serviced
