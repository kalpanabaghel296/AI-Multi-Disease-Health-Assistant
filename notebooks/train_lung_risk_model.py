import pandas as pd
import numpy as np
import joblib
import os

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE


# ---------------------------------------------------
# 1 Load Dataset
# ---------------------------------------------------

data = pd.read_csv("../datasets/lung_cancer_risk.csv")

print("Dataset Shape:", data.shape)
print(data.head())


# ---------------------------------------------------
# 2 Data Cleaning
# ---------------------------------------------------

# Convert target YES/NO → 1/0
data["LUNG_CANCER"] = data["LUNG_CANCER"].map({"YES":1, "NO":0})

# Convert feature values 1/2 → 1/0
data = data.replace({2:0})

# Convert gender
data["GENDER"] = data["GENDER"].map({"M":1, "F":0})


# ---------------------------------------------------
# 3 Feature Selection
# ---------------------------------------------------

features = [
    "AGE",
    "SMOKING",
    "YELLOW_FINGERS",
    "ANXIETY",
    "CHRONIC DISEASE",
    "COUGHING",
    "SHORTNESS OF BREATH",
    "CHEST PAIN",
    "WHEEZING",
    "ALCOHOL CONSUMING"
]

X = data[features]
y = data["LUNG_CANCER"]


print("\nSelected Features:", features)


# ---------------------------------------------------
# 4 Train Test Split
# ---------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# ---------------------------------------------------
# 5 Feature Scaling
# ---------------------------------------------------

scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)


# ---------------------------------------------------
# 6 Handle Class Imbalance
# ---------------------------------------------------

smote = SMOTE(random_state=42)

X_train, y_train = smote.fit_resample(X_train, y_train)

print("After SMOTE:", X_train.shape)


# ---------------------------------------------------
# 7 Model Comparison
# ---------------------------------------------------

print("\n==============================")
print("MODEL COMPARISON")
print("==============================")

models = {

    "Logistic Regression":
        LogisticRegression(max_iter=2000),

    "SVM":
        SVC(kernel="rbf", probability=True),

    "Random Forest":
        RandomForestClassifier(
            n_estimators=300,
            max_depth=10,
            random_state=42
        ),

    "XGBoost":
        XGBClassifier(
            n_estimators=300,
            learning_rate=0.05,
            max_depth=6,
            eval_metric="logloss",
            random_state=42
        )
}

for name, model in models.items():

    print("\nTraining:", name)

    model.fit(X_train, y_train)

    preds = model.predict(X_test)

    acc = accuracy_score(y_test, preds)

    print("Accuracy:", acc)

    print(classification_report(y_test, preds))


# ---------------------------------------------------
# 8 Ensemble Model (SVM + RF + XGB)
# ---------------------------------------------------

svm_model = SVC(kernel="rbf", probability=True)

rf_model = RandomForestClassifier(
    n_estimators=400,
    max_depth=12,
    random_state=42
)

xgb_model = XGBClassifier(
    n_estimators=400,
    learning_rate=0.03,
    max_depth=6,
    eval_metric="logloss",
    random_state=42
)

ensemble_model = VotingClassifier(

    estimators=[
        ("svm", svm_model),
        ("rf", rf_model),
        ("xgb", xgb_model)
    ],

    voting="soft"
)

print("\nTraining Ensemble Model...")

ensemble_model.fit(X_train, y_train)


# ---------------------------------------------------
# 9 Prediction
# ---------------------------------------------------

probs = ensemble_model.predict_proba(X_test)[:,1]

preds = (probs > 0.5).astype(int)


# ---------------------------------------------------
# 10 Evaluation
# ---------------------------------------------------

accuracy = accuracy_score(y_test, preds)

print("\nEnsemble Accuracy:", accuracy)

print("\nClassification Report:")
print(classification_report(y_test, preds))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, preds))


# ---------------------------------------------------
# 11 Cross Validation
# ---------------------------------------------------

scores = cross_val_score(ensemble_model, X_train, y_train, cv=5)

print("\nCross Validation Accuracy:", scores.mean())


# ---------------------------------------------------
# 12 Save Model
# ---------------------------------------------------

os.makedirs("../backend/ml_models", exist_ok=True)

joblib.dump(
    ensemble_model,
    "../backend/ml_models/lung_risk_model.joblib"
)

joblib.dump(
    scaler,
    "../backend/ml_models/lung_risk_scaler.joblib"
)

print("\nLung Cancer Risk Model Saved Successfully!")