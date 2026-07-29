"""
Main FastAPI application entry point.

Initializes the API server with all middleware, routes, and services.
"""

from fastapi import Depends, FastAPI, Header, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import logging
import shutil
import uuid
from pathlib import Path
from sqlalchemy import select

from src.config import settings
from src.db.session import init_db, close_db, get_session
from src.db.models import PortfolioSettings, Experience, Project, Certificate
from src.cache.redis_manager import redis_manager
from src.api.schemas import (
    AdminIngestResponse,
    AdminProfileEntryRequest,
    ChatRequest,
    ChatResponse,
    SiteKnowledgeRequest,
    FullPortfolioContentResponse,
    PortfolioSettingsUpdate,
    PortfolioSettingsResponse,
    ExperienceCreate,
    ExperienceResponse,
    ProjectCreate,
    ProjectResponse,
    CertificateCreate,
    CertificateResponse,
)
from src.ingestion.pipeline import IngestionMetadata, ingest_text, ingest_file
from src.rag.orchestration.graph import process_query



# Configure logging
logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger(__name__)


async def require_admin(x_admin_api_key: str = Header(default="")) -> None:
    """Temporary admin gate until JWT/RBAC is implemented."""
    if not settings.ADMIN_API_KEY:
        raise HTTPException(status_code=503, detail="ADMIN_API_KEY is not configured")
    if x_admin_api_key != settings.ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid admin API key")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifecycle management.
    
    Startup: Initialize services
    Shutdown: Clean up resources
    """
    # Startup
    logger.info("Starting up application...")
    try:
        await init_db()
        await redis_manager.connect()
        logger.info("All services initialized successfully")
    except Exception as e:
        logger.error(f"Startup failed: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")
    try:
        await close_db()
        await redis_manager.disconnect()
        logger.info("Cleanup completed")
    except Exception as e:
        logger.error(f"Shutdown error: {e}")


# Create FastAPI app
app = FastAPI(
    title="Digital Twin Portfolio API",
    description="API for the portfolio knowledge and chat system.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/v1/docs" if settings.DEBUG else None,
    openapi_url="/api/v1/openapi.json" if settings.DEBUG else None,
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
    max_age=600,
)


# Security headers middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    """Add security headers to all responses."""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


# Health check endpoint
@app.get("/api/v1/health", tags=["health"])
async def health_check():
    """Check system health."""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "version": "1.0.0"
    }


# Chat endpoint
@app.post("/api/v1/chat", response_model=ChatResponse, tags=["chat"])
async def chat(request: ChatRequest):
    """Process a chat request through the RAG orchestration pipeline."""
    try:
        result = await process_query(request.query, request.session_id, request.user_id)
        return ChatResponse(
            response=result.get("response", ""),
            citations=result.get("citations", []),
            query_type=result.get("query_type", "general_question"),
            latencies=result.get("latencies", {}),
            session_id=result.get("session_id", request.session_id),
            tokens=result.get("tokens", []),
        )
    except Exception as e:
        import traceback
        error_msg = traceback.format_exc()
        raise HTTPException(status_code=400, detail=f"Chat failed: {str(e)}\n\nTraceback:\n{error_msg}")


@app.post("/api/v1/admin/knowledge/profile-entry", response_model=AdminIngestResponse, tags=["admin"])
async def ingest_profile_entry(
    request: AdminProfileEntryRequest,
    _: None = Depends(require_admin),
):
    """Ingest a structured admin panel entry into the RAG knowledge base."""
    result = await ingest_text(
        title=request.title,
        content=build_profile_entry_markdown(request),
        source_type=f"admin_{request.entry_type}",
        file_name=build_profile_entry_file_name(request),
        metadata=IngestionMetadata(
            project_name=request.project_name,
            technologies=request.technologies,
            topics=request.topics or [request.entry_type],
            experience_level=request.experience_level,
            importance=request.importance,
            source_url=request.url,
            ingested_by=request.created_by,
            custom_metadata={
                "entry_type": request.entry_type,
                "organization": request.organization,
                "issuer": request.issuer,
                "location": request.location,
                "start_date": request.start_date.isoformat() if request.start_date else None,
                "end_date": request.end_date.isoformat() if request.end_date else None,
                "credential_id": request.credential_id,
                "source_label": request.source_label,
                "highlights": request.highlights,
                "achievements": request.achievements,
            },
        ),
    )
    return AdminIngestResponse(**result)


@app.post("/api/v1/admin/knowledge/site-content", response_model=AdminIngestResponse, tags=["admin"])
async def ingest_site_content(
    request: SiteKnowledgeRequest,
    _: None = Depends(require_admin),
):
    """Ingest content that is published from the website/admin panel."""
    body = [f"# {request.title}"]
    if request.section:
        body.append(f"Section: {request.section}")
    body.extend(["", request.body.strip()])
    result = await ingest_text(
        title=request.title,
        content="\n".join(body).strip(),
        source_type="site_content",
        file_name=f"site-{request.page_slug}.md",
        metadata=IngestionMetadata(
            project_name=request.project_name,
            technologies=request.technologies,
            topics=request.topics or ["website", request.page_slug],
            importance=request.importance,
            source_url=request.url,
            ingested_by=request.created_by,
            custom_metadata={
                "page_slug": request.page_slug,
                "section": request.section,
            },
        ),
    )
    return AdminIngestResponse(**result)


@app.post("/api/v1/admin/knowledge/upload", response_model=AdminIngestResponse, tags=["admin"])
async def upload_file(
    file: UploadFile = File(...),
    project_name: str | None = Form(None),
    technologies: str | None = Form(None),
    topics: str | None = Form(None),
    importance: str | None = Form("medium"),
    created_by: str | None = Form(None),
    _: None = Depends(require_admin),
):
    """Upload a file (PDF, Word, MD) and ingest it into the knowledge base."""
    upload_dir = Path("uploads")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    file_ext = Path(file.filename or "").suffix
    temp_filename = f"{uuid.uuid4()}{file_ext}"
    temp_path = upload_dir / temp_filename
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        tech_list = [t.strip() for t in technologies.split(",")] if technologies else []
        topic_list = [t.strip() for t in topics.split(",")] if topics else []
        
        metadata = IngestionMetadata(
            project_name=project_name,
            technologies=tech_list,
            topics=topic_list,
            importance=importance,
            ingested_by=created_by,
        )
        
        result = await ingest_file(str(temp_path), metadata=metadata)
        result["file_name"] = file.filename
        return AdminIngestResponse(**result)
    except Exception as e:
        import traceback
        error_msg = traceback.format_exc()
        raise HTTPException(status_code=400, detail=f"Upload failed: {str(e)}\n\nTraceback:\n{error_msg}")
    finally:
        if temp_path.exists():
            temp_path.unlink()

@app.post("/api/v1/admin/upload-image", tags=["admin"])
async def upload_image(
    file: UploadFile = File(...),
    _: None = Depends(require_admin),
):
    """Upload an image file and return its public URL."""
    upload_dir = Path("uploads")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    file_ext = Path(file.filename or "").suffix.lower()
    if file_ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]:
        raise HTTPException(status_code=400, detail="Sadece resim dosyaları (.png, .jpg, .webp, .svg) yüklenebilir.")
        
    unique_filename = f"img_{uuid.uuid4().hex[:8]}{file_ext}"
    target_path = upload_dir / unique_filename
    
    with open(target_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    image_url = f"/uploads/{unique_filename}"
    return {"url": image_url, "file_name": file.filename}


# Static Files for Uploads
upload_dir = Path("uploads")
upload_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(upload_dir)), name="uploads")


# --- Dynamic Portfolio Content API Endpoints ---

@app.get("/api/v1/portfolio/content", response_model=FullPortfolioContentResponse, tags=["portfolio"])
async def get_full_portfolio_content():
    """Public endpoint to fetch all dynamic portfolio content."""
    async with get_session() as session:
        settings_result = await session.execute(select(PortfolioSettings))
        settings = settings_result.scalars().first()
        
        exp_result = await session.execute(select(Experience).order_by(Experience.created_at.desc()))
        experiences = exp_result.scalars().all()
        
        proj_result = await session.execute(select(Project).order_by(Project.created_at.desc()))
        projects = proj_result.scalars().all()
        
        cert_result = await session.execute(select(Certificate).order_by(Certificate.created_at.desc()))
        certificates = cert_result.scalars().all()

        return FullPortfolioContentResponse(
            settings=PortfolioSettingsResponse(
                id=str(settings.id),
                full_name=settings.full_name,
                title=settings.title,
                hero_subtitle=settings.hero_subtitle,
                about_markdown=settings.about_markdown,
                contact_email=settings.contact_email,
                github_url=settings.github_url,
                linkedin_url=settings.linkedin_url,
                avatar_url=settings.avatar_url,
            ) if settings else None,
            experiences=[
                ExperienceResponse(
                    id=str(e.id),
                    company=e.company,
                    position=e.position,
                    location=e.location,
                    start_date=e.start_date,
                    end_date=e.end_date,
                    is_current=e.is_current,
                    description=e.description,
                    technologies=e.technologies or [],
                ) for e in experiences
            ],
            projects=[
                ProjectResponse(
                    id=str(p.id),
                    title=p.title,
                    slug=p.slug,
                    summary=p.summary,
                    description=p.description,
                    technologies=p.technologies or [],
                    github_url=p.github_url,
                    live_url=p.live_url,
                    image_url=p.image_url,
                    is_featured=p.is_featured,
                ) for p in projects
            ],
            certificates=[
                CertificateResponse(
                    id=str(c.id),
                    title=c.title,
                    issuer=c.issuer,
                    issue_date=c.issue_date,
                    credential_id=c.credential_id,
                    credential_url=c.credential_url,
                ) for c in certificates
            ]
        )


@app.post("/api/v1/admin/portfolio/settings", response_model=PortfolioSettingsResponse, tags=["admin"])
async def update_portfolio_settings(
    payload: PortfolioSettingsUpdate,
    _: None = Depends(require_admin),
):
    """Update profile settings & ingest into RAG."""
    async with get_session() as session:
        result = await session.execute(select(PortfolioSettings))
        settings = result.scalars().first()
        
        if not settings:
            settings = PortfolioSettings()
            session.add(settings)
            
        settings.full_name = payload.full_name
        settings.title = payload.title
        settings.hero_subtitle = payload.hero_subtitle
        settings.about_markdown = payload.about_markdown
        settings.contact_email = payload.contact_email
        settings.github_url = payload.github_url
        settings.linkedin_url = payload.linkedin_url
        settings.avatar_url = payload.avatar_url
        
        await session.commit()
        await session.refresh(settings)

    rag_content = f"# Portfolio Owner Profile\nName: {payload.full_name}\nTitle: {payload.title}\nBio: {payload.hero_subtitle or ''}\n\nAbout:\n{payload.about_markdown or ''}"
    await ingest_text(
        title=f"Profile - {payload.full_name}",
        content=rag_content,
        source_type="admin_profile",
        file_name="admin-profile.md",
    )
    
    return PortfolioSettingsResponse(id=str(settings.id), **payload.dict())


@app.post("/api/v1/admin/portfolio/experience", response_model=ExperienceResponse, tags=["admin"])
async def add_experience(
    payload: ExperienceCreate,
    _: None = Depends(require_admin),
):
    """Add new work experience & ingest into RAG."""
    async with get_session() as session:
        exp = Experience(**payload.dict())
        session.add(exp)
        await session.commit()
        await session.refresh(exp)

    rag_content = f"# Experience: {payload.position} at {payload.company}\nLocation: {payload.location or 'N/A'}\nDates: {payload.start_date or ''} - {payload.end_date or ('Present' if payload.is_current else '')}\nTechnologies: {', '.join(payload.technologies)}\n\nDescription:\n{payload.description or ''}"
    await ingest_text(
        title=f"Experience - {payload.position} at {payload.company}",
        content=rag_content,
        source_type="admin_experience",
        file_name=f"experience-{payload.company.lower().replace(' ', '-')}.md",
    )

    return ExperienceResponse(id=str(exp.id), **payload.dict())


@app.post("/api/v1/admin/portfolio/project", response_model=ProjectResponse, tags=["admin"])
async def add_project(
    payload: ProjectCreate,
    _: None = Depends(require_admin),
):
    """Add new project & ingest into RAG."""
    async with get_session() as session:
        proj = Project(**payload.dict())
        session.add(proj)
        await session.commit()
        await session.refresh(proj)

    rag_content = f"# Project: {payload.title}\nSummary: {payload.summary or ''}\nTechnologies: {', '.join(payload.technologies)}\nGitHub: {payload.github_url or ''}\nLive Demo: {payload.live_url or ''}\n\nDescription:\n{payload.description or ''}"
    await ingest_text(
        title=f"Project - {payload.title}",
        content=rag_content,
        source_type="admin_project",
        file_name=f"project-{payload.title.lower().replace(' ', '-')}.md",
    )

    return ProjectResponse(id=str(proj.id), **payload.dict())


# Root endpoint
@app.get("/", tags=["root"])
async def root():
    """API information."""
    return {
        "name": "Digital Twin Portfolio API",
        "version": "1.0.0",
        "docs": "/api/v1/docs",
        "health": "/api/v1/health"
    }



def build_profile_entry_file_name(request: AdminProfileEntryRequest) -> str:
    normalized_title = request.title.lower().replace(" ", "-").replace("/", "-")
    return f"{request.entry_type}-{normalized_title}.md"


def build_profile_entry_markdown(request: AdminProfileEntryRequest) -> str:
    lines = [f"# {request.title}", f"Type: {request.entry_type}"]
    if request.organization:
        lines.append(f"Organization: {request.organization}")
    if request.issuer:
        lines.append(f"Issuer: {request.issuer}")
    if request.location:
        lines.append(f"Location: {request.location}")
    if request.start_date or request.end_date:
        lines.append(
            "Timeline: "
            f"{request.start_date.isoformat() if request.start_date else 'unknown'}"
            " -> "
            f"{request.end_date.isoformat() if request.end_date else 'present'}"
        )
    if request.credential_id:
        lines.append(f"Credential ID: {request.credential_id}")
    if request.url:
        lines.append(f"Reference URL: {request.url}")
    if request.technologies:
        lines.append(f"Technologies: {', '.join(request.technologies)}")
    if request.topics:
        lines.append(f"Topics: {', '.join(request.topics)}")
    lines.extend(["", "## Summary", request.summary.strip()])
    if request.highlights:
        lines.extend(["", "## Highlights"])
        lines.extend([f"- {item}" for item in request.highlights])
    if request.achievements:
        lines.extend(["", "## Achievements"])
        lines.extend([f"- {item}" for item in request.achievements])
    return "\n".join(lines).strip()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )
