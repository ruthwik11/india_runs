import chromadb
from chromadb.utils.embedding_functions import DefaultEmbeddingFunction
import json
import os
from src.config import settings

# Global client
chroma_client = None
embedding_model = None

async def init_chroma():
    """Initialize ChromaDB and load all schemes"""
    global chroma_client, embedding_model
    
    # Init ChromaDB (persistent)
    chroma_client = chromadb.PersistentClient(path=settings.CHROMA_PERSISTENT_PATH)
    
    # Init embedding model
    embedding_model = DefaultEmbeddingFunction()
    
    # Check if schemes.json exists
    schemes_path = os.path.join(os.path.dirname(__file__), 'schemes.json')
    if not os.path.exists(schemes_path):
        # We will create an empty list or ignore if missing, pipeline will populate
        return

    # Load schemes from schemes.json
    with open(schemes_path, 'r', encoding='utf-8') as f:
        schemes = json.load(f)
    
    # Create/get collections for each language
    for lang in settings.SUPPORTED_LANGUAGES.split(","):
        collection = chroma_client.get_or_create_collection(
            name=f"schemes_{lang}",
            metadata={"language": lang}
        )
        
        # Check if already populated to avoid re-indexing every startup
        if collection.count() > 0:
            continue
            
        # Index schemes
        for scheme in schemes:
            doc_text = f"{scheme.get('name', '')} {scheme.get('description', '')} {scheme.get('benefit_amount', '')}"
            
            collection.add(
                ids=[scheme['scheme_id']],
                documents=[doc_text],
                embeddings=[embedding_model([doc_text])[0]],
                metadatas=[{
                    "scheme_id": scheme['scheme_id'],
                    "name": scheme.get('name', ''),
                    "benefit_amount": scheme.get('benefit_amount', ''),
                    "state_list": json.dumps(scheme.get('state_list', ['all']))
                }]
            )

def query_schemes(query_text: str, language: str, top_k: int = 10):
    """Semantic search for schemes"""
    if not chroma_client:
        raise Exception("ChromaDB not initialized")
        
    collection = chroma_client.get_collection(f"schemes_{language}")
    
    query_embedding = embedding_model([query_text])[0]
    
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    
    return results

def get_scheme_details(scheme_id: str, language: str) -> dict:
    """Fetch full scheme details from JSON by ID"""
    schemes_path = os.path.join(os.path.dirname(__file__), 'schemes.json')
    if not os.path.exists(schemes_path):
        return {}
        
    with open(schemes_path, 'r', encoding='utf-8') as f:
        schemes = json.load(f)
        
    for scheme in schemes:
        if scheme.get("scheme_id") == scheme_id:
            return {
                "scheme_id": scheme_id,
                "name_en": scheme.get("name", "Unknown Scheme"),
                "name_local": scheme.get("name", "Unknown Scheme"), # In reality this would be translated
                "benefit_amount": scheme.get("benefit_amount", "Varies"),
                "eligibility_match_score": 0.0,
                "required_documents": scheme.get("required_documents", ["Aadhaar", "Bank Account"]),
                "steps_to_apply": scheme.get("steps_to_apply", [
                    {"step": 1, "action_en": "Register online", "action_local": "Register online", "link": None}
                ]),
                "apply_link": "",
                "state_specific": "",
                "contact": {"Toll-free": "1800-000-0000"}
            }
    
    return {}
