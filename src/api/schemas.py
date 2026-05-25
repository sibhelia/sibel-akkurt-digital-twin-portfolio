"""API request and response schemas."""

from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class ChatRequest(BaseModel):
    query: str
    session_id: str
    user_id: str
    stream: bool = False


class ChatResponse(BaseModel):
    response: str
    citations: List[Dict[str, Any]]
    query_type: str
    latencies: Dict[str, float]
    session_id: str
    tokens: Optional[List[str]] = None
