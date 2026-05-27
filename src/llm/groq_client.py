"""Groq API client for text generation and embeddings."""

import hashlib
import httpx
import logging
from typing import Any, List
from src.config import settings

logger = logging.getLogger(__name__)


class GroqClient:
    """Client wrapper for Groq LLM and embedding endpoints."""

    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.base_url = settings.GROQ_BASE_URL.rstrip("/")
        self.model = settings.GROQ_MODEL
        self.embedding_model = settings.GROQ_EMBEDDING_MODEL

        if not self.api_key:
            logger.warning("GROQ_API_KEY is not configured. Groq requests will fail until set.")

    def _uses_reasoning_model(self) -> bool:
        return self.model.startswith("openai/gpt-oss")

    def _normalize_max_output_tokens(self, max_tokens: int) -> int:
        """Keep enough room for reasoning models to produce a final answer."""
        if self._uses_reasoning_model():
            return max(max_tokens, 256)
        return max_tokens

    async def _request(self, endpoint: str, payload: dict[str, Any]) -> dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(f"{self.base_url}{endpoint}", json=payload, headers=headers)
            response.raise_for_status()
            return response.json()

    async def generate_text(
        self,
        prompt: str,
        max_tokens: int = 1024,
        temperature: float = 0.2,
        stop: list[str] | None = None,
    ) -> str:
        max_output_tokens = self._normalize_max_output_tokens(max_tokens)
        payload: dict[str, Any] = {
            "model": self.model,
            "input": prompt,
            "max_output_tokens": max_output_tokens,
            "temperature": temperature,
        }
        if stop:
            payload["stop"] = stop

        result = await self._request("/responses", payload)
        if "output_text" in result:
            return str(result["output_text"])

        output = result.get("output")
        if isinstance(output, list):
            parts: list[str] = []
            reasoning_parts: list[str] = []
            for item in output:
                if not isinstance(item, dict):
                    continue
                for content_item in item.get("content", []):
                    if not isinstance(content_item, dict):
                        continue
                    content_type = content_item.get("type")
                    if content_type == "output_text":
                        parts.append(str(content_item.get("text", "")))
                    elif content_type == "reasoning_text":
                        reasoning_parts.append(str(content_item.get("text", "")))
            if parts:
                return "".join(parts)
            if reasoning_parts:
                logger.warning(
                    "Groq returned reasoning content without a final answer for model %s",
                    self.model,
                )

        choices = result.get("choices", [])
        if choices and isinstance(choices, list):
            choice = choices[0]
            message = choice.get("message", {})
            if isinstance(message, dict):
                return str(message.get("content", ""))
            return str(choice.get("text", ""))

        return ""

    async def embed_texts(self, texts: list[str]) -> list[list[float]]:
        payload = {
            "model": self.embedding_model,
            "input": texts,
        }
        try:
            result = await self._request("/embeddings", payload)
            data = result.get("data", [])
            embeddings = []
            for item in data:
                embedding = item.get("embedding")
                if isinstance(embedding, list):
                    embeddings.append(embedding)
            if embeddings:
                return embeddings
        except Exception as exc:
            logger.warning(f"Groq embeddings unavailable, using local fallback embeddings: {exc}")

        return [self._fallback_embedding(text) for text in texts]

    def _fallback_embedding(self, text: str) -> list[float]:
        """Generate deterministic local embeddings when provider embeddings are unavailable."""
        dimension = settings.EMBEDDING_DIMENSION
        vector = [0.0] * dimension
        tokens = text.lower().split()
        if not tokens:
            return vector

        for token in tokens:
            digest = hashlib.sha256(token.encode("utf-8")).digest()
            for index in range(0, len(digest), 4):
                chunk = digest[index:index + 4]
                bucket = int.from_bytes(chunk, "big") % dimension
                vector[bucket] += 1.0

        norm = sum(value * value for value in vector) ** 0.5
        if norm:
            vector = [value / norm for value in vector]
        return vector


groq_client = GroqClient()
