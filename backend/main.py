import asyncio
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from backend.app.database.connection import init_db, close_db
from backend.app.bot import setup_bot
from backend.app.api.router import api_router

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    print(f"ERROR: {str(exc)}")
    print(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)}
    )

app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Birthday WebApp API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
