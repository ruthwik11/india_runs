from typing import TypedDict

class AgentState(TypedDict):
    user_id: str
    language: str
    profile: dict
    message: str | None
    matched_schemes: list
    response: dict

def standardize_state_name(state_name: str) -> str:
    """Basic standardization of state names"""
    return state_name.strip().title()

def get_state_portal_link(scheme_id: str, state_name: str) -> str:
    """Mock database lookup for state-specific portals"""
    # In a real app, you'd look this up in a DB table
    state_normalized = state_name.lower().replace(" ", "")
    return f"https://{state_normalized}.gov.in/apply/{scheme_id}"

async def normalize_profile(state: AgentState) -> AgentState:
    """Validate and standardize profile fields"""
    profile = state["profile"]
    
    # Check required fields
    required = ["age", "monthly_income", "state", "occupation", "family_size"]
    for field in required:
        if field not in profile:
            raise ValueError(f"Missing field: {field}")
    
    # Standardize state name (handle typos, case sensitivity)
    state["profile"]["state"] = standardize_state_name(profile["state"])
    
    return state

async def match_schemes(state: AgentState) -> AgentState:
    """Query ChromaDB + apply eligibility rules"""
    from src.eligibility.matcher import match_schemes_for_profile
    
    matched = match_schemes_for_profile(
        profile=state["profile"],
        language=state["language"],
        top_k=20  # Return top 20
    )
    
    state["matched_schemes"] = matched
    return state

async def generate_response(state: AgentState) -> AgentState:
    """Use Groq to create friendly, localized output or answer questions"""
    from src.llm.groq_client import generate_summary
    
    LANGUAGE_MAP = {
        "en": "English", "hi": "Hindi", "te": "Telugu", "ta": "Tamil", 
        "kn": "Kannada", "mr": "Marathi", "ml": "Malayalam", "gu": "Gujarati", 
        "or": "Odia", "pa": "Punjabi", "bn": "Bengali", "ur": "Urdu", 
        "mni": "Manipuri", "as": "Assamese"
    }
    full_language = LANGUAGE_MAP.get(state["language"], "English")

    summary = generate_summary(
        schemes=state["matched_schemes"],
        profile=state["profile"],
        language=full_language,
        message=state.get("message")
    )
    
    state["response"] = {
        "schemes": state["matched_schemes"],
        "total_matched": len(state["matched_schemes"]),
        "summary_en": summary["en"],
        "summary_local": summary.get("local", summary["en"])
    }
    
    return state

async def locate_portals(state: AgentState) -> AgentState:
    """Add state-specific portal links"""
    state_name = state["profile"]["state"]
    
    for scheme in state["response"]["schemes"]:
        # Fetch state-specific application portal
        scheme["apply_link"] = get_state_portal_link(scheme["scheme_id"], state_name)
        scheme["state_specific"] = state_name
    
    return state
