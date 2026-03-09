import pandas as pd
import numpy as np
import os
import joblib
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.model_selection import cross_val_score

from imblearn.over_sampling import SMOTE
from xgboost import XGBClassifier


# ----------------------------------------------------
# 1 Load Dataset
# ----------------------------------------------------

data = pd.read_csv("../datasets/diabetes.csv")

print("Dataset Shape:", data.shape)

# ----------------------------------------------------
# 2 Separate Features and Target
# ----------------------------------------------------

X = data.drop("Diabetes_binary", axis=1)
y = data["Diabetes_binary"]

print("Features:", X.shape)

# ----------------------------------------------------
# 3 Feature Selection (important)
# ----------------------------------------------------

selector = SelectKBest(score_func=f_classif, k=15)

X_selected = selector.fit_transform(X, y)

selected_features = X.columns[selector.get_support()]

print("\nSelected Features:")
print(selected_features)

# ----------------------------------------------------
# 4 Train Test Split
# ----------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X_selected,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# ----------------------------------------------------
# 5 Fix Class Imbalance using SMOTE
# ----------------------------------------------------

smote = SMOTE(random_state=42)

X_train, y_train = smote.fit_resample(X_train, y_train)

print("\nAfter SMOTE balancing:", X_train.shape)

# ----------------------------------------------------
# 6 Feature Scaling
# ----------------------------------------------------

scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# ----------------------------------------------------
# 7 Train XGBoost Model
# ----------------------------------------------------

model = XGBClassifier(
    n_estimators=600,
    learning_rate=0.03,
    max_depth=8,
    subsample=0.9,
    colsample_bytree=0.9,
    scale_pos_weight=5.5,
    objective="binary:logistic",
    eval_metric="logloss",
    n_jobs=-1
)

print("\nTraining XGBoost model...")

model.fit(X_train, y_train)

# ----------------------------------------------------
# 8 Prediction
# ----------------------------------------------------

probs = model.predict_proba(X_test)[:,1]

predictions = (probs > 0.55).astype(int)

# ----------------------------------------------------
# 9 Evaluation
# ----------------------------------------------------

accuracy = accuracy_score(y_test, predictions)

print("\nAccuracy:", accuracy)

print("\nClassification Report:")
print(classification_report(y_test, predictions))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, predictions))

# ----------------------------------------------------
# 10 Cross Validation
# ----------------------------------------------------

scores = cross_val_score(model, X_train, y_train, cv=5)

print("\nCross Validation Accuracy:", scores.mean())

# ----------------------------------------------------
# 11 Feature Importance Plot
# ----------------------------------------------------

importances = model.feature_importances_

plt.figure(figsize=(10,6))

plt.barh(range(len(importances)), importances)

plt.title("Feature Importance")

plt.xlabel("Importance Score")

plt.show()

# ----------------------------------------------------
# 12 Save Model
# ----------------------------------------------------

os.makedirs("../backend/ml_models", exist_ok=True)

joblib.dump(model, "../backend/ml_models/diabetes_model.joblib")

joblib.dump(scaler, "../backend/ml_models/diabetes_scaler.joblib")

joblib.dump(selector, "../backend/ml_models/feature_selector.joblib")

print("\nModel, scaler, and feature selector saved successfully!")