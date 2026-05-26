"""Basic document parsers for ingestion."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from pypdf import PdfReader


def parse_document(file_path: str) -> dict[str, Any]:
    """Parse a supported document into normalized text and metadata."""
    path = Path(file_path)
    suffix = path.suffix.lower()

    if suffix == ".pdf":
        return _parse_pdf(path)
    if suffix in {".md", ".txt", ".rst"}:
        return _parse_text(path)

    raise ValueError(f"Unsupported file type: {suffix}")


def _parse_text(path: Path) -> dict[str, Any]:
    content = path.read_text(encoding="utf-8")
    return {
        "title": path.stem,
        "content": content,
        "source_type": "markdown" if path.suffix.lower() == ".md" else "text",
        "metadata": {},
    }


def _parse_pdf(path: Path) -> dict[str, Any]:
    reader = PdfReader(str(path))
    pages: list[str] = []
    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        pages.append(f"[Page {page_number}]\n{text.strip()}")

    metadata = reader.metadata or {}
    return {
        "title": metadata.get("/Title") or path.stem,
        "content": "\n\n".join(pages).strip(),
        "source_type": "pdf",
        "metadata": {
            "author": metadata.get("/Author"),
            "subject": metadata.get("/Subject"),
            "page_count": len(reader.pages),
        },
    }
