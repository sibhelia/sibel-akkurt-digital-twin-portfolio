import httpx
import asyncio

async def test_translate():
    text = "Merhaba dünya, bu bir test mesajıdır."
    url = "https://translate.googleapis.com/translate_a/single"
    params = {
        "client": "gtx",
        "sl": "tr",
        "tl": "en",
        "dt": "t",
        "q": text
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        print(response.status_code)
        if response.status_code == 200:
            data = response.json()
            # The translated text is in data[0][0][0]
            translated = "".join([sentence[0] for sentence in data[0]])
            print("Translated:", translated)
        else:
            print("Failed:", response.text)

if __name__ == "__main__":
    asyncio.run(test_translate())
