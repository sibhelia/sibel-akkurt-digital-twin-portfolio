"""
Configuration and settings for the Digital Twin Portfolio RAG system.

This module loads configuration from environment variables and validates
the setup before the application starts.
"""

from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://portfolio:portfolio@localhost:5432/portfolio_db"
    )
    
    # Cache
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Vector Database
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    QDRANT_COLLECTION_NAME: str = "portfolio_chunks"
    
    # Embeddings
    EMBEDDING_MODEL: str = "BAAI/bge-large-en"
    EMBEDDING_DIMENSION: int = 1024
    
    # LLM
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "openai")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_DAY: int = 10000
    
    # Admin
    ADMIN_USERS: list[str] = os.getenv("ADMIN_USERS", "").split(",") if os.getenv("ADMIN_USERS") else []
    
    # Features
    ENABLE_DEBUG_ENDPOINT: bool = DEBUG
    ENABLE_ADMIN_ENDPOINTS: bool = True
    
    # Observability
    SENTRY_DSN: Optional[str] = os.getenv("SENTRY_DSN")
    OTEL_EXPORTER_OTLP_ENDPOINT: str = os.getenv(
        "OTEL_EXPORTER_OTLP_ENDPOINT",
        "http://localhost:4317"
    )
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Load settings
settings = Settings()

# Validate critical settings in production
if settings.ENVIRONMENT == "production":
    assert settings.JWT_SECRET != "your-secret-key-change-in-production", \
        "JWT_SECRET must be changed in production"
    assert settings.OPENAI_API_KEY, \
        "OPENAI_API_KEY must be set in production"
