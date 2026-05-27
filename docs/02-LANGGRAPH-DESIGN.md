# LangGraph Orchestration Design

**Version**: 1.1  
**Scope**: Agentic RAG workflow orchestration  
**Status**: Implemented — `src/rag/orchestration/graph.py`

> **Note**: langgraph 0.2.x requires TypedDict-based state (not dataclass or plain dict).
> All nodes return `{**state, ...}` — state is immutable between nodes.

---

## Overview

LangGraph orchestrates the entire RAG pipeline with conditional routing, memory management, fallback chains, and observability.

```
START
  ↓
[1] User Input Node
  ↓
[2] Query Classification Node
   Type: "project_query", "skill_question", "experience", etc.
   Confidence: 0.0-1.0
  ↓
[3] Memory Check Node
   Retrieve conversation history
   Extract session context
   Identify relevant prior exchanges
  ↓
[4] Query Rewriting Node
   Generate 3-5 variations
   Parallel execution
   Output: [query_1, query_2, ...]
  ↓
[5] Retrieval Strategy Selector
   Conditional: Based on classification
   Options: standard, project-filtered, skill-focused, timeline, multi-doc
   Selected: retrieval_strategy
  ↓
[6] Hybrid Retriever Node
   BM25 Search (in parallel)
   Vector Search (in parallel)
   Metadata Filtering (conditional)
   Hybrid Fusion (RRF algorithm)
   Output: top_50_candidates
  ↓
[7] Reranker Node
   Cross-encoder scoring
   Relevance filtering (threshold: 0.6)
   Output: top_5_reranked_chunks
  ↓
[8] Context Optimization Node
   Format chunks
   Preserve hierarchy
   Merge overlaps
   Token counting
   Truncate if needed
  ↓
[9] Memory Injection Node
   Merge conversation history
   Add session summary
   Prioritize high-relevance messages
   Final context assembly
  ↓
[10] LLM Response Generator
   Stream generation
   Token-by-token output
   Confidence tracking
  ↓
[11] Citation Builder Node
   Map tokens to sources
   Format citations
   Generate metadata
  ↓
[12] Streaming Response Node
   Format for transport
   WebSocket/SSE output
   Telemetry logging
  ↓
END
```

---

## Node Specifications

### Node 1: User Input Node

**Input**:
```python
{
    "query": str,           # Raw user query
    "session_id": str,      # Session identifier
    "user_id": str,         # User identifier
    "context": {            # Optional context
        "projects_filter": list[str],  # Project filter
        "skills_filter": list[str],    # Skill filter
        "timestamp": datetime
    }
}
```

**Processing**:
```python
def process_user_input(state):
    # Sanitize query
    query = sanitize_input(state["query"])
    
    # Validate length (min 3, max 2000 chars)
    if len(query) < 3 or len(query) > 2000:
        raise ValueError("Query length invalid")
    
    # Detect prompt injection
    if is_prompt_injection(query):
        raise SecurityError("Potential prompt injection detected")
    
    # Tokenize for later use
    tokens = tokenize(query)
    
    return {
        "query": query,
        "query_tokens": tokens,
        "query_length": len(tokens),
        "original_query": state["query"],
        "session_id": state["session_id"],
        "timestamp": datetime.now()
    }
```

**Output**:
```python
{
    "query": str,              # Cleaned query
    "query_tokens": list[str], # Tokenized
    "session_id": str,
    "timestamp": datetime
}
```

**Error Handling**:
- Invalid length → Return error
- Injection detected → Block and log
- Rate limit exceeded → Return error

---

### Node 2: Query Classification Node

**Purpose**: Determine query intent and domain

**Classification Types** (current implementation):
1. **project_summary**: project, portfolio, proje, yaptığım
2. **skill_assessment**: skill, technology, bilgi, yetenek, teknoloji
3. **architecture_question**: architecture, design, system, mimari
4. **experience_question**: experience, worked, deneyim, çalıştım
5. **comparison_question**: compare, vs, karşılaştır
6. **technical_deep_dive**: why, how, neden, nasıl
7. **general_question**: catch-all default

> **Turkish support**: The classifier recognizes both English and Turkish keywords.

**Processing** (from `src/rag/orchestration/graph.py`):
```python
async def node_classify_query(state: OrchestrationState) -> OrchestrationState:
    lower = (state.get("query") or "").lower()
    if any(k in lower for k in ("architecture", "design", "system", "mimari")):
        query_type = "architecture_question"
    elif any(k in lower for k in ("project", "portfolio", "proje")):
        query_type = "project_summary"
    # ... etc.
    return {**state, "query_type": query_type, "confidence": 0.85}
```

**Output**:
```python
{
    "query_type": str,   # Classification label
    "confidence": float  # Fixed at 0.85 for keyword-based classification
}
```

---

### Node 3: Memory Check Node

**Purpose**: Retrieve relevant conversation context

**Processing**:
```python
async def check_memory(state):
    session_id = state["session_id"]
    
    # Layer 1: Redis immediate memory (current thread)
    immediate_memory = await redis.get(f"session:{session_id}:thread")
    
    # Layer 2: Conversation history from DB
    history = await db.query(
        "SELECT * FROM messages WHERE session_id = %s "
        "ORDER BY created_at DESC LIMIT 10",
        (session_id,)
    )
    
    # Layer 3: Session summary
    session_summary = await redis.get(f"session:{session_id}:summary")
    
    # Combine and format
    memory_context = {
        "immediate": immediate_memory,
        "history": format_conversation(history),
        "summary": session_summary,
        "message_count": len(history),
        "session_age": calculate_session_age(history)
    }
    
    return {
        **state,
        "memory_context": memory_context,
        "has_history": len(history) > 0,
        "conversation_turn": len(history)
    }
```

**Output**:
```python
{
    "memory_context": {
        "immediate": str,      # Last exchange
        "history": str,        # Formatted history
        "summary": str         # Session summary
    },
    "has_history": bool,
    "conversation_turn": int
}
```

---

### Node 4: Query Rewriting Node

**Purpose**: Generate multiple query variations for better retrieval

**Processing**:
```python
async def rewrite_query(state):
    from langchain.prompts import PromptTemplate
    
    prompt_template = """Given a user query, generate 4 alternative phrasings 
that capture different aspects. Return as newline-separated queries.

Original Query: {query}
Query Type: {query_type}
Domain: {domain}

Generate 4 alternative phrasings:"""
    
    prompt = PromptTemplate(
        input_variables=["query", "query_type", "domain"],
        template=prompt_template
    )
    
    response = await llm.apredict(
        prompt,
        query=state["query"],
        query_type=state["query_type"],
        domain=state["domain"]
    )
    
    rewritten_queries = parse_rewritten_queries(response)
    
    # Include original query
    all_queries = [state["query"]] + rewritten_queries
    
    return {
        **state,
        "rewritten_queries": all_queries,
        "query_count": len(all_queries)
    }
```

**Example Output**:
```python
{
    "rewritten_queries": [
        "Explain your RAG architecture",           # Original
        "What is your retrieval-augmented generation design?",
        "How did you build your RAG system?",
        "What components are in your RAG pipeline?",
        "Why did you choose this RAG approach?"
    ],
    "query_count": 5
}
```

---

### Node 5: Retrieval Strategy Selector

**Purpose**: Choose retrieval approach based on query classification

**Processing**:
```python
def select_retrieval_strategy(state):
    query_type = state["query_type"]
    has_entities = len(state["entities"]) > 0
    has_history = state["has_history"]
    
    strategy_rules = {
        "project_query": "project_filtered_hybrid",
        "skill_question": "skill_filtered_hybrid",
        "technical_deep_dive": "multi_query_hybrid",
        "comparison": "parallel_multi_doc",
        "experience_question": "timeline_filtered_hybrid",
        "general_introduction": "general_hybrid",
        "default": "standard_hybrid"
    }
    
    strategy = strategy_rules.get(query_type, "standard_hybrid")
    
    # Adjust based on context
    if has_entities and query_type != "general_introduction":
        strategy = f"{strategy}+metadata"
    
    if state["conversation_turn"] > 3:
        strategy = f"{strategy}+conversation_aware"
    
    return {
        **state,
        "retrieval_strategy": strategy,
        "strategy_reasoning": f"Selected {strategy} for {query_type} query"
    }
```

**Strategies**:

1. **standard_hybrid**: Basic hybrid + reranking
2. **project_filtered_hybrid**: Filtered by project_name
3. **skill_filtered_hybrid**: Filtered by technology tags
4. **timeline_filtered_hybrid**: Filtered by experience level/timeframe
5. **multi_query_hybrid**: Run all rewritten queries, merge results
6. **parallel_multi_doc**: Retrieve from multiple document types
7. **conversation_aware**: Factor in previous messages

---

### Node 6: Hybrid Retriever Node

**Purpose**: Perform hybrid (BM25 + semantic) search with metadata filtering

**Architecture**:

```
Query (or multiple queries)
  → [BM25 Search]
      PostgreSQL full-text search
      TF-IDF scoring
      Top 30 results
  
  → [Vector Embedding]
      Embed query
      Vector similarity search
      Top 30 results
  
  → [Metadata Filtering] (optional)
      Filter by project
      Filter by skill
      Filter by timeline
      Intersection filtering
  
  → [Hybrid Fusion: RRF]
       Reciprocal Rank Fusion
       Combine scores: 60 BM25 + 40 Vector
       Merge results
       Top 50 candidates
```

**Processing**:
```python
async def hybrid_retrieve(state):
    queries = state["rewritten_queries"]
    strategy = state["retrieval_strategy"]
    
    all_results = []
    
    for query in queries:
        # BM25 Search
        bm25_results = await search_bm25(
            query=query,
            top_k=30,
            metadata_filter=extract_metadata_filter(state, strategy)
        )
        
        # Vector Search
        query_embedding = await embed(query)
        vector_results = await search_vector(
            embedding=query_embedding,
            top_k=30,
            metadata_filter=extract_metadata_filter(state, strategy)
        )
        
        # Hybrid Fusion (RRF)
        fused_results = reciprocal_rank_fusion(
            bm25_results,
            vector_results,
            alpha=0.6,  # Weight for BM25
            beta=0.4    # Weight for vector
        )
        
        all_results.extend(fused_results)
    
    # Merge and deduplicate
    merged_results = merge_search_results(all_results)
    
    return {
        **state,
        "retrieved_chunks": merged_results[:50],  # Top 50
        "retrieval_count": len(merged_results),
        "retrieval_debug_info": {
            "bm25_searches": len(queries),
            "vector_searches": len(queries),
            "fusion_method": "RRF",
            "final_candidates": len(merged_results)
        }
    }
```

**Output**:
```python
{
    "retrieved_chunks": [
        {
            "chunk_id": "chunk_12345",
            "content": "...",
            "metadata": {
                "source": "project_doc",
                "project": "rag-system",
                "section": "retrieval"
            },
            "bm25_score": 0.87,
            "vector_score": 0.92,
            "hybrid_score": 0.895,
            "source_document": "architecture.md"
        },
        # ... more chunks
    ],
    "retrieval_count": 50,
    "retrieval_debug_info": {...}
}
```

---

### Node 7: Reranker Node

**Purpose**: Score and re-order retrieval candidates by relevance

**Current Implementation**: Score-based reranking using the existing hybrid fusion scores.

```python
# src/rag/retrieval/reranker.py
def simple_rerank(query, candidates, threshold=0.0, top_k=7):
    for candidate in candidates:
        candidate["rerank_score"] = float(candidate.get("score", 0.0))
    ranked = sorted(candidates, key=lambda x: x["rerank_score"], reverse=True)
    filtered = [x for x in ranked if x["rerank_score"] >= threshold]
    return filtered[:top_k] if filtered else ranked[:top_k]
```

**Future upgrade** (Phase 3+): Replace with a cross-encoder model for significantly better precision:
```python
# To upgrade: add to requirements.txt
# sentence-transformers already installed

from sentence_transformers import CrossEncoder
reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
pairs = [(query, chunk["chunk_text"]) for chunk in candidates]
scores = reranker.predict(pairs)
```

---

### Node 8: Context Optimization Node

**Purpose**: Format and prepare context for LLM

**Processing**:
```python
async def optimize_context(state):
    chunks = state["reranked_chunks"]
    
    # Format chunks with structure
    formatted_chunks = []
    for i, chunk in enumerate(chunks, 1):
        formatted = f"""
[Source {i}: {chunk['source_document']}]
{chunk['content']}
[Confidence: {chunk['rerank_score']:.2f}]
"""
        formatted_chunks.append(formatted)
    
    # Merge overlapping/duplicate content
    merged = merge_overlapping_chunks(formatted_chunks)
    
    # Build context string
    context = "\n".join(merged)
    
    # Token counting
    token_count = count_tokens(context)
    
    # Truncate if exceeds limit (e.g., 2000 tokens)
    max_tokens = 2000
    if token_count > max_tokens:
        context = truncate_context(context, max_tokens)
    
    return {
        **state,
        "optimized_context": context,
        "context_token_count": token_count,
        "context_truncated": token_count > max_tokens
    }
```

---

### Node 9: Memory Injection Node

**Purpose**: Inject conversation history and session context

**Processing**:
```python
async def inject_memory(state):
    memory_context = state["memory_context"]
    optimized_context = state["optimized_context"]
    
    # Build memory block
    memory_block = ""
    
    # Conversation history (if any)
    if state["has_history"]:
        memory_block += f"""## Conversation History
{memory_context['history']}

"""
    
    # Session summary (if long session)
    if state["conversation_turn"] > 5:
        memory_block += f"""## Session Context
{memory_context['summary']}

"""
    
    # Combine with retrieved context
    full_context = memory_block + optimized_context
    
    # Token count
    full_token_count = count_tokens(full_context)
    
    # Enforce max context (e.g., 3500 tokens)
    if full_token_count > 3500:
        # Prioritize retrieved content, trim history
        full_context = trim_history_keep_retrieval(
            memory_block,
            optimized_context,
            max_tokens=3500
        )
    
    return {
        **state,
        "final_context": full_context,
        "final_context_token_count": count_tokens(full_context),
        "memory_injected": state["has_history"]
    }
```

---

### Node 10: LLM Response Generator

**Purpose**: Generate response using Groq LLM

**LLM Provider**: Groq (`llama-3.3-70b-versatile` by default)

**Processing** (from `src/rag/orchestration/graph.py`):
```python
async def node_llm_generator(state: OrchestrationState) -> OrchestrationState:
    system_prompt = (
        "You are a helpful assistant representing a software engineer's portfolio. "
        "Answer questions using only the provided context. "
        "Be concise and factual. "
        "If the context does not contain enough information, say you don't have that information. "
        "Do not invent projects, metrics, or technologies."
    )
    user_message = (
        f"Context:\n{state.get('context', '')}\n\n"
        f"Question:\n{state.get('query', '')}\n\nAnswer:"
    )
    response = await groq_client.generate_text(
        prompt=user_message,
        system_prompt=system_prompt,
        max_tokens=1200,
        temperature=0.1,
    )
    return {**state, "response": response}
```

**Groq model options** (set via `GROQ_MODEL` env var):
- `llama-3.3-70b-versatile` — default, best quality
- `llama-3.1-8b-instant` — faster, lower cost
- `gemma2-9b-it` — alternative

**Fallback**: Set `LLM_PROVIDER=openai` and `OPENAI_API_KEY` in `.env` for OpenAI.

---

### Node 11: Citation Builder Node

**Purpose**: Extract citations from response and map to sources

**Processing**:
```python
async def build_citations(state):
    response_text = state["response_text"]
    reranked_chunks = state["reranked_chunks"]
    
    citations = []
    
    # Use sentence-similarity to map response sentences to source chunks
    response_sentences = split_sentences(response_text)
    
    for sent_idx, sentence in enumerate(response_sentences):
        # Find most similar chunk
        similarities = []
        for chunk in reranked_chunks:
            sim = cosine_similarity(
                embed(sentence),
                embed(chunk["content"])
            )
            similarities.append((chunk, sim))
        
        best_chunk = max(similarities, key=lambda x: x[1])[0]
        
        citation = {
            "sentence_index": sent_idx,
            "cited_chunk": best_chunk["chunk_id"],
            "source_document": best_chunk["source_document"],
            "confidence": best_chunk["rerank_score"],
            "metadata": best_chunk["metadata"]
        }
        citations.append(citation)
    
    return {
        **state,
        "citations": citations,
        "citation_count": len(citations)
    }
```

---

### Node 12: Streaming Response Node

**Purpose**: Format and stream response to client

**Output Format**:
```json
{
    "event": "response",
    "token": "The",
    "accumulated": "The",
    "metadata": {
        "token_index": 0,
        "citation": {
            "source": "rag-architecture.md",
            "chunk_id": "chunk_123",
            "confidence": 0.92
        }
    }
}
```

**Processing**:
```python
async def stream_response(state):
    for token_idx, token in enumerate(state["response_tokens"]):
        # Find citation for this token
        citation = find_citation_for_token(
            token_idx,
            state["citations"]
        )
        
        # Build streaming message
        message = {
            "event": "response_token",
            "token": token,
            "token_index": token_idx,
            "citation": citation
        }
        
        yield json.dumps(message) + "\n"
    
    # Send completion event
    final_message = {
        "event": "response_complete",
        "total_tokens": state["token_count"],
        "latency_ms": calculate_latency(state),
        "sources": [c["source_document"] for c in state["reranked_chunks"]]
    }
    
    yield json.dumps(final_message) + "\n"
```

---

## State Management

**Full State Structure**:
```python
{
    # User Input
    "query": str,
    "session_id": str,
    "user_id": str,
    
    # Classification
    "query_type": str,
    "confidence": float,
    "entities": list[str],
    "domain": str,
    
    # Memory
    "memory_context": dict,
    "has_history": bool,
    "conversation_turn": int,
    
    # Retrieval
    "rewritten_queries": list[str],
    "retrieval_strategy": str,
    "retrieved_chunks": list[dict],
    
    # Reranking
    "reranked_chunks": list[dict],
    
    # Context
    "optimized_context": str,
    "context_token_count": int,
    "final_context": str,
    "final_context_token_count": int,
    
    # Response
    "response_text": str,
    "response_tokens": list[str],
    "citations": list[dict],
    
    # Metadata
    "timestamp": datetime,
    "latency": float,
    "model": str,
    "version": str
}
```

---

## Error Handling & Retry Logic

```python
node_retry_config = {
    "hybrid_retriever": {
        "max_retries": 3,
        "backoff": "exponential",
        "fallback": "simple_keyword_search"
    },
    "reranker": {
        "max_retries": 2,
        "fallback": "use_hybrid_scores"
    },
    "llm_generator": {
        "max_retries": 2,
        "fallback": "use_cached_response"
    }
}
```

---

## Conditional Routing

```python
# If retrieval fails or no results
if state["retrieval_count"] < 3:
    route_to = "fallback_retrieval"

# If query is ambiguous
if state["confidence"] < 0.5:
    route_to = "clarification_prompt"

# If response is too generic
if detect_generic_response(state["response_text"]):
    route_to = "enhanced_retrieval_retry"

# If citation confidence is low
if avg_citation_confidence < 0.6:
    route_to = "reranker_retry"
```

---

## Observability & Debugging

**Debug Mode Output** (when enabled):
```json
{
    "debug": {
        "classification": {
            "category": "technical_deep_dive",
            "confidence": 0.94,
            "reasoning": "Query asks for explanation of architecture"
        },
        "retrieval": {
            "strategy": "multi_query_hybrid",
            "queries_used": 5,
            "bm25_results": 30,
            "vector_results": 30,
            "after_fusion": 50,
            "after_rerank": 7
        },
        "context": {
            "memory_included": true,
            "context_tokens": 2847,
            "truncated": false,
            "chunk_scores": [0.94, 0.91, 0.88, ...]
        },
        "generation": {
            "model": "gpt-4-turbo",
            "temperature": 0.3,
            "tokens_generated": 156,
            "latency_ms": 2341
        },
        "timing": {
            "classification_ms": 234,
            "retrieval_ms": 1456,
            "rerank_ms": 678,
            "generation_ms": 2341,
            "total_ms": 4709
        }
    }
}
```

---

## Next Steps

See [03-DATABASE-SCHEMA.md](03-DATABASE-SCHEMA.md) for PostgreSQL + Redis schema.  
See [04-API-DESIGN.md](04-API-DESIGN.md) for FastAPI endpoints.  
See [05-IMPLEMENTATION-ROADMAP.md](05-IMPLEMENTATION-ROADMAP.md) for implementation steps.
