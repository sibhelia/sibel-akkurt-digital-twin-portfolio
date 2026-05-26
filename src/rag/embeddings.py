"""Embedding utilities for the RAG system."""

from __future__ import annotations

import hashlib
from typing import List

from src.cache.redis_manager import redis_manager
from src.config import settings
from src.llm.groq_client import groq_client


async def embed_texts(texts: List[str]) -> List[List[float]]:
    """Generate embeddings for text inputs, with Redis caching."""
    results: list[list[float] | None] = [None] * len(texts)
    missing_texts: list[str] = []
    missing_indexes: list[int] = []

    for index, text in enumerate(texts):
        cached = await redis_manager.get_embedding(text)
        if cached is not None:
            results[index] = cached
        else:
            missing_texts.append(text)
            missing_indexes.append(index)

    if missing_texts:
        embeddings = await generate_embeddings(missing_texts)
        for list_index, embedding in enumerate(embeddings):
            index = missing_indexes[list_index]
            results[index] = embedding
            await redis_manager.set_embedding(missing_texts[list_index], embedding)

    return [embedding or [] for embedding in results]


async def generate_embeddings(texts: List[str]) -> List[List[float]]:
    """Generate embeddings using the configured provider."""
    provider = settings.EMBEDDING_PROVIDER.strip().lower()
    if provider == "groq":
        return await groq_client.embed_texts(texts)
    return [local_hash_embedding(text) for text in texts]


def local_hash_embedding(text: str) -> List[float]:
    """Deterministic multilingual-friendly embedding fallback."""
    dimension = settings.EMBEDDING_DIMENSION
    vector = [0.0] * dimension
    normalized = normalize_text(text)

    for token in normalized.split():
        _accumulate_feature(vector, f"tok:{token}", weight=2.0)

    for ngram in character_ngrams(normalized, n=3):
        _accumulate_feature(vector, f"chr:{ngram}", weight=0.5)

    norm = sum(value * value for value in vector) ** 0.5
    if norm:
        vector = [value / norm for value in vector]
    return vector


def normalize_text(text: str) -> str:
    return " ".join(text.lower().strip().split())


def character_ngrams(text: str, n: int = 3) -> List[str]:
    compact = text.replace(" ", "_")
    if not compact:
        return []
    if len(compact) < n:
        return [compact]
    return [compact[index:index + n] for index in range(len(compact) - n + 1)]


def _accumulate_feature(vector: List[float], feature: str, weight: float) -> None:
    digest = hashlib.sha256(feature.encode("utf-8")).digest()
    bucket = int.from_bytes(digest[:4], "big") % len(vector)
    sign = 1.0 if digest[4] % 2 == 0 else -1.0
    vector[bucket] += weight * sign
