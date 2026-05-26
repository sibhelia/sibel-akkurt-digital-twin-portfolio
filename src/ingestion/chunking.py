"""Chunking helpers for ingestion."""

from __future__ import annotations

from hashlib import sha256


def chunk_text(text: str, chunk_size: int = 1200, overlap: int = 150) -> list[dict[str, object]]:
    """Split text into overlapping paragraph-aware chunks."""
    paragraphs = [part.strip() for part in text.split("\n\n") if part.strip()]
    chunks: list[dict[str, object]] = []
    current = ""

    for paragraph in paragraphs:
        candidate = f"{current}\n\n{paragraph}".strip() if current else paragraph
        if len(candidate) <= chunk_size:
            current = candidate
            continue

        if current:
            chunks.append(_build_chunk(current, len(chunks)))

        if len(paragraph) <= chunk_size:
            current = paragraph
            continue

        start = 0
        while start < len(paragraph):
            end = min(start + chunk_size, len(paragraph))
            segment = paragraph[start:end].strip()
            if segment:
                chunks.append(_build_chunk(segment, len(chunks)))
            if end >= len(paragraph):
                break
            start = max(end - overlap, start + 1)
        current = ""

    if current:
        chunks.append(_build_chunk(current, len(chunks)))

    return chunks


def _build_chunk(content: str, chunk_index: int) -> dict[str, object]:
    return {
        "chunk_index": chunk_index,
        "content": content,
        "token_count": max(1, len(content) // 4),
        "content_hash": sha256(content.encode("utf-8")).hexdigest(),
    }
