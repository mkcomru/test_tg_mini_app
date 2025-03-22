import asyncio
from fastapi import FastAPI
from contextlib import asynccontextmanager

from backend.app.database.connection import init_db, close_db
from backend.app.bot import setup_bot

bot_task = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global bot_task
    
    await init_db()
    
    bot_task = asyncio.create_task(setup_bot())
    
    yield
    
    if bot_task:
        bot_task.cancel()
    
    await close_db()

app = FastAPI(lifespan=lifespan)


@app.get("/")
async def root():
    return {"message": "Birthday WebApp API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
