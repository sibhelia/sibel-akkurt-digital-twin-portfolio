import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

DATABASE_URL = "postgresql+asyncpg://postgres.zaipwituvddwoggbnyez:kZqrbg93N7m2pBgV@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"

async def main():
    engine = create_async_engine(DATABASE_URL)
    async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    
    async with async_session() as session:
        result = await session.execute(text("SELECT id, title, title_en FROM projects"))
        rows = result.fetchall()
        for row in rows:
            print(row)
            
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())
