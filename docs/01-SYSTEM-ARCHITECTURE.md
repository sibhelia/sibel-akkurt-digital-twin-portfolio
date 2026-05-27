# Digital Twin Portfolio System Architecture

**Version**: 1.0  
**Status**: Draft design  
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

### Storage

The planned storage model uses:

- PostgreSQL for structured records
- Redis for cache and short-lived session data
- Qdrant for vector search

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

This document describes the intended shape of the system, not a finished production setup. Some pieces exist as working code, while others are still scaffolding or planning material.
