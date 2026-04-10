from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

router = APIRouter()


class Query(BaseModel):
    message: str


@router.post("/chat")
def assistant_query(data: Query):

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
    {
        "role": "system",
        "content": """
You are a medical assistant AI.

Rules:
- Give SHORT, CLEAR, and SPECIFIC answers
- Use simple and easy-to-understand language
- Do NOT give long explanations
- Do NOT give a final diagnosis
- Use the user’s details (age, symptoms, duration, conditions) in your answer
- Mention possible common causes (not just generic statements)
- Give practical next steps (what to do now)
- Include warning signs (when to seek urgent care) if relevant
- Ask 1–2 short follow-up questions if more information is needed
- Suggest consulting a doctor when appropriate
- Do NOT give the same generic response for every question
- Focus only on answering the user’s question
"""
    },
            {"role": "user", "content": data.message}
        ]
    )

    return {
        "response": response.choices[0].message.content
    }