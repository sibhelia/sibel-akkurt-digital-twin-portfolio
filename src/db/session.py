"""
Database session management with SQLAlchemy async support.

Provides connection pooling, session management, and lifecycle management
for PostgreSQL connections.
"""

from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncSession,
    async_sessionmaker,
)
from sqlalchemy.orm import declarative_base
from typing import Optional
import logging

from src.config import settings

logger = logging.getLogger(__name__)

# Base class for all ORM models
Base = declarative_base()

# Engine and session factory (will be initialized on startup)
engine = None
SessionLocal = None


async def init_db():
    """
    Initialize database engine and session factory.
    
    Called on application startup.
    """
    global engine, SessionLocal
    
    logger.info("Initializing database connection...")
    
    # Create async engine with connection pooling
    engine = create_async_engine(
        settings.DATABASE_URL,
        echo=settings.DEBUG,
        pool_size=20,
        max_overflow=40,
        pool_pre_ping=True,  # Verify connections before using
        pool_recycle=3600,   # Recycle connections after 1 hour
    )
    
    # Create session factory
    SessionLocal = async_sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )

    # Create tables for the current starter implementation.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    logger.info("Database initialized successfully")


async def close_db():
    """
    Close database connections.
    
    Called on application shutdown.
    """
    global engine
    
    if engine:
        logger.info("Closing database connections...")
        await engine.dispose()
        logger.info("Database connections closed")

from contextlib import asynccontextmanager

@asynccontextmanager
async def get_session() -> AsyncSession:
    """
    Get a database session.
    
    Yields:
        AsyncSession: Database session for queries
        
    Usage:
        async with get_session() as session:
            result = await session.execute(query)
    """
    if not SessionLocal:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    
    async with SessionLocal() as session:
        yield session


# ORM Models will be defined in separate files and imported here
import src.db.models as _models  # noqa: F401,E402
