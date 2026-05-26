"""
Redis cache management with multi-layer caching strategy.

Implements:
- Layer 1: Immediate cache for current conversation (1 hour TTL)
- Layer 2: Session cache for query results (1 hour TTL)
- Layer 3: Persistent cache for session data (24 hour TTL)
- Layer 4: Embedding cache for popular chunks (7 day TTL)
"""

import redis.asyncio as redis
from typing import Any, Optional
import json
import logging

from src.config import settings

logger = logging.getLogger(__name__)


class RedisManager:
    """Manages Redis connections and caching operations."""
    
    def __init__(self):
        self.redis: Optional[redis.Redis] = None
        self.available: bool = False
    
    async def connect(self):
        """Initialize Redis connection."""
        logger.info("Connecting to Redis...")
        try:
            self.redis = await redis.from_url(
                settings.REDIS_URL,
                encoding="utf8",
                decode_responses=True,
            )
            await self.redis.ping()
            self.available = True
            logger.info("Redis connected successfully")
        except Exception as exc:
            self.redis = None
            self.available = False
            logger.warning(f"Redis unavailable, continuing without cache: {exc}")
    
    async def disconnect(self):
        """Close Redis connection."""
        if self.redis:
            logger.info("Closing Redis connection...")
            await self.redis.close()
            logger.info("Redis connection closed")
        self.available = False
    
    # =====================================================================
    # Layer 1: Immediate Conversation Cache (1 hour)
    # =====================================================================
    
    async def get_conversation_turn(self, session_id: str, turn_num: int) -> Optional[dict]:
        """Get a specific conversation turn."""
        if not self.available or not self.redis:
            return None
        key = f"conv:{session_id}:turn:{turn_num}"
        data = await self.redis.get(key)
        return json.loads(data) if data else None
    
    async def set_conversation_turn(self, session_id: str, turn_num: int, data: dict):
        """Cache a conversation turn for 1 hour."""
        if not self.available or not self.redis:
            return
        key = f"conv:{session_id}:turn:{turn_num}"
        await self.redis.setex(
            key,
            3600,  # 1 hour
            json.dumps(data)
        )
    
    # =====================================================================
    # Layer 2: Session Cache for Query Results (1 hour)
    # =====================================================================
    
    async def get_query_result(self, query_hash: str) -> Optional[dict]:
        """Get cached query results."""
        if not self.available or not self.redis:
            return None
        key = f"query:{query_hash}"
        data = await self.redis.get(key)
        return json.loads(data) if data else None
    
    async def set_query_result(self, query_hash: str, result: dict):
        """Cache query results for 1 hour."""
        if not self.available or not self.redis:
            return
        key = f"query:{query_hash}"
        await self.redis.setex(
            key,
            3600,  # 1 hour
            json.dumps(result)
        )
    
    async def get_query_summary(self, session_id: str) -> Optional[str]:
        """Get session query summary."""
        if not self.available or not self.redis:
            return None
        key = f"summary:{session_id}"
        return await self.redis.get(key)
    
    async def set_query_summary(self, session_id: str, summary: str):
        """Cache query summary for 1 hour."""
        if not self.available or not self.redis:
            return
        key = f"summary:{session_id}"
        await self.redis.setex(key, 3600, summary)
    
    # =====================================================================
    # Layer 3: Persistent Session Cache (24 hours)
    # =====================================================================
    
    async def get_session(self, session_id: str) -> Optional[dict]:
        """Get session data."""
        if not self.available or not self.redis:
            return None
        key = f"session:{session_id}"
        data = await self.redis.get(key)
        return json.loads(data) if data else None
    
    async def set_session(self, session_id: str, data: dict):
        """Cache session data for 24 hours."""
        if not self.available or not self.redis:
            return
        key = f"session:{session_id}"
        await self.redis.setex(
            key,
            86400,  # 24 hours
            json.dumps(data)
        )
    
    async def update_session(self, session_id: str, updates: dict):
        """Update session data."""
        if not self.available or not self.redis:
            return
        session = await self.get_session(session_id) or {}
        session.update(updates)
        await self.set_session(session_id, session)
    
    # =====================================================================
    # Layer 4: Embedding Cache (7 days)
    # =====================================================================
    
    async def get_embedding(self, text: str) -> Optional[list]:
        """Get cached embedding."""
        if not self.available or not self.redis:
            return None
        key = f"embedding:{hash(text)}"
        data = await self.redis.get(key)
        return json.loads(data) if data else None
    
    async def set_embedding(self, text: str, embedding: list):
        """Cache embedding for 7 days."""
        if not self.available or not self.redis:
            return
        key = f"embedding:{hash(text)}"
        await self.redis.setex(
            key,
            604800,  # 7 days
            json.dumps(embedding)
        )
    
    # =====================================================================
    # General Purpose
    # =====================================================================
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value by key."""
        if not self.available or not self.redis:
            return None
        data = await self.redis.get(key)
        return json.loads(data) if data else None
    
    async def set(self, key: str, value: Any, ttl_seconds: int = 3600):
        """Set value with TTL."""
        if not self.available or not self.redis:
            return
        await self.redis.setex(key, ttl_seconds, json.dumps(value))
    
    async def delete(self, key: str):
        """Delete key."""
        if not self.available or not self.redis:
            return
        await self.redis.delete(key)
    
    async def clear_session(self, session_id: str):
        """Clear all cache for a session."""
        if not self.available or not self.redis:
            return
        pattern = f"*:{session_id}:*"
        keys = await self.redis.keys(pattern)
        if keys:
            await self.redis.delete(*keys)
            logger.info(f"Cleared {len(keys)} cache entries for session {session_id}")
    
    async def get_stats(self) -> dict:
        """Get Redis stats."""
        if not self.available or not self.redis:
            return {
                "connected_clients": 0,
                "used_memory_mb": 0,
                "total_commands_processed": 0,
            }
        info = await self.redis.info()
        return {
            "connected_clients": info.get("connected_clients"),
            "used_memory_mb": info.get("used_memory") / 1024 / 1024,
            "total_commands_processed": info.get("total_commands_processed"),
        }


# Global instance
redis_manager = RedisManager()
