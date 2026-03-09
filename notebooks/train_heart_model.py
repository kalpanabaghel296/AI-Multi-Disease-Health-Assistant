import pandas as pd
import numpy as np
import joblib
import os

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.feature_selection import SelectKBest, f_classif

from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier, VotingClassifier

from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
from sklearn.metrics import roc_curve


# ----------------------------------------------------
# 1 Load Dataset
# ----------------------------------------------------

data = pd.read_csv("../datasets/heart_disease.csv")

print("Dataset Shape:", data.shape)
print(data.head())


# ----------------------------------------------------
# 2 Handle Missing Values
# ----------------------------------------------------

data.fillna(data.median(), inplace=True)


# ----------------------------------------------------
# 3 Separate Features and Target
# ----------------------------------------------------

X = data.drop("TenYearCHD", axis=1)
y = data["TenYearCHD"]


# ----------------------------------------------------
# 4 Feature Selection
# ----------------------------------------------------

selector = SelectKBest(score_func=f_classif, k=10)

X_selected = selector.fit_transform(X, y)

selected_features = X.columns[selector.get_support()]

print("\nSelected Features:")
print(selected_features)


# ----------------------------------------------------
# 5 Train Test Split
# ----------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X_selected,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# ----------------------------------------------------
# 6 Handle Class Imbalance
# ----------------------------------------------------

smote = SMOTE(random_state=42)

X_train, y_train = smote.fit_resample(X_train, y_train)

print("After SMOTE:", X_train.shape)


# ----------------------------------------------------
# 7 Feature Scaling
# ----------------------------------------------------

scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)


# ----------------------------------------------------
# 8 Model Comparison
# ----------------------------------------------------

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
            max_depth=12,
            class_weight="balanced",
            random_state=42
        ),

    "XGBoost":
        XGBClassifier(
            n_estimators=300,
            learning_rate=0.05,
            max_depth=6,
            eval_metric="logloss",
            random_state=42,
            n_jobs=-1
        )
}

for name, model in models.items():

    print("\nTraining:", name)

    model.fit(X_train, y_train)

    preds = model.predict(X_test)

    acc = accuracy_score(y_test, preds)

    print("Accuracy:", acc)

    print(classification_report(y_test, preds))


# ----------------------------------------------------
# 9 Define Strong Models for Ensemble
# ----------------------------------------------------

rf_model = RandomForestClassifier(
    n_estimators=500,
    max_depth=14,
    class_weight={0:1, 1:4},
    random_state=42
)

xgb_model = XGBClassifier(
    n_estimators=500,
    learning_rate=0.03,
    max_depth=7,
    subsample=0.9,
    colsample_bytree=0.9,
    scale_pos_weight=5,
    eval_metric="logloss",
    random_state=42,
    n_jobs=-1
)


# ----------------------------------------------------
# 10 Ensemble Model
# ----------------------------------------------------

ensemble_model = VotingClassifier(
    estimators=[
        ("rf", rf_model),
        ("xgb", xgb_model)
    ],
    voting="soft"
)

print("\nTraining Ensemble Model...")

ensemble_model.fit(X_train, y_train)


# ----------------------------------------------------
# 11 Prediction + Threshold Optimization
# ----------------------------------------------------

probs = ensemble_model.predict_proba(X_test)[:,1]

fpr, tpr, thresholds = roc_curve(y_test, probs)

optimal_idx = (tpr - fpr).argmax()

best_threshold = thresholds[optimal_idx]

print("\nBest threshold:", best_threshold)

predictions = (probs > best_threshold).astype(int)


# ----------------------------------------------------
# 12 Evaluation
# ----------------------------------------------------

accuracy = accuracy_score(y_test, predictions)

print("\nAccuracy:", accuracy)

print("\nClassification Report:")
print(classification_report(y_test, predictions))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, predictions))


# ----------------------------------------------------
# 13 Cross Validation
# ----------------------------------------------------

scores = cross_val_score(ensemble_model, X_train, y_train, cv=5)

print("\nCross Validation Accuracy:", scores.mean())


# ----------------------------------------------------
# 14 Save Model
# ----------------------------------------------------

os.makedirs("../backend/ml_models", exist_ok=True)

joblib.dump(ensemble_model, "../backend/ml_models/heart_ensemble_model.joblib")
joblib.dump(scaler, "../backend/ml_models/heart_scaler.joblib")
joblib.dump(selector, "../backend/ml_models/heart_feature_selector.joblib")

print("\nHeart Ensemble Model Saved Successfully!")