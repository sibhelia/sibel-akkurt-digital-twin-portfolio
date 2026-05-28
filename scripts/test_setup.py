"""
Quick test script — API ve servislerin çalışıp çalışmadığını test eder.

Kullanım:
    python scripts/test_setup.py
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))


async def main():
    print("=" * 55)
    print("Digital Twin Portfolio — Sistem Testi")
    print("=" * 55)

    # 1. Config
    print("\n[1] Config yukleniyor...")
    try:
        from src.config import settings
        print(f"   [OK] Ortam: {settings.ENVIRONMENT}")
        print(f"   [OK] LLM modeli: {settings.GROQ_MODEL}")
        print(f"   [OK] Embedding: {settings.EMBEDDING_MODEL}")
        print(f"   [OK] Qdrant URL: {settings.QDRANT_URL}")
        groq_ok = bool(settings.GROQ_API_KEY)
        print(f"   {'[OK]' if groq_ok else '[ERR]'} GROQ_API_KEY: {'set' if groq_ok else 'EKSIK!'}")
    except Exception as e:
        print(f"   [ERR] Config hatasi: {e}")
        return

    # 2. Redis
    print("\n[2] Redis baglantisi test ediliyor...")
    try:
        from src.cache.redis_manager import redis_manager
        await redis_manager.connect()
        await redis_manager.disconnect()
        print("   [OK] Redis baglantisi basarili")
    except Exception as e:
        print(f"   [ERR] Redis hatasi: {e}")
        print("   -> docker-compose up -d ile Redis'i baslatin")

    # 3. Qdrant
    print("\n[3] Qdrant baglantisi test ediliyor...")
    try:
        from qdrant_client import QdrantClient
        client = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY or None,
        )
        info = client.get_collections()
        print(f"   [OK] Qdrant baglantisi basarili ({len(info.collections)} koleksiyon)")
    except Exception as e:
        print(f"   [ERR] Qdrant hatasi: {e}")
        print("   -> docker-compose up -d veya cloud Qdrant URL'ini kontrol edin")

    # 4. Veritabani
    print("\n[4] PostgreSQL baglantisi test ediliyor...")
    try:
        from src.db.session import init_db, close_db
        await init_db()
        await close_db()
        print("   [OK] PostgreSQL baglantisi ve tablolar basarili")
    except Exception as e:
        print(f"   [ERR] PostgreSQL hatasi: {e}")
        print("   -> DATABASE_URL'i .env dosyasinda kontrol edin")

    # 5. Embedding modeli
    print("\n[5] Embedding modeli test ediliyor...")
    try:
        from src.rag.embeddings import generate_embeddings
        vectors = await generate_embeddings(["Merhaba, bu bir test."])
        dim = len(vectors[0]) if vectors else 0
        print(f"   [OK] Embedding calisiyor (dimension: {dim})")
    except Exception as e:
        print(f"   [ERR] Embedding hatasi: {e}")

    # 6. Groq LLM
    print("\n[6] Groq LLM test ediliyor...")
    if not settings.GROQ_API_KEY:
        print("   [ERR] GROQ_API_KEY eksik - .env dosyasina ekleyin")
    else:
        try:
            from src.llm.groq_client import groq_client
            response = await groq_client.generate_text(
                prompt="Merhaba! Tek cumleyle kendini tanit.",
                max_tokens=50,
                temperature=0.1,
            )
            print(f"   [OK] Groq calisiyor: \"{response[:80]}...\"")
        except Exception as e:
            print(f"   [ERR] Groq hatasi: {e}")

    print("\n" + "=" * 55)
    print("Test tamamlandı!")
    print("=" * 55)


if __name__ == "__main__":
    asyncio.run(main())
