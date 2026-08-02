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
    title_en: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_subtitle_en: Optional[str] = None
    about_markdown: Optional[str] = None
    about_markdown_en: Optional[str] = None
    contact_email: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    avatar_url: Optional[str] = None
    stats: Optional[List[Dict[str, Any]]] = Field(default_factory=list)


class PortfolioSettingsResponse(PortfolioSettingsUpdate):
    id: str


class ExperienceCreate(BaseModel):
    company: str
    position: str
    position_en: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool = False
    description: Optional[str] = None
    description_en: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)


class ExperienceResponse(ExperienceCreate):
    id: str


class ProjectCreate(BaseModel):
    title: str
    title_en: Optional[str] = None
    slug: Optional[str] = None
    summary: Optional[str] = None
    summary_en: Optional[str] = None
    description: Optional[str] = None
    description_en: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: bool = True


class ProjectResponse(ProjectCreate):
    id: str


class CertificateCreate(BaseModel):
    title: str
    title_en: Optional[str] = None
    issuer: str
    issuer_en: Optional[str] = None
    issue_date: Optional[str] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None


class CertificateResponse(CertificateCreate):
    id: str


class SkillCreate(BaseModel):
    name: str
    name_en: Optional[str] = None
    is_active: bool = True

class SkillResponse(SkillCreate):
    id: str

class EducationCreate(BaseModel):
    school: str
    school_en: Optional[str] = None
    degree: str
    degree_en: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    description_en: Optional[str] = None

class EducationResponse(EducationCreate):
    id: str

class TechnologyCreate(BaseModel):
    name: str
    category: Optional[str] = None
    category_en: Optional[str] = None
    icon_url: Optional[str] = None

class TechnologyResponse(TechnologyCreate):
    id: str

class ServiceCreate(BaseModel):
    title: str
    title_en: Optional[str] = None
    description: Optional[str] = None
    description_en: Optional[str] = None
    icon_name: Optional[str] = None

class ServiceResponse(ServiceCreate):
    id: str

class TestimonialCreate(BaseModel):
    client_name: str
    client_title: Optional[str] = None
    client_title_en: Optional[str] = None
    company: Optional[str] = None
    content: str
    content_en: Optional[str] = None
    is_approved: bool = True

class TestimonialResponse(TestimonialCreate):
    id: str

class ContactMessageCreate(BaseModel):
    full_name: str
    email: str
    content: str
    is_read: bool = False

class ContactMessageResponse(ContactMessageCreate):
    id: str

class BannerCreate(BaseModel):
    title: str
    title_en: Optional[str] = None
    subtitle: Optional[str] = None
    subtitle_en: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool = True

class BannerResponse(BannerCreate):
    id: str


class FullPortfolioContentResponse(BaseModel):
    settings: Optional[PortfolioSettingsResponse] = None
    experiences: List[ExperienceResponse] = Field(default_factory=list)
    projects: List[ProjectResponse] = Field(default_factory=list)
    certificates: List[CertificateResponse] = Field(default_factory=list)
    skills: List[SkillResponse] = Field(default_factory=list)
    education: List[EducationResponse] = Field(default_factory=list)
    technologies: List[TechnologyResponse] = Field(default_factory=list)
    services: List[ServiceResponse] = Field(default_factory=list)
    testimonials: List[TestimonialResponse] = Field(default_factory=list)
    messages: List[ContactMessageResponse] = Field(default_factory=list)
    banners: List[BannerResponse] = Field(default_factory=list)
