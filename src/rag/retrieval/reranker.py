"""Reranking utilities for retrieval candidates."""

from typing import Dict, List


def simple_rerank(
    query: str,
    candidates: List[Dict[str, object]],
    threshold: float = 0.5,
    top_k: int = 7,
) -> List[Dict[str, object]]:
    """Use a simple relevance score to rerank retrieval candidates."""
    for candidate in candidates:
        candidate["rerank_score"] = float(candidate.get("score", 0.0))

    ranked = sorted(candidates, key=lambda item: item["rerank_score"], reverse=True)
    filtered = [item for item in ranked if item["rerank_score"] >= threshold]
    if filtered:
        return filtered[:top_k]
    return ranked[:top_k]
