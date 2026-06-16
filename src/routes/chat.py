from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from src.agent.graph import run_agent

router = APIRouter()

class UserProfile(BaseModel):
    age: str  # "25-35" | "35-50" | "50-60" | "60+"
    monthly_income: str  # "0-10k" | "10-25k" | "25-50k" | "50k+"
    state: str  # "Andhra Pradesh" etc
    occupation: str  # "farmer" | "student" | "laborer" | etc
    family_size: int
    caste: str  # "general" | "obc" | "sc" | "st" | "minority"
    has_land: bool
    land_size_acres: float
    is_disabled: bool
    is_widow: bool
    is_rural: bool

class ChatRequest(BaseModel):
    user_id: str
    language: str  # "en" | "hi" | "te" | "ta" | "kn"
    profile: UserProfile
    message: Optional[str] = None

class SchemeStep(BaseModel):
    step: int
    action_en: str
    action_local: str
    link: Optional[str] = None

class Scheme(BaseModel):
    scheme_id: str
    name_en: str
    name_local: str
    benefit_amount: str
    eligibility_match_score: float
    required_documents: list[str]
    steps_to_apply: list[SchemeStep]
    apply_link: str
    state_specific: str
    contact: dict

class ChatResponse(BaseModel):
    status: str  # "success" | "error"
    user_id: str
    language: str
    response_type: str  # "profile_confirmation" | "schemes_list" | "scheme_detail" | "error"
    data: Optional[dict]  # { "schemes": [...], "total_matched": X, "summary_en": "...", "summary_local": "..." }
    error_message: Optional[str] = None

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest) -> ChatResponse:
    """
    Main endpoint. Takes user profile, returns matched schemes.
    """
    try:
        # Validate profile
        if request.profile.monthly_income not in ["0-10k", "10-25k", "25-50k", "50k+"]:
            raise ValueError("Invalid income bracket")
        
        # Run agent graph
        result = await run_agent(
            user_id=request.user_id,
            language=request.language,
            profile=request.profile.model_dump(), # pydantic v2
            message=request.message
        )
        
        return ChatResponse(
            status="success",
            user_id=request.user_id,
            language=request.language,
            response_type="schemes_list",
            data=result,
            error_message=None
        )
    
    except Exception as e:
        return ChatResponse(
            status="error",
            user_id=request.user_id,
            language=request.language,
            response_type="error",
            data=None,
            error_message=str(e)
        )
