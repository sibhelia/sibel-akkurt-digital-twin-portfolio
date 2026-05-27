"""Groq API client for text generation using the official Groq Python SDK."""

import logging
from typing import Any

from groq import AsyncGroq

from src.config import settings

logger = logging.getLogger(__name__)


class GroqClient:
    """Client wrapper for Groq LLM using the official Groq SDK."""

    def __init__(self) -> None:
        self.model = settings.GROQ_MODEL

        if not settings.GROQ_API_KEY:
            logger.warning(
                "GROQ_API_KEY is not configured. Groq requests will fail until set."
            )
            self._client: AsyncGroq | None = None
        else:
            self._client = AsyncGroq(api_key=settings.GROQ_API_KEY)

    def _get_client(self) -> AsyncGroq:
        if self._client is None:
            raise RuntimeError(
                "GROQ_API_KEY is not set. Configure it in your .env file."
            )
        return self._client

    async def generate_text(
        self,
        prompt: str,
        max_tokens: int = 1024,
        temperature: float = 0.2,
        system_prompt: str | None = None,
        stop: list[str] | None = None,
    ) -> str:
        """Generate text using the Groq Chat Completions API."""
        client = self._get_client()

        messages: list[dict[str, Any]] = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        kwargs: dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
        }
        if stop:
            kwargs["stop"] = stop

        try:
            response = await client.chat.completions.create(**kwargs)
            content = response.choices[0].message.content
            return content or ""
        except Exception as exc:
            logger.error("Groq generate_text failed: %s", exc)
            raise

    async def generate_with_history(
        self,
        messages: list[dict[str, str]],
        max_tokens: int = 1024,
        temperature: float = 0.2,
    ) -> str:
        """Generate text using a full conversation history (role/content pairs)."""
        client = self._get_client()

        try:
            response = await client.chat.completions.create(
                model=self.model,
                messages=messages,  # type: ignore[arg-type]
                max_tokens=max_tokens,
                temperature=temperature,
            )
            content = response.choices[0].message.content
            return content or ""
        except Exception as exc:
            logger.error("Groq generate_with_history failed: %s", exc)
            raise


groq_client = GroqClient()
