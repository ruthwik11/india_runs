from src.database.chroma_client import query_schemes, get_scheme_details
from src.eligibility.rules import (
    check_eligibility,
    check_income_match,
    check_occupation_match,
    check_state_match,
    check_other_factors
)

def calculate_match_score(scheme: dict, profile: dict) -> float:
    """
    Score how well user matches scheme (0-1).
    Factors: income match, state match, occupation match, etc.
    """
    score = 0.0
    max_score = 0.0
    
    # Income match (40 points)
    if check_income_match(scheme, profile):
        score += 40
    max_score += 40
    
    # Occupation match (30 points)
    if check_occupation_match(scheme, profile):
        score += 30
    max_score += 30
    
    # State match (20 points)
    if check_state_match(scheme, profile):
        score += 20
    max_score += 20
    
    # Other factors (10 points)
    if check_other_factors(scheme, profile):
        score += 10
    max_score += 10
    
    return score / max_score if max_score > 0 else 0.0

def match_schemes_for_profile(profile: dict, language: str, top_k: int = 20):
    """
    Two-stage matching:
    1. Semantic search (broad)
    2. Rule-based filtering (strict)
    """
    
    # Stage 1: Semantic search
    query = f"{profile.get('occupation')} {profile.get('state')} {profile.get('age')}"
    semantic_results = query_schemes(query, language, top_k=50)
    
    if not semantic_results or not semantic_results['ids'] or len(semantic_results['ids'][0]) == 0:
        return []
        
    # Stage 2: Rule-based filtering
    matched = []
    for scheme_id in semantic_results['ids'][0]:
        if check_eligibility(scheme_id, profile):
            # Fetch full scheme details
            scheme_data = get_scheme_details(scheme_id, language)
            
            if scheme_data:
                # Calculate match score (0-1)
                score = calculate_match_score(scheme_data, profile)
                scheme_data['eligibility_match_score'] = score
                
                matched.append(scheme_data)
    
    # Sort by match score (descending)
    matched = sorted(matched, key=lambda x: x['eligibility_match_score'], reverse=True)
    
    return matched[:top_k]
