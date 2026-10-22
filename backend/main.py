import os
import uuid
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import chromadb
from chromadb.utils import embedding_functions
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted
from pathlib import Path

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel("gemini-3.6-flash")

from supabase import create_client


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise ValueError(
        "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env"
    )

supabase_client = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
)

def load_known_subjects():
    result = supabase_client.table("subjects").select("subject_name").execute()
    names = set(row["subject_name"] for row in result.data)
    return sorted(names, key=len, reverse=True)

try:
    KNOWN_SUBJECTS = load_known_subjects()
    print(f"Loaded {len(KNOWN_SUBJECTS)} known subjects for question matching.")
except Exception as e:
    KNOWN_SUBJECTS = []
    print(f"WARNING: Could not load subjects from Supabase at startup ({e}). Subject-matching will be disabled until this is fixed.")

BASE_DIR = Path(__file__).resolve().parent.parent
CHROMA_DB_PATH = str(BASE_DIR / "chroma_db")
chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
embedding_fn = embedding_functions.DefaultEmbeddingFunction()
collection = chroma_client.get_collection(name="gtu_syllabus", embedding_function=embedding_fn)

app = FastAPI(
    title="GTU Campus Geek API",
    description="Backend API for GTU Campus Geek",
    version="1.0.0"
)



app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://gtu-campus-geek.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class QuestionRequest(BaseModel):
    question: str
    conversation_id: str | None = None
    branch: str = None
    semester: int = None
    subject_name: str = None


def get_user_id_from_token(authorization: str | None):
    """
    Verifies the Supabase access token sent by the frontend and returns the user's ID.
    Returns None if no token was provided or it's invalid - the assistant still works,
    just without saving/using chat history for that request.
    """
    if not authorization:
        return None
    try:
        token = authorization.replace("Bearer ", "").strip()
        user_response = supabase_client.auth.get_user(token)
        return user_response.user.id
    except Exception:
        return None


def fetch_recent_history(user_id, conversation_id, limit=3):
    """Gets the last few Q&A pairs of THIS conversation, oldest first, for follow-up context."""
    if not user_id or not conversation_id:
        return []
    try:
        result = (
            supabase_client.table("chat_messages")
            .select("question, answer")
            .eq("user_id", user_id)
            .eq("conversation_id", conversation_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return list(reversed(result.data))
    except Exception as e:
        print(f"WARNING: Could not load chat history: {e}")
        return []



def save_chat_message(user_id, conversation_id, question, answer, sources):
    if not user_id:
        print("CHAT SAVE FAILED: No authenticated user ID.")
        return False

    try:
        print("CHAT SAVE DEBUG")
        print("User ID:", user_id)
        print("Supabase URL:", os.getenv("SUPABASE_URL"))
        print(
            "Service-role key loaded:",
            bool(os.getenv("SUPABASE_SERVICE_ROLE_KEY"))
        )

        result = (
            supabase_client.table("chat_messages")
            .insert({
                "user_id": user_id,
                "conversation_id": conversation_id,
                "question": question,
                "answer": answer,
                "sources": ", ".join(sources) if sources else None
            })
            .execute()
        )

        print("CHAT SAVE SUCCESS:", result.data)
        return True

    except Exception as e:
        print("CHAT SAVE FAILED:", repr(e))
        return False


@app.get("/")
def root():
    return {"message": "GTU Campus Geek Backend is running!"}


@app.post("/api/ask")
def ask_question(request: QuestionRequest, authorization: str | None = Header(default=None)):
    user_id = get_user_id_from_token(authorization)
    question_lower = request.question.lower()

    # A new chat has no conversation_id yet, so we create one and send it back to the frontend
    conversation_id = request.conversation_id or str(uuid.uuid4())

    # Handle questions about the assistant itself, before touching RAG/Gemini
    capability_phrases = [
        "what can you do", "who are you", "what are you", "your capabilities",
        "your features", "how do you work", "what do you do", "help me understand you",
        "what is gtu campus geek", "tell me about yourself", "introduce yourself"
    ]
    if any(phrase in question_lower for phrase in capability_phrases):
        answer_text = (
            "I'm GTU Campus Geek, your syllabus-based AI study assistant for GTU Diploma Engineering.\n\n"
            "Here's what I can help with:\n"
            "- Explain any topic from your official GTU syllabus, like a teacher would\n"
            "- Answer questions about specific units, subjects, or sub-topics\n"
            "- Cover all 7 branches (IT, Computer, Electrical, Civil, Mechanical, Chemical, Plastic Engineering) across Semesters 1-5\n"
            "- Give you the PDF of a subject's syllabus if you ask for it\n"
            "- Remember our recent conversation so you can ask follow-up questions\n\n"
            "I only answer using your actual GTU syllabus content, so I won't make up information outside what's officially prescribed. "
            "Just ask me something like 'Explain loops in Python Programming' or 'What's the syllabus for Data Structures?' to get started."
        )
        save_chat_message(user_id, conversation_id, request.question, answer_text, [])
        return {"success": True, "question": request.question, "answer": answer_text, "sources": [], "conversation_id": conversation_id}

    matched_subject = None
    for subject_name in KNOWN_SUBJECTS:
        if subject_name.lower() in question_lower:
            matched_subject = subject_name
            break

    filter_conditions = []
    if matched_subject:
        filter_conditions.append({"subject_name": matched_subject})
    if request.branch:
        filter_conditions.append({"branch": request.branch})
    if request.semester:
        filter_conditions.append({"semester": request.semester})

    where_filter = None
    if len(filter_conditions) == 1:
        where_filter = filter_conditions[0]
    elif len(filter_conditions) > 1:
        where_filter = {"$and": filter_conditions}

    if matched_subject:
        results = collection.get(where=where_filter)
        retrieved_chunks = results["documents"] if results["documents"] else []
        retrieved_metadata = results["metadatas"] if results["metadatas"] else []
    else:
        results = collection.query(
            query_texts=[request.question],
            n_results=4,
            where=where_filter
        )
        retrieved_chunks = results["documents"][0] if results["documents"] else []
        retrieved_metadata = results["metadatas"][0] if results["metadatas"] else []

    if matched_subject and not retrieved_chunks:
        answer_text = f"'{matched_subject}' exists in our subject database, but its syllabus content hasn't been added to the knowledge base yet. Please check back later or contact the department."
        save_chat_message(user_id, conversation_id, request.question, answer_text, [])
        return {"success": True, "question": request.question, "answer": answer_text, "sources": [], "conversation_id": conversation_id}

    if not retrieved_chunks:
        answer_text = "I couldn't find relevant information in the GTU knowledge base for this question. Please check the subject/semester details or rephrase your question."
        save_chat_message(user_id, conversation_id, request.question, answer_text, [])
        return {"success": True, "question": request.question, "answer": answer_text, "sources": [], "conversation_id": conversation_id}

    context_text = "\n\n---\n\n".join(retrieved_chunks)

    history = fetch_recent_history(user_id, conversation_id, limit=3)
    history_text = ""
    if history:
        history_lines = [f"Student: {h['question']}\nYou: {h['answer']}" for h in history]
        history_text = "Recent conversation (for context on follow-up questions):\n" + "\n\n".join(history_lines) + "\n\n"

    prompt = f"""You are GTU Campus Geek, an AI-powered academic assistant for GTU Diploma students.
Answer the student's question using ONLY the information provided in the context below.
If the context does not contain enough information to answer, clearly say so instead of guessing.

Explain like a teacher would in a classroom, not like a search result:
- Start with a simple, one-line definition or overview of the concept
- Then explain it in more depth, breaking it into clear points where useful
- Use an example wherever one would genuinely help understanding (even a small, simple one)
- Use clear, student-friendly language, as if talking to someone learning this for the first time
- Keep a warm, encouraging teaching tone, not a dry textbook tone

{history_text}Context from GTU syllabus documents:
{context_text}

Student's Question: {request.question}

Answer:"""


    
    try:
        response = gemini_model.generate_content(prompt)
    except ResourceExhausted as e:
        print("GEMINI QUOTA ERROR:", repr(e))
        raise HTTPException(
            status_code=429,
            detail="Gemini API quota or rate limit reached. Check the backend terminal for details."
        )


    sources = []
    for meta in retrieved_metadata:
        source_str = (
            f"{meta['branch']} Sem{meta['semester']} - "
            f"{meta['subject_name']} ({meta['category']})"
        )
        if source_str not in sources:
            sources.append(source_str)

    save_chat_message(
        user_id, conversation_id, request.question, response.text, sources
    )

    return {
        "success": True,
        "question": request.question,
        "answer": response.text,
        "sources": sources,
        "conversation_id": conversation_id
    }

    {
        "success": True,
        "question": request.question,
        "answer": response.text,
        "sources": sources,
        "conversation_id": conversation_id
    }


@app.get("/api/conversations")
def list_conversations(authorization: str | None = Header(default=None)):
    """Returns the logged-in user's chats (newest first), titled by their first question."""
    user_id = get_user_id_from_token(authorization)
    if not user_id:
        return {"success": False, "message": "Not logged in.", "conversations": []}

    result = (
        supabase_client.table("chat_messages")
        .select("conversation_id, question, created_at")
        .eq("user_id", user_id)
        .order("created_at")
        .execute()
    )

    conversations = {}
    for row in result.data:
        cid = row["conversation_id"]
        if cid not in conversations:
            title = row["question"].strip()
            if len(title) > 50:
                title = title[:50] + "..."
            conversations[cid] = {
                "conversation_id": cid,
                "title": title,
                "last_updated": row["created_at"]
            }
        else:
            conversations[cid]["last_updated"] = row["created_at"]

    ordered = sorted(conversations.values(), key=lambda c: c["last_updated"], reverse=True)
    return {"success": True, "conversations": ordered}


@app.get("/api/conversations/{conversation_id}")
def get_conversation(conversation_id: str, authorization: str | None = Header(default=None)):
    """Returns every message of one chat, oldest first, so the frontend can reopen it."""
    user_id = get_user_id_from_token(authorization)
    if not user_id:
        return {"success": False, "message": "Not logged in.", "messages": []}

    result = (
        supabase_client.table("chat_messages")
        .select("question, answer, sources, created_at")
        .eq("user_id", user_id)
        .eq("conversation_id", conversation_id)
        .order("created_at")
        .execute()
    )
    return {"success": True, "messages": result.data}


@app.get("/api/chat-history")
def get_chat_history(authorization: str | None = Header(default=None)):
    user_id = get_user_id_from_token(authorization)
    if not user_id:
        return {"success": False, "message": "Not logged in.", "messages": []}

    result = (
        supabase_client.table("chat_messages")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at")
        .execute()
    )
    return {"success": True, "messages": result.data}


@app.get("/api/subjects")
def get_subjects(branch: str = None, semester: int = None):
    query = supabase_client.table("subjects").select("*")
    if branch:
        query = query.eq("branch", branch)
    if semester:
        query = query.eq("semester", semester)
    query = query.order("semester").order("subject_name")
    result = query.execute()
    return {"success": True, "count": len(result.data), "subjects": result.data}