"""
LangGraph Orchestration Module

This module implements the 12-node orchestration pipeline for RAG processing.
Each node handles a specific step in the pipeline.
"""

from __future__ import annotations

from dataclasses import dataclass, field
import time
import logging
from typing import Any, Dict, List

from langgraph.graph import StateGraph, END
from src.cache.redis_manager import redis_manager
from src.llm.groq_client import groq_client
from src.rag.retrieval.hybrid_retriever import hybrid_search
from src.rag.retrieval.reranker import simple_rerank

logger = logging.getLogger(__name__)


# ============================================================================
# State Schema
# ============================================================================

@dataclass
class OrchestrationState:
    query: str = ""
    session_id: str = ""
    user_id: str = ""
    query_type: str = "general_question"
    confidence: float = 1.0
    conversation_history: List[Dict[str, str]] = field(default_factory=list)
    session_context: Dict[str, Any] = field(default_factory=dict)
    query_variations: List[str] = field(default_factory=list)
    retrieval_strategy: str = "hybrid_balanced"
    retrieved_chunks: List[Dict[str, Any]] = field(default_factory=list)
    ranked_chunks: List[Dict[str, Any]] = field(default_factory=list)
    context: str = ""
    response: str = ""
    tokens: List[str] = field(default_factory=list)
    citations: List[Dict[str, str]] = field(default_factory=list)
    start_time: float = 0.0
    latencies: Dict[str, float] = field(default_factory=dict)


# ============================================================================
# Node Implementations
# ============================================================================

async def node_user_input(state: OrchestrationState) -> OrchestrationState:
    logger.info(f"[USER_INPUT] Processing query: {state.query[:50]}...")
    state.query = state.query.strip()
    if len(state.query) > 1000:
        state.query = state.query[:1000]
    return state


async def node_classify_query(state: OrchestrationState) -> OrchestrationState:
    logger.info("[CLASSIFY] Classifying query type...")
    lower = state.query.lower()
    if "architecture" in lower or "design" in lower:
        state.query_type = "architecture_question"
    elif "project" in lower or "portfolio" in lower:
        state.query_type = "project_summary"
    elif "skill" in lower or "technology" in lower:
        state.query_type = "skill_assessment"
    elif "experience" in lower or "worked" in lower:
        state.query_type = "experience_question"
    elif "compare" in lower or "vs" in lower:
        state.query_type = "comparison_question"
    elif "why" in lower or "how" in lower:
        state.query_type = "technical_deep_dive"
    else:
        state.query_type = "general_question"
    state.confidence = 0.85
    return state


async def node_memory_check(state: OrchestrationState) -> OrchestrationState:
    logger.info(f"[MEMORY] Checking session memory for {state.session_id}...")
    session_data = await redis_manager.get_session(state.session_id)
    if session_data:
        state.session_context = session_data
        state.conversation_history = session_data.get("history", [])
    return state


async def node_query_rewrite(state: OrchestrationState) -> OrchestrationState:
    logger.info("[REWRITE] Generating query variations...")
    state.query_variations = [
        state.query,
        f"Explain {state.query} in detail",
        f"What is the best answer for: {state.query}",
    ]
    if len(state.query_variations) < 5:
        state.query_variations.append(f"Provide context for: {state.query}")
    return state


async def node_retrieval_strategy_selector(state: OrchestrationState) -> OrchestrationState:
    logger.info(f"[STRATEGY] Selecting retrieval strategy for {state.query_type}...")
    strategy_map = {
        "technical_deep_dive": "hybrid_balanced",
        "project_summary": "dense_heavy",
        "skill_assessment": "sparse_only",
        "experience_question": "multi_query",
        "architecture_question": "hybrid_balanced",
        "comparison_question": "hybrid_balanced",
        "troubleshooting": "dense_heavy",
        "general_question": "hybrid_balanced",
    }
    state.retrieval_strategy = strategy_map.get(state.query_type, "hybrid_balanced")
    return state


async def node_hybrid_retriever(state: OrchestrationState) -> OrchestrationState:
    logger.info(f"[RETRIEVER] Executing hybrid search strategy: {state.retrieval_strategy}...")
    state.retrieved_chunks = await hybrid_search(
        query=state.query,
        query_variations=state.query_variations,
        top_k=15,
    )
    state.latencies["retrieval_candidates"] = float(len(state.retrieved_chunks))
    return state


async def node_reranker(state: OrchestrationState) -> OrchestrationState:
    logger.info(f"[RERANKER] Reranking {len(state.retrieved_chunks)} candidates...")
    state.ranked_chunks = simple_rerank(state.query, state.retrieved_chunks, threshold=0.0, top_k=7)
    state.latencies["reranked_chunks"] = float(len(state.ranked_chunks))
    return state


async def node_context_optimizer(state: OrchestrationState) -> OrchestrationState:
    logger.info(f"[CONTEXT] Optimizing context from {len(state.ranked_chunks)} chunks...")
    context_lines = []
    for index, chunk in enumerate(state.ranked_chunks, start=1):
        text = chunk.get("chunk_text", "")
        source = chunk.get("metadata", {}).get("source", f"chunk-{index}")
        retrieval_mode = chunk.get("metadata", {}).get("retrieval_mode", "hybrid")
        context_lines.append(f"[{source} | {retrieval_mode}] {text}")
    state.context = "\n\n".join(context_lines)
    return state


async def node_memory_injector(state: OrchestrationState) -> OrchestrationState:
    logger.info("[MEMORY_INJECT] Injecting conversation memory...")
    if state.conversation_history:
        history_lines = [f"{item.get('role')}: {item.get('content')}" for item in state.conversation_history[-5:]]
        state.context = "\n\n".join(["Conversation history:"] + history_lines + [state.context])
    return state


async def node_llm_generator(state: OrchestrationState) -> OrchestrationState:
    logger.info("[LLM] Generating response with LLM...")
    system_prompt = (
        "You are an expert software engineer assistant. Answer based only on the context below. "
        "If the answer is not available, say you do not know."
    )
    full_prompt = f"{system_prompt}\n\nContext:\n{state.context}\n\nQuestion:\n{state.query}\n\nAnswer:"
    state.response = await groq_client.generate_text(full_prompt, max_tokens=1024, temperature=0.2)
    return state


async def node_citation_builder(state: OrchestrationState) -> OrchestrationState:
    logger.info("[CITATIONS] Building citations...")
    citations = []
    for index, chunk in enumerate(state.ranked_chunks, start=1):
        source = chunk.get("metadata", {}).get("source", f"chunk-{index}")
        citations.append({
            "source": source,
            "score": chunk.get("score", 0.0),
            "excerpt": chunk.get("chunk_text", "")[:200],
        })
    state.citations = citations
    return state


async def node_streaming_response(state: OrchestrationState) -> OrchestrationState:
    logger.info("[STREAM] Preparing response for streaming...")
    state.tokens = state.response.split()
    state.latencies["total"] = time.time() - state.start_time
    return state


# ============================================================================
# Graph Builder
# ============================================================================

def build_orchestration_graph() -> StateGraph:
    graph = StateGraph(OrchestrationState)
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
    initial_state = OrchestrationState(
        query=query,
        session_id=session_id,
        user_id=user_id,
        start_time=time.time(),
    )
    final_state = await orchestration_graph.ainvoke(initial_state)
    state = final_state if isinstance(final_state, dict) else final_state.__dict__
    return {
        "response": state.get("response", ""),
        "citations": state.get("citations", []),
        "query_type": state.get("query_type", "general_question"),
        "latencies": state.get("latencies", {}),
        "session_id": session_id,
        "tokens": state.get("tokens", []),
    }
