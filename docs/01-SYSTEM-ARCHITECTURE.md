# Digital Twin Portfolio System Architecture

**Version**: 1.1  
**Status**: Partly implemented — core modules working  
**Target**: Portfolio-focused RAG application

---

## System Overview

The goal of this project is to answer questions about portfolio content, projects, technical choices, and work history using retrieved context instead of relying only on the base model.

At a high level, the system is split into five parts:

1. API layer
2. Ingestion pipeline
3. Retrieval layer
4. LLM orchestration
5. Storage and cache services

---

## Main Components

### API Layer

The FastAPI application handles chat requests, health checks, and admin-only ingestion endpoints. It is responsible for request validation, basic security headers, and wiring requests into the retrieval/orchestration flow.

### Ingestion Pipeline

The ingestion side prepares source material for retrieval. In the current repo this mostly means parsing input, chunking it, attaching metadata, and storing the result in a form that downstream retrieval can use.

### Retrieval Layer

The retrieval stack is designed around a hybrid approach:

- keyword search for exact or term-heavy matches
- vector search for semantic similarity
- reranking to improve the final context selection

This keeps the system practical for both direct factual queries and broader questions about experience or project history.

### Orchestration

The orchestration layer decides how a user query should be processed, which retrieval path to use, and how the final answer should be assembled. The repo already includes the basic module layout for this flow.

### LLM & Embeddings

- **LLM**: Groq (`llama-3.3-70b-versatile`) via official Groq Python SDK
  - Uses Chat Completions API with system + user message format
  - OpenAI (`gpt-4o-mini`) available as env-var fallback
- **Embeddings**: `intfloat/multilingual-e5-base` via sentence-transformers
  - Runs locally — no API key required
  - Turkish + English support
  - 768-dimensional vectors
  - Uses `"query: "` prefix for search, `"passage: "` prefix for documents

### Storage

The storage model uses:

- PostgreSQL for structured records (documents, chunks, conversations, citations)
- Redis for cache and short-lived session data (also caches embeddings)
- Qdrant for vector search (COSINE similarity, 768-dim collection)

---

## Request Flow

1. A chat request reaches the API.
2. The query is normalized and sent into orchestration.
3. The system chooses a retrieval strategy.
4. Matching context is collected and reranked.
5. The LLM generates a response from that context.
6. The API returns the response together with any citations or metadata.

---

## Design Priorities

- Keep answers grounded in retrieved material
- Prefer simple module boundaries over tightly coupled logic
- Make storage choices replaceable where possible
- Leave room for streaming and session memory
- Keep admin ingestion separate from public chat access

---

## Current Reality

The following modules are implemented and wired up:
- `src/api/main.py` — FastAPI app with chat + admin ingestion endpoints
- `src/llm/groq_client.py` — Groq SDK client (Chat Completions)
- `src/rag/embeddings.py` — sentence-transformers with Redis caching
- `src/rag/orchestration/graph.py` — langgraph 0.2.x TypedDict pipeline
- `src/rag/retrieval/` — hybrid BM25 + Qdrant vector search with RRF fusion
- `src/ingestion/pipeline.py` — parse, chunk, embed, and index pipeline
- `src/db/models.py` — full SQLAlchemy ORM (Document, Chunk, Conversation, Message, Citation)

What still needs work:
- Alembic migration files (tables need `alembic upgrade head`)
- Cross-encoder reranker (currently uses score-passthrough)
- Streaming SSE/WebSocket responses
- JWT authentication on public endpoints
