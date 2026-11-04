"""
Configuration
=============
Author: Asaad

Loads all settings from .env file. Every module imports from here.
"""

import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


# ─── LLM Provider ────────────────────────────────────────
# OpenRouter is the primary provider; OPENAI_API_KEY is a documented fallback
# (direct OpenAI). Clients are built lazily via get_llm_client() so the app
# always boots — a missing key surfaces at CALL time, never at import.

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

# Single source of truth for the model name (see get_llm_model()).
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-6-luna")


@lru_cache(maxsize=1)
def get_llm_client():
    """Lazily build the LLM client on first use (cached as a singleton).

    Prefers OpenRouter (OPENROUTER_API_KEY), falls back to direct OpenAI
    (OPENAI_API_KEY). Raises a clear RuntimeError at CALL time — never at
    import — if neither key is configured, so the app still boots without keys.
    """
    from openai import OpenAI

    if OPENROUTER_API_KEY:
        return OpenAI(api_key=OPENROUTER_API_KEY, base_url=OPENROUTER_BASE_URL)
    if OPENAI_API_KEY:
        return OpenAI(api_key=OPENAI_API_KEY)
    raise RuntimeError(
        "No LLM API key configured. Set OPENROUTER_API_KEY (recommended) or "
        "OPENAI_API_KEY in your .env file — see .env.example."
    )


def get_llm_model() -> str:
    """Return the model string for the active provider.

    OpenRouter requires a provider prefix (openai/…); direct OpenAI does not.
    """
    if OPENROUTER_API_KEY:
        return f"openai/{LLM_MODEL}"
    return LLM_MODEL

# ─── Database ────────────────────────────────────────────

CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "./datasets/chroma_db")

# ─── Server ──────────────────────────────────────────────

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))

# ─── Sandbox Settings ────────────────────────────────────

SANDBOX_TIMEOUT_SECONDS = int(os.getenv("SANDBOX_TIMEOUT", "10"))
SANDBOX_MEMORY_LIMIT_MB = int(os.getenv("SANDBOX_MEMORY_LIMIT", "128"))

# ─── Supabase ────────────────────────────────────────────

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

# ─── Validation ──────────────────────────────────────────

if not OPENROUTER_API_KEY and not OPENAI_API_KEY:
    print("⚠️  No LLM key set (OPENROUTER_API_KEY / OPENAI_API_KEY). "
          "The server still boots; LLM stages will error at call time.")
