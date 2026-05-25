"""Vector search support using Qdrant."""

from typing import Dict, List, Optional
from qdrant_client import QdrantClient
from src.config import settings

client = QdrantClient(url=settings.QDRANT_URL)


def qdrant_search(
    query_embedding: List[float],
    top_k: int = 10,
    filter: Optional[dict] = None,
) -> List[Dict[str, object]]:
    """Search Qdrant for semantic matches."""
    if not query_embedding:
        return []

    results = client.search(
        collection_name=settings.QDRANT_COLLECTION_NAME,
        query_vector=query_embedding,
        limit=top_k,
        with_payload=True,
    )

    return [
        {
            "source_id": str(item.id),
            "payload": item.payload,
            "score": float(item.score or 0.0),
        }
        for item in results
    ]
