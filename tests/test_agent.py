import pytest
from src.agent.graph import normalize_profile, AgentState

@pytest.mark.asyncio
async def test_normalize_profile():
    state = AgentState(
        user_id="123",
        language="en",
        profile={
            "age": "25-35",
            "monthly_income": "10-25k",
            "state": "andhra pradesh",
            "occupation": "farmer",
            "family_size": 4
        },
        message=None,
        matched_schemes=[],
        response={}
    )
    
    new_state = await normalize_profile(state)
    assert new_state["profile"]["state"] == "Andhra Pradesh"
    
@pytest.mark.asyncio
async def test_normalize_profile_missing_field():
    state = AgentState(
        user_id="123",
        language="en",
        profile={
            "age": "25-35",
            # missing income
            "state": "andhra pradesh",
            "occupation": "farmer",
            "family_size": 4
        },
        message=None,
        matched_schemes=[],
        response={}
    )
    
    with pytest.raises(ValueError):
        await normalize_profile(state)
