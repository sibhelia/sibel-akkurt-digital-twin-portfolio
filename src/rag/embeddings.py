"""Embedding utilities for the RAG system."""

from typing import List
from src.cache.redis_manager import redis_manager
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
        embeddings = await groq_client.embed_texts(missing_texts)
        for list_index, embedding in enumerate(embeddings):
            index = missing_indexes[list_index]
            results[index] = embedding
            await redis_manager.set_embedding(missing_texts[list_index], embedding)

    return [embedding or [] for embedding in results]
