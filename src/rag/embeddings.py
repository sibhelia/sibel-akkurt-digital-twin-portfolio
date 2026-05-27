"""Embedding utilities for the RAG system.

Provider priority:
  1. "sentence-transformers" — local ML model, best semantic quality, no API key needed.
     Default model: intfloat/multilingual-e5-base (Turkish + English support).
  2. "local-hash"           — deterministic hash-based fallback, no ML, fast but weak.

Redis caching is applied in both cases to avoid re-computing embeddings for repeated texts.
"""

from __future__ import annotations

import asyncio
import hashlib
import logging
from functools import lru_cache
from typing import List

from src.cache.redis_manager import redis_manager
from src.config import settings

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Sentence-Transformers (local model, loaded once)
# ---------------------------------------------------------------------------

@lru_cache(maxsize=1)
def _load_sentence_transformer():
    """Load the sentence-transformers model once and cache it in memory."""
    try:
        from sentence_transformers import SentenceTransformer
        logger.info("Loading embedding model: %s", settings.EMBEDDING_MODEL)
        model = SentenceTransformer(settings.EMBEDDING_MODEL)
        logger.info("Embedding model loaded successfully.")
        return model
    except Exception as exc:
        logger.error("Failed to load sentence-transformers model: %s", exc)
        return None


def _sentence_transformer_embed(texts: List[str]) -> List[List[float]]:
    """Run sentence-transformers encoding synchronously (called in a thread)."""
    model = _load_sentence_transformer()
    if model is None:
        logger.warning("Sentence-transformers unavailable, falling back to local-hash embeddings.")
        return [local_hash_embedding(text) for text in texts]

    # multilingual-e5-base works best with "query: " / "passage: " prefixes
    prefixed = [f"passage: {text}" for text in texts]
    vectors = model.encode(prefixed, normalize_embeddings=True, show_progress_bar=False)
    return [v.tolist() for v in vectors]


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

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

    if provider == "sentence-transformers":
        # Run CPU-bound model in a thread pool to avoid blocking the event loop
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, _sentence_transformer_embed, texts)

    # Fallback: deterministic hash embedding (no ML, weak semantic quality)
    logger.debug("Using local-hash embedding provider.")
    return [local_hash_embedding(text) for text in texts]


async def embed_query(query: str) -> List[float]:
    """Embed a single query string (uses 'query: ' prefix for e5 models)."""
    provider = settings.EMBEDDING_PROVIDER.strip().lower()

    if provider == "sentence-transformers":
        model = _load_sentence_transformer()
        if model is not None:
            loop = asyncio.get_event_loop()
            prefixed = f"query: {query}"
            embedding = await loop.run_in_executor(
                None,
                lambda: model.encode(prefixed, normalize_embeddings=True).tolist(),
            )
            return embedding

    return local_hash_embedding(query)


# ---------------------------------------------------------------------------
# Hash-based fallback (no ML)
# ---------------------------------------------------------------------------

def local_hash_embedding(text: str) -> List[float]:
    """Deterministic multilingual-friendly embedding fallback using character n-grams."""
    dimension = settings.EMBEDDING_DIMENSION
    vector = [0.0] * dimension
    normalized = _normalize_text(text)

    for token in normalized.split():
        _accumulate_feature(vector, f"tok:{token}", weight=2.0)

    for ngram in _character_ngrams(normalized, n=3):
        _accumulate_feature(vector, f"chr:{ngram}", weight=0.5)

    norm = sum(value * value for value in vector) ** 0.5
    if norm:
        vector = [value / norm for value in vector]
    return vector


def _normalize_text(text: str) -> str:
    return " ".join(text.lower().strip().split())


def _character_ngrams(text: str, n: int = 3) -> List[str]:
    compact = text.replace(" ", "_")
    if not compact:
        return []
    if len(compact) < n:
        return [compact]
    return [compact[i:i + n] for i in range(len(compact) - n + 1)]


def _accumulate_feature(vector: List[float], feature: str, weight: float) -> None:
    digest = hashlib.sha256(feature.encode("utf-8")).digest()
    bucket = int.from_bytes(digest[:4], "big") % len(vector)
    sign = 1.0 if digest[4] % 2 == 0 else -1.0
    vector[bucket] += weight * sign
