"""
Main FastAPI application entry point.

Initializes the API server with all middleware, routes, and services.
"""

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from src.config import settings
from src.db.session import init_db, close_db
from src.cache.redis_manager import redis_manager
from src.api.schemas import (
    AdminIngestResponse,
    AdminProfileEntryRequest,
    ChatRequest,
    ChatResponse,
    SiteKnowledgeRequest,
)
from src.ingestion import IngestionMetadata, ingest_text
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
    title="AI Digital Twin Portfolio",
    description="Production-grade RAG system for intelligent portfolio clone",
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
    result = await process_query(request.query, request.session_id, request.user_id)
    return ChatResponse(
        response=result.get("response", ""),
        citations=result.get("citations", []),
        query_type=result.get("query_type", "general_question"),
        latencies=result.get("latencies", {}),
        session_id=result.get("session_id", request.session_id),
        tokens=result.get("tokens", []),
    )


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


# Root endpoint
@app.get("/", tags=["root"])
async def root():
    """API information."""
    return {
        "name": "AI Digital Twin Portfolio",
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
