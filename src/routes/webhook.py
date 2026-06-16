from fastapi import APIRouter

router = APIRouter()

@router.post("/webhook")
async def webhook_endpoint(data: dict):
    # Future placeholder for WhatsApp webhook
    return {"status": "received"}
