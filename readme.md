# 🧠 AI Healthcare Prediction System

An intelligent full-stack AI system that predicts diseases from medical data and reports using Machine Learning, OCR, and LLMs.

---

## 🚀 Features

### 🔍 1. Disease Prediction APIs

* Diabetes Prediction
* Heart Disease Prediction
* Lung Cancer Risk Prediction

---

### 📄 2. Medical Report Analysis

* Upload PDF / Image reports
* Extract text using OCR (Tesseract)
* Convert unstructured data → structured JSON
* Predict diseases automatically

---

### 🤖 3. AI Assistant (Chatbot)

* Ask medical questions
* Get short, clear responses
* Powered by Groq LLM

---

### 🧠 4. Smart Extraction

* Uses LLM (Groq) for intelligent parsing
* Fallback to regex if needed
* Handles real-world medical reports

---

## 🏗️ Tech Stack

### 🔧 Backend

* FastAPI
* Python
* Scikit-learn
* Tesseract OCR
* Groq API (LLM)

### 🎨 Frontend

* React.js
* Axios

---

## 📁 Project Structure

backend/
├── routes/
│    ├── prediction_routes.py
│    ├── report_routes.py
│    ├── assistant_routes.py
│
├── services/
│    ├── prediction_service.py
│    ├── report_extraction.py
│
├── schemas/
│    ├── prediction_schema.py
│
├── models_loader.py
├── app.py

frontend/
├── src/
│    ├── components/
│    │    ├── UploadReport.js
│    │    ├── ChatAssistant.js
│    │
│    ├── App.js

---

## ⚙️ Setup Instructions

### 🔹 1. Clone Repository

git clone https://github.com/kalpanabaghel296/AI-Multi-Disease-Health-Assistant.git
cd AI-Multi-Disease-Health-Assistant

---

### 🔹 2. Backend Setup

cd backend

# Create virtual environment

python -m venv venv

# Activate

venv\Scripts\activate   (Windows)

# source venv/bin/activate  (Mac/Linux)

# Install dependencies

pip install -r requirements.txt

---

### 🔹 3. Setup Environment Variables

Create `.env` file inside `backend/`:

GROQ_API_KEY=your_api_key_here

---

### 🔹 4. Install Tesseract OCR

Download and install:
https://github.com/UB-Mannheim/tesseract/wiki

Set path in code:

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

---

### 🔹 5. Run Backend

uvicorn app:app --reload

Open:
http://127.0.0.1:8000/docs

---

### 🔹 6. Frontend Setup

cd HealthPredictionNew
npm install
npx react-native run-android

---

## 🌐 API Endpoints

### 🔬 Prediction APIs

* POST /predict/diabetes
* POST /predict/heart
* POST /predict/lung

---

### 📄 Report APIs

* POST /report/upload-report
* POST /report/extract
* POST /report/analyze

---

### 🤖 Assistant API

* POST /assistant/query

---

## 🧪 Example Usage

### Assistant API

{
"message": "I have fever and cough, what should I do?"
}

---

### Report Analysis

Upload a medical report (PDF/Image) → Get:

* Extracted data
* Disease predictions

---

## ⚠️ Important Notes

* Do NOT upload `.env` file to GitHub
* API keys must remain private
* Predictions are for informational purposes only

---

## 🚀 Future Improvements

* Improve LLM extraction accuracy
* Add chat history
* Build mobile app (React Native)
* Deploy backend & frontend
* Add image-based disease detection

---

