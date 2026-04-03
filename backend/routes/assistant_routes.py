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


@router.post("/query")
def assistant_query(data: Query):

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
    {
        "role": "system",
        "content": """
You are a medical assistant AI.

Rules:
- Give SHORT and CLEAR answers 
- Use simple language
- Do NOT give long explanations
- Do NOT give final diagnosis
- Suggest consulting a doctor if needed
- Focus only on answering the question

"""
    },
            {"role": "user", "content": data.message}
        ]
    )

    return {
        "response": response.choices[0].message.content
    }