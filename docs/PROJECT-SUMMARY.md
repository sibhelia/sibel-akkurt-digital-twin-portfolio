# Project Summary

This repository is a starting point for a portfolio-focused RAG application. The current codebase includes the API shell, retrieval-related modules, ingestion helpers, and planning documents for the rest of the system.

## What's Here

- `src/api/main.py`: FastAPI entry point and admin ingestion endpoints
- `src/rag/`: retrieval and orchestration modules
- `src/ingestion/`: parsing and chunking helpers
- `src/db/` and `src/cache/`: persistence and cache setup
- `docker-compose.yml` and `docker/Dockerfile`: local development setup
- `docs/`: architecture, roadmap, API, security, and deployment notes

## Current Shape

The project is partly implemented. Some modules are wired up, while several documents still describe the intended direction rather than finished behavior. The docs are useful, but they should be read as planning material, not as a promise that every listed feature already exists.

## Suggested Reading Order

1. `docs/GETTING-STARTED.md`
2. `docs/01-SYSTEM-ARCHITECTURE.md`
3. `docs/05-IMPLEMENTATION-ROADMAP.md`

## Notes

- Python cache files are ignored and should stay out of version control.
- If you want to keep trimming the repo, the docs are the best place to simplify repeated or inflated language.
- There is no root `README.md` yet. Adding a short one later would make the repo feel more finished.
