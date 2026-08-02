import asyncio
import httpx

async def main():
    async with httpx.AsyncClient() as client:
        response = await client.get("http://localhost:8000/api/v1/portfolio/content")
        print(response.json()['projects'])

if __name__ == "__main__":
    asyncio.run(main())
