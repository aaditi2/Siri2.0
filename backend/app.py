from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from rag_engine import get_siri2_response
from pydantic import BaseModel

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to Netlify URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    user_input: str

@app.post("/chat")
async def chat(query: Query):
    response = get_siri2_response(query.user_input)
    return {"response": response}
