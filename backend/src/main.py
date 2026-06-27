from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes import chat, health, webhook
from src.database.firestore_client import init_firestore

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
    """Warm up Firestore client + embedder"""
    asyncio.create_task(init_firestore())

# Mount routes at root AND under /api (Firebase Hosting rewrites /api/** -> Cloud Run)
for _r in (health.router, chat.router, webhook.router):
    app.include_router(_r)
    app.include_router(_r, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
