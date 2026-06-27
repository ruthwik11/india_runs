from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GROQ_API_KEY: str = "test-key"
    GROQ_MODEL: str = "llama-3.1-8b-instant"
    CHROMA_PERSISTENT_PATH: str = "./chroma_db"
    MYSCHEME_API_URL: str = "https://www.myscheme.gov.in/api/schemes"
    SUPPORTED_LANGUAGES: str = "en,hi,te,ta,kn,mr,ml,gu,or,pa,bn,ur,mni,as"

    # --- Firestore vector DB ---
    GCP_PROJECT_ID: str = "sarkarisaathi-687f1"
    FIRESTORE_DATABASE: str = "(default)"
    GOOGLE_APPLICATION_CREDENTIALS: str = ""   # path to service-account JSON (or use ADC)
    VECTOR_DISTANCE: str = "COSINE"            # COSINE | EUCLIDEAN | DOT_PRODUCT

    class Config:
        env_file = ".env"

settings = Settings()
