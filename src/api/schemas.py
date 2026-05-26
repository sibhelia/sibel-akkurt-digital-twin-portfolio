"""API request and response schemas."""

from datetime import date
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


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


class AdminIngestResponse(BaseModel):
    document_id: str
    ingestion_batch_id: str
    chunks_indexed: int
    file_name: str
    source_type: str


class AdminProfileEntryRequest(BaseModel):
    entry_type: str
    title: str
    summary: str
    organization: Optional[str] = None
    issuer: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    credential_id: Optional[str] = None
    project_name: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)
    topics: List[str] = Field(default_factory=list)
    highlights: List[str] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)
    url: Optional[str] = None
    experience_level: Optional[str] = None
    importance: Optional[str] = "high"
    source_label: Optional[str] = "admin-panel"
    created_by: Optional[str] = "admin"


class SiteKnowledgeRequest(BaseModel):
    page_slug: str
    title: str
    body: str
    section: Optional[str] = None
    url: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)
    topics: List[str] = Field(default_factory=list)
    project_name: Optional[str] = None
    importance: Optional[str] = "medium"
    created_by: Optional[str] = "site-sync"
