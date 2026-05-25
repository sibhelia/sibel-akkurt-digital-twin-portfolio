# FastAPI Architecture & Endpoint Design

**Version**: 1.0  
**Framework**: FastAPI with async/await  
**Authentication**: JWT Bearer Tokens  
**Status**: Production Specification

---

## API Overview

```
Base URL: /api/v1
Authentication: JWT Bearer token in Authorization header
Rate Limiting: Per-user, per-minute, per-day quotas
```

---

## Core Endpoints

### 1. Chat Endpoint (Streaming)

#### `POST /api/v1/chat`

**Purpose**: Primary conversational endpoint with streaming responses

**Authentication**: Required (JWT)

**Rate Limit**: 60 requests/minute, 10,000/day

**Request**:
```json
{
  "query": "Explain your RAG architecture and why you chose LangGraph",
  "session_id": "session-abc123",
  "stream": true,
  "debug_mode": false,
  "context": {
    "projects_filter": ["rag-system"],
    "skill_focus": ["python", "ml"],
    "previous_context": true
  }
}
```

**Request Schema** (Pydantic):
```python
class ChatRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=2000)
    session_id: str = Field(..., regex="^[a-zA-Z0-9-_]+$")
    stream: bool = False
    debug_mode: bool = False
    context: Optional[Dict] = None
    
    class Config:
        schema_extra = {
            "example": {
                "query": "Tell me about your projects",
                "session_id": "session-123"
            }
        }
```

**Response (Streaming)**:
```
data: {"event": "response_start", "session_id": "session-abc123", "request_id": "req-xyz"}
data: {"event": "response_token", "token": "The", "token_index": 0}
data: {"event": "response_token", "token": " RAG", "token_index": 1}
...
data: {"event": "response_complete", "total_tokens": 156, "latency_ms": 2341, "sources": ["rag-arch.md", "retrieval.md"]}
```

**Response Schema** (per event):
```python
class ResponseTokenEvent(BaseModel):
    event: Literal["response_token"]
    token: str
    token_index: int
    citation: Optional[Dict] = None
    
class ResponseCompleteEvent(BaseModel):
    event: Literal["response_complete"]
    total_tokens: int
    latency_ms: int
    sources: List[str]
    debug_info: Optional[Dict] = None  # If debug_mode=true
```

**Status Codes**:
- `200 OK`: Streaming started
- `400 Bad Request`: Invalid query
- `401 Unauthorized`: Missing/invalid JWT
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: LLM service down

**Implementation**:
```python
@router.post("/chat", response_class=StreamingResponse)
async def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis)
):
    # Validate user and rate limit
    await check_rate_limit(current_user.id, redis)
    
    # Initialize LangGraph state
    state = {
        "query": request.query,
        "session_id": request.session_id,
        "user_id": current_user.id,
        "debug_mode": request.debug_mode,
        # ... other state
    }
    
    # Execute graph and stream responses
    async def event_generator():
        yield f"data: {json.dumps({'event': 'response_start'})}\n\n"
        
        async for output in langgraph_app.astream(state):
            if output.get("streaming_response"):
                for event in output["streaming_response"]:
                    yield f"data: {json.dumps(event)}\n\n"
        
        yield f"data: {json.dumps({'event': 'response_complete'})}\n\n"
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

---

### 2. Document Ingestion

#### `POST /api/v1/ingest/documents` (Admin Only)

**Purpose**: Upload and ingest documents into knowledge base

**Authentication**: Required (JWT with admin role)

**Rate Limit**: 10 uploads/minute per admin

**Request**:
```
Content-Type: multipart/form-data

file: [PDF/Markdown/Text file]
project_name: "rag-system"
technologies: ["python", "langgraph"]
topics: ["retrieval", "architecture"]
importance: "high"
experience_level: "advanced"
custom_metadata: {
  "url": "https://github.com/...",
  "author": "sibel"
}
```

**Response**:
```json
{
  "ingestion_id": "ingestion-123",
  "file_name": "rag-architecture.pdf",
  "status": "processing",
  "document_id": "doc-456",
  "message": "Document queued for processing",
  "estimated_completion_ms": 30000,
  "chunks_expected": 42
}
```

**Status Codes**:
- `202 Accepted`: Document accepted for processing
- `400 Bad Request`: Invalid file
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Insufficient permissions
- `413 Payload Too Large`: File > 100MB
- `415 Unsupported Media Type`: Invalid file type

**Implementation**:
```python
@router.post("/ingest/documents")
async def ingest_documents(
    file: UploadFile = File(...),
    project_name: str = Form(...),
    technologies: List[str] = Form(...),
    current_user: User = Depends(get_current_user_admin),
    db: AsyncSession = Depends(get_db)
):
    # Validate file
    if file.size > 100 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large")
    
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail="Invalid file type")
    
    # Scan for viruses (integration with ClamAV, etc.)
    is_safe = await scan_file(file)
    if not is_safe:
        raise HTTPException(status_code=400, detail="Potentially malicious file")
    
    # Queue for async processing
    batch_id = str(uuid.uuid4())
    await celery.send_task(
        "tasks.ingest_document",
        args=[
            batch_id,
            file.filename,
            await file.read(),
            project_name,
            technologies,
            current_user.id
        ]
    )
    
    return {
        "ingestion_id": batch_id,
        "file_name": file.filename,
        "status": "processing"
    }
```

---

### 3. GitHub Repository Ingestion

#### `POST /api/v1/ingest/github` (Admin Only)

**Purpose**: Ingest README and documentation from GitHub repos

**Authentication**: Required (JWT with admin role)

**Request**:
```json
{
  "owner": "sibhelia",
  "repo": "rocket-system",
  "include_paths": ["README.md", "docs/**/*.md", "ARCHITECTURE.md"],
  "exclude_paths": [".github/**"],
  "project_name": "rocket-system",
  "technologies": ["python", "distributed-systems"],
  "topics": ["architecture", "scaling"]
}
```

**Response**:
```json
{
  "ingestion_id": "ingestion-789",
  "status": "processing",
  "files_queued": 7,
  "estimated_chunks": 156,
  "message": "GitHub repository queued for ingestion"
}
```

**Implementation**:
```python
@router.post("/ingest/github")
async def ingest_github(
    request: GitHubIngestRequest,
    current_user: User = Depends(get_current_user_admin)
):
    # Validate GitHub access
    github_token = settings.GITHUB_TOKEN
    
    batch_id = str(uuid.uuid4())
    
    await celery.send_task(
        "tasks.ingest_github_repo",
        args=[
            batch_id,
            request.owner,
            request.repo,
            request.include_paths,
            github_token,
            request.project_name,
            current_user.id
        ]
    )
    
    return {
        "ingestion_id": batch_id,
        "status": "processing"
    }
```

---

### 4. Retrieval Debug Endpoint

#### `GET /api/v1/retrieval/debug`

**Purpose**: Debug retrieval pipeline (development/admin only)

**Authentication**: Required (JWT with debug permission)

**Query Parameters**:
```
query: "Explain RAG architecture"
project_filter: "rag-system" (optional)
debug_depth: "full" (optional: basic, detailed, full)
```

**Response**:
```json
{
  "query": "Explain RAG architecture",
  "classification": {
    "type": "technical_deep_dive",
    "confidence": 0.94,
    "entities": ["RAG", "architecture"],
    "domain": "architecture"
  },
  "retrieval": {
    "strategy": "multi_query_hybrid",
    "rewritten_queries": [
      "Explain RAG architecture",
      "What is your retrieval augmented generation design",
      "How did you build your RAG system",
      "What components are in your RAG pipeline"
    ],
    "bm25_results": {
      "count": 30,
      "top_3": [
        {
          "chunk_id": "chunk-123",
          "score": 0.92,
          "content_preview": "The RAG architecture has three main components..."
        }
      ]
    },
    "vector_results": {
      "count": 30,
      "top_3": [
        {
          "chunk_id": "chunk-456",
          "score": 0.88,
          "content_preview": "Vector similarity search..."
        }
      ]
    },
    "after_fusion": {
      "count": 50,
      "top_3": [
        {
          "chunk_id": "chunk-789",
          "hybrid_score": 0.895,
          "content_preview": "..."
        }
      ]
    },
    "after_rerank": {
      "count": 7,
      "top_3": [
        {
          "chunk_id": "chunk-789",
          "rerank_score": 0.94,
          "content": "Full chunk content...",
          "metadata": {"project": "rag-system", "importance": "high"}
        }
      ]
    }
  },
  "timing": {
    "classification_ms": 234,
    "rewriting_ms": 456,
    "bm25_search_ms": 78,
    "vector_search_ms": 234,
    "fusion_ms": 12,
    "rerank_ms": 567,
    "total_ms": 1581
  }
}
```

---

### 5. Conversation History

#### `GET /api/v1/conversations/{session_id}`

**Purpose**: Retrieve conversation history

**Authentication**: Required (JWT)

**Query Parameters**:
```
limit: 50 (optional, max 100)
offset: 0 (optional, for pagination)
```

**Response**:
```json
{
  "session_id": "session-abc123",
  "conversation_id": "conv-xyz",
  "created_at": "2024-01-15T10:30:00Z",
  "message_count": 8,
  "messages": [
    {
      "id": "msg-1",
      "index": 0,
      "role": "user",
      "content": "Tell me about your RAG architecture",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": "msg-2",
      "index": 1,
      "role": "assistant",
      "content": "The RAG architecture...",
      "created_at": "2024-01-15T10:30:05Z",
      "citations": [
        {
          "source": "rag-architecture.md",
          "chunk_id": "chunk-123",
          "confidence": 0.94
        }
      ],
      "latency_ms": 2341,
      "tokens_used": 156
    }
  ],
  "summary": "Discussion of RAG system architecture and design decisions"
}
```

**Status Codes**:
- `200 OK`: Success
- `404 Not Found`: Session not found
- `401 Unauthorized`: Not authenticated

---

### 6. Memory Export

#### `POST /api/v1/memory/export`

**Purpose**: Export conversation and memory for analysis

**Authentication**: Required (JWT)

**Request**:
```json
{
  "session_id": "session-abc123",
  "format": "json",
  "include_debug": false
}
```

**Response**: File download (JSON or CSV)

```json
{
  "session_id": "session-abc123",
  "export_timestamp": "2024-01-15T12:00:00Z",
  "total_messages": 12,
  "conversation_summary": "...",
  "messages": [...],
  "statistics": {
    "total_tokens": 8934,
    "avg_latency_ms": 2134,
    "hallucination_detected": false
  }
}
```

---

### 7. Re-indexing (Admin)

#### `POST /api/v1/reindex` (Admin Only)

**Purpose**: Trigger full re-indexing of knowledge base

**Authentication**: Required (JWT with admin role)

**Request**:
```json
{
  "scope": "all",
  "incremental": false,
  "force": false,
  "project_filter": "rag-system"
}
```

**Response**:
```json
{
  "reindex_id": "reindex-123",
  "status": "started",
  "scope": "all",
  "total_documents": 156,
  "total_chunks": 12345,
  "estimated_duration_minutes": 45,
  "message": "Re-indexing started in background"
}
```

**WebSocket Updates** (optional):
```python
@router.websocket("/ws/reindex/{reindex_id}")
async def websocket_reindex_status(websocket: WebSocket, reindex_id: str):
    await websocket.accept()
    
    async def send_updates():
        while True:
            status = await get_reindex_status(reindex_id)
            await websocket.send_json(status)
            await asyncio.sleep(5)  # Update every 5 seconds
    
    await send_updates()
```

---

### 8. Health Check

#### `GET /api/v1/health`

**Purpose**: System health check (no auth required)

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T12:00:00Z",
  "uptime_seconds": 345600,
  "dependencies": {
    "postgres": "healthy",
    "redis": "healthy",
    "qdrant": "healthy",
    "llm_service": "healthy"
  },
  "version": "1.0.0",
  "environment": "production"
}
```

---

### 9. Metrics & Monitoring

#### `GET /api/v1/metrics`

**Purpose**: Prometheus metrics endpoint

**Authentication**: Optional (can be restricted to internal)

**Response** (Prometheus format):
```
# HELP portfolio_chat_requests_total Total chat requests
# TYPE portfolio_chat_requests_total counter
portfolio_chat_requests_total{endpoint="chat",status="200"} 12345

# HELP portfolio_chat_latency_seconds Chat endpoint latency
# TYPE portfolio_chat_latency_seconds histogram
portfolio_chat_latency_seconds_bucket{endpoint="chat",le="0.5"} 9234
portfolio_chat_latency_seconds_bucket{endpoint="chat",le="1.0"} 11232
...

# HELP portfolio_retrieval_latency_seconds Retrieval latency
# TYPE portfolio_retrieval_latency_seconds histogram
portfolio_retrieval_latency_seconds_bucket{le="0.1"} 1234
...

# HELP portfolio_vector_search_recall_ratio Vector search recall
# TYPE portfolio_vector_search_recall_ratio gauge
portfolio_vector_search_recall_ratio 0.94
```

---

## Authentication

### JWT Token Generation

```python
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    refresh_token: Optional[str] = None

@router.post("/auth/token")
async def get_token(credentials: Credentials):
    # Validate credentials (could be OAuth, basic auth, etc.)
    user = await authenticate_user(credentials)
    
    # Create JWT token
    token = create_access_token(
        data={"user_id": user.id, "permissions": user.permissions},
        expires_delta=timedelta(hours=24)
    )
    
    return TokenResponse(access_token=token, expires_in=86400)
```

### Token Structure
```python
{
  "user_id": "user-123",
  "permissions": ["chat:write", "retrieval:debug"],
  "iat": 1705318800,
  "exp": 1705405200,
  "iss": "portfolio-rag"
}
```

---

## Error Handling

### Standard Error Response

```python
class ErrorResponse(BaseModel):
    error_code: str
    message: str
    details: Optional[Dict] = None
    request_id: str
    timestamp: datetime

class ValidationError(BaseModel):
    error_code: str = "VALIDATION_ERROR"
    message: str
    fields: Dict[str, List[str]]
    timestamp: datetime
```

### Common Error Codes

```python
ERROR_CODES = {
    "QUERY_INVALID": (400, "Query is invalid or too short"),
    "SESSION_NOT_FOUND": (404, "Session not found"),
    "RATE_LIMIT_EXCEEDED": (429, "Rate limit exceeded"),
    "AUTH_FAILED": (401, "Authentication failed"),
    "PERMISSION_DENIED": (403, "Insufficient permissions"),
    "RETRIEVAL_FAILED": (503, "Retrieval service unavailable"),
    "LLM_TIMEOUT": (504, "LLM request timeout"),
    "HALLUCINATION_DETECTED": (422, "Potential hallucination in response"),
    "INTERNAL_ERROR": (500, "Internal server error"),
}
```

---

## Middleware & Interceptors

```python
# 1. Authentication middleware
@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    try:
        payload = jwt.decode(token, settings.JWT_SECRET)
        request.state.user_id = payload["user_id"]
    except:
        request.state.user_id = None
    
    response = await call_next(request)
    return response

# 2. Rate limiting middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    user_id = request.state.user_id
    if await check_rate_limit(user_id):
        return Response(status_code=429)
    
    response = await call_next(request)
    return response

# 3. Logging middleware
@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start_time = time.time()
    
    response = await call_next(request)
    
    duration = time.time() - start_time
    logger.info(
        f"{request.method} {request.url.path}",
        extra={
            "request_id": request_id,
            "user_id": request.state.user_id,
            "status": response.status_code,
            "duration_ms": int(duration * 1000)
        }
    )
    
    return response
```

---

## Request/Response Examples

### Example: Full Chat Request/Response

**Request**:
```python
POST /api/v1/chat
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "query": "How would you design a distributed caching layer for high-traffic systems?",
  "session_id": "session-user123-20240115",
  "stream": true,
  "context": {
    "projects_filter": ["rocket-system", "distributed-systems"],
    "skill_focus": ["distributed-systems", "systems-design"]
  }
}
```

**Response Stream** (line-delimited JSON):
```
data: {"event":"response_start","session_id":"session-user123-20240115","request_id":"req-456"}

data: {"event":"response_token","token":"I'd","token_index":0}
data: {"event":"response_token","token":" design","token_index":1}
data: {"event":"response_token","token":" a","token_index":2}
data: {"event":"response_token","token":" distributed","token_index":3}
...
data: {"event":"response_token","token":"\.","token_index":156}

data: {"event":"response_complete","total_tokens":156,"latency_ms":2341,"sources":["distributed-caching.md","architecture-patterns.md"],"debug_info":{"retrieval_strategy":"multi_query_hybrid","rerank_scores":[0.94,0.91,0.88]}}
```

---

## API Documentation

### OpenAPI/Swagger

```python
from fastapi.openapi.utils import get_openapi

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="AI Digital Twin Portfolio API",
        version="1.0.0",
        description="Production-grade RAG system for AI-powered portfolio",
        routes=app.routes,
    )
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
```

Available at: `GET /api/v1/docs`

---

## Next Steps

See [05-IMPLEMENTATION-ROADMAP.md](05-IMPLEMENTATION-ROADMAP.md) for step-by-step implementation.  
See [06-SECURITY-ARCHITECTURE.md](06-SECURITY-ARCHITECTURE.md) for security best practices.
