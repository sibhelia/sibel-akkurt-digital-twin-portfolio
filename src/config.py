"""
Configuration and settings for the Digital Twin Portfolio RAG system.

This module loads configuration from environment variables and validates
the setup before the application starts.
"""

import os
from typing import Optional

from pydantic import field_validator
from pydantic_settings import BaseSettings


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
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")
    QDRANT_COLLECTION_NAME: str = "portfolio_chunks"
    
    # Embeddings — uses local sentence-transformers model by default (no API key needed)
    # "sentence-transformers" → free local model, best quality
    # "local-hash"           → deterministic fallback, no ML, fast but low quality
    EMBEDDING_PROVIDER: str = os.getenv("EMBEDDING_PROVIDER", "sentence-transformers")
    # multilingual-e5-base supports Turkish + English out of the box
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "intfloat/multilingual-e5-base")
    EMBEDDING_DIMENSION: int = 768  # multilingual-e5-base output dimension

    # LLM
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "groq")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    # Primary model: Llama 4 Maverick — smarter, cheaper, and multimodal (text + image)
    # Alternatives:
    #   "meta-llama/llama-4-scout-17b-16e-instruct" — faster, huge context window
    #   "llama-3.3-70b-versatile"                   — reliable fallback, battle-tested
    #   "llama-3.1-8b-instant"                      — fastest & cheapest, lower quality
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "meta-llama/llama-4-maverick-17b-128e-instruct")

    # OpenAI fallback
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = "gpt-4o-mini"
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_DAY: int = 10000
    
    # Admin
    ADMIN_USERS: str = os.getenv("ADMIN_USERS", "")
    ADMIN_API_KEY: str = os.getenv("ADMIN_API_KEY", "")
    
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

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug(cls, value):
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"1", "true", "yes", "on", "debug"}:
                return True
            if normalized in {"0", "false", "no", "off", "release", "prod", "production"}:
                return False
        return bool(value)



# Load settings
settings = Settings()

# Validate critical settings in production
if settings.ENVIRONMENT == "production":
    assert settings.JWT_SECRET != "your-secret-key-change-in-production", \
        "JWT_SECRET must be changed in production"

    if settings.LLM_PROVIDER == "groq":
        assert settings.GROQ_API_KEY, \
            "GROQ_API_KEY must be set in production when using Groq"
    elif settings.LLM_PROVIDER == "openai":
        assert settings.OPENAI_API_KEY, \
            "OPENAI_API_KEY must be set in production when using OpenAI"
