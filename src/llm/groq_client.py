from groq import Groq
from src.config import settings
from src.agent.prompts import get_summary_prompt

# Allow graceful failure if API key is test key
client = None
if settings.GROQ_API_KEY != "test-key" and settings.GROQ_API_KEY:
    client = Groq(api_key=settings.GROQ_API_KEY)

def generate_summary(schemes: list, profile: dict, language: str) -> dict:
    """Use Groq to create user-friendly summary"""
    if not schemes:
        return {"en": "No schemes found for your profile.", language: "మీ ప్రొఫైల్ కోసం ఎటువంటి పథకాలు కనుగొనబడలేదు."}
        
    scheme_names = ", ".join([s.get('name_en', '') for s in schemes[:5]])
    
    prompt = get_summary_prompt(scheme_names, profile, language)
    
    if not client:
        # Fallback if no valid key
        return {
            "en": f"You qualify for {len(schemes)} government schemes worth exploring.",
            language: f"మీరు {len(schemes)} ప్రభుత్వ పథకాలకు అర్హులు."
        }
    
    try:
        message = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            max_tokens=300,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        response_text = message.choices[0].message.content
        
        # Simple parsing based on expected prompt output format
        parts = response_text.split("|--|")
        if len(parts) == 2:
            return {
                "en": parts[0].strip(),
                language: parts[1].strip()
            }
        else:
            # Fallback
            return {
                "en": response_text[:150],
                language: response_text[150:]
            }
    except Exception as e:
        print(f"Groq API Error: {e}")
        return {
            "en": f"You qualify for {len(schemes)} government schemes.",
            language: f"మీరు {len(schemes)} ప్రభుత్వ పథకాలకు అర్హులు."
        }
