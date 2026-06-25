import json
from groq import Groq
from src.config import settings
from src.agent.prompts import get_summary_prompt, get_qa_prompt

# Allow graceful failure if API key is test key
client = None
if settings.GROQ_API_KEY != "test-key" and settings.GROQ_API_KEY:
    client = Groq(api_key=settings.GROQ_API_KEY)

def generate_summary(schemes: list, profile: dict, language: str, message: str = None) -> dict:
    """Use Groq to create user-friendly summary or answer specific questions"""
    if not schemes and not message:
        fallback_msgs = {
            "en": "No schemes found for your profile.", 
            "hi": "आपकी प्रोफ़ाइल के लिए कोई योजना नहीं मिली।",
            "te": "మీ ప్రొఫైల్ కోసం ఎటువంటి పథకాలు కనుగొనబడలేదు.",
            "kn": "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ಗಾಗಿ ಯಾವುದೇ ಯೋಜನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
            "ta": "உங்கள் சுயவிவரத்திற்கான திட்டங்கள் எதுவும் கிடைக்கவில்லை.",
            "ml": "നിങ്ങളുടെ പ്രൊഫൈലുമായി പൊരുത്തപ്പെടുന്ന പദ്ധതികളൊന്നും കണ്ടെത്തിയില്ല.",
            "mr": "तुमच्या प्रोफाइलसाठी कोणतीही योजना आढळली नाही."
        }
        return {
            "en": fallback_msgs["en"],
            language: fallback_msgs.get(language, "No schemes found for your profile.")
        }
        
    if message and message.strip():
        prompt = get_qa_prompt(schemes, profile, language, message)
    else:
        prompt = get_summary_prompt(schemes, profile, language)
    
    if not client:
        # Fallback if no valid key
        if message:
             return {
                 "en": "I am operating in offline mode, but based on your profile, you are eligible for several schemes.",
                 language: "Offline mode: Eligible for several schemes."
             }
        return {
            "en": f"You qualify for {len(schemes)} government schemes worth exploring.",
            language: f"Offline mode: You qualify for {len(schemes)} government schemes."
        }
    
    try:
        completion = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            max_tokens=800,
            response_format={"type": "json_object"},
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        response_text = completion.choices[0].message.content
        
        try:
            parsed = json.loads(response_text)
            return {
                "en": parsed.get("en", "Error: Missing English text"),
                language: parsed.get("local", parsed.get("en", "Error: Missing translation text"))
            }
        except json.JSONDecodeError:
            clean_text = response_text.replace("```json", "").replace("```", "").strip()
            try:
                parsed = json.loads(clean_text)
                return {
                    "en": parsed.get("en", "Error: Missing English text"),
                    language: parsed.get("local", parsed.get("en", "Error: Missing translation text"))
                }
            except:
                return {
                    "en": clean_text,
                    language: clean_text
                }
    except Exception as e:
        print(f"Groq API Error: {e}")
        return {
            "en": f"You qualify for {len(schemes)} government schemes.",
            language: f"Fallback: You qualify for {len(schemes)} government schemes."
        }
