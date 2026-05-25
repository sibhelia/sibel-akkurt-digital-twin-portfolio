"""
Main FastAPI application entry point.

Initializes the API server with all middleware, routes, and services.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from src.config import settings
from src.db.session import init_db, close_db
from src.cache.redis_manager import redis_manager
from src.api.schemas import ChatRequest, ChatResponse
from src.rag.orchestration.graph import process_query


# Configure logging
logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger(__name__)


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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )
