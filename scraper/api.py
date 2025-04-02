from fastapi import FastAPI, HTTPException
from mbs_scraper import MBSScraper
import os

app = FastAPI()

@app.get("/")
async def root():
    return {"status": "ok"}

@app.post("/scrape")
async def scrape():
    try:
        # Verify secret token if needed
        scraper = MBSScraper()
        scraper.update_database()
        return {"status": "success", "message": "Scraping completed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000))) 