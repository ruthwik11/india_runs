# Prompts file, we may use this to store larger prompts later.
# Currently groq_client holds the main prompt.

def get_summary_prompt(scheme_names: str, profile: dict, language: str) -> str:
    return f"""
    A user in {profile['state']} who is a {profile['occupation']} qualifies for these schemes:
    {scheme_names}
    
    Generate a friendly summary in both English and {language} saying why they qualify and what benefits await.
    The response format MUST be exactly:
    [English Translation]
    |--|
    [{language} Translation]
    """
