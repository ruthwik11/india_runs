def transform_scheme(raw_scheme: dict) -> dict:
    """Transform external API schema into our internal schema"""
    return {
        "scheme_id": raw_scheme.get("id", ""),
        "name": raw_scheme.get("name", ""),
        "description": raw_scheme.get("description", ""),
        "benefit_amount": raw_scheme.get("funding", "Varies"),
        "eligibility_rules": raw_scheme.get("eligibility", {}),
        "state_list": raw_scheme.get("applicable_states", ["all"])
    }
