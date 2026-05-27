# Implementation Roadmap

**Version**: 1.0  
**Status**: Detailed Phase-by-Phase Guide  
**Total Duration**: ~16-20 weeks

---

## Project Phases Overview

```
Phase 0: Foundation & Setup (Weeks 1-2)
   Environment setup
   Project structure
   Dependency management
   CI/CD pipeline

Phase 1: Core Persistence Layer (Weeks 3-5)
   PostgreSQL schema
   Database ORM setup
   Redis integration
   Vector DB setup

Phase 2: Document Ingestion Pipeline (Weeks 6-8)
   Document parsers
   Chunking engine
   Embedding generation
   Indexing pipeline

Phase 3: Retrieval System (Weeks 9-11)
   BM25 search
   Vector search
   Hybrid fusion
   Reranking
   Metadata filtering

Phase 4: LangGraph Orchestration (Weeks 12-14)
   Node implementations
   State management
   Memory system
   Integration testing

Phase 5: API & Streaming (Weeks 15-16)
   FastAPI setup
   Streaming responses
   Authentication
   Rate limiting

Phase 6: Observability & Polish (Weeks 17-20)
   Logging & metrics
   Error handling
   Documentation
   Production deployment
```

---

## Phase 0: Foundation & Setup (Weeks 1-2)

### Week 1: Project Structure & Dependencies

#### Tasks

**1.1 - Create Project Structure**
```bash
digital-twin-portfolio/
 src/
    rag/
       __init__.py
       orchestration/
          __init__.py
          langgraph_app.py
          nodes/
       retrieval/
          __init__.py
          hybrid_search.py
          bm25_search.py
          vector_search.py
          reranker.py
          fusion.py
       memory/
          __init__.py
          conversation_memory.py
          session_memory.py
          memory_manager.py
       streaming/
          __init__.py
          response_streamer.py
       utils/
           __init__.py
           embedding.py
           tokenizer.py
           validators.py
    ingestion/
       __init__.py
       parsers/
          pdf_parser.py
          markdown_parser.py
          github_parser.py
          code_parser.py
       chunking/
          recursive_chunker.py
          semantic_chunker.py
          chunk_optimizer.py
       pipeline.py
    api/
       __init__.py
       main.py
       routes/
          chat.py
          ingestion.py
          retrieval.py
          conversations.py
          health.py
       auth.py
       middleware.py
       schemas.py
    db/
       __init__.py
       models.py
       session.py
       migrations/
    config.py
    logger.py
    settings.py
 tests/
    __init__.py
    unit/
    integration/
    e2e/
 docs/
    01-SYSTEM-ARCHITECTURE.md (created)
    02-LANGGRAPH-DESIGN.md (created)
    03-DATABASE-SCHEMA.md (created)
    04-API-DESIGN.md (created)
    05-IMPLEMENTATION-ROADMAP.md (this file)
    06-SECURITY-ARCHITECTURE.md (to create)
    07-DEPLOYMENT-GUIDE.md (to create)
    08-SCALING-STRATEGY.md (to create)
 docker/
    Dockerfile
    Dockerfile.cpu
    docker-compose.yml
 scripts/
    setup_db.py
    ingest_sample_data.py
    generate_test_vectors.py
    performance_test.py
 requirements.txt
 requirements-dev.txt
 .env.example
 .gitignore
 pyproject.toml
 README.md
```

**1.2 - Create pyproject.toml**
```toml
[project]
name = "digital-twin-portfolio"
version = "1.0.0"
description = "Production-grade RAG system for AI portfolio"
authors = [{name = "Sibel Akkurt"}]
requires-python = ">=3.11"

[project.optional-dependencies]
dev = [
    "pytest==7.4.3",
    "pytest-asyncio==0.21.1",
    "pytest-cov==4.1.0",
    "black==23.12.0",
    "ruff==0.1.8",
    "mypy==1.7.1",
]

[build-system]
requires = ["setuptools", "wheel"]
```

**1.3 - Create requirements.txt**
```
# Core
fastapi==0.115.5
uvicorn[standard]==0.32.1
pydantic==2.10.3
pydantic-settings==2.6.1
python-dotenv==1.0.1

# LLM & RAG
langchain==0.3.14
langgraph==0.2.62          # TypedDict-based state (0.2.x API)
langchain-openai==0.2.14
groq==0.13.1               # Official Groq SDK

# Embeddings (local, no API key needed)
sentence-transformers==3.3.1
numpy==1.26.4
torch==2.5.1
transformers==4.47.1

# Search & Vector DB
qdrant-client==1.12.1
rank-bm25==0.2.2

# Database
sqlalchemy==2.0.36
asyncpg==0.30.0
alembic==1.14.0

# Cache
redis==5.2.1
hiredis==3.0.0

# Processing
pypdf==5.1.0
markdown==3.7
python-pptx==1.0.2
python-multipart==0.0.20

# Auth
pyjwt==2.10.1
passlib[bcrypt]==1.7.4
cryptography==44.0.0
httpx==0.27.2

# Observability
structlog==24.4.0
prometheus-client==0.21.1
opentelemetry-api==1.29.0
sentry-sdk[fastapi]==2.19.2

# Testing
pytest==8.3.4
pytest-asyncio==0.24.0
pytest-cov==6.0.0
```

**1.4 - Create .env.example**
```bash
# Environment
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=DEBUG

# Database
DATABASE_URL=postgresql+asyncpg://portfolio:portfolio@localhost:5432/portfolio_db
REDIS_URL=redis://localhost:6379/0

# Vector DB
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=
QDRANT_COLLECTION_NAME=portfolio_chunks

# Embeddings
# "sentence-transformers" = local ML model, best quality, no API key needed (default)
# "local-hash"            = deterministic fallback, no ML, fast but weak semantics
EMBEDDING_PROVIDER=sentence-transformers
# multilingual-e5-base supports Turkish + English
EMBEDDING_MODEL=intfloat/multilingual-e5-base
EMBEDDING_DIMENSION=768

# LLM — Primary: Groq (fast inference, generous free tier)
LLM_PROVIDER=groq
# Get your free API key at: https://console.groq.com
GROQ_API_KEY=your-groq-api-key-here
# Available models:
#   meta-llama/llama-4-maverick-17b-128e-instruct  (default — smartest, cheapest, multimodal)
#   meta-llama/llama-4-scout-17b-16e-instruct      (fastest, huge context)
#   llama-3.3-70b-versatile                        (reliable fallback)
#   llama-3.1-8b-instant                           (cheapest)
GROQ_MODEL=meta-llama/llama-4-maverick-17b-128e-instruct

# OpenAI (optional fallback)
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini

# Security
JWT_SECRET=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_PER_DAY=10000

# Admin
ADMIN_USERS=admin@example.com
ADMIN_API_KEY=change-me-admin-key

# Observability
SENTRY_DSN=
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

### Week 2: CI/CD & Testing Setup

**2.1 - GitHub Actions Workflow**

Create `.github/workflows/ci.yml`:
```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: portfolio_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      qdrant:
        image: qdrant/qdrant:latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt
      
      - name: Lint with ruff
        run: ruff check src/
      
      - name: Type check with mypy
        run: mypy src/ --ignore-missing-imports
      
      - name: Format check with black
        run: black --check src/
      
      - name: Run tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost/portfolio_test
          REDIS_URL: redis://localhost:6379/0
          QDRANT_URL: http://localhost:6333
        run: pytest tests/ -v --cov=src/
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

**2.2 - Docker Setup**

Create `docker/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY src/ ./src/

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/api/v1/health')"

# Run application
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Create `docker/docker-compose.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: portfolio_db
      POSTGRES_USER: portfolio_user
      POSTGRES_PASSWORD: portfolio_pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

  api:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql+asyncpg://portfolio_user:portfolio_pass@postgres:5432/portfolio_db
      REDIS_URL: redis://redis:6379/0
      QDRANT_URL: http://qdrant:6333
    depends_on:
      - postgres
      - redis
      - qdrant
    volumes:
      - ../src:/app/src

volumes:
  postgres_data:
  redis_data:
  qdrant_data:
```

---

## Phase 1: Core Persistence Layer (Weeks 3-5)

### Week 3: PostgreSQL Setup & ORM

**3.1 - Create Database Models**

Create `src/db/models.py`:
```python
from sqlalchemy import Column, String, Text, Integer, Float, DateTime, Boolean, JSON, UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from datetime import datetime
import uuid

Base = declarative_base()

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    source_type = Column(String(50), nullable=False)  # pdf, markdown, github
    source_url = Column(Text)
    raw_content = Column(Text, nullable=False)
    processed_content = Column(Text)
    
    project_name = Column(String(100))
    technologies = Column(JSONB, default=[])
    topics = Column(JSONB, default=[])
    experience_level = Column(String(20))
    importance = Column(String(20))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    document_created_at = Column(DateTime)
    
    status = Column(String(20), default='indexed')
    error_message = Column(Text)
    
    ingested_by = Column(String(100))
    ingestion_batch_id = Column(UUID(as_uuid=True))
    version = Column(Integer, default=1)
    
    content_hash = Column(String(64), unique=True)

class Chunk(Base):
    __tablename__ = "chunks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), nullable=False)  # FK to documents
    parent_chunk_id = Column(UUID(as_uuid=True))  # For hierarchical chunks
    
    content = Column(Text, nullable=False)
    content_hash = Column(String(64))
    chunk_index = Column(Integer, nullable=False)
    section_path = Column(String(500))
    header_chain = Column(Text)
    
    project_name = Column(String(100))
    technologies = Column(JSONB)
    topics = Column(JSONB)
    importance = Column(String(20))
    experience_level = Column(String(20))
    custom_metadata = Column(JSONB)
    
    embedding_id = Column(String(255))
    embedding_model = Column(String(100))
    embedding_dimension = Column(Integer)
    embedding_generated_at = Column(DateTime)
    
    token_count = Column(Integer)
    bm25_score = Column(Float)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    status = Column(String(20), default='ready')

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(100), nullable=False)
    session_id = Column(String(100), nullable=False, unique=True)
    title = Column(String(255))
    domain = Column(String(100))
    topics = Column(JSONB)
    projects_mentioned = Column(JSONB)
    
    message_count = Column(Integer, default=0)
    last_activity = Column(DateTime)
    status = Column(String(20), default='active')
    
    model_used = Column(String(100))
    average_token_usage = Column(Float)
    total_tokens_used = Column(Integer, default=0)
    
    user_satisfaction = Column(Integer)  # 1-5
    contains_hallucination = Column(Boolean, default=False)
    hallucination_notes = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime)
    
    conversation_summary = Column(Text)
    summary_generated_at = Column(DateTime)

# ... More models (Message, Citation, etc.)
```

**3.2 - Create Database Session Manager**

Create `src/db/session.py`:
```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import NullPool
from typing import AsyncGenerator
import os

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_async_engine(
    DATABASE_URL,
    echo=os.getenv("DEBUG", "False").lower() == "true",
    pool_size=20,
    max_overflow=40,
    poolclass=NullPool,  # For serverless
)

async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def close_db():
    await engine.dispose()
```

**3.3 - Alembic Migrations**

```bash
alembic init alembic
```

Create `alembic/env.py` migration configuration.

### Week 4: Redis Integration

**4.1 - Redis Connection Manager**

Create `src/cache/redis_manager.py`:
```python
import redis.asyncio as redis
from typing import Optional, Any
import json
import os

class RedisManager:
    def __init__(self):
        self.url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.client: Optional[redis.Redis] = None
    
    async def connect(self):
        self.client = await redis.from_url(self.url, decode_responses=False)
        await self.client.ping()
        print("Connected to Redis")
    
    async def disconnect(self):
        if self.client:
            await self.client.close()
    
    async def set(self, key: str, value: Any, ttl: int = 3600):
        serialized = json.dumps(value).encode()
        await self.client.setex(key, ttl, serialized)
    
    async def get(self, key: str) -> Optional[Any]:
        data = await self.client.get(key)
        if data:
            return json.loads(data.decode())
        return None
    
    async def delete(self, key: str):
        await self.client.delete(key)

redis_manager = RedisManager()
```

### Week 5: Qdrant/pgvector Setup

**5.1 - Qdrant Collection Initialization**

Create `src/vector_db/qdrant_manager.py`:
```python
from qdrant_client import QdrantClient
from qdrant_client.http import models
from typing import List, Dict
import os

class QdrantManager:
    def __init__(self):
        self.url = os.getenv("QDRANT_URL", "http://localhost:6333")
        self.client = QdrantClient(self.url)
    
    async def create_collection(self, collection_name: str):
        await self.client.recreate_collection(
            collection_name=collection_name,
            vectors_config=models.VectorParams(
                size=1024,  # BAAI/bge-large-en dimension
                distance=models.Distance.COSINE
            ),
            payload_schema={
                "project_name": models.PayloadSchemaType.KEYWORD,
                "technologies": models.PayloadSchemaType.ARRAY,
                "importance": models.PayloadSchemaType.KEYWORD,
            }
        )
    
    async def upsert_vectors(
        self,
        collection_name: str,
        points: List[models.PointStruct]
    ):
        await self.client.upsert(
            collection_name=collection_name,
            points=points
        )
    
    async def search(
        self,
        collection_name: str,
        vector: List[float],
        limit: int = 10,
        query_filter = None
    ) -> List[models.ScoredPoint]:
        return await self.client.search(
            collection_name=collection_name,
            query_vector=vector,
            limit=limit,
            query_filter=query_filter,
        )

qdrant_manager = QdrantManager()
```

---

## Phase 2: Document Ingestion Pipeline (Weeks 6-8)

### Week 6: Document Parsers

**6.1 - PDF Parser**

Create `src/ingestion/parsers/pdf_parser.py`:
```python
import pypdf
from typing import List, Dict

class PDFParser:
    def parse(self, file_path: str) -> Dict[str, any]:
        text = ""
        metadata = {}
        
        with open(file_path, 'rb') as f:
            pdf_reader = pypdf.PdfReader(f)
            metadata = pdf_reader.metadata
            
            for page_num, page in enumerate(pdf_reader.pages):
                text += f"\n--- Page {page_num + 1} ---\n"
                text += page.extract_text()
        
        return {
            "content": text,
            "metadata": {
                "title": metadata.get("/Title", ""),
                "author": metadata.get("/Author", ""),
                "created": str(metadata.get("/CreationDate", "")),
            },
            "page_count": len(pdf_reader.pages)
        }

class MarkdownParser:
    def parse(self, file_path: str) -> Dict[str, any]:
        with open(file_path, 'r') as f:
            content = f.read()
        
        # Parse markdown structure
        lines = content.split('\n')
        sections = self._extract_sections(lines)
        
        return {
            "content": content,
            "sections": sections,
            "structure": self._build_hierarchy(lines)
        }
    
    def _extract_sections(self, lines: List[str]) -> List[Dict]:
        sections = []
        current_section = None
        
        for line in lines:
            if line.startswith('#'):
                level = len(line) - len(line.lstrip('#'))
                current_section = {
                    "level": level,
                    "title": line.lstrip('# ').strip(),
                    "content": []
                }
                sections.append(current_section)
            elif current_section:
                current_section["content"].append(line)
        
        return sections
```

### Week 7: Chunking Engine

**7.1 - Recursive Chunker**

Create `src/ingestion/chunking/recursive_chunker.py`:
```python
from typing import List, Dict
import re

class RecursiveChunker:
    def __init__(self, chunk_size: int = 512, overlap: int = 50):
        self.chunk_size = chunk_size
        self.overlap = overlap
    
    def chunk(
        self,
        text: str,
        metadata: Dict = None,
        preserv_headers: bool = True
    ) -> List[Dict]:
        """
        Recursive chunking: Start with large chunks, split if too large
        """
        chunks = []
        
        # Split by paragraphs first
        paragraphs = text.split('\n\n')
        
        current_chunk = ""
        chunk_metadata = metadata or {}
        
        for para in paragraphs:
            if len(current_chunk) + len(para) < self.chunk_size:
                current_chunk += para + "\n\n"
            else:
                if current_chunk:
                    chunks.append({
                        "content": current_chunk.strip(),
                        "metadata": chunk_metadata,
                        "token_count": self._estimate_tokens(current_chunk)
                    })
                current_chunk = para + "\n\n"
        
        if current_chunk:
            chunks.append({
                "content": current_chunk.strip(),
                "metadata": chunk_metadata,
                "token_count": self._estimate_tokens(current_chunk)
            })
        
        # Add overlap
        overlapped = self._add_overlap(chunks)
        
        return overlapped
    
    def _estimate_tokens(self, text: str) -> int:
        """Rough token estimation (1 token ≈ 4 characters)"""
        return len(text) // 4
    
    def _add_overlap(self, chunks: List[Dict]) -> List[Dict]:
        """Add overlapping context between chunks"""
        result = []
        
        for i, chunk in enumerate(chunks):
            new_chunk = chunk.copy()
            
            # Add end of previous chunk
            if i > 0:
                prev_end = chunks[i-1]["content"][-self.overlap:]
                new_chunk["content"] = prev_end + "\n" + chunk["content"]
            
            # Add start of next chunk
            if i < len(chunks) - 1:
                next_start = chunks[i+1]["content"][:self.overlap]
                new_chunk["content"] = chunk["content"] + "\n" + next_start
            
            result.append(new_chunk)
        
        return result

class SemanticChunker:
    """
    Uses embeddings to identify semantic boundaries
    """
    def __init__(self, embedding_model):
        self.embedding_model = embedding_model
    
    async def chunk(self, text: str, metadata: Dict = None) -> List[Dict]:
        # Split sentences
        sentences = text.split('. ')
        
        # Get embeddings for each sentence
        embeddings = [self.embedding_model.embed(s) for s in sentences]
        
        # Find low-similarity boundaries (semantic breaks)
        chunks = []
        current_chunk = []
        
        for i, (sent, emb) in enumerate(zip(sentences, embeddings)):
            current_chunk.append(sent)
            
            if i < len(sentences) - 1:
                # Calculate similarity to next sentence
                sim = self._cosine_similarity(emb, embeddings[i+1])
                
                # Split if similarity is low
                if sim < 0.7 and len(current_chunk) > 5:
                    chunk_text = '. '.join(current_chunk) + '.'
                    chunks.append({
                        "content": chunk_text,
                        "metadata": metadata
                    })
                    current_chunk = []
        
        # Add remaining
        if current_chunk:
            chunks.append({
                "content": '. '.join(current_chunk) + '.',
                "metadata": metadata
            })
        
        return chunks
    
    def _cosine_similarity(self, a, b):
        # Calculate cosine similarity
        import numpy as np
        return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
```

### Week 8: Embedding Generation Pipeline

**8.1 - Embedding Service**

Embedding logic lives in `src/rag/embeddings.py` (already implemented).

Key design decisions:
- **Model**: `intfloat/multilingual-e5-base` (Turkish + English support, 768-dim)
- **Provider**: `sentence-transformers` — runs locally, no API key required
- Model is loaded once via `lru_cache` and runs in a thread pool to avoid blocking the async event loop
- Uses `"passage: "` prefix for documents, `"query: "` prefix for search queries (required by e5 models)
- Redis caches embeddings to avoid re-computing on repeated texts

```python
# Usage (already implemented in src/rag/embeddings.py)
from src.rag.embeddings import embed_texts, embed_query

# Embed passages for storage
embeddings = await embed_texts(["My project uses LangGraph..."])

# Embed a search query
query_vec = await embed_query("What technologies did you use?")
```

**8.2 - Async Ingestion Pipeline**

Create `src/ingestion/pipeline.py`:
```python
from celery import Celery, Task
from typing import List, Dict
import asyncio
import os

celery_app = Celery(
    'portfolio',
    broker=os.getenv("REDIS_URL"),
    backend=os.getenv("REDIS_URL")
)

@celery_app.task(bind=True)
def ingest_document_task(self, document_id: str, chunks_data: List[Dict]):
    """
    Celery task for async document ingestion:
    1. Parse document
    2. Generate embeddings
    3. Index in vector DB
    4. Store in PostgreSQL
    """
    
    try:
        # Generate embeddings
        embedding_service = EmbeddingService()
        texts = [chunk["content"] for chunk in chunks_data]
        embeddings = embedding_service.embed_batch(texts)
        
        # Store in vector DB
        points = []
        for i, (chunk, embedding) in enumerate(zip(chunks_data, embeddings)):
            point = {
                "id": f"{document_id}_{i}",
                "vector": embedding,
                "payload": {
                    "chunk_id": chunk["id"],
                    "project": chunk.get("project"),
                    "importance": chunk.get("importance"),
                    "content_preview": chunk["content"][:200]
                }
            }
            points.append(point)
        
        # Upsert to Qdrant
        qdrant_manager.upsert_vectors("portfolio_chunks", points)
        
        self.update_state(state='SUCCESS')
        
    except Exception as e:
        self.update_state(state='FAILURE', meta={'error': str(e)})
        raise
```

---

## Phase 3: Retrieval System (Weeks 9-11)

### Week 9: BM25 & Vector Search

**9.1 - BM25 Search**

Create `src/rag/retrieval/bm25_search.py`:
```python
from rank_bm25 import BM25Okapi
from typing import List, Dict, Tuple
import asyncpg

class BM25Searcher:
    def __init__(self, db_pool):
        self.db_pool = db_pool
    
    async def search(self, query: str, top_k: int = 30) -> List[Tuple[str, float]]:
        """Search using PostgreSQL full-text search (BM25-like)"""
        
        async with self.db_pool.acquire() as conn:
            results = await conn.fetch("""
                SELECT id, content, ts_rank(to_tsvector('english', content), 
                       plainto_tsquery('english', $1)) as rank
                FROM chunks
                WHERE to_tsvector('english', content) @@ plainto_tsquery('english', $1)
                ORDER BY rank DESC
                LIMIT $2
            """, query, top_k)
        
        return [(r['id'], r['rank']) for r in results]

class VectorSearcher:
    def __init__(self, qdrant_manager, embedding_service):
        self.qdrant = qdrant_manager
        self.embedder = embedding_service
    
    async def search(
        self,
        query: str,
        top_k: int = 30,
        filters: Dict = None
    ) -> List[Tuple[str, float]]:
        """Search using vector similarity"""
        
        # Embed query
        query_embedding = await self.embedder.embed(query)
        
        # Search in Qdrant
        results = await self.qdrant.search(
            "portfolio_chunks",
            query_embedding,
            limit=top_k,
            query_filter=filters
        )
        
        return [(r.id, r.score) for r in results]
```

### Week 10: Hybrid Fusion & Reranking

**10.1 - Hybrid Fusion (RRF)**

Create `src/rag/retrieval/fusion.py`:
```python
from typing import List, Dict, Tuple
import heapq

def reciprocal_rank_fusion(
    bm25_results: List[Tuple[str, float]],
    vector_results: List[Tuple[str, float]],
    alpha: float = 0.6,
    beta: float = 0.4,
    k: int = 60
) -> Dict[str, float]:
    """
    RRF: Combine rankings from multiple sources
    Score = alpha * (1 / (60 + rank_bm25)) + beta * (1 / (60 + rank_vector))
    """
    
    fused_scores = {}
    
    # Process BM25 results
    for rank, (doc_id, score) in enumerate(bm25_results):
        rrf_score = alpha * (1 / (k + rank + 1))
        fused_scores[doc_id] = fused_scores.get(doc_id, 0) + rrf_score
    
    # Process Vector results
    for rank, (doc_id, score) in enumerate(vector_results):
        rrf_score = beta * (1 / (k + rank + 1))
        fused_scores[doc_id] = fused_scores.get(doc_id, 0) + rrf_score
    
    # Sort and return top results
    return dict(sorted(fused_scores.items(), key=lambda x: x[1], reverse=True))

class HybridRetriever:
    def __init__(self, bm25_searcher, vector_searcher):
        self.bm25 = bm25_searcher
        self.vector = vector_searcher
    
    async def search(
        self,
        query: str,
        top_k: int = 50,
        project_filter: str = None
    ) -> List[Dict]:
        """Perform hybrid search"""
        
        # Parallel search
        bm25_results, vector_results = await asyncio.gather(
            self.bm25.search(query, top_k=30),
            self.vector.search(query, top_k=30, filters={"project_name": project_filter})
        )
        
        # Fusion
        fused = reciprocal_rank_fusion(bm25_results, vector_results)
        
        # Fetch full documents
        top_ids = list(fused.keys())[:top_k]
        chunks = await self._fetch_chunks(top_ids)
        
        # Add scores
        for chunk in chunks:
            chunk["hybrid_score"] = fused[chunk["id"]]
        
        return chunks
    
    async def _fetch_chunks(self, chunk_ids: List[str]) -> List[Dict]:
        # Fetch from database
        pass
```

### Week 11: Reranker Implementation

**11.1 - Cross-Encoder Reranking**

Create `src/rag/retrieval/reranker.py`:
```python
from sentence_transformers import CrossEncoder
from typing import List, Dict

class CrossEncoderReranker:
    def __init__(self, model_name: str = "BAAI/bge-reranker-large"):
        self.model = CrossEncoder(model_name)
    
    async def rerank(
        self,
        query: str,
        candidates: List[Dict],
        top_k: int = 7,
        threshold: float = 0.6
    ) -> List[Dict]:
        """Rerank candidates using cross-encoder"""
        
        # Prepare pairs
        pairs = [[query, candidate["content"]] for candidate in candidates]
        
        # Get scores
        scores = self.model.predict(pairs)
        
        # Attach scores and sort
        scored_candidates = []
        for candidate, score in zip(candidates, scores):
            candidate["rerank_score"] = float(score)
            if score >= threshold:
                scored_candidates.append(candidate)
        
        # Sort by score and return top-k
        scored_candidates.sort(key=lambda x: x["rerank_score"], reverse=True)
        return scored_candidates[:top_k]
```

---

## Phase 4: LangGraph Orchestration (Weeks 12-14)

### Week 12-13: Node Implementation

**12.1 - LangGraph Setup**

Create `src/rag/orchestration/langgraph_app.py`:
```python
from langgraph.graph import StateGraph, END
from langgraph.types import Send
from typing import Any, Dict, List
import asyncio

# Import node functions
from . import nodes

# Define state
class RAGState(TypedDict):
    query: str
    session_id: str
    query_type: str
    entities: List[str]
    rewritten_queries: List[str]
    retrieved_chunks: List[Dict]
    reranked_chunks: List[Dict]
    final_context: str
    response_text: str
    citations: List[Dict]

# Create graph
workflow = StateGraph(RAGState)

# Add nodes
workflow.add_node("user_input", nodes.process_user_input)
workflow.add_node("classify_query", nodes.classify_query)
workflow.add_node("check_memory", nodes.check_memory)
workflow.add_node("rewrite_query", nodes.rewrite_query)
workflow.add_node("select_strategy", nodes.select_retrieval_strategy)
workflow.add_node("hybrid_retrieve", nodes.hybrid_retrieve)
workflow.add_node("rerank", nodes.rerank)
workflow.add_node("optimize_context", nodes.optimize_context)
workflow.add_node("inject_memory", nodes.inject_memory)
workflow.add_node("generate_response", nodes.generate_response)
workflow.add_node("build_citations", nodes.build_citations)
workflow.add_node("stream_response", nodes.stream_response)

# Add edges
workflow.add_edge("user_input", "classify_query")
workflow.add_edge("classify_query", "check_memory")
workflow.add_edge("check_memory", "rewrite_query")
workflow.add_edge("rewrite_query", "select_strategy")
workflow.add_edge("select_strategy", "hybrid_retrieve")
workflow.add_edge("hybrid_retrieve", "rerank")
workflow.add_edge("rerank", "optimize_context")
workflow.add_edge("optimize_context", "inject_memory")
workflow.add_edge("inject_memory", "generate_response")
workflow.add_edge("generate_response", "build_citations")
workflow.add_edge("build_citations", "stream_response")
workflow.add_edge("stream_response", END)

# Compile
app = workflow.compile()
```

### Week 14: Memory & Error Handling

**14.1 - Memory System**

Create `src/rag/memory/memory_manager.py`:
```python
from typing import Optional, Dict, List
from datetime import datetime, timedelta

class ConversationMemory:
    def __init__(self, redis_manager, db):
        self.redis = redis_manager
        self.db = db
    
    async def get_session_context(self, session_id: str) -> Dict:
        """Get conversation context from memory layers"""
        
        # Layer 1: Redis immediate memory
        immediate = await self.redis.get(f"session:{session_id}:thread")
        
        # Layer 2: Session summary
        summary = await self.redis.get(f"session:{session_id}:summary")
        
        # Layer 3: Full history from DB
        history = await self.db.get_conversation_history(session_id, limit=10)
        
        return {
            "immediate": immediate,
            "summary": summary,
            "history": history,
            "context_age": datetime.utcnow()
        }
    
    async def save_message(self, session_id: str, role: str, content: str):
        """Save message to both Redis and DB"""
        
        # Save to DB (persistent)
        await self.db.save_message(session_id, role, content)
        
        # Save to Redis (cache)
        await self.redis.set(
            f"session:{session_id}:last_message",
            {"role": role, "content": content, "timestamp": datetime.utcnow().isoformat()},
            ttl=86400
        )
    
    async def summarize_session(self, session_id: str):
        """Generate summary of long sessions"""
        
        history = await self.db.get_conversation_history(session_id)
        
        # Use LLM to summarize
        summary = await summarize_conversation(history)
        
        # Cache summary
        await self.redis.set(
            f"session:{session_id}:summary",
            summary,
            ttl=7 * 86400  # 7 days
        )
        
        return summary
```

---

## Phase 5: API & Streaming (Weeks 15-16)

### Week 15: FastAPI Setup & Endpoints

**15.1 - Main FastAPI App**

Create `src/api/main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from src.db.session import init_db, close_db
from src.cache.redis_manager import redis_manager
from src.vector_db.qdrant_manager import qdrant_manager
from src.api.routes import chat, ingestion, health

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up...")
    await init_db()
    await redis_manager.connect()
    logger.info("Services initialized")
    
    yield
    
    # Shutdown
    logger.info("Shutting down...")
    await close_db()
    await redis_manager.disconnect()

app = FastAPI(
    title="AI Digital Twin Portfolio",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(chat.router, prefix="/api/v1", tags=["chat"])
app.include_router(ingestion.router, prefix="/api/v1", tags=["ingestion"])
app.include_router(health.router, prefix="/api/v1", tags=["health"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**15.2 - Chat Route with Streaming**

Create `src/api/routes/chat.py`:
```python
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from typing import AsyncGenerator
import json
import asyncio

from src.rag.orchestration.langgraph_app import app as langgraph_app
from src.api.schemas import ChatRequest, ChatResponse
from src.api.auth import get_current_user

router = APIRouter()

@router.post("/chat")
async def chat(
    request: ChatRequest,
    current_user = Depends(get_current_user)
) -> StreamingResponse:
    """Chat endpoint with streaming response"""
    
    async def event_generator() -> AsyncGenerator[str, None]:
        try:
            # Initialize state
            state = {
                "query": request.query,
                "session_id": request.session_id,
                "user_id": current_user.id,
                "debug_mode": request.debug_mode,
            }
            
            # Stream from LangGraph
            async for output in langgraph_app.astream(state):
                # Send tokens as server-sent events
                if "streaming_response" in output:
                    for event in output["streaming_response"]:
                        yield f"data: {json.dumps(event)}\n\n"
                        await asyncio.sleep(0)  # Yield control
            
            # Send completion
            yield f"data: {json.dumps({'event': 'complete'})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'event': 'error', 'error': str(e)})}\n\n"
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

### Week 16: Streaming & Response Format

**16.1 - Streaming Response Handler**

Create `src/rag/streaming/response_streamer.py`:
```python
from typing import AsyncGenerator, Dict, List
import asyncio
import json

class ResponseStreamer:
    def __init__(self):
        self.buffer = []
        self.token_index = 0
    
    async def stream_tokens(
        self,
        token_generator: AsyncGenerator,
        citations: List[Dict]
    ) -> AsyncGenerator[Dict, None]:
        """Stream tokens with citation metadata"""
        
        accumulated = ""
        
        async for token in token_generator:
            accumulated += token
            self.token_index += 1
            
            # Find citation for this token
            citation = self._find_citation(self.token_index, citations)
            
            yield {
                "event": "token",
                "token": token,
                "token_index": self.token_index,
                "accumulated": accumulated,
                "citation": citation
            }
            
            # Small delay to prevent overwhelming client
            await asyncio.sleep(0.01)
    
    def _find_citation(self, token_index: int, citations: List[Dict]) -> Dict:
        for citation in citations:
            if citation["token_start"] <= token_index <= citation["token_end"]:
                return citation
        return None
```

---

## Phase 6: Observability & Polish (Weeks 17-20)

### Week 17-18: Logging & Monitoring

**17.1 - Structured Logging**

Create `src/logger.py`:
```python
import structlog
import logging
from pythonjsonlogger import jsonlogger

# Configure JSON logging
logger = structlog.wrap_logger(
    logging.getLogger(),
    processors=[
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    initial_values={},
    cache_logger_on_first_use=True,
)
```

**17.2 - Prometheus Metrics**

Create `src/metrics.py`:
```python
from prometheus_client import Counter, Histogram, Gauge

chat_requests = Counter(
    'portfolio_chat_requests_total',
    'Total chat requests',
    ['status']
)

chat_latency = Histogram(
    'portfolio_chat_latency_seconds',
    'Chat endpoint latency',
    buckets=[0.5, 1.0, 2.0, 5.0, 10.0]
)

retrieval_latency = Histogram(
    'portfolio_retrieval_latency_seconds',
    'Retrieval system latency',
    buckets=[0.1, 0.5, 1.0, 2.0]
)

vector_search_recall = Gauge(
    'portfolio_vector_search_recall',
    'Vector search recall rate'
)

queue_size = Gauge(
    'portfolio_embedding_queue_size',
    'Current embedding queue size'
)
```

### Week 19: Testing & Documentation

**19.1 - Integration Tests**

Create `tests/integration/test_chat_flow.py`:
```python
import pytest
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)

@pytest.mark.asyncio
async def test_full_chat_flow():
    """Test complete chat flow"""
    
    response = await client.post(
        "/api/v1/chat",
        json={
            "query": "Tell me about your RAG architecture",
            "session_id": "test-session-123"
        },
        headers={"Authorization": "Bearer test-token"}
    )
    
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/event-stream"
    
    # Parse streaming response
    events = response.text.split("\n")
    assert any("response_complete" in event for event in events)
```

### Week 20: Production Deployment

**20.1 - Docker Production Build**

```dockerfile
FROM python:3.11-slim as base

# Production-optimized image
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/
ENV PYTHONUNBUFFERED=1

HEALTHCHECK --interval=30s CMD python -c "import requests; requests.get('http://localhost:8000/api/v1/health')"

CMD ["gunicorn", "src.api.main:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker"]
```

**20.2 - Kubernetes Deployment**

Create `k8s/deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: portfolio-api
  template:
    metadata:
      labels:
        app: portfolio-api
    spec:
      containers:
      - name: api
        image: portfolio-api:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: portfolio-secrets
              key: database-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
```

---

## Timeline & Milestones

| Week | Phase | Milestones | Deliverables |
|------|-------|-----------|--------------|
| 1-2 | 0 | Foundation ready | Project structure, Docker setup, CI/CD pipeline |
| 3-5 | 1 | DB layer complete | PostgreSQL, Redis, Vector DB initialized |
| 6-8 | 2 | Ingestion pipeline | Document parsing, chunking, embeddings |
| 9-11 | 3 | Retrieval system | Hybrid search, reranking, metadata filters |
| 12-14 | 4 | LangGraph ready | Orchestration, memory, state management |
| 15-16 | 5 | API complete | FastAPI, streaming, auth, rate limiting |
| 17-20 | 6 | Production ready | Logging, monitoring, tests, deployment |

---

## Quick Start Commands

```bash
# Setup
git clone <repo>
cd digital-twin-portfolio
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# Database
docker-compose up postgres redis qdrant
alembic upgrade head

# Development
uvicorn src.api.main:app --reload --port 8000

# Testing
pytest tests/ -v

# Build & Deploy
docker build -t portfolio-api:latest .
kubectl apply -f k8s/
```

---

## Key Success Metrics

- **Retrieval Accuracy**: > 90% relevant chunks in top-5
- **Response Latency**: < 3 seconds p95
- **Hallucination Rate**: < 5%
- **API Uptime**: > 99.9%
- **User Satisfaction**: > 4.5/5 rating

---

## Next Documents

See [06-SECURITY-ARCHITECTURE.md](06-SECURITY-ARCHITECTURE.md) for security hardening.  
See [07-DEPLOYMENT-GUIDE.md](07-DEPLOYMENT-GUIDE.md) for production deployment.  
See [08-SCALING-STRATEGY.md](08-SCALING-STRATEGY.md) for scaling and optimization.
