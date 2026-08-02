"""Core SQLAlchemy ORM models for persistence."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.session import Base


def _json_default() -> list[Any]:
    return []


class TimestampMixin:
    """Shared timestamp columns."""

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )


class Document(TimestampMixin, Base):
    __tablename__ = "documents"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    source_type: Mapped[str] = mapped_column(String(50), nullable=False)
    source_url: Mapped[str | None] = mapped_column(Text)
    raw_content: Mapped[str] = mapped_column(Text, nullable=False)
    processed_content: Mapped[str | None] = mapped_column(Text)
    project_name: Mapped[str | None] = mapped_column(String(100))
    technologies: Mapped[list[Any]] = mapped_column(JSONB, default=_json_default, nullable=False)
    topics: Mapped[list[Any]] = mapped_column(JSONB, default=_json_default, nullable=False)
    experience_level: Mapped[str | None] = mapped_column(String(20))
    importance: Mapped[str | None] = mapped_column(String(20))
    document_created_at: Mapped[datetime | None] = mapped_column(DateTime)
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)
    error_message: Mapped[str | None] = mapped_column(Text)
    ingested_by: Mapped[str | None] = mapped_column(String(100))
    ingestion_batch_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    version: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    content_hash: Mapped[str | None] = mapped_column(String(64), unique=True)

    chunks: Mapped[list["Chunk"]] = relationship(
        back_populates="document",
        cascade="all, delete-orphan",
        order_by="Chunk.chunk_index",
    )
    ingestion_logs: Mapped[list["IngestionLog"]] = relationship(
        back_populates="document",
        cascade="all, delete-orphan",
    )


class Chunk(TimestampMixin, Base):
    __tablename__ = "chunks"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
    )
    parent_chunk_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("chunks.id", ondelete="SET NULL"),
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)
    content_hash: Mapped[str | None] = mapped_column(String(64))
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False)
    section_path: Mapped[str | None] = mapped_column(String(500))
    header_chain: Mapped[str | None] = mapped_column(Text)
    project_name: Mapped[str | None] = mapped_column(String(100))
    technologies: Mapped[list[Any]] = mapped_column(JSONB, default=_json_default, nullable=False)
    topics: Mapped[list[Any]] = mapped_column(JSONB, default=_json_default, nullable=False)
    importance: Mapped[str | None] = mapped_column(String(20))
    experience_level: Mapped[str | None] = mapped_column(String(20))
    custom_metadata: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    embedding_id: Mapped[str | None] = mapped_column(String(255))
    embedding_model: Mapped[str | None] = mapped_column(String(100))
    embedding_dimension: Mapped[int | None] = mapped_column(Integer)
    embedding_generated_at: Mapped[datetime | None] = mapped_column(DateTime)
    token_count: Mapped[int | None] = mapped_column(Integer)
    bm25_score: Mapped[float | None] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(20), default="ready", nullable=False)

    document: Mapped["Document"] = relationship(back_populates="chunks")
    parent_chunk: Mapped["Chunk | None"] = relationship(remote_side="Chunk.id", back_populates="child_chunks")
    child_chunks: Mapped[list["Chunk"]] = relationship(back_populates="parent_chunk")
    citations: Mapped[list["Citation"]] = relationship(back_populates="chunk")


class Conversation(TimestampMixin, Base):
    __tablename__ = "conversations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[str] = mapped_column(String(100), nullable=False)
    session_id: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    title: Mapped[str | None] = mapped_column(String(255))
    domain: Mapped[str | None] = mapped_column(String(100))
    topics: Mapped[list[Any]] = mapped_column(JSONB, default=_json_default, nullable=False)
    projects_mentioned: Mapped[list[Any]] = mapped_column(JSONB, default=_json_default, nullable=False)
    message_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_activity: Mapped[datetime | None] = mapped_column(DateTime)
    status: Mapped[str] = mapped_column(String(20), default="active", nullable=False)
    model_used: Mapped[str | None] = mapped_column(String(100))
    average_token_usage: Mapped[float | None] = mapped_column(Float)
    total_tokens_used: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    user_satisfaction: Mapped[int | None] = mapped_column(Integer)
    contains_hallucination: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    hallucination_notes: Mapped[str | None] = mapped_column(Text)
    ended_at: Mapped[datetime | None] = mapped_column(DateTime)
    conversation_summary: Mapped[str | None] = mapped_column(Text)
    summary_generated_at: Mapped[datetime | None] = mapped_column(DateTime)

    messages: Mapped[list["Message"]] = relationship(
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="Message.message_index",
    )


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
    )
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    message_index: Mapped[int] = mapped_column(Integer, nullable=False)
    query_type: Mapped[str | None] = mapped_column(String(50))
    detected_entities: Mapped[list[Any]] = mapped_column(JSONB, default=_json_default, nullable=False)
    model_used: Mapped[str | None] = mapped_column(String(100))
    temperature: Mapped[float | None] = mapped_column(Float)
    max_tokens: Mapped[int | None] = mapped_column(Integer)
    tokens_used: Mapped[int | None] = mapped_column(Integer)
    retrieved_chunks_ids: Mapped[list[Any]] = mapped_column(JSONB, default=_json_default, nullable=False)
    retrieval_latency_ms: Mapped[int | None] = mapped_column(Integer)
    response_latency_ms: Mapped[int | None] = mapped_column(Integer)
    hallucination_detected: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    citations_metadata: Mapped[list[Any]] = mapped_column("citations", JSONB, default=_json_default, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    conversation: Mapped["Conversation"] = relationship(back_populates="messages")
    citation_records: Mapped[list["Citation"]] = relationship(
        back_populates="message",
        cascade="all, delete-orphan",
    )


class Citation(Base):
    __tablename__ = "citations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    message_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("messages.id", ondelete="CASCADE"),
        nullable=False,
    )
    chunk_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("chunks.id", ondelete="CASCADE"),
        nullable=False,
    )
    cited_text: Mapped[str | None] = mapped_column(String(500))
    source_text: Mapped[str | None] = mapped_column(Text)
    confidence: Mapped[float | None] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    message: Mapped["Message"] = relationship(back_populates="citation_records")
    chunk: Mapped["Chunk"] = relationship(back_populates="citations")


class IngestionLog(Base):
    __tablename__ = "ingestion_logs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("documents.id", ondelete="SET NULL"),
    )
    batch_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    file_name: Mapped[str | None] = mapped_column(String(255))
    source_type: Mapped[str | None] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(20), default="queued", nullable=False)
    message: Mapped[str | None] = mapped_column(Text)
    created_by: Mapped[str | None] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime)

    document: Mapped["Document | None"] = relationship(back_populates="ingestion_logs")


# =====================================================================
# Dynamic CMS Portfolio Models
# =====================================================================

class PortfolioSettings(TimestampMixin, Base):
    """Stores general profile information (Name, Title, Bio, Social Links)."""
    __tablename__ = "portfolio_settings"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False, default="Sibel Akkurt")
    title: Mapped[str] = mapped_column(String(255), nullable=False, default="Full Stack Developer & AI Engineer")
    title_en: Mapped[str | None] = mapped_column(String(255))
    hero_subtitle: Mapped[str | None] = mapped_column(Text)
    hero_subtitle_en: Mapped[str | None] = mapped_column(Text)
    about_markdown: Mapped[str | None] = mapped_column(Text)
    about_markdown_en: Mapped[str | None] = mapped_column(Text)
    contact_email: Mapped[str | None] = mapped_column(String(255))
    github_url: Mapped[str | None] = mapped_column(String(500))
    linkedin_url: Mapped[str | None] = mapped_column(String(500))
    avatar_url: Mapped[str | None] = mapped_column(String(500))
    stats: Mapped[list[Any]] = mapped_column(JSONB, default=_json_default, nullable=False)


class Experience(TimestampMixin, Base):
    """Stores work experiences for the portfolio."""
    __tablename__ = "experiences"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company: Mapped[str] = mapped_column(String(255), nullable=False)
    position: Mapped[str] = mapped_column(String(255), nullable=False)
    position_en: Mapped[str | None] = mapped_column(String(255))
    location: Mapped[str | None] = mapped_column(String(255))
    start_date: Mapped[str | None] = mapped_column(String(50))
    end_date: Mapped[str | None] = mapped_column(String(50))
    is_current: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    description_en: Mapped[str | None] = mapped_column(Text)
    technologies: Mapped[list[Any]] = mapped_column(JSONB, default=_json_default, nullable=False)


class Project(TimestampMixin, Base):
    """Stores portfolio projects."""
    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    title_en: Mapped[str | None] = mapped_column(String(255))
    slug: Mapped[str | None] = mapped_column(String(255))
    summary: Mapped[str | None] = mapped_column(Text)
    summary_en: Mapped[str | None] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text)
    description_en: Mapped[str | None] = mapped_column(Text)
    technologies: Mapped[list[Any]] = mapped_column(JSONB, default=_json_default, nullable=False)
    github_url: Mapped[str | None] = mapped_column(String(500))
    live_url: Mapped[str | None] = mapped_column(String(500))
    image_url: Mapped[str | None] = mapped_column(String(500))
    is_featured: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class Certificate(TimestampMixin, Base):
    """Stores certifications and courses."""
    __tablename__ = "certificates"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    title_en: Mapped[str | None] = mapped_column(String(255))
    issuer: Mapped[str] = mapped_column(String(255), nullable=False)
    issuer_en: Mapped[str | None] = mapped_column(String(255))
    issue_date: Mapped[str | None] = mapped_column(String(50))
    credential_id: Mapped[str | None] = mapped_column(String(255))
    credential_url: Mapped[str | None] = mapped_column(String(500))



class Skill(TimestampMixin, Base):
    __tablename__ = "skills"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    name_en: Mapped[str | None] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class Education(TimestampMixin, Base):
    __tablename__ = "education"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    school: Mapped[str] = mapped_column(String(255), nullable=False)
    school_en: Mapped[str | None] = mapped_column(String(255))
    degree: Mapped[str] = mapped_column(String(255), nullable=False)
    degree_en: Mapped[str | None] = mapped_column(String(255))
    start_date: Mapped[str | None] = mapped_column(String(50))
    end_date: Mapped[str | None] = mapped_column(String(50))
    description: Mapped[str | None] = mapped_column(Text)
    description_en: Mapped[str | None] = mapped_column(Text)


class Technology(TimestampMixin, Base):
    __tablename__ = "technologies"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str | None] = mapped_column(String(100))
    category_en: Mapped[str | None] = mapped_column(String(100))
    icon_url: Mapped[str | None] = mapped_column(String(500))


class Service(TimestampMixin, Base):
    __tablename__ = "services"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    title_en: Mapped[str | None] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    description_en: Mapped[str | None] = mapped_column(Text)
    detailed_description: Mapped[str | None] = mapped_column(Text)
    detailed_description_en: Mapped[str | None] = mapped_column(Text)
    icon_name: Mapped[str | None] = mapped_column(String(100))


class Testimonial(TimestampMixin, Base):
    __tablename__ = "testimonials"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    client_name: Mapped[str] = mapped_column(String(255), nullable=False)
    client_title: Mapped[str | None] = mapped_column(String(255))
    client_title_en: Mapped[str | None] = mapped_column(String(255))
    company: Mapped[str | None] = mapped_column(String(255))
    content: Mapped[str] = mapped_column(Text, nullable=False)
    content_en: Mapped[str | None] = mapped_column(Text)
    is_approved: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class ContactMessage(TimestampMixin, Base):
    __tablename__ = "contact_messages"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class Banner(TimestampMixin, Base):
    __tablename__ = "banners"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    title_en: Mapped[str | None] = mapped_column(String(255))
    subtitle: Mapped[str | None] = mapped_column(Text)
    subtitle_en: Mapped[str | None] = mapped_column(Text)
    image_url: Mapped[str | None] = mapped_column(String(500))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

