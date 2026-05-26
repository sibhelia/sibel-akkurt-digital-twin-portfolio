"""Hybrid retrieval that fuses PostgreSQL chunk matches with Qdrant search."""

from __future__ import annotations

from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import joinedload

from src.db import session as db_session
from src.db.models import Chunk
from src.rag.embeddings import embed_texts
from src.rag.retrieval.bm25_searcher import bm25_search
from src.rag.retrieval.vector_searcher import qdrant_search


def reciprocal_rank_fusion(result_sets: list[list[dict[str, Any]]], k: int = 60) -> list[dict[str, Any]]:
    """Combine ranked results from multiple retrievers using RRF."""
    fused: dict[str, dict[str, Any]] = {}

    for result_set in result_sets:
        for rank, item in enumerate(result_set):
            source_id = str(item.get("source_id") or item.get("metadata", {}).get("chunk_id"))
            if not source_id:
                continue

            rrf_score = 1.0 / (k + rank + 1)
            entry = fused.setdefault(
                source_id,
                {
                    "source_id": source_id,
                    "score": 0.0,
                    "chunk_text": item.get("chunk_text", ""),
                    "metadata": dict(item.get("metadata", {})),
                },
            )
            entry["score"] += rrf_score
            if not entry["chunk_text"] and item.get("chunk_text"):
                entry["chunk_text"] = item["chunk_text"]
            entry["metadata"].update(item.get("metadata", {}))

    return sorted(fused.values(), key=lambda item: item["score"], reverse=True)


async def hybrid_search(
    query: str,
    query_variations: list[str] | None = None,
    top_k: int = 15,
    project_name: str | None = None,
) -> list[dict[str, Any]]:
    """Fuse sparse and dense matches, then hydrate missing chunk content from PostgreSQL."""
    if db_session.SessionLocal is None:
        raise RuntimeError("Database not initialized. Call init_db() before retrieval.")

    queries = [query] + [item for item in (query_variations or []) if item and item != query]

    async with db_session.SessionLocal() as session:
        sparse_results: list[dict[str, Any]] = []
        for item in queries[:3]:
            sparse_results.extend(await bm25_search(session, item, top_k=top_k, project_name=project_name))

        query_embedding = (await embed_texts([query]))[0]
        vector_filter = {"project_name": project_name} if project_name else None
        vector_results_raw = qdrant_search(query_embedding, top_k=top_k, filter=vector_filter)
        vector_results = [
            {
                "source_id": str(item.get("payload", {}).get("chunk_id") or item.get("source_id", "")),
                "chunk_text": str(item.get("payload", {}).get("text", "")),
                "score": float(item.get("score", 0.0)),
                "metadata": {
                    **dict(item.get("payload", {})),
                    "retrieval_mode": "dense",
                },
            }
            for item in vector_results_raw
        ]

        fused = reciprocal_rank_fusion([sparse_results, vector_results])[:top_k]
        hydrated = await hydrate_chunks(session, fused)
        return hydrated


async def hydrate_chunks(session, results: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Fill missing chunk/document metadata from PostgreSQL."""
    chunk_ids = [item["source_id"] for item in results if item.get("source_id")]
    if not chunk_ids:
        return results

    statement = (
        select(Chunk)
        .options(joinedload(Chunk.document))
        .where(Chunk.id.in_(chunk_ids))
    )
    db_results = await session.execute(statement)
    chunks = {str(chunk.id): chunk for chunk in db_results.scalars().all()}

    hydrated: list[dict[str, Any]] = []
    for item in results:
        chunk = chunks.get(item["source_id"])
        if chunk:
            metadata = dict(item.get("metadata", {}))
            metadata.update(
                {
                    "source": chunk.document.file_name if chunk.document else metadata.get("source", item["source_id"]),
                    "document_id": str(chunk.document_id),
                    "chunk_id": str(chunk.id),
                    "project_name": chunk.project_name,
                    "technologies": chunk.technologies,
                    "topics": chunk.topics,
                    "importance": chunk.importance,
                }
            )
            hydrated.append(
                {
                    "source_id": item["source_id"],
                    "chunk_text": chunk.content,
                    "score": float(item.get("score", 0.0)),
                    "metadata": metadata,
                }
            )
        else:
            hydrated.append(item)

    return hydrated
