from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Union
from src.agent.graph import run_agent

router = APIRouter()

class UserProfile(BaseModel):
    age: str  # "25-35" | "35-50" | "50-60" | "60+"
    monthly_income: Union[str, int]  # User inputs raw number like 15000
    state: str  # "Andhra Pradesh" etc
    occupation: str  # "farmer" | "student" | "laborer" | etc
    caste: str  # "General" | "OBC" | "SC" | "ST" | "Minority"
    family_size: int = 1
    has_land: bool = False
    land_size_acres: float = 0.0
    is_disabled: bool = False
    is_widow: bool = False
    is_rural: bool = True

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
        LANGUAGE_MAP = {
            "en": "English", "hi": "Hindi", "te": "Telugu", "ta": "Tamil", 
            "kn": "Kannada", "mr": "Marathi", "ml": "Malayalam", "gu": "Gujarati", 
            "or": "Odia", "pa": "Punjabi", "bn": "Bengali", "ur": "Urdu", 
            "mni": "Manipuri", "as": "Assamese"
        }
        full_language = LANGUAGE_MAP.get(request.language, "English")
        
        # Run agent graph
        result = await run_agent(
            user_id=request.user_id,
            language=full_language,
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
