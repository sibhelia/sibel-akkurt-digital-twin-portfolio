# AI-Powered Digital Twin Portfolio - System Architecture

**Version**: 1.0  
**Status**: Production-Grade Design  
**Target**: Enterprise RAG System for Intelligent AI Clone

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Principles](#architecture-principles)
3. [System Components](#system-components)
4. [Data Flow](#data-flow)
5. [Technology Stack](#technology-stack)
6. [Deployment Model](#deployment-model)

---

## System Overview

### Mission Statement

Build a **production-grade RAG (Retrieval-Augmented Generation) system** that powers an AI clone capable of deep, contextually accurate conversations about your professional work, technical decisions, and engineering mindset—not a simple chatbot, but an intelligent conversational system.

### Key Characteristics

- **Retrieval Accuracy**: Hybrid search with semantic and BM25 scoring
- **Low Hallucination**: Cross-encoder reranking with relevance scoring
- **Context Awareness**: Multi-layered memory system with conversation tracking
- **Streaming Responses**: Low-latency token streaming for better UX
- **Production Ready**: Scalable, observable, secure, fault-tolerant
- **Recruiter Impressive**: Demonstrates sophisticated architecture and AI integration

---

## Architecture Principles

### 1. **Modular Design**
- Each component (retrieval, LLM, memory, streaming) is independently deployable
- Clear interfaces between components
- Pluggable implementations for vector DBs, embeddings, LLMs

### 2. **Async-First**
- All I/O operations are non-blocking
- Efficient resource utilization
- Support for concurrent requests

### 3. **Observability Built-In**
- Logging at every retrieval step
- Metrics for latency, accuracy, token usage
- Debug mode for development and troubleshooting

### 4. **Security by Default**
- JWT authentication on all endpoints
- Admin-only ingestion endpoints
- Rate limiting and prompt injection protection
- Secure file upload handling

### 5. **Scalability**
- Horizontal scaling via Docker containers
- Queue-based embedding pipeline
- Redis caching for frequent queries
- Database partitioning for large datasets

---

## System Components

### 1. **LangGraph Orchestration Layer** (Agentic Core)

```

              LangGraph Orchestration                     

                                                          
  User Input → Query Classification → Query Rewriting    
      ↓                                 ↓                 
  Memory Check → Retrieval Strategy → Hybrid Retriever   
      ↓                ↓                    ↓             
  Context Optimization → Reranking → LLM Response        
      ↓                            ↓                      
  Citation Building → Streaming → Response               
                                                          

```

**Nodes**:
- `user_input`: Parse and validate user query
- `query_classifier`: Determine query type (project-specific, skill-focused, experience, etc.)
- `query_rewriter`: Multi-query generation for better retrieval
- `retrieval_strategy_selector`: Choose hybrid/metadata-filtered/semantic search
- `hybrid_retriever`: BM25 + dense vector search with fusion
- `reranker`: Cross-encoder reranking for top-K selection
- `context_builder`: Format and merge retrieved context
- `memory_injector`: Include conversation history and summaries
- `llm_generator`: Generate response with streaming
- `citation_builder`: Extract and format citations
- `streaming_response`: Stream tokens to client

**Features**:
- Conditional routing based on query classification
- Retry mechanisms for failed retrievals
- Fallback chains when primary retrieval fails
- Memory-aware orchestration

### 2. **Retrieval System**

#### Hybrid Search Architecture

```
Query Input
    ↓
    → BM25 Retrieval (Lexical) → Scored Results
    → Dense Vector Search (Semantic) → Scored Results
    → Metadata Filtering (Project/Skill/Timeline) → Filtered Results
    
    → Hybrid Fusion (RRF: Reciprocal Rank Fusion)
        ↓
    Combined Ranked Results
        ↓
    Cross-Encoder Reranking
        ↓
    Top-K Results with Relevance Scores
```

**Components**:
- **BM25 Index**: PostgreSQL with full-text search
- **Vector Index**: Qdrant or pgvector for semantic search
- **Metadata Store**: Structured metadata for filtering
- **Hybrid Fusion**: Reciprocal Rank Fusion algorithm
- **Reranker**: bge-reranker-large cross-encoder model

**Search Modes**:
1. **Standard Search**: Hybrid + reranking
2. **Project-Specific**: Filtered by project_name metadata
3. **Skill-Focused**: Filtered by technology tags
4. **Timeline-Based**: Filtered by time ranges
5. **Expert Query**: Multi-query with context merging

### 3. **Knowledge Graph & Chunking Pipeline**

```
Raw Documents (PDFs, MD, GitHub)
    ↓
Document Parser (Type-specific)
    → PDF Extractor
    → Markdown Parser (header-aware)
    → GitHub README Parser
    → Code Extractor
    → Text Extractor
    ↓
Metadata Extraction & Tagging
    → Source type detection
    → Project/domain identification
    → Technology tagging
    → Time/experience-level detection
    → Importance scoring
    ↓
Semantic Chunking
    → Recursive chunking with overlap
    → Header-preserving for context
    → Code-aware block detection
    → Semantic boundary detection
    → Parent-child chunk architecture
    ↓
Embedding Generation
    → BAAI/bge-large-en (primary)
    → Batching for efficiency
    → Async processing queue
    → Embedding cache
    ↓
Vector Index & Storage
    → Qdrant/pgvector indexing
    → BM25 index creation
    → Metadata storage
    → Redis caching layer
```

### 4. **Memory System**

```

        Multi-Layer Memory Stack         

                                         
  Layer 1: Immediate (Redis - Short-term)
  - Current conversation thread          
  - Last 10 exchanges                    
  - Recent search results cache          
  ↓                                      
  Layer 2: Session (Redis - Medium-term) 
  - Session-level context summary        
  - User preferences in session          
  - Retrieved chunks memory              
  ↓                                      
  Layer 3: Persistent (PostgreSQL/DB)    
  - Full conversation history            
  - Summarized sessions                  
  - Long-term context                    
  ↓                                      
  Layer 4: Knowledge Base (Vector DB)    
  - Indexed documents                    
  - Semantic relationships                
  - Cross-document connections           
                                         

```

**Features**:
- Rolling window of conversation history
- Automatic summarization for context compression
- Importance-based context merging
- Session isolation and security
- Conversation export capabilities

### 5. **Streaming Response Pipeline**

```
LLM Response Generation
    ↓
Token Streaming Handler
    → Buffer management
    → Async queue
    → WebSocket/Server-Sent Events
    → Graceful backpressure handling
    ↓
Citation Tracking
    → Map tokens to source chunks
    → Confidence scoring
    → Citation formatting
    ↓
Client Stream
    → Real-time token delivery
    → Metadata interleaving
    → Error handling
```

### 6. **Data Persistence Layer**

#### PostgreSQL Schema
```
Core Tables:
  - documents: Metadata for all indexed documents
  - chunks: Processed chunks with metadata
  - conversations: Chat sessions
  - messages: Individual chat messages
  - citations: Source attribution
  - ingestion_logs: Audit trail
  - chunk_embeddings: Vector IDs and scores
```

#### Vector Database (Qdrant/pgvector)
```
Collections:
  - portfolio_chunks: Primary embeddings
  - project_descriptions: High-level project overviews
  - technical_skills: Skills and expertise vectors
```

#### Redis Cache
```
Keys:
  session:{session_id}:* → Session data
  chunk:{chunk_id} → Embedding cache
  query:{hash} → Cached retrieval results
  conversation:{session_id} → Thread memory
```

### 7. **API Gateway (FastAPI)**

```
RESTful Endpoints:
 POST /api/v1/chat (streaming)
 POST /api/v1/ingest/documents (admin)
 POST /api/v1/ingest/github (admin)
 POST /api/v1/reindex (admin)
 GET /api/v1/retrieval/debug
 GET /api/v1/conversations/{id}
 POST /api/v1/memory/export
 GET /api/v1/health
 GET /api/v1/metrics
```

---

## Data Flow

### Query-to-Response Flow (Detailed)

```
1. USER REQUEST
    Query: "Explain your RAG architecture"
    Session: "session-123"
    Context: {user_agent, timestamp}

2. VALIDATION & AUTH
    JWT validation
    Rate limiting check
    Input sanitization
    Prompt injection detection

3. LANGGRAPH ORCHESTRATION BEGINS
    Node: query_input
      Extract and structure query
   
    Node: query_classifier
      Type: "technical_deep_dive"
      Domain: "architecture"
      Entities: ["RAG", "architecture", "components"]
      Confidence: 0.94
   
    Node: memory_check
      Session history: 5 previous messages
      Context summary: "Discussing system architecture"
      Relevant snippets identified
   
    Node: query_rewriter
      Generated queries:
       1. "Explain retrieval architecture"
       2. "What is your LangGraph design"
       3. "How do you build RAG systems"
       4. "Technical decisions in RAG"
      Confidence distribution
   
    Node: retrieval_strategy_selector
      Strategy: "multi_query_hybrid"
   
    Node: hybrid_retriever (for each rewritten query)
      BM25 Search
        Query: "Explain retrieval architecture"
        Results: 20 candidates
        Scores: [0.98, 0.87, 0.76, ...]
     
      Dense Vector Search
        Embedding: [0.23, -0.45, 0.12, ...]
        Results: 20 candidates
        Scores: [0.92, 0.88, 0.81, ...]
     
      Metadata Filtering (if applicable)
        Apply filters: project="rag", importance >= "high"
     
      Hybrid Fusion (RRF)
         Combined candidates: 25 items
   
    Node: reranker
      Cross-encoder model: bge-reranker-large
      Input: 25 candidates + original query
      Scoring: [0.94, 0.91, 0.88, 0.85, ...]
      Top-K: Select 5 best chunks
   
    Node: context_builder
      Format retrieved chunks
      Preserve hierarchy and headers
      Add source attribution
      Merge overlapping content
      Final context: ~2000 tokens
   
    Node: memory_injector
      Add session history (summarized)
      Add conversation thread (last 3 exchanges)
      Add user preferences
      Total context to LLM: ~3000 tokens
   
    Node: llm_generator
      Model: gpt-4-turbo (or Claude, Gemini, DeepSeek)
      Prompt:
       "You are an AI assistant representing the engineer.
        Use the provided context to answer deeply and accurately.
        Explain your technical reasoning.
        Reference specific decisions and trade-offs."
      Generation:
       Token 1: "The"
       Token 2: "RAG"
       Token 3: "architecture"
       ...
      Stream tokens to response handler
   
    Node: citation_builder
      Map each token to source chunks
      Calculate confidence per citation
      Format citations: [1], [2], etc.
      Prepare citation metadata
   
    Node: streaming_response
       Send token stream to client
       Include chunk metadata
       Handle backpressure
       Log metrics and telemetry

4. STORAGE & OBSERVABILITY
    Store conversation in PostgreSQL
    Cache session in Redis
    Log retrieval metrics
    Track token usage
    Measure latency (retrieval + LLM)
    Record any hallucinations detected

5. CLIENT RECEIVES RESPONSE
    Real-time token streaming
    Citations displayed inline
    Related documents sidebar
    Timestamp and session metadata
```

### Document Ingestion Flow

```
1. DOCUMENT UPLOAD
    File validation
    Virus scanning
    Type detection
    Metadata extraction from upload form

2. PARSING
    PDF → Text + Structure extraction
    Markdown → Header-aware parsing
    GitHub → API fetch + parsing
    Code → Syntax-aware extraction
    Text → Direct ingestion

3. METADATA ENRICHMENT
    Auto-detect domain/project
    Extract technologies
    Calculate importance score
    Assign experience level
    Tag creation date/updated date

4. CHUNKING
    Recursive chunk with overlap
    Preserve header hierarchy
    Create parent-child relationships
    Generate chunk IDs

5. EMBEDDING GENERATION
    Batch chunks into groups of 100
    Queue for async processing
    Generate embeddings via model
    Store in vector DB
    Cache recent embeddings

6. INDEXING
    Add to BM25 index
    Add to vector index
    Store metadata
    Update FTS index
    Commit to database

7. POST-INGESTION
    Log ingestion event
    Update document status
    Notify on completion
    Generate ingestion report
    Enable cache invalidation
```

---

## Technology Stack

### Backend Core
- **Framework**: FastAPI (async HTTP framework)
- **Orchestration**: LangGraph (agentic workflows)
- **LLM Integration**: LangChain (abstractions + tools)
- **Language**: Python 3.11+

### Retrieval & Search
- **Vector Database**: Qdrant or PostgreSQL pgvector
- **Search**: Hybrid (BM25 + semantic)
- **Reranker**: bge-reranker-large (cross-encoder)
- **Embeddings**: BAAI/bge-large-en (1024-dim)

### Data Persistence
- **Primary DB**: PostgreSQL (documents, conversations, metadata)
- **Cache**: Redis (sessions, embeddings cache, query results)
- **Vector Store**: Qdrant (remote/local) or pgvector (PostgreSQL extension)

### Processing & Async
- **Task Queue**: Celery + Redis (embedding generation, document processing)
- **Async Runtime**: asyncio + uvicorn
- **Async ORM**: SQLAlchemy async

### LLM Options
- **GPT-4 Turbo** (OpenAI) - Most capable
- **Claude 3.5 Sonnet** (Anthropic) - Excellent reasoning
- **Gemini 2.0** (Google) - Strong multimodal
- **DeepSeek** (Open-source friendly) - Cost-effective
- **Llama 3.1** (Local) - On-premise option

### Security & Observability
- **Auth**: JWT (PyJWT)
- **Rate Limiting**: slowapi
- **Logging**: structlog + Python logging
- **Metrics**: Prometheus + Grafana
- **Tracing**: OpenTelemetry + Jaeger
- **Monitoring**: Sentry for error tracking

### DevOps & Deployment
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes (production)
- **CI/CD**: GitHub Actions
- **Infrastructure**: Cloud-agnostic (AWS/Azure/GCP)

---

## Deployment Model

### Development
```
laptop/dev-env
 FastAPI dev server (port 8000)
 PostgreSQL (local/Docker)
 Redis (Docker)
 Qdrant (Docker or local)
 Mocked LLM responses (for testing)
```

### Staging
```
staging-cluster
 FastAPI pod (replicas: 2)
 PostgreSQL (managed service)
 Redis (managed service)
 Qdrant (managed service)
 Embedding queue (Celery workers)
 Monitoring stack
```

### Production
```
production-cluster
 FastAPI pods (autoscaling: 3-10 replicas)
 PostgreSQL (primary + replicas, backups)
 Redis Cluster (HA configuration)
 Qdrant Cluster (distributed)
 Embedding workers (queue-based scaling)
 Load balancer (Nginx/HAProxy)
 CDN for static assets
 Full observability stack
 Disaster recovery setup
```

---

## Key Design Decisions

### 1. Why LangGraph?
- Agentic control flow with conditional routing
- Memory management out-of-the-box
- Tool/function calling capabilities
- Fallback and retry mechanisms
- Observable execution paths
- Future multi-agent support

### 2. Why Hybrid Search?
- BM25 captures keyword relevance (recall)
- Semantic search captures meaning (precision)
- Complementary approaches improve accuracy
- Reranking provides final ranking

### 3. Why Qdrant + PostgreSQL?
- **Qdrant**: Purpose-built vector DB, excellent performance
- **pgvector**: Option for PG-only deployment (simpler architecture)
- Combined: Best of both worlds flexibility
- Both support filtering, scaling, backups

### 4. Why Multi-Query?
- Single query may not capture all relevant documents
- Different phrasings retrieve different chunks
- Reranking handles duplicate/similar results
- Improves recall without significantly harming precision

### 5. Why Redis Multi-Layer?
- Layer 1: Fast access to conversation state
- Layer 2: Query result caching
- Layer 3: Session management
- Reduces database load significantly

---

## Next Steps

See [02-LANGGRAPH-DESIGN.md](02-LANGGRAPH-DESIGN.md) for detailed node designs.  
See [03-DATABASE-SCHEMA.md](03-DATABASE-SCHEMA.md) for persistence layer.  
See [04-API-DESIGN.md](04-API-DESIGN.md) for endpoint specifications.  
See [05-IMPLEMENTATION-ROADMAP.md](05-IMPLEMENTATION-ROADMAP.md) for step-by-step guide.
