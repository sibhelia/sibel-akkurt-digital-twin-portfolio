# Getting Started

##  Quick Start (5 minutes)

### Prerequisites
- Python 3.11+
- Docker & Docker Compose installed
- Git installed

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd digital-twin-portfolio

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your API keys
# Most important: OPENAI_API_KEY
nano .env  # or use your editor
```

**Key variables to set**:
- `GROQ_API_KEY`: Your free Groq API key (get it at https://console.groq.com)
- `ENVIRONMENT`: Set to "development"
- `ADMIN_API_KEY`: Set a secure key for admin endpoints
- Other settings can use defaults for local development

### Step 3: Start Services

```bash
# Start all services (PostgreSQL, Redis, Qdrant)
docker-compose up -d

# Verify services are running
docker-compose ps

# Expected output:
# portfolio-postgres  Running  5432
# portfolio-redis     Running  6379
# portfolio-qdrant    Running  6333
# portfolio-api       Running  8000
```

### Step 4: Initialize Database

```bash
# Run migrations (creates tables)
alembic upgrade head

# Verify database
docker exec portfolio-postgres psql -U portfolio -d portfolio_db -c "\dt"
```

### Step 5: Start API

```bash
# Terminal 1: Start FastAPI server
uvicorn src.api.main:app --reload --port 8000

# Expected output:
# INFO:     Uvicorn running on http://127.0.0.1:8000
# INFO:     Application startup complete
```

### Step 6: Test It Works

Open browser:
- API Docs: http://localhost:8000/api/v1/docs
- Health Check: http://localhost:8000/api/v1/health
- Redis UI: http://localhost:8001
- Qdrant Dashboard: http://localhost:6333/dashboard

If those endpoints open, the local setup is working.

---

##  Understanding the Architecture

### What Just Started?

```

  FastAPI (8000)   ← Your API server (development mode)

         
    
                              
      
 PG       Redis      Qdrant   
(5432)   (6379)     (6333)    
      
```

- **PostgreSQL**: Stores documents, conversations, audit logs
- **Redis**: Caches query results and sessions
- **Qdrant**: Stores vector embeddings for semantic search
- **FastAPI**: HTTP server that coordinates everything

---

##  The Next Steps

### Phase 1: Set Up Database Models (Week 1)

The database is running, but we need to define the ORM models.

**Files to create**:
- `src/db/models/document.py` - Document storage
- `src/db/models/chunk.py` - Document chunks
- `src/db/models/conversation.py` - Chat history
- `src/db/models/citation.py` - Citation tracking

**See [05-IMPLEMENTATION-ROADMAP.md](docs/05-IMPLEMENTATION-ROADMAP.md) for details**

### Phase 2: Document Ingestion (Week 2-3)

Once models are done, implement document ingestion:

```python
# Example: What you'll build
from src.ingestion import ingest_documents

# Load your portfolio documents
docs = await ingest_documents([
    "docs/my-projects.md",
    "docs/technical-skills.md",
    "repositories/my-repo/README.md",
])
# Documents are chunked, embedded, and stored
```

### Phase 3: Retrieval System (Week 4-5)

Build the search engines:

```python
# What you'll implement
from src.rag.retrieval import hybrid_search

results = await hybrid_search(
    query="Tell me about your RAG architecture",
    top_k=7,
)
# Returns: Most relevant chunks from your knowledge base
```

### Phase 4: Orchestration (Week 6-7)

Implement the LangGraph pipeline (12 nodes):

```python
# What you'll build
from src.rag.orchestration import process_query

response = await process_query(
    query="Explain your RAG architecture",
    session_id="user-123",
    user_id="user-123",
)
# Returns: Full response with citations
```

### Phase 5: API & Streaming (Week 8)

Connect everything via FastAPI:

```python
# What you'll implement
@app.post("/api/v1/chat")
async def chat(request: ChatRequest):
    # Stream responses back to client
    async for token in process_query_stream(request.query):
        yield f"data: {token}\n\n"
```

---

##  Key Concepts

### What is RAG?

**RAG = Retrieval-Augmented Generation**

Instead of asking ChatGPT directly:
```
User: "Tell me about your RAG architecture"
ChatGPT: "RAG is a technique where... [generic explanation]"
```

With RAG:
```
1. Retrieve: Find relevant docs from YOUR knowledge base
2. Augment: Add those docs as context
3. Generate: Ask LLM to answer based on YOUR docs

User: "Tell me about your RAG architecture"
Response: "Based on my portfolio docs, [YOUR specific architecture]"
```

**Result**: Accurate, personalized responses instead of generic answers!

### Why This Design?

| Component | Why |
|-----------|-----|
| **LangGraph 0.2.x** | Orchestrates the 12-step pipeline, TypedDict state |
| **Groq LLM** | Fastest inference, generous free tier, `llama-3.3-70b-versatile` |
| **Hybrid Search** | BM25 + vectors = better results than either alone |
| **multilingual-e5-base** | Turkish + English embedding support, runs locally |
| **Memory Layers** | Makes responses contextually intelligent |
| **Streaming** | Better UX (feels faster) |

---

##  Testing Your Setup

### Test 1: Database Connection

```bash
# Check if PostgreSQL is running
docker exec portfolio-postgres psql -U portfolio -d portfolio_db -c "SELECT 1"

# Expected: 
# 1
# (1 row)
```

### Test 2: Redis Connection

```bash
# Check if Redis is running
docker exec portfolio-redis redis-cli ping

# Expected:
# PONG
```

### Test 3: Qdrant Connection

```bash
# Check if Qdrant is running
curl http://localhost:6333/health

# Expected JSON response with "status": "ok"
```

### Test 4: FastAPI

```bash
# Check if API is running
curl http://localhost:8000/api/v1/health

# Expected:
# {"status":"healthy","environment":"development","version":"1.0.0"}
```

---

##  Troubleshooting

### Issue: "Connection refused"

**Symptom**: Error connecting to PostgreSQL/Redis/Qdrant

**Solution**:
```bash
# Check if services are running
docker-compose ps

# If not running, start them
docker-compose up -d

# View logs for errors
docker-compose logs postgres
docker-compose logs redis
docker-compose logs qdrant
```

### Issue: "Port already in use"

**Symptom**: Error like "bind: address already in use"

**Solution**:
```bash
# Find what's using the port (example: port 5432)
lsof -i :5432

# Kill it
kill -9 <PID>

# Or use different ports in docker-compose.yml
```

### Issue: "ModuleNotFoundError"

**Symptom**: Python import errors

**Solution**:
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: API won't start

**Symptom**: `uvicorn src.api.main:app --reload` fails

**Solution**:
```bash
# Check Python version (need 3.11+)
python --version

# Check if dependencies installed
pip show fastapi

# Check for syntax errors
python -m py_compile src/api/main.py

# Run with detailed error output
python src/api/main.py
```

---

##  Next Milestone

Once everything is running:

### Your Checklist:
-  Services running (PostgreSQL, Redis, Qdrant)
-  FastAPI server responding
-  Environment variables set
-  **Next**: Implement database models (Week 1)

### Commands You'll Use Often:

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Run API
uvicorn src.api.main:app --reload

# Run tests
pytest tests/ -v

# Format code
black src/

# Type checking
mypy src/
```

---

##  Where to Go Next

1. **Understand the Database**:
   - Read [03-DATABASE-SCHEMA.md](../docs/03-DATABASE-SCHEMA.md)
   - Implement ORM models

2. **Understand the Orchestration**:
   - Read [02-LANGGRAPH-DESIGN.md](../docs/02-LANGGRAPH-DESIGN.md)
   - Review `src/rag/orchestration/graph.py`

3. **Understand the API**:
   - Read [04-API-DESIGN.md](../docs/04-API-DESIGN.md)
   - Visit http://localhost:8000/api/v1/docs

4. **Follow the Roadmap**:
   - See [05-IMPLEMENTATION-ROADMAP.md](../docs/05-IMPLEMENTATION-ROADMAP.md)
   - Week 1: Database models
   - Week 2-3: Document ingestion
   - Week 4-5: Retrieval system

---

##  Success Criteria

You've successfully set up the system when:

- [x] All Docker services are running
- [x] FastAPI is responding on port 8000
- [x] Health check returns {"status": "healthy"}
- [x] You can access API docs at http://localhost:8000/api/v1/docs
- [x] You understand the 3-tier architecture (API → Orchestration → Services)
- [x] You're ready to implement the next phase

---

##  You're Ready!

The foundation is in place. The infrastructure is running. Now it's time to build the intelligent parts!

**See you in Phase 1!** 

For detailed implementation guidance, see [05-IMPLEMENTATION-ROADMAP.md](../docs/05-IMPLEMENTATION-ROADMAP.md)
