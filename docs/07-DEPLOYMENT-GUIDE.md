# Deployment & Scaling Strategy

**Version**: 1.0  
**Status**: Production Operations Guide

---

## Deployment Options

### Option 1: Local Development

```bash
# Using Docker Compose
docker-compose up -d

# Migrations
docker-compose exec api alembic upgrade head

# Sample ingestion
docker-compose exec api python scripts/ingest_sample_data.py

# Access
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
# Redis UI: http://localhost:8001
# Qdrant UI: http://localhost:6333/dashboard
```

### Option 2: Single Server (Production-Lite)

```bash
# VPS setup (Ubuntu 22.04)
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | bash
sudo usermod -aG docker $USER

# Clone and setup
git clone <repo>
cd digital-twin-portfolio
cp .env.production .env
docker-compose -f docker-compose.prod.yml up -d

# SSL Certificates (Let's Encrypt)
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d portfolio.example.com
```

### Option 3: Kubernetes (Recommended for Scale)

#### Cluster Setup

```bash
# Create cluster (AWS EKS)
eksctl create cluster \
  --name portfolio-prod \
  --region us-east-1 \
  --nodegroup-name standard-nodes \
  --node-type t3.medium \
  --nodes 3

# Create namespaces
kubectl create namespace portfolio
kubectl create namespace portfolio-db

# Install ingress controller
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace
```

#### Kubernetes Manifests

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: portfolio

---
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: portfolio-secrets
  namespace: portfolio
type: Opaque
stringData:
  database-url: postgresql://user:pass@postgres:5432/portfolio
  redis-url: redis://redis:6379/0
  jwt-secret: your-jwt-secret-key
  # ... other secrets

---
# k8s/postgres.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: portfolio
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 50Gi

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: portfolio
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:16-alpine
        env:
        - name: POSTGRES_DB
          value: portfolio
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: portfolio-secrets
              key: db-user
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-data
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-data
        persistentVolumeClaim:
          claimName: postgres-pvc

---
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio-api
  namespace: portfolio
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: portfolio-api
  template:
    metadata:
      labels:
        app: portfolio-api
    spec:
      serviceAccountName: portfolio-api
      containers:
      - name: api
        image: gcr.io/portfolio/api:latest
        imagePullPolicy: Always
        ports:
        - name: http
          containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: portfolio-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: portfolio-secrets
              key: redis-url
        - name: ENVIRONMENT
          value: production
        
        # Resource limits
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        
        # Probes
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
          failureThreshold: 3
        
        readinessProbe:
          httpGet:
            path: /api/v1/health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
          failureThreshold: 3
        
        # Graceful shutdown
        lifecycle:
          preStop:
            exec:
              command: ["sleep", "30"]

---
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: portfolio-api-svc
  namespace: portfolio
spec:
  type: ClusterIP
  selector:
    app: portfolio-api
  ports:
  - name: http
    port: 80
    targetPort: 8000

---
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: portfolio-ingress
  namespace: portfolio
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - portfolio.example.com
    secretName: portfolio-tls
  rules:
  - host: portfolio.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: portfolio-api-svc
            port:
              number: 80

---
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: portfolio-api-hpa
  namespace: portfolio
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: portfolio-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

#### Deploy to Kubernetes

```bash
# Apply manifests
kubectl apply -f k8s/

# Check status
kubectl get pods -n portfolio
kubectl logs -f deployment/portfolio-api -n portfolio

# Access
kubectl port-forward svc/portfolio-api-svc 8000:80 -n portfolio
```

---

## Scaling Strategy

### Horizontal Scaling

```
Load Balancer (Nginx/HAProxy)
    ↓
    → API Pod 1
    → API Pod 2
    → API Pod 3
    → API Pod N (autoscaling)
    
Each pod is stateless and can handle requests independently
```

**Configuration**:
```python
# HPA targets
CPU: 70% threshold
Memory: 80% threshold
Min replicas: 3
Max replicas: 10
Scale-up period: 15 seconds
Scale-down period: 5 minutes
```

### Database Scaling

#### Read Replicas
```yaml
# PostgreSQL with Replication
Primary (Write)
    ↓
Replica 1 (Read)
Replica 2 (Read)
Replica 3 (Read)

# Connection pooling with PgBouncer
Client → PgBouncer → Primary/Replicas
```

#### Vector Database Scaling
```
Qdrant Cluster:
- Master node (write)
- Replica nodes (read)
- Sharding for large collections
```

### Cache Optimization

```
# Redis optimization for retrieval queries
Layer 1: Query result cache (1 hour)
Layer 2: Chunk embedding cache (7 days)
Layer 3: Session data (24 hours)

Hit rate target: > 80% for repeated queries
```

### Async Processing

```
# Celery workers for embedding generation
Incoming documents → Queue → Worker Pool (3-5 workers)
Each worker processes batches of 32 embeddings

Peak: Scale to 20+ workers during bulk ingestion
Idle: Scale to 1-2 workers
```

---

## Performance Optimization

### Database Query Optimization

```sql
-- Indexes for hot paths
CREATE INDEX idx_chunks_project_importance_created 
ON chunks(project_name, importance, created_at DESC);

CREATE INDEX idx_messages_conversation_created 
ON messages(conversation_id, created_at DESC);

-- EXPLAIN ANALYZE before/after
EXPLAIN ANALYZE
SELECT * FROM chunks WHERE project_name = 'rag-system' LIMIT 10;
```

### Vector Search Optimization

```python
# Qdrant optimization
batch_size: 32
force_disable_check_payload: true
# Use specific index types based on workload
```

### API Response Optimization

```python
# Compression
from fastapi.middleware.gzip import GZIPMiddleware
app.add_middleware(GZIPMiddleware, minimum_size=1000)

# Caching
from fastapi_cache2 import FastAPICache2
from fastapi_cache2.backends.redis import RedisBackend

@cached(expire=3600)
@router.get("/retrieval/debug")
async def retrieval_debug(query: str):
    # This response is cached for 1 hour
    ...
```

---

## Monitoring & Observability

### Metrics Stack

```yaml
# Prometheus + Grafana
prometheus:
  - API latency
  - Retrieval latency
  - Vector search recall
  - Reranking scores
  - Error rates
  - Request volume

grafana:
  - Real-time dashboards
  - Alerts on anomalies
  - SLA tracking
```

### Logging Stack

```yaml
# ELK Stack or Loki
logs:
  - Application logs
  - Request logs
  - Error traces
  - Audit logs

aggregation:
  - Centralized logging
  - Full-text search
  - Alerting on patterns
```

### Distributed Tracing

```python
from opentelemetry import trace
from opentelemetry.exporter.jaeger.thrift import JaegerExporter

tracer_provider = TracerProvider()
tracer_provider.add_span_processor(
    BatchSpanProcessor(JaegerExporter())
)

# Trace retrieval flow
with tracer.start_as_current_span("hybrid_retrieve") as span:
    # Execution is traced
    ...
```

### Health Checks

```python
@router.get("/api/v1/health")
async def health_check():
    checks = {
        "api": "up",
        "postgres": await check_postgres(),
        "redis": await check_redis(),
        "qdrant": await check_qdrant(),
        "llm": await check_llm_connection()
    }
    
    overall = "healthy" if all(v == "up" for v in checks.values()) else "degraded"
    
    return {
        "status": overall,
        "checks": checks,
        "timestamp": datetime.utcnow()
    }
```

---

## Disaster Recovery

### Backup Strategy

```bash
# PostgreSQL daily backups
0 2 * * * pg_dump -h localhost -U portfolio -d portfolio_db | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz

# Retain 30 days
find /backups -name "db_*.sql.gz" -mtime +30 -delete

# Upload to S3
aws s3 sync /backups s3://portfolio-backups --storage-class GLACIER
```

### Disaster Recovery Plan

```
RTO (Recovery Time Objective): 1 hour
RPO (Recovery Point Objective): 1 hour (daily backups)

Steps:
1. Detect failure (health checks)
2. Failover to backup infrastructure (if using multi-region)
3. Restore from latest backup
4. Verify data integrity
5. Resume operations
6. Post-incident review
```

### High Availability

```
Multi-region setup:
Region A (Primary)
  - API instances
  - PostgreSQL primary
  - Redis master
  
Region B (Standby)
  - API instances (reduced capacity)
  - PostgreSQL replica
  - Redis replica

Automatic failover on region failure
```

---

## Cost Optimization

### Development/Staging

```
• Single VPS (t3.medium): ~$15/month
• 50GB storage: ~$5/month
• Total: ~$20/month
```

### Production

```
• Kubernetes cluster (3 nodes, t3.medium): ~$150/month
• Database (managed RDS): ~$100/month
• Redis (managed ElastiCache): ~$50/month
• Vector DB (Qdrant Cloud): ~$100/month
• Monitoring (Datadog): ~$50/month
• Backup/storage: ~$20/month
• CDN (CloudFront): ~$50/month

Total: ~$520/month base + usage costs
```

### Cost Optimization Tips

- Use spot instances for non-critical workloads
- Implement aggressive caching (Redis)
- Compress responses (gzip)
- Batch embedding generation
- Use managed services (RDS, ElastiCache)
- Set auto-scaling limits
- Archive old logs to S3
- Use reserved instances for baseline load

---

## Continuous Deployment

### CI/CD Pipeline

```yaml
# GitHub Actions workflow
name: Deploy

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: pytest tests/ -v

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build image
        run: docker build -t gcr.io/portfolio/api:${{ github.sha }} .
      - name: Push to GCR
        run: docker push gcr.io/portfolio/api:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to k8s
        run: |
          kubectl set image deployment/portfolio-api \
            api=gcr.io/portfolio/api:${{ github.sha }} \
            -n portfolio
      - name: Verify rollout
        run: kubectl rollout status deployment/portfolio-api -n portfolio
```

---

## Rollback Strategy

```bash
# If deployment has issues
kubectl rollout undo deployment/portfolio-api -n portfolio

# Or revert to specific revision
kubectl rollout history deployment/portfolio-api -n portfolio
kubectl rollout undo deployment/portfolio-api --to-revision=2 -n portfolio

# Blue-green deployment option
# Keep old version running, switch traffic once new version verified
```

---

## Next Steps

For advanced scaling patterns, see performance tuning guides.  
For operational runbooks, see incident response procedures.
