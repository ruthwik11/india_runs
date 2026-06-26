from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes import chat, health, webhook
from src.database.chroma_client import init_chroma

app = FastAPI(title="SarkariSaathi Backend")

import os

origins_env = os.getenv("CORS_ORIGINS", "*")
origins = [origin.strip() for origin in origins_env.split(",")] if origins_env != "*" else ["*"]

# Allow frontend to call you
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

import asyncio

@app.on_event("startup")
async def startup():
    """Index all schemes on startup"""
    asyncio.create_task(init_chroma())

# Mount routes
app.include_router(health.router)
app.include_router(chat.router)
app.include_router(webhook.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
