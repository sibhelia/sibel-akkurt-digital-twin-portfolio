"""Sparse retrieval support backed by chunk records in PostgreSQL."""

from __future__ import annotations

import re
from typing import Any

from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from src.db.models import Chunk


WORD_RE = re.compile(r"\w+", re.UNICODE)


def tokenize(text: str) -> list[str]:
    """Lightweight tokenizer for fallback sparse matching."""
    return WORD_RE.findall(text.lower())


async def bm25_search(
    session: AsyncSession,
    query: str,
    top_k: int = 10,
    project_name: str | None = None,
) -> list[dict[str, Any]]:
    """Approximate sparse retrieval over chunks stored in PostgreSQL."""
    tokens = tokenize(query)
    if not tokens:
        return []

    statement: Select[tuple[Chunk]] = (
        select(Chunk)
        .options(joinedload(Chunk.document))
        .where(Chunk.status == "ready")
    )
    if project_name:
        statement = statement.where(Chunk.project_name == project_name)

    result = await session.execute(statement)
    chunks = result.scalars().all()
    scored = []

    for chunk in chunks:
        content = chunk.content.lower()
        score = sum(content.count(token) for token in tokens)
        if score <= 0:
            continue

        scored.append(
            {
                "source_id": str(chunk.id),
                "chunk_text": chunk.content,
                "score": float(score),
                "metadata": {
                    "source": chunk.document.file_name if chunk.document else str(chunk.id),
                    "document_id": str(chunk.document_id),
                    "chunk_id": str(chunk.id),
                    "project_name": chunk.project_name,
                    "technologies": chunk.technologies,
                    "topics": chunk.topics,
                    "importance": chunk.importance,
                    "retrieval_mode": "sparse",
                },
            }
        )

    scored.sort(key=lambda item: item["score"], reverse=True)
    return scored[:top_k]
