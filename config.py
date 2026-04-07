import os
from dotenv import load_dotenv

load_dotenv()

# AI Model
GEMINI_API_KEY = os.getenv("AIzaSyA27N8L_cQ7wREREg86RCUAvtoopqu_MRs", "")
MODEL = "gemini-1.5-flash"
MAX_TOKENS = 4096

# RAG
CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "./datasets/chroma_db")
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
RAG_TOP_K = 5

# Server
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))