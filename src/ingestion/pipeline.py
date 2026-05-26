"""Synchronous-first ingestion pipeline for documents."""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import datetime
from hashlib import sha256
from pathlib import Path
from typing import Any

from qdrant_client.http import models as qdrant_models

from src.config import settings
from src.db.models import Chunk, Document, IngestionLog
from src.db import session as db_session
from src.ingestion.chunking import chunk_text
from src.ingestion.parsers import parse_document
from src.rag.embeddings import embed_texts
from src.rag.retrieval.vector_searcher import ensure_collection, upsert_points


@dataclass
class IngestionMetadata:
    project_name: str | None = None
    technologies: list[str] = field(default_factory=list)
    topics: list[str] = field(default_factory=list)
    experience_level: str | None = None
    importance: str | None = None
    source_url: str | None = None
    ingested_by: str | None = None
    custom_metadata: dict[str, Any] = field(default_factory=dict)


async def ingest_file(file_path: str, metadata: IngestionMetadata | None = None) -> dict[str, Any]:
    """Parse, chunk, embed, and index a single file."""
    if db_session.SessionLocal is None:
        raise RuntimeError("Database not initialized. Call init_db() before ingestion.")

    metadata = metadata or IngestionMetadata()
    parsed = parse_document(file_path)
    raw_content = parsed["content"].strip()
    if not raw_content:
        raise ValueError("Document content is empty after parsing.")

    path = Path(file_path)
    batch_id = uuid.uuid4()
    file_size = path.stat().st_size
    content_hash = sha256(raw_content.encode("utf-8")).hexdigest()
    chunk_payloads = chunk_text(raw_content)

    async with db_session.SessionLocal() as session:
        document = Document(
            title=parsed["title"],
            file_name=path.name,
            file_size_bytes=file_size,
            source_type=parsed["source_type"],
            source_url=metadata.source_url,
            raw_content=raw_content,
            processed_content=raw_content,
            project_name=metadata.project_name,
            technologies=metadata.technologies,
            topics=metadata.topics,
            experience_level=metadata.experience_level,
            importance=metadata.importance,
            status="processing",
            ingested_by=metadata.ingested_by,
            ingestion_batch_id=batch_id,
            content_hash=content_hash,
            document_created_at=datetime.utcnow(),
        )
        session.add(document)
        await session.flush()

        log = IngestionLog(
            document_id=document.id,
            batch_id=batch_id,
            file_name=path.name,
            source_type=parsed["source_type"],
            status="processing",
            message=f"Chunking {len(chunk_payloads)} sections",
            created_by=metadata.ingested_by,
        )
        session.add(log)
        await session.flush()

        embeddings = await embed_texts([str(chunk["content"]) for chunk in chunk_payloads])
        ensure_collection()

        qdrant_points: list[qdrant_models.PointStruct] = []
        chunk_models: list[Chunk] = []

        for chunk_payload, embedding in zip(chunk_payloads, embeddings):
            chunk_id = uuid.uuid4()
            chunk_model = Chunk(
                id=chunk_id,
                document_id=document.id,
                content=str(chunk_payload["content"]),
                content_hash=str(chunk_payload["content_hash"]),
                chunk_index=int(chunk_payload["chunk_index"]),
                project_name=metadata.project_name,
                technologies=metadata.technologies,
                topics=metadata.topics,
                importance=metadata.importance,
                experience_level=metadata.experience_level,
                custom_metadata=metadata.custom_metadata,
                embedding_id=str(chunk_id),
                embedding_model=settings.GROQ_EMBEDDING_MODEL,
                embedding_dimension=len(embedding),
                embedding_generated_at=datetime.utcnow(),
                token_count=int(chunk_payload["token_count"]),
                status="ready",
            )
            chunk_models.append(chunk_model)
            qdrant_points.append(
                qdrant_models.PointStruct(
                    id=str(chunk_id),
                    vector=embedding,
                    payload={
                        "text": chunk_model.content,
                        "source": path.name,
                        "document_id": str(document.id),
                        "chunk_id": str(chunk_id),
                        "project_name": metadata.project_name,
                        "technologies": metadata.technologies,
                        "topics": metadata.topics,
                        "importance": metadata.importance,
                    },
                )
            )

        session.add_all(chunk_models)
        upsert_points(qdrant_points)

        document.status = "indexed"
        log.status = "completed"
        log.message = f"Indexed {len(chunk_models)} chunks"
        log.completed_at = datetime.utcnow()

        await session.commit()

    return {
        "document_id": str(document.id),
        "ingestion_batch_id": str(batch_id),
        "chunks_indexed": len(chunk_payloads),
        "file_name": path.name,
        "source_type": parsed["source_type"],
    }
