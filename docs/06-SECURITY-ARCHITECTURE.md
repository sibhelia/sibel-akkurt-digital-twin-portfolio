# Security Architecture

**Version**: 1.0  
**Classification**: Production Security Design  
**Status**: Comprehensive Security Blueprint

---

## Security Layers

```

         Network Layer Security              
  - TLS/SSL, WAF, DDoS Protection           

         ↓

      Application Layer Security             
  - Authentication, Authorization, Validation

         ↓

         Data Layer Security                 
  - Encryption, Access Control, Audit       

```

---

## 1. Authentication & Authorization

### JWT-Based Authentication

```python
# src/api/auth.py

from datetime import datetime, timedelta
from typing import Optional
import jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthCredentials

security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"])

class TokenPayload(BaseModel):
    user_id: str
    permissions: List[str]
    iat: datetime
    exp: datetime

def create_access_token(user_id: str, permissions: List[str], hours: int = 24) -> str:
    """Create JWT token"""
    exp = datetime.utcnow() + timedelta(hours=hours)
    payload = {
        "user_id": user_id,
        "permissions": permissions,
        "iat": datetime.utcnow(),
        "exp": exp
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")

async def get_current_user(credentials: HTTPAuthCredentials = Depends(security)) -> str:
    """Verify JWT and extract user"""
    try:
        payload = jwt.decode(credentials.credentials, settings.JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user_admin(current_user: str = Depends(get_current_user)) -> str:
    """Verify admin user"""
    payload = jwt.decode(current_user, settings.JWT_SECRET, algorithms=["HS256"])
    if "admin" not in payload.get("permissions", []):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    return current_user
```

### Role-Based Access Control (RBAC)

```python
class Permission:
    CHAT_WRITE = "chat:write"
    CHAT_READ = "chat:read"
    DOCUMENTS_READ = "documents:read"
    DOCUMENTS_WRITE = "documents:write"
    DOCUMENTS_DELETE = "documents:delete"
    ADMIN_ALL = "admin:*"

class Role:
    USER = ["chat:write", "chat:read", "documents:read"]
    ADMIN = ["admin:*"]
    GUEST = ["chat:read"]

async def check_permission(required: str, current_user = Depends(get_current_user)):
    """Check if user has required permission"""
    payload = jwt.decode(current_user, settings.JWT_SECRET)
    permissions = payload.get("permissions", [])
    
    if "admin:*" in permissions:
        return True
    
    if required not in permissions:
        raise HTTPException(status_code=403, detail="Permission denied")
```

---

## 2. Input Validation & Sanitization

### Query Sanitization

```python
# src/rag/utils/validators.py

from typing import Tuple
import re

class QueryValidator:
    # SQL injection patterns
    SQL_INJECTION_PATTERNS = [
        r"(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE)\b)",
        r"(--|;|\/\*|\*\/)",
        r"(<script|javascript:|onerror=|onclick=)"
    ]
    
    # Prompt injection patterns
    PROMPT_INJECTION_PATTERNS = [
        r"(ignore previous|forget all|forget previous)",
        r"(system prompt|system message|hidden instructions)",
        r"(disregard|override|replace)",
    ]
    
    @staticmethod
    def is_sql_injection(query: str) -> bool:
        """Detect SQL injection attempts"""
        for pattern in QueryValidator.SQL_INJECTION_PATTERNS:
            if re.search(pattern, query, re.IGNORECASE):
                return True
        return False
    
    @staticmethod
    def is_prompt_injection(query: str) -> bool:
        """Detect prompt injection attempts"""
        for pattern in QueryValidator.PROMPT_INJECTION_PATTERNS:
            if re.search(pattern, query, re.IGNORECASE):
                return True
        return False
    
    @staticmethod
    def sanitize(query: str) -> str:
        """Sanitize query"""
        # Remove leading/trailing whitespace
        query = query.strip()
        
        # Remove multiple spaces
        query = re.sub(r'\s+', ' ', query)
        
        # Remove potentially harmful characters (but keep natural language)
        query = re.sub(r'[<>\"\'`;]', '', query)
        
        return query
    
    @staticmethod
    def validate_query(query: str) -> Tuple[bool, str]:
        """Full validation"""
        if len(query) < 3:
            return False, "Query too short"
        
        if len(query) > 2000:
            return False, "Query too long"
        
        if QueryValidator.is_sql_injection(query):
            return False, "Potential SQL injection detected"
        
        if QueryValidator.is_prompt_injection(query):
            return False, "Potential prompt injection detected"
        
        return True, QueryValidator.sanitize(query)
```

### File Upload Security

```python
# src/ingestion/security.py

from typing import Optional
import hashlib
import magic
import subprocess

class FileSecurityValidator:
    ALLOWED_TYPES = {
        'application/pdf',
        'text/plain',
        'text/markdown',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }
    
    MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB
    
    @staticmethod
    async def validate_file(file) -> Optional[str]:
        """Validate uploaded file"""
        
        # Check file size
        content = await file.read()
        if len(content) > FileSecurityValidator.MAX_FILE_SIZE:
            return "File too large"
        
        # Check MIME type
        mime = magic.from_buffer(content, mime=True)
        if mime not in FileSecurityValidator.ALLOWED_TYPES:
            return f"Invalid file type: {mime}"
        
        # Virus scan (using ClamAV)
        is_safe = await FileSecurityValidator.scan_virus(content)
        if not is_safe:
            return "File flagged as potentially malicious"
        
        return None  # Valid
    
    @staticmethod
    async def scan_virus(content: bytes) -> bool:
        """Scan file with ClamAV"""
        try:
            # Write to temp file
            import tempfile
            with tempfile.NamedTemporaryFile(delete=False) as tmp:
                tmp.write(content)
                tmp_path = tmp.name
            
            # Run ClamAV
            result = subprocess.run(
                ['clamscan', tmp_path],
                capture_output=True
            )
            
            # Clean up
            import os
            os.unlink(tmp_path)
            
            # Result 0 = clean, 1 = infected
            return result.returncode == 0
        except Exception as e:
            logger.error(f"Virus scan error: {e}")
            return False  # Fail secure
```

---

## 3. Rate Limiting & Throttling

```python
# src/api/rate_limiting.py

from fastapi import HTTPException
from datetime import datetime, timedelta
import redis.asyncio as redis

class RateLimiter:
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
    
    async def check_limit(
        self,
        user_id: str,
        limit_per_minute: int = 60,
        limit_per_day: int = 10000
    ) -> bool:
        """Check if user is within rate limits"""
        
        now = datetime.utcnow()
        
        # Per-minute check
        minute_key = f"rate_limit:{user_id}:minute:{now.strftime('%Y%m%d%H%M')}"
        minute_count = await self.redis.incr(minute_key)
        
        if minute_count == 1:
            await self.redis.expire(minute_key, 60)
        
        if minute_count > limit_per_minute:
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        
        # Per-day check
        day_key = f"rate_limit:{user_id}:day:{now.strftime('%Y%m%d')}"
        day_count = await self.redis.incr(day_key)
        
        if day_count == 1:
            await self.redis.expire(day_key, 86400)
        
        if day_count > limit_per_day:
            raise HTTPException(status_code=429, detail="Daily limit exceeded")
        
        return True

# Apply as middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    user_id = request.state.user_id or "anonymous"
    try:
        await rate_limiter.check_limit(user_id)
    except HTTPException:
        raise
    
    response = await call_next(request)
    return response
```

---

## 4. Data Encryption

### Encryption at Rest

```python
# src/db/encryption.py

from cryptography.fernet import Fernet
from sqlalchemy import event
from sqlalchemy.orm import Session
import os

class EncryptionManager:
    def __init__(self):
        self.cipher = Fernet(os.getenv("ENCRYPTION_KEY"))
    
    def encrypt(self, data: str) -> str:
        """Encrypt sensitive data"""
        return self.cipher.encrypt(data.encode()).decode()
    
    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt sensitive data"""
        return self.cipher.decrypt(encrypted_data.encode()).decode()

encryption_manager = EncryptionManager()

# Automatically encrypt sensitive fields
@event.listens_for(Session, "before_insert")
def encrypt_sensitive_fields(session, flush_context):
    for obj in session.new:
        if hasattr(obj, 'api_key'):
            obj.api_key = encryption_manager.encrypt(obj.api_key)
```

### Encryption in Transit

```python
# Use HTTPS/TLS
# In production, configure SSL certificates

# FastAPI setup
if settings.ENVIRONMENT == "production":
    import ssl
    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ssl_context.load_cert_chain(
        certfile=settings.SSL_CERT_PATH,
        keyfile=settings.SSL_KEY_PATH
    )
```

---

## 5. Database Access Control

### Row-Level Security

```python
# Restrict queries to user's own data
async def get_user_conversations(
    user_id: str,
    db: AsyncSession
):
    query = select(Conversation).where(
        Conversation.user_id == user_id
    )
    return await db.execute(query)
```

### Connection Security

```python
# src/db/session.py

engine = create_async_engine(
    DATABASE_URL,
    # Security settings
    echo=False,  # No logging in production
    echo_pool=False,
    pool_pre_ping=True,  # Test connections
    pool_recycle=3600,  # Recycle connections hourly
    connect_args={
        "server_settings": {
            "application_name": "portfolio-api",
            "ssl": "require",  # Require SSL
        }
    }
)
```

---

## 6. API Security Headers

```python
# src/api/middleware.py

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    
    # Security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    
    return response
```

---

## 7. Logging & Audit Trail

```python
# src/db/models.py

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(UUID, primary_key=True)
    user_id = Column(String(100))
    action = Column(String(100))
    resource_type = Column(String(50))
    resource_id = Column(UUID)
    status = Column(String(20))  # success, failure
    details = Column(JSONB)
    ip_address = Column(String(50))
    timestamp = Column(DateTime, default=datetime.utcnow)

@app.middleware("http")
async def audit_middleware(request: Request, call_next):
    response = await call_next(request)
    
    # Log sensitive operations
    if request.method in ["POST", "DELETE", "PUT"]:
        user_id = request.state.user_id
        
        audit_log = AuditLog(
            user_id=user_id,
            action=f"{request.method} {request.url.path}",
            status="success" if response.status_code < 400 else "failure",
            ip_address=request.client.host,
            details={"method": request.method, "path": request.url.path}
        )
        
        # Save to database
        await db.add(audit_log)
        await db.commit()
    
    return response
```

---

## 8. Secret Management

```python
# src/config.py

from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Load from environment variables
    DATABASE_URL: str
    REDIS_URL: str
    
    JWT_SECRET: str  # Should be strong random string
    ENCRYPTION_KEY: str  # Fernet key
    
    OPENAI_API_KEY: str
    GITHUB_TOKEN: str
    
    # NOT in code, only in secure vault (AWS Secrets, Azure KeyVault, etc.)
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        # Never commit .env file
        
        # Mark sensitive fields
        json_schema_extra = {
            "example": {
                "DATABASE_URL": "postgresql://...",  # Never expose
                "JWT_SECRET": "***",
                "OPENAI_API_KEY": "***"
            }
        }

# Production: Use AWS Secrets Manager
import boto3

def get_secret(secret_name: str) -> str:
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId=secret_name)
    return response['SecretString']
```

---

## 9. CORS & CSRF Protection

```python
# src/api/main.py

from fastapi.middleware.cors import CORSMiddleware
from fastapi_csrf_protect import CsrfProtect

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://portfolio.example.com"],  # Specific origins
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
    max_age=600,
)

@CsrfProtect.load_config
def load_config():
    return CsrfSettings(
        secret_key=settings.JWT_SECRET,
        cookie_secure=True,
        cookie_httponly=True,
        cookie_samesite="Strict"
    )
```

---

## 10. Production Hardening Checklist

- [ ] Enable HTTPS/TLS with valid certificates
- [ ] Use strong JWT secrets (>32 characters, random)
- [ ] Enable database connection encryption
- [ ] Implement rate limiting per endpoint
- [ ] Set up WAF (AWS WAF, Cloudflare, etc.)
- [ ] Enable CORS for specific origins only
- [ ] Set security headers on all responses
- [ ] Implement audit logging
- [ ] Use secrets management service
- [ ] Regular security updates for dependencies
- [ ] SQL injection prevention (use ORM, parameterized queries)
- [ ] XSS prevention (input validation, output encoding)
- [ ] CSRF protection on state-changing operations
- [ ] Implement DDoS protection
- [ ] Regular penetration testing
- [ ] Keep dependencies updated (use renovate, dependabot)
- [ ] Monitor for suspicious activity
- [ ] Implement backup/disaster recovery
- [ ] Regular security audits
- [ ] Privacy compliance (GDPR, etc.)

---

## Security Incident Response

```python
# src/security/incident_handler.py

import sentry_sdk
from datetime import datetime

class IncidentHandler:
    @staticmethod
    async def handle_suspicious_activity(
        user_id: str,
        activity_type: str,
        details: Dict
    ):
        """Handle security incidents"""
        
        # Log incident
        logger.warning(
            f"Suspicious activity detected",
            extra={
                "user_id": user_id,
                "type": activity_type,
                "details": details
            }
        )
        
        # Report to Sentry
        sentry_sdk.capture_message(
            f"Security: {activity_type}",
            level="warning"
        )
        
        # Immediate actions
        if activity_type == "multiple_failed_logins":
            # Block user temporarily
            await block_user(user_id, duration_minutes=15)
        
        elif activity_type == "sql_injection_attempt":
            # Alert security team
            await alert_security_team(f"SQL injection attempt from {user_id}")
            # Block IP
            await block_ip(request.client.host)
        
        elif activity_type == "rate_limit_abuse":
            # Reduce rate limit
            await update_rate_limit(user_id, requests_per_minute=5)
```

---

## Compliance & Standards

### OWASP Top 10 Mitigation

1. **Broken Access Control**: RBAC, row-level security 
2. **Cryptographic Failures**: TLS, encryption at rest 
3. **Injection**: Input validation, parameterized queries 
4. **Insecure Design**: Threat modeling, design review 
5. **Security Misconfiguration**: Security headers, hardening 
6. **Vulnerable Components**: Dependency scanning, updates 
7. **Authentication Failures**: JWT, rate limiting, MFA 
8. **Software Data Integrity**: Code signing, SBOM 
9. **Logging & Monitoring**: Structured logs, alerting 
10. **SSRF**: Input validation, network segmentation 

### GDPR Compliance

- [ ] Data minimization
- [ ] Right to access
- [ ] Right to deletion
- [ ] Data portability
- [ ] Privacy by design
- [ ] Consent management
- [ ] Data protection impact assessment

---

## Next Steps

See [07-DEPLOYMENT-GUIDE.md](07-DEPLOYMENT-GUIDE.md) for secure deployment.  
See [08-SCALING-STRATEGY.md](08-SCALING-STRATEGY.md) for scaling securely.
