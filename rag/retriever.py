"""
RAG Retriever — STUB
=====================
Owner: Ibro
Status: NOT STARTED — implement only if Gemini responses need grounding.
Priority: Sprint 3+ (after core pipeline works without RAG)

This module will query ChromaDB for relevant bug patterns and
optimization examples to include in Gemini prompts.
"""

# TODO (Ibro): Implement only if needed. See core/config.py for CHROMA_DB_PATH.

def retrieve_similar_patterns(code: str, top_k: int = 5) -> list[dict]:
    """
    Search ChromaDB for similar code patterns.
    Returns list of relevant bug/optimization examples.
    """
    # STUB: return empty list (agents work without RAG)
    return []
