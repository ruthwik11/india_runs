import requests
import json
import os
from src.config import settings
from src.data_pipeline.transformer import transform_scheme

def fetch_schemes_from_myscheme():
    """Fetch from MyScheme.gov.in API"""
    # Note: Using mock endpoint if real one doesn't work for scraping purposes
    # For robust pipeline, we simulate or wrap in try-except.
    try:
        response = requests.get(settings.MYSCHEME_API_URL, params={"state": "all"}, timeout=10)
        response.raise_for_status()
        schemes = response.json()
    except Exception as e:
        print(f"Failed to fetch from {settings.MYSCHEME_API_URL}: {e}")
        print("Using local mock data instead for demonstration.")
        return 0
    
    # Transform to our schema
    transformed = []
    for scheme in schemes:
        transformed.append(transform_scheme(scheme))
    
    # Save to schemes.json
    schemes_path = os.path.join(os.path.dirname(__file__), '..', 'database', 'schemes.json')
    with open(schemes_path, 'w', encoding='utf-8') as f:
        json.dump(transformed, f, indent=2)
    
    return len(transformed)

if __name__ == "__main__":
    count = fetch_schemes_from_myscheme()
    print(f"Indexed {count} schemes")
