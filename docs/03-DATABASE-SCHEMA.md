# Database & Persistence Layer Schema

**Version**: 1.0  
**Covers**: PostgreSQL, Redis, Qdrant/pgvector  
**Status**: Production Schema

---

## Overview

Three-layer persistence:
1. **PostgreSQL**: Documents, conversations, metadata, audit trail
2. **Redis**: Caching, sessions, real-time state
3. **Qdrant/pgvector**: Vector embeddings, semantic search

---

## PostgreSQL Schema

### Core Tables

#### `documents`
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Document metadata
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes INT NOT NULL,
    source_type VARCHAR(50) NOT NULL,  -- pdf, markdown, github, code, text
    source_url TEXT,  -- For GitHub, URLs, etc.
    
    -- Document content
    raw_content TEXT NOT NULL,
    processed_content TEXT,
    
    -- Tagging
    project_name VARCHAR(100),  -- e.g., "rag-system"
    technologies JSONB,  -- ["python", "langgraph", "fastapi"]
    topics JSONB,  -- ["retrieval", "architecture", "ml"]
    experience_level VARCHAR(20),  -- beginner, intermediate, advanced, expert
    importance VARCHAR(20),  -- low, medium, high, critical
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    document_created_at TIMESTAMP,  -- When was the original doc created
    
    -- Status
    status VARCHAR(20) DEFAULT 'indexed',  -- pending, processing, indexed, error
    error_message TEXT,
    
    -- Ingestion tracking
    ingested_by VARCHAR(100),
    ingestion_batch_id UUID,
    version INT DEFAULT 1,
    
    -- Search optimization
    content_hash VARCHAR(64),  -- For deduplication
    
    UNIQUE(file_name, source_type),
    INDEX idx_project_name(project_name),
    INDEX idx_source_type(source_type),
    INDEX idx_created_at(created_at),
    FULLTEXT INDEX idx_content_fts(raw_content)
);
```

#### `chunks`
```sql
CREATE TABLE chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationship
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    parent_chunk_id UUID REFERENCES chunks(id),  -- For hierarchical chunks
    
    -- Content
    content TEXT NOT NULL,
    content_hash VARCHAR(64),
    
    -- Position
    chunk_index INT NOT NULL,  -- Position in document
    section_path VARCHAR(500),  -- e.g., "## Architecture > ### Retrieval"
    header_chain TEXT,  -- Breadcrumb of headers
    
    -- Metadata (inherited and custom)
    project_name VARCHAR(100),
    technologies JSONB,
    topics JSONB,
    importance VARCHAR(20),
    experience_level VARCHAR(20),
    custom_metadata JSONB,  -- For application-specific metadata
    
    -- Embedding tracking
    embedding_id VARCHAR(255),  -- Reference to vector DB ID
    embedding_model VARCHAR(100),  -- "bge-large-en"
    embedding_dimension INT,
    embedding_generated_at TIMESTAMP,
    
    -- Tokens
    token_count INT,
    
    -- For BM25 search
    bm25_score FLOAT,  -- Updated during search
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Status
    status VARCHAR(20) DEFAULT 'ready',  -- pending_embedding, ready, archived
    
    INDEX idx_document_id(document_id),
    INDEX idx_chunk_index(document_id, chunk_index),
    INDEX idx_project_name(project_name),
    FULLTEXT INDEX idx_content_fts(content)
);
```

#### `conversations`
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User & Session
    user_id VARCHAR(100) NOT NULL,
    session_id VARCHAR(100) NOT NULL UNIQUE,
    
    -- Metadata
    title VARCHAR(255),  -- Auto-generated or user-provided
    domain VARCHAR(100),  -- Primary domain discussed
    topics JSONB,  -- Topics discussed
    projects_mentioned JSONB,  -- Projects discussed
    
    -- Conversation state
    message_count INT DEFAULT 0,
    last_activity TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',  -- active, completed, archived
    
    -- AI metadata
    model_used VARCHAR(100),  -- gpt-4-turbo, claude-3, etc.
    average_token_usage FLOAT,
    total_tokens_used INT DEFAULT 0,
    
    -- Quality metrics
    user_satisfaction INT,  -- 1-5 rating (optional)
    contains_hallucination BOOLEAN DEFAULT FALSE,
    hallucination_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    
    -- Storage
    conversation_summary TEXT,
    summary_generated_at TIMESTAMP,
    
    INDEX idx_user_id(user_id),
    INDEX idx_session_id(session_id),
    INDEX idx_created_at(created_at),
    INDEX idx_last_activity(last_activity)
);
```

#### `messages`
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    
    -- Message content
    role VARCHAR(20) NOT NULL,  -- user, assistant, system
    content TEXT NOT NULL,
    
    -- Metadata
    message_index INT NOT NULL,  -- Order in conversation
    
    -- For user messages
    query_type VARCHAR(50),  -- project_query, skill_question, etc.
    detected_entities JSONB,  -- Extracted entities
    
    -- For assistant messages
    model_used VARCHAR(100),
    temperature FLOAT,
    max_tokens INT,
    tokens_used INT,
    
    -- Retrieved context
    retrieved_chunks_ids JSONB,  -- UUIDs of chunks used
    retrieval_latency_ms INT,
    
    -- Response quality
    response_latency_ms INT,
    hallucination_detected BOOLEAN DEFAULT FALSE,
    
    -- Citations
    citations JSONB,  -- [{source: ..., confidence: ...}]
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_conversation_id(conversation_id),
    INDEX idx_created_at(created_at)
);
```

#### `citations`
```sql
CREATE TABLE citations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationship
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    chunk_id UUID NOT NULL REFERENCES chunks(id),
    
    -- Citation details
    cited_text VARCHAR(500),  -- The part of response cited
    source_text TEXT,  -- The source from chunk
    confidence_score FLOAT,  -- 0.0-1.0
    
    -- Citation type
    citation_type VARCHAR(50),  -- direct, paraphrased, inferred
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_message_id(message_id),
    INDEX idx_chunk_id(chunk_id)
);
```

#### `ingestion_logs`
```sql
CREATE TABLE ingestion_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Ingestion metadata
    batch_id UUID NOT NULL,
    file_name VARCHAR(255),
    file_size_bytes INT,
    source_type VARCHAR(50),
    
    -- Process tracking
    status VARCHAR(50),  -- pending, parsing, chunking, embedding, indexing, complete, failed
    status_changed_at TIMESTAMP DEFAULT NOW(),
    
    -- Progress
    chunks_created INT DEFAULT 0,
    chunks_embedded INT DEFAULT 0,
    total_chunks INT DEFAULT 0,
    
    -- Timing
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    processing_time_ms INT,
    
    -- Errors
    error_message TEXT,
    error_traceback TEXT,
    
    -- Metadata
    created_by VARCHAR(100),
    notes TEXT,
    
    INDEX idx_batch_id(batch_id),
    INDEX idx_status(status),
    INDEX idx_created_at(started_at)
);
```

#### `sessions`
```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(100) UNIQUE NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    
    -- Session data
    context_data JSONB,  -- Arbitrary session context
    preferences JSONB,  -- User preferences for session
    
    -- Tokens & Rate limiting
    request_count INT DEFAULT 0,
    last_request_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    last_activity TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    
    INDEX idx_session_id(session_id),
    INDEX idx_user_id(user_id),
    INDEX idx_expires_at(expires_at)
);
```

#### `api_keys`
```sql
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Key metadata
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) UNIQUE NOT NULL,  -- SHA-256 hash
    user_id VARCHAR(100) NOT NULL,
    
    -- Permissions
    permissions JSONB,  -- ["chat:write", "documents:read", "admin:*"]
    
    -- Rate limiting
    rate_limit_per_minute INT DEFAULT 60,
    rate_limit_per_day INT DEFAULT 10000,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    last_used TIMESTAMP,
    expires_at TIMESTAMP,
    
    INDEX idx_user_id(user_id),
    INDEX idx_is_active(is_active)
);
```

#### `audit_logs`
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Action
    action VARCHAR(100) NOT NULL,  -- document_uploaded, query_executed, retrieval_failed
    resource_type VARCHAR(50),  -- document, message, session
    resource_id UUID,
    
    -- User
    user_id VARCHAR(100),
    ip_address INET,
    
    -- Details
    details JSONB,
    status VARCHAR(20),  -- success, failure, warning
    error_message TEXT,
    
    -- Timing
    created_at TIMESTAMP DEFAULT NOW(),
    duration_ms INT,
    
    INDEX idx_user_id(user_id),
    INDEX idx_action(action),
    INDEX idx_created_at(created_at)
);
```

---

## Full-Text Search Configuration (PostgreSQL)

```sql
-- Create custom text search configuration for technical content
CREATE TEXT SEARCH CONFIGURATION tech_search (COPY = english);

-- Add custom stopwords (technical terms we DON'T want to ignore)
ALTER TEXT SEARCH CONFIGURATION tech_search
    DROP STOP FOR english;

-- Create GIN index for fast FTS
CREATE INDEX idx_documents_content_gin ON documents USING GIN(to_tsvector('tech_search', raw_content));
CREATE INDEX idx_chunks_content_gin ON chunks USING GIN(to_tsvector('tech_search', content));
```

---

## Vector Database Schema (Qdrant)

### Collection: `portfolio_chunks`

```json
{
  "collection_name": "portfolio_chunks",
  "vectors": {
    "size": 1024,
    "distance": "Cosine"
  },
  "payload_schema": {
    "chunk_id": {
      "type": "keyword"
    },
    "document_id": {
      "type": "keyword"
    },
    "project_name": {
      "type": "keyword",
      "index": true
    },
    "technologies": {
      "type": "array",
      "index": true
    },
    "topics": {
      "type": "array",
      "index": true
    },
    "importance": {
      "type": "keyword",
      "index": true
    },
    "experience_level": {
      "type": "keyword",
      "index": true
    },
    "section_path": {
      "type": "text"
    },
    "source_document": {
      "type": "text"
    },
    "token_count": {
      "type": "integer"
    },
    "created_at": {
      "type": "datetime"
    },
    "content_preview": {
      "type": "text"
    }
  },
  "indexes": [
    "project_name",
    "technologies",
    "topics",
    "importance",
    "experience_level"
  ]
}
```

### Filterable Payloads (Qdrant Filter Examples)

```python
# Filter by project
{
  "filter": {
    "must": [
      {
        "key": "project_name",
        "match": {
          "value": "rag-system"
        }
      }
    ]
  }
}

# Filter by multiple technologies
{
  "filter": {
    "must": [
      {
        "key": "technologies",
        "match": {
          "any": ["python", "langgraph"]
        }
      }
    ]
  }
}

# Complex filter: High importance project topics
{
  "filter": {
    "must": [
      {
        "key": "importance",
        "match": {"value": "high"}
      },
      {
        "key": "project_name",
        "match": {"value": "rag-system"}
      }
    ]
  }
}
```

### pgvector Alternative (PostgreSQL Extension)

```sql
-- Install pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table with vector column
CREATE TABLE chunk_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chunk_id UUID NOT NULL REFERENCES chunks(id) ON DELETE CASCADE,
    
    -- Vector embedding (1024 dimensions for bge-large-en)
    embedding vector(1024) NOT NULL,
    
    -- Metadata (denormalized for search performance)
    project_name VARCHAR(100),
    importance VARCHAR(20),
    experience_level VARCHAR(20),
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- HNSW index for fast similarity search
    CONSTRAINT fk_chunk FOREIGN KEY (chunk_id) REFERENCES chunks(id)
);

-- Create HNSW index
CREATE INDEX ON chunk_embeddings USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Create composite index for filtered searches
CREATE INDEX ON chunk_embeddings (project_name, importance);
```

---

## Redis Schema

### Key Patterns

```
# Session keys
session:{session_id}:metadata → JSON
session:{session_id}:thread → Conversation thread (last exchange)
session:{session_id}:summary → LLM-generated summary
session:{session_id}:preferences → User preferences

# Query result cache
query_cache:{query_hash}:{project_filter} → JSON (retrieved chunks)
query_cache:{query_hash}:metadata → Metadata about cache entry

# Conversation state
conversation:{conversation_id}:current → Current exchange JSON
conversation:{conversation_id}:history → Array of messages

# Embedding cache (for popular chunks)
chunk_embedding:{chunk_id} → Vector (serialized)
chunk_embedding:stats → Stats about cache

# Rate limiting
rate_limit:{user_id}:{minute} → Request count
rate_limit:{user_id}:daily → Request count

# Locks (for concurrent operations)
lock:ingestion:{batch_id} → Timestamp
lock:embedding:queue → Semaphore

# LLM response cache (expensive generations)
llm_cache:{prompt_hash} → Response text

# Real-time metrics
metrics:queries_per_minute → Counter
metrics:avg_latency_ms → Moving average
metrics:embedding_queue_size → Current size
```

### Data Structures

#### Session Data
```json
{
  "session_id": "session-abc123",
  "user_id": "user-123",
  "created_at": "2024-01-15T10:30:00Z",
  "last_activity": "2024-01-15T11:45:00Z",
  "conversation_count": 5,
  "context": {
    "projects_of_interest": ["rag-system", "distributed-systems"],
    "skill_focus": ["python", "ml"],
    "previous_queries": 3
  },
  "preferences": {
    "response_depth": "deep",
    "include_citations": true,
    "explain_reasoning": true
  }
}
```

#### Conversation Thread (Cache)
```json
{
  "thread_id": "thread-xyz",
  "messages": [
    {
      "index": 0,
      "role": "user",
      "content": "Tell me about your RAG architecture",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "index": 1,
      "role": "assistant",
      "content": "The RAG architecture has three main components...",
      "timestamp": "2024-01-15T10:30:05Z",
      "chunks_used": ["chunk-1", "chunk-5", "chunk-12"]
    }
  ],
  "summary": "Discussion of RAG retrieval and ranking components",
  "context_used_tokens": 2847
}
```

#### Query Cache Entry
```json
{
  "query_hash": "sha256_hash_of_query",
  "query": "Explain your RAG architecture",
  "project_filter": "rag-system",
  "results": [
    {
      "chunk_id": "chunk-123",
      "document": "rag-architecture.md",
      "rerank_score": 0.94,
      "content": "..."
    }
  ],
  "created_at": "2024-01-15T10:25:00Z",
  "ttl": 3600,
  "hit_count": 3
}
```

### Redis Configuration

```python
# Connection pooling
redis_config = {
    "host": "redis.internal",
    "port": 6379,
    "db": 0,
    "max_connections": 50,
    "decode_responses": False,  # Use bytes for efficiency
    "socket_keepalive": True,
}

# Key expiration policies
expiration_policies = {
    "session:*": 24 * 3600,  # 24 hours
    "query_cache:*": 3600,  # 1 hour
    "conversation:*": 7 * 24 * 3600,  # 7 days
    "rate_limit:*": 60,  # 1 minute
    "chunk_embedding:*": 7 * 24 * 3600,  # 7 days
    "lock:*": 300,  # 5 minutes
    "llm_cache:*": 24 * 3600,  # 24 hours
}
```

---

## Migration Strategy

### PostgreSQL Migrations (Alembic)

```python
# Initial migration
class InitialSchema(MigrationScript):
    def upgrade():
        # Create tables in order
        op.create_table('documents', ...)
        op.create_table('chunks', ...)
        op.create_table('conversations', ...)
        # ... etc
    
    def downgrade():
        op.drop_table('audit_logs')
        # ... in reverse order
```

---

## Backup & Recovery

### PostgreSQL Backups
```bash
# Full backup
pg_dump -h localhost -U postgres -d portfolio_db > backup.sql

# Point-in-time recovery
pg_dump -h localhost --format=tar --file=backup.tar

# WAL archiving for PITR
archive_command = 'cp %p /backups/wal_archive/%f'
```

### Redis Backups
```python
# Redis RDB snapshots
redis-cli BGSAVE  # Background save

# Redis persistence config
save 900 1       # Save after 900s if 1 key changed
save 300 10      # Save after 300s if 10 keys changed
save 60 10000    # Save after 60s if 10000 keys changed
```

---

## Performance Optimization

### Indexes Strategy

```sql
-- Hot path: Retrieval queries
CREATE INDEX idx_chunks_project_importance 
ON chunks(project_name, importance, created_at DESC);

CREATE INDEX idx_chunks_technologies 
ON chunks USING GIN(technologies);

-- Hot path: Conversation queries
CREATE INDEX idx_messages_conversation_created 
ON messages(conversation_id, created_at DESC);

-- Hot path: Document search
CREATE INDEX idx_documents_source_status 
ON documents(source_type, status);

-- BM25 full-text search
CREATE INDEX idx_chunks_content_fts 
ON chunks USING GIN(to_tsvector('tech_search', content));
```

### Query Optimization

```sql
-- Use EXPLAIN to analyze queries
EXPLAIN ANALYZE
SELECT c.*, d.title 
FROM chunks c
JOIN documents d ON c.document_id = d.id
WHERE c.project_name = 'rag-system'
AND c.importance = 'high'
ORDER BY c.created_at DESC
LIMIT 10;
```

---

## Monitoring & Alerting

```python
# Metrics to monitor
metrics = {
    "database": {
        "connection_pool_utilization": "percentage",
        "query_latency_p95": "milliseconds",
        "slow_query_count": "count",
        "transaction_duration": "seconds"
    },
    "cache": {
        "hit_rate": "percentage",
        "eviction_rate": "per_second",
        "memory_usage": "bytes",
        "command_latency": "milliseconds"
    },
    "vector_search": {
        "search_latency": "milliseconds",
        "recall_rate": "percentage",
        "filter_accuracy": "percentage"
    }
}
```

---

## Next Steps

See [04-API-DESIGN.md](04-API-DESIGN.md) for FastAPI endpoints and data contracts.  
See [05-IMPLEMENTATION-ROADMAP.md](05-IMPLEMENTATION-ROADMAP.md) for implementation sequence.
