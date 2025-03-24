import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
api_key = os.getenv("OPENROUTER_API_KEY")

# Setup OpenRouter client
client = OpenAI(
    api_key=api_key,
    base_url="https://openrouter.ai/api/v1",
    default_headers={
        "HTTP-Referer": "http://localhost:3000/",  # or your deployed frontend
        "X-Title": "Siri2.0",
    },
)

# Initial saved knowledge
initial_documents = [
    "Siri2.0 was created by Aditi to help users access internal notes.",
    "It only answers based on the provided saved knowledge.",
    "Siri2.0 can summarize uploaded text files or documents.",
    "I have a doctor’s appointment on Monday at 3 PM.",
    "I bought a MacBook Air last week.",
    "I am feeling tired lately.",
    "Tanvi's birthday is coming up on Friday.",
    "I have 32 apps in my phone.",
    "I received an email from Nitin about our group project."

]

# Memory of the current session
conversation_memory = initial_documents.copy()

def get_relevant_context(user_input):
    return [doc for doc in conversation_memory if any(word.lower() in doc.lower() for word in user_input.split())]


def get_email_summary():
    try:
        with open(r"C:\Users\Acer\Desktop\CSUChico\FULL STACK\Siri\Siri2.0\backend\email.txt", "r", encoding="utf-8", errors="replace") as f:
            content = f.read()


        prompt = f"""You are an assistant that reads emails.
Here is the content of the email:

{content}

Summarize this email and highlight any to-dos."""
        
        response = client.chat.completions.create(
            model="openai/gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are Siri2.0, an assistant that summarizes emails."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content

    except Exception as e:
        return f"⚠️ Error reading email: {str(e)}"

def get_siri2_response(user_input):
    # Save the user's message
    conversation_memory.append(f"User: {user_input}")

    # Check if the question is about emails and trigger summary
    if "email" in user_input.lower():
        email_summary = get_email_summary()
        conversation_memory.append(f"Assistant: {email_summary}")
        return email_summary

    # Otherwise, continue with normal context-based response
    relevant_context = get_relevant_context(user_input)
    context_string = "\n".join(relevant_context) if relevant_context else "No relevant context found."

    prompt = f"""You are a smart assistant with memory.
Only use the user's context to answer their current question.
If nothing in the context is helpful, say you don't know.
Make relevant conversation with the user by asking more questions, if you don't know the answer.
Try to connect the context with the question if possible; otherwise, say you don't know.

Context:
{context_string}

User: {user_input}
Assistant:"""

    response = client.chat.completions.create(
        model="openai/gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are Siri2.0, a helpful assistant that responds only using the context given."},
            {"role": "user", "content": prompt}
        ]
    )

    assistant_reply = response.choices[0].message.content
    conversation_memory.append(f"Assistant: {assistant_reply}")
    return assistant_reply
