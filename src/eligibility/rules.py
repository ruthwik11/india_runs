import json
import os

def load_schemes_data():
    schemes_path = os.path.join(os.path.dirname(__file__), '..', 'database', 'schemes.json')
    if not os.path.exists(schemes_path):
        return []
    with open(schemes_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_raw_scheme(scheme_id: str) -> dict:
    schemes = load_schemes_data()
    for s in schemes:
        if s.get("scheme_id") == scheme_id:
            return s
    return {}

def check_eligibility(scheme_id: str, profile: dict) -> bool:
    """Strict eligibility check. If False, scheme is dropped completely."""
    scheme = get_raw_scheme(scheme_id)
    if not scheme:
        return False
        
    rules = scheme.get("eligibility_rules", {})
    if not rules:
        return True # no rules, everyone is eligible
        
    # Example strict checks
    if rules.get("has_land") and not profile.get("has_land"):
        return False
        
    if rules.get("is_disabled") and not profile.get("is_disabled"):
        return False
        
    return True

def check_income_match(scheme: dict, profile: dict) -> bool:
    """Soft check for income points"""
    return True # simplistic for now

def check_occupation_match(scheme: dict, profile: dict) -> bool:
    """Soft check for occupation points"""
    raw_scheme = get_raw_scheme(scheme.get("scheme_id", ""))
    rules = raw_scheme.get("eligibility_rules", {})
    occupations = rules.get("occupations", ["all"])
    
    if "all" in occupations:
        return True
        
    return profile.get("occupation", "").lower() in [o.lower() for o in occupations]

def check_state_match(scheme: dict, profile: dict) -> bool:
    """Soft check for state points"""
    raw_scheme = get_raw_scheme(scheme.get("scheme_id", ""))
    states = raw_scheme.get("state_list", ["all"])
    
    if "all" in states:
        return True
        
    return profile.get("state", "").lower() in [s.lower() for s in states]

def check_other_factors(scheme: dict, profile: dict) -> bool:
    """Other minor factors"""
    return True
