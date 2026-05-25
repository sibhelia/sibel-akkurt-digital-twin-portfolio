"""Groq API client for text generation and embeddings."""

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
        temperature: float = 0.7,
        stop: list[str] | None = None,
    ) -> str:
        payload: dict[str, Any] = {
            "model": self.model,
            "input": prompt,
            "max_output_tokens": max_tokens,
            "temperature": temperature,
        }
        if stop:
            payload["stop"] = stop

        result = await self._request("/v1/complete", payload)
        if "output" in result:
            output = result["output"]
            if isinstance(output, list):
                return "".join(str(item) for item in output)
            return str(output)

        choices = result.get("choices", [])
        if choices and isinstance(choices, list):
            return str(choices[0].get("text", ""))

        return ""

    async def embed_texts(self, texts: list[str]) -> list[list[float]]:
        payload = {
            "model": self.embedding_model,
            "input": texts,
        }
        result = await self._request("/v1/embeddings", payload)
        data = result.get("data", [])
        embeddings = []
        for item in data:
            embedding = item.get("embedding")
            if isinstance(embedding, list):
                embeddings.append(embedding)
        return embeddings


groq_client = GroqClient()
