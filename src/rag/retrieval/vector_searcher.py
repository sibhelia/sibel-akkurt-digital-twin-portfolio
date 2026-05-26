"""Vector search support using Qdrant."""

from typing import Dict, List, Optional
from qdrant_client import QdrantClient
from qdrant_client.http import models as qdrant_models
from src.config import settings

client = QdrantClient(
    url=settings.QDRANT_URL,
    api_key=settings.QDRANT_API_KEY or None,
)


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


def delete_points(point_ids: List[str]) -> None:
    """Delete vectors by their ids."""
    if not point_ids:
        return

    client.delete(
        collection_name=settings.QDRANT_COLLECTION_NAME,
        points_selector=qdrant_models.PointIdsList(points=point_ids),
    )


def qdrant_search(
    query_embedding: List[float],
    top_k: int = 10,
    filter: Optional[dict] = None,
) -> List[Dict[str, object]]:
    """Search Qdrant for semantic matches."""
    if not query_embedding:
        return []

    qdrant_filter = None
    if filter:
        conditions = [
            qdrant_models.FieldCondition(
                key=key,
                match=qdrant_models.MatchValue(value=value),
            )
            for key, value in filter.items()
            if value is not None
        ]
        if conditions:
            qdrant_filter = qdrant_models.Filter(must=conditions)

    response = client.query_points(
        collection_name=settings.QDRANT_COLLECTION_NAME,
        query=query_embedding,
        limit=top_k,
        with_payload=True,
        query_filter=qdrant_filter,
    )
    results = getattr(response, "points", response)

    return [
        {
            "source_id": str(item.id),
            "payload": item.payload,
            "score": float(item.score or 0.0),
        }
        for item in results
    ]
