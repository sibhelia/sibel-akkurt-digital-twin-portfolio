"""BM25 retrieval support for sparse search."""

from typing import Dict, List
from rank_bm25 import BM25Okapi


def bm25_search(corpus: List[str], query: str, top_k: int = 10) -> List[Dict[str, float]]:
    """Search a corpus using BM25 and return scored documents."""
    if not corpus or not query:
        return []

    tokenized = [doc.split() for doc in corpus]
    bm25 = BM25Okapi(tokenized)
    query_tokens = query.split()
    scores = bm25.get_scores(query_tokens)
    ranked = sorted(
        enumerate(scores), key=lambda item: item[1], reverse=True
    )[:top_k]

    return [
        {"document": corpus[index], "score": float(score), "source_id": str(index)}
        for index, score in ranked
        if score > 0
    ]
