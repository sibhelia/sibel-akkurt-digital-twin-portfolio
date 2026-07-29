"""API request and response schemas."""

from datetime import date
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    query: str
    session_id: str
    user_id: str
    language: Optional[str] = "tr"
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


# --- Dynamic Portfolio CMS Schemas ---

class PortfolioSettingsUpdate(BaseModel):
    full_name: str
    title: str
    hero_subtitle: Optional[str] = None
    about_markdown: Optional[str] = None
    contact_email: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    avatar_url: Optional[str] = None


class PortfolioSettingsResponse(PortfolioSettingsUpdate):
    id: str


class ExperienceCreate(BaseModel):
    company: str
    position: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool = False
    description: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)


class ExperienceResponse(ExperienceCreate):
    id: str


class ProjectCreate(BaseModel):
    title: str
    slug: Optional[str] = None
    summary: Optional[str] = None
    description: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: bool = True


class ProjectResponse(ProjectCreate):
    id: str


class CertificateCreate(BaseModel):
    title: str
    issuer: str
    issue_date: Optional[str] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None


class CertificateResponse(CertificateCreate):
    id: str


class FullPortfolioContentResponse(BaseModel):
    settings: Optional[PortfolioSettingsResponse] = None
    experiences: List[ExperienceResponse] = Field(default_factory=list)
    projects: List[ProjectResponse] = Field(default_factory=list)
    certificates: List[CertificateResponse] = Field(default_factory=list)

