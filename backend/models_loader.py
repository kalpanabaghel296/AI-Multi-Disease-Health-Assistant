import joblib
import torch
# import torch
import torchvision.models as models
import torch.nn as nn


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

# ── Dermatosis Model (ResNet50, 7 classes) ──────────────────────────────────
def load_dermatosis_model():
    try:
        model = models.resnet50(weights=None)
        model.fc = nn.Linear(model.fc.in_features, 7)
        state_dict = torch.load(
            'ml_models/dermatosis_model.pth',
            map_location='cpu'
        )
        model.load_state_dict(state_dict)
        model.eval()
        return model
    except Exception as e:
        print(f"Dermatosis model load error: {e}")
        return None

# ── Pneumonia Model (DenseNet121, 2 classes) ─────────────────────────────────
def load_pneumonia_model():
    try:
        model = models.densenet121(weights=None)
        model.classifier = nn.Linear(
            model.classifier.in_features, 2
        )
        state_dict = torch.load(
            'ml_models/pneumonia_model.pth',
            map_location='cpu'
        )
        model.load_state_dict(state_dict)
        model.eval()
        return model
    except Exception as e:
        print(f"Pneumonia model load error: {e}")
        return None

dermatosis_model = load_dermatosis_model()
pneumonia_model  = load_pneumonia_model()