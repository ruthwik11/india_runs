from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes import chat, health, webhook
from src.database.chroma_client import init_chroma

app = FastAPI(title="SarkariSaathi Backend")

# Allow frontend to call you
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    """Index all schemes on startup"""
    await init_chroma()

# Mount routes
app.include_router(health.router)
app.include_router(chat.router)
app.include_router(webhook.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
