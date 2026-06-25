from langgraph.graph import StateGraph, START, END
from typing import TypedDict
from src.agent.nodes import (
    normalize_profile,
    match_schemes,
    generate_response,
    locate_portals
)

class AgentState(TypedDict):
    user_id: str
    language: str
    profile: dict
    message: str | None
    matched_schemes: list
    response: dict

def build_agent():
    """Build the 4-node LangGraph workflow"""
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("normalize", normalize_profile)
    workflow.add_node("match", match_schemes)
    workflow.add_node("generate", generate_response)
    workflow.add_node("locate", locate_portals)
    
    # Connect in sequence
    workflow.add_edge(START, "normalize")
    workflow.add_edge("normalize", "match")
    workflow.add_edge("match", "generate")
    workflow.add_edge("generate", "locate")
    workflow.add_edge("locate", END)
    
    return workflow.compile()

agent = build_agent()

async def run_agent(user_id: str, language: str, profile: dict, message: str | None):
    """Execute the agent and return schemes"""
    state = AgentState(
        user_id=user_id,
        language=language,
        profile=profile,
        message=message,
        matched_schemes=[],
        response={}
    )
    
    final_state = await agent.ainvoke(state)
    return final_state["response"]
