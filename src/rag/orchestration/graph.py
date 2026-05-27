"""
LangGraph Orchestration Module

RAG pipeline using langgraph 0.2.x TypedDict-based state.
Each node handles a specific step in the pipeline.
"""

from __future__ import annotations

import time
import logging
from typing import Any, Dict, List, TypedDict

from langgraph.graph import StateGraph, END
from src.cache.redis_manager import redis_manager
from src.llm.groq_client import groq_client
from src.rag.retrieval.hybrid_retriever import hybrid_search
from src.rag.retrieval.reranker import simple_rerank

logger = logging.getLogger(__name__)


# ============================================================================
# State Schema — TypedDict required by langgraph 0.2+
# ============================================================================

class OrchestrationState(TypedDict, total=False):
    query: str
    session_id: str
    user_id: str
    query_type: str
    confidence: float
    conversation_history: List[Dict[str, str]]
    session_context: Dict[str, Any]
    query_variations: List[str]
    retrieval_strategy: str
    retrieved_chunks: List[Dict[str, Any]]
    ranked_chunks: List[Dict[str, Any]]
    context: str
    response: str
    tokens: List[str]
    citations: List[Dict[str, Any]]
    start_time: float
    latencies: Dict[str, float]


# ============================================================================
# Node Implementations
# ============================================================================

async def node_user_input(state: OrchestrationState) -> OrchestrationState:
    logger.info("[USER_INPUT] Processing query: %s...", state.get("query", "")[:50])
    query = (state.get("query") or "").strip()
    if len(query) > 1000:
        query = query[:1000]
    return {**state, "query": query}


async def node_classify_query(state: OrchestrationState) -> OrchestrationState:
    logger.info("[CLASSIFY] Classifying query type...")
    lower = (state.get("query") or "").lower()

    if any(k in lower for k in ("architecture", "design", "system", "mimari")):
        query_type = "architecture_question"
    elif any(k in lower for k in ("project", "portfolio", "proje", "yaptığım")):
        query_type = "project_summary"
    elif any(k in lower for k in ("skill", "technology", "tech", "bilgi", "yetenek", "teknoloji")):
        query_type = "skill_assessment"
    elif any(k in lower for k in ("experience", "worked", "deneyim", "çalıştım")):
        query_type = "experience_question"
    elif any(k in lower for k in ("compare", "vs", "karşılaştır")):
        query_type = "comparison_question"
    elif any(k in lower for k in ("why", "how", "neden", "nasıl")):
        query_type = "technical_deep_dive"
    else:
        query_type = "general_question"

    return {**state, "query_type": query_type, "confidence": 0.85}


async def node_memory_check(state: OrchestrationState) -> OrchestrationState:
    session_id = state.get("session_id") or ""
    logger.info("[MEMORY] Checking session memory for %s...", session_id)
    session_data = await redis_manager.get_session(session_id)
    if session_data:
        return {
            **state,
            "session_context": session_data,
            "conversation_history": session_data.get("history", []),
        }
    return state


async def node_query_rewrite(state: OrchestrationState) -> OrchestrationState:
    logger.info("[REWRITE] Generating query variations...")
    query = state.get("query") or ""
    variations = [
        query,
        f"Explain {query} in detail",
        f"What is the best answer for: {query}",
        f"Provide context for: {query}",
    ]
    return {**state, "query_variations": variations}


async def node_retrieval_strategy_selector(state: OrchestrationState) -> OrchestrationState:
    query_type = state.get("query_type", "general_question")
    logger.info("[STRATEGY] Selecting retrieval strategy for %s...", query_type)
    strategy_map = {
        "technical_deep_dive": "hybrid_balanced",
        "project_summary": "dense_heavy",
        "skill_assessment": "sparse_only",
        "experience_question": "multi_query",
        "architecture_question": "hybrid_balanced",
        "comparison_question": "hybrid_balanced",
        "general_question": "hybrid_balanced",
    }
    strategy = strategy_map.get(query_type, "hybrid_balanced")
    return {**state, "retrieval_strategy": strategy}


async def node_hybrid_retriever(state: OrchestrationState) -> OrchestrationState:
    strategy = state.get("retrieval_strategy", "hybrid_balanced")
    logger.info("[RETRIEVER] Executing hybrid search strategy: %s...", strategy)
    chunks = await hybrid_search(
        query=state.get("query") or "",
        query_variations=state.get("query_variations"),
        top_k=15,
    )
    latencies = dict(state.get("latencies") or {})
    latencies["retrieval_candidates"] = float(len(chunks))
    return {**state, "retrieved_chunks": chunks, "latencies": latencies}


async def node_reranker(state: OrchestrationState) -> OrchestrationState:
    retrieved = state.get("retrieved_chunks") or []
    logger.info("[RERANKER] Reranking %d candidates...", len(retrieved))
    ranked = simple_rerank(state.get("query") or "", retrieved, threshold=0.0, top_k=7)
    latencies = dict(state.get("latencies") or {})
    latencies["reranked_chunks"] = float(len(ranked))
    return {**state, "ranked_chunks": ranked, "latencies": latencies}


async def node_context_optimizer(state: OrchestrationState) -> OrchestrationState:
    ranked = state.get("ranked_chunks") or []
    logger.info("[CONTEXT] Optimizing context from %d chunks...", len(ranked))
    context_lines = []
    for index, chunk in enumerate(ranked, start=1):
        text = chunk.get("chunk_text", "")
        source = chunk.get("metadata", {}).get("source", f"chunk-{index}")
        retrieval_mode = chunk.get("metadata", {}).get("retrieval_mode", "hybrid")
        context_lines.append(f"[{source} | {retrieval_mode}] {text}")
    return {**state, "context": "\n\n".join(context_lines)}


async def node_memory_injector(state: OrchestrationState) -> OrchestrationState:
    logger.info("[MEMORY_INJECT] Injecting conversation memory...")
    history = state.get("conversation_history") or []
    context = state.get("context") or ""
    if history:
        history_lines = [
            f"{item.get('role')}: {item.get('content')}"
            for item in history[-5:]
        ]
        context = "\n\n".join(["Conversation history:"] + history_lines + [context])
    return {**state, "context": context}


async def node_llm_generator(state: OrchestrationState) -> OrchestrationState:
    logger.info("[LLM] Generating response with LLM...")
    system_prompt = (
        "You are a helpful assistant representing a software engineer's portfolio. "
        "Answer questions using only the provided context. "
        "Be concise and factual. "
        "If the context does not contain enough information, say you don't have that information. "
        "Do not invent projects, metrics, or technologies."
    )
    user_message = (
        f"Context:\n{state.get('context', '')}\n\n"
        f"Question:\n{state.get('query', '')}\n\n"
        "Answer:"
    )
    response = await groq_client.generate_text(
        prompt=user_message,
        system_prompt=system_prompt,
        max_tokens=1200,
        temperature=0.1,
    )
    return {**state, "response": response}


async def node_citation_builder(state: OrchestrationState) -> OrchestrationState:
    logger.info("[CITATIONS] Building citations...")
    ranked = state.get("ranked_chunks") or []
    citations = [
        {
            "source": chunk.get("metadata", {}).get("source", f"chunk-{i}"),
            "score": chunk.get("score", 0.0),
            "excerpt": (chunk.get("chunk_text") or "")[:200],
        }
        for i, chunk in enumerate(ranked, start=1)
    ]
    return {**state, "citations": citations}


async def node_streaming_response(state: OrchestrationState) -> OrchestrationState:
    logger.info("[STREAM] Preparing response for streaming...")
    start_time = state.get("start_time") or time.time()
    latencies = dict(state.get("latencies") or {})
    latencies["total"] = time.time() - start_time
    tokens = (state.get("response") or "").split()
    return {**state, "tokens": tokens, "latencies": latencies}


# ============================================================================
# Graph Builder
# ============================================================================

def build_orchestration_graph():
    graph: StateGraph = StateGraph(OrchestrationState)

    graph.add_node("user_input", node_user_input)
    graph.add_node("classify_query", node_classify_query)
    graph.add_node("memory_check", node_memory_check)
    graph.add_node("query_rewrite", node_query_rewrite)
    graph.add_node("retrieval_strategy_selector", node_retrieval_strategy_selector)
    graph.add_node("hybrid_retriever", node_hybrid_retriever)
    graph.add_node("reranker", node_reranker)
    graph.add_node("context_optimizer", node_context_optimizer)
    graph.add_node("memory_injector", node_memory_injector)
    graph.add_node("llm_generator", node_llm_generator)
    graph.add_node("citation_builder", node_citation_builder)
    graph.add_node("streaming_response", node_streaming_response)

    graph.set_entry_point("user_input")
    graph.add_edge("user_input", "classify_query")
    graph.add_edge("classify_query", "memory_check")
    graph.add_edge("memory_check", "query_rewrite")
    graph.add_edge("query_rewrite", "retrieval_strategy_selector")
    graph.add_edge("retrieval_strategy_selector", "hybrid_retriever")
    graph.add_edge("hybrid_retriever", "reranker")
    graph.add_edge("reranker", "context_optimizer")
    graph.add_edge("context_optimizer", "memory_injector")
    graph.add_edge("memory_injector", "llm_generator")
    graph.add_edge("llm_generator", "citation_builder")
    graph.add_edge("citation_builder", "streaming_response")
    graph.add_edge("streaming_response", END)

    return graph.compile()


orchestration_graph = build_orchestration_graph()


async def process_query(query: str, session_id: str, user_id: str) -> Dict[str, Any]:
    initial_state: OrchestrationState = {
        "query": query,
        "session_id": session_id,
        "user_id": user_id,
        "start_time": time.time(),
        "query_type": "general_question",
        "confidence": 1.0,
        "conversation_history": [],
        "session_context": {},
        "query_variations": [],
        "retrieval_strategy": "hybrid_balanced",
        "retrieved_chunks": [],
        "ranked_chunks": [],
        "context": "",
        "response": "",
        "tokens": [],
        "citations": [],
        "latencies": {},
    }
    final_state = await orchestration_graph.ainvoke(initial_state)
    return {
        "response": final_state.get("response", ""),
        "citations": final_state.get("citations", []),
        "query_type": final_state.get("query_type", "general_question"),
        "latencies": final_state.get("latencies", {}),
        "session_id": session_id,
        "tokens": final_state.get("tokens", []),
    }
