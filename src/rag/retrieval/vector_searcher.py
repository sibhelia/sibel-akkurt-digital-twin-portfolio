"""Vector search support using Qdrant."""

from typing import Dict, List, Optional
from qdrant_client import QdrantClient
from qdrant_client.http import models as qdrant_models
from src.config import settings

client = QdrantClient(url=settings.QDRANT_URL)


def ensure_collection() -> None:
    """Create the portfolio collection if it does not exist."""
    collections = client.get_collections().collections
    if any(collection.name == settings.QDRANT_COLLECTION_NAME for collection in collections):
        return

    client.create_collection(
        collection_name=settings.QDRANT_COLLECTION_NAME,
        vectors_config=qdrant_models.VectorParams(
            size=settings.EMBEDDING_DIMENSION,
            distance=qdrant_models.Distance.COSINE,
        ),
    )


def upsert_points(points: List[qdrant_models.PointStruct]) -> None:
    """Upsert document chunk vectors into Qdrant."""
    if not points:
        return

    client.upsert(
        collection_name=settings.QDRANT_COLLECTION_NAME,
        points=points,
    )


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
