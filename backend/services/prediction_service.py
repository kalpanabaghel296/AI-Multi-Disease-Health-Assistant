import numpy as np
from models_loader import (
    diabetes_model, diabetes_scaler,
    heart_model, heart_scaler, heart_selector,
    lung_model, lung_scaler
)

# ---------------- HELPER FUNCTION ----------------
def prepare_features(input_list, expected_size):
    features = [0] * expected_size

    for i in range(min(len(input_list), expected_size)):
        val = input_list[i]

        # 🔥 handle None / invalid values
        if val is None:
            val = 0

        try:
            val = float(val)
        except:
            val = 0

        features[i] = val

    return np.array(features).reshape(1, -1)


# ---------------- DIABETES ----------------
def predict_diabetes(data):
    try:
        input_features = [
            data.get("pregnancies", 0),
            data.get("glucose", 0),
            data.get("blood_pressure", 0),
            data.get("skin_thickness", 0),
            data.get("insulin", 0),
            data.get("bmi", 0),
            data.get("diabetes_pedigree", 0),
            data.get("age", 0)
        ]

        features = prepare_features(input_features, diabetes_scaler.n_features_in_)
        scaled = diabetes_scaler.transform(features)
        features = np.nan_to_num(features)
        prediction = diabetes_model.predict(scaled)[0]

        return {
            "prediction": int(prediction),
            "result": "Diabetic" if prediction == 1 else "Non-Diabetic"
        }

    except Exception as e:
        return {"error": str(e)}


# ---------------- HEART ----------------
def predict_heart(data):
    try:
        expected_size = heart_scaler.n_features_in_

        input_features = [
            data.get("age", 0),
            data.get("sex", 1),
            data.get("cp", 0),
            data.get("trestbps", 0),
            data.get("chol", 0),
            data.get("fbs", 0),
            data.get("restecg", 1),
            data.get("thalach", 150),
            data.get("exang", 0),
            data.get("oldpeak", 1.0),
            data.get("slope", 2),
            data.get("ca", 0),
            data.get("thal", 2)
        ]

        # 🔥 PAD to expected size
        features = [0] * expected_size
        for i in range(min(len(input_features), expected_size)):
            features[i] = float(input_features[i] or 0)

        features = np.array(features).reshape(1, -1)
        features = np.nan_to_num(features)

        scaled = heart_scaler.transform(features)

        # 🔥 SAFE SELECTOR
        try:
            selected = heart_selector.transform(scaled)
        except:
            selected = scaled  # fallback

        prediction = heart_model.predict(selected)[0]

        return {
            "prediction": int(prediction),
            "result": "Heart Disease Risk" if prediction == 1 else "Normal"
        }

    except Exception as e:
        return {"error": str(e)}

# ---------------- LUNG ----------------
def predict_lung(data):
    try:
        input_features = [
            data.get("age", 0),
            data.get("smoking", 0),
            data.get("yellow_fingers", 0),
            data.get("anxiety", 0),
            data.get("peer_pressure", 0),
            data.get("chronic_disease", 0),
            data.get("fatigue", 0),
            data.get("allergy", 0),
            data.get("wheezing", 0),
            data.get("alcohol_consuming", 0),
            data.get("coughing", 0),
            data.get("shortness_of_breath", 0),
            data.get("swallowing_difficulty", 0),
            data.get("chest_pain", 0)
        ]

        features = prepare_features(input_features, lung_scaler.n_features_in_)
        scaled = lung_scaler.transform(features)
        features = np.nan_to_num(features)
        prob = lung_model.predict_proba(scaled)[0][1]

        risk_percentage = round(prob * 100, 2)

        if risk_percentage < 30:
            level = "Low"
        elif risk_percentage < 70:
            level = "Medium"
        else:
            level = "High"

        return {
            "risk_percentage": risk_percentage,
            "risk_level": level
        }

    except Exception as e:
        return {"error": str(e)}