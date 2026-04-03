import pdfplumber
import pytesseract
from PIL import Image
import io
import re
import json
import os
from groq import Groq
from dotenv import load_dotenv

# ---------------- LOAD ENV ----------------
load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ---------------- TESSERACT PATH ----------------
pytesseract.pytesseract.tesseract_cmd = r"C:\Users\LAB\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"


# ---------------- TEXT EXTRACTION ----------------
async def extract_report_data(file):
    content = await file.read()

    if file.filename.endswith(".pdf"):
        text = extract_from_pdf(content)
    else:
        text = extract_from_image(content)

    # fallback if text empty
    if not text or len(text.strip()) == 0:
        return {"error": "No text extracted from file"}

    structured_data = llm_extract(text)

    return {
        "raw_text": text[:500],
        "structured_data": structured_data
    }


# ---------------- PDF ----------------
def extract_from_pdf(content):
    text = ""
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text


# ---------------- IMAGE (OCR) ----------------
def extract_from_image(content):
    image = Image.open(io.BytesIO(content))
    text = pytesseract.image_to_string(image)
    return text


# ---------------- SMART REGEX (FALLBACK) ----------------
def extract_features(text):
    data = {
        "age": None,
        "lab_values": {},
        "symptoms": [],
        "medical_info": {}
    }

    text = text.lower()

    # AGE
    age_match = re.search(r'age[:\s]+(\d+)', text)
    if age_match:
        data["age"] = int(age_match.group(1))

    # LAB VALUES
    patterns = {
        "glucose": r'(glucose|sugar)[:\s]+(\d+)',
        "blood_pressure": r'(blood pressure|bp)[:\s]+(\d+)',
        "cholesterol": r'cholesterol[:\s]+(\d+)'
    }

    for key, pattern in patterns.items():
        match = re.search(pattern, text)
        if match:
            data["lab_values"][key] = float(match.group(len(match.groups())))

    return data


# ---------------- LLM EXTRACTION ----------------
def llm_extract(text):
    prompt = f"""
You are a medical data extraction AI.

Extract ALL possible medical information from the report.

Rules:
- If value is not present → return null
- Try to infer values if clearly mentioned
- Extract BP even if written as 120/80
- Extract glucose even if written as sugar

Return STRICT JSON:

{{
  "age": number or null,
  "lab_values": {{
    "glucose": number or null,
    "blood_pressure": number or null,
    "cholesterol": number or null
  }},
  "symptoms": [],
  "diagnosis": "text"
}}

Report:
{text}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",   # ✅ FIXED MODEL
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0
        )

        result = response.choices[0].message.content.strip()

        return json.loads(result)

    except json.JSONDecodeError:
        # 🔥 fallback if LLM gives bad JSON
        return {
            "warning": "LLM parsing failed, using fallback",
            "fallback_data": extract_features(text)
        }

    except Exception as e:
        return {
            "error": str(e)
        }