"""
Firestore (Native mode) vector-search client.

Drop-in replacement for chroma_client: same public functions / return shapes,
but semantic search runs against Firestore KNN (find_nearest) over the
`schemes_<lang>` collections that were migrated from ChromaDB.

Embeddings reuse ChromaDB's DefaultEmbeddingFunction (all-MiniLM-L6-v2, 384-dim)
so query vectors are byte-for-byte compatible with the stored vectors.
"""
import json
import os

from src.config import settings

_db = None
_embedder = None


def _get_embedder():
    """Lazy singleton MiniLM-L6-v2 embedder (same model used to build the DB)."""
    global _embedder
    if _embedder is None:
        from chromadb.utils.embedding_functions import DefaultEmbeddingFunction
        _embedder = DefaultEmbeddingFunction()
    return _embedder


def _get_db():
    """
    Lazy singleton Firestore client. Auth resolution order:
      1. GOOGLE_APPLICATION_CREDENTIALS_JSON env (inline JSON — handy on Render/Cloud Run)
      2. GOOGLE_APPLICATION_CREDENTIALS path (env or settings)
      3. Application Default Credentials (gcloud / metadata server)
    """
    global _db
    if _db is None:
        from google.cloud import firestore

        project = settings.GCP_PROJECT_ID or None
        database = settings.FIRESTORE_DATABASE

        inline = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
        if inline:
            from google.oauth2 import service_account
            info = json.loads(inline)
            creds = service_account.Credentials.from_service_account_info(info)
            _db = firestore.Client(project=project or info.get("project_id"),
                                   database=database, credentials=creds)
        else:
            if settings.GOOGLE_APPLICATION_CREDENTIALS and not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
                os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = settings.GOOGLE_APPLICATION_CREDENTIALS
            _db = firestore.Client(project=project, database=database)
    return _db


def embed(text: str):
    """Return a 384-dim python float list for a single string."""
    return [float(x) for x in _get_embedder()([text])[0]]


async def init_firestore():
    """Warm up embedder + client at startup. Non-fatal so the app still boots."""
    try:
        _get_embedder()
        _get_db()
        print("[firestore] client + embedder ready")
    except Exception as e:                       # noqa: BLE001
        print(f"[firestore] init warning (will retry on first query): {e}")


def query_schemes(query_text: str, language: str, top_k: int = 10):
    """
    Semantic search via Firestore KNN. Returns ChromaDB-compatible shape:
        {"ids": [[...]], "documents": [[...]], "metadatas": [[...]]}
    """
    from google.cloud.firestore_v1.vector import Vector
    from google.cloud.firestore_v1.base_vector_query import DistanceMeasure

    db = _get_db()
    qvec = Vector(embed(query_text))
    measure = getattr(DistanceMeasure, settings.VECTOR_DISTANCE.upper(), DistanceMeasure.COSINE)

    snaps = (
        db.collection(f"schemes_{language}")
          .find_nearest("embedding", qvec, distance_measure=measure, limit=top_k)
          .get()
    )

    ids, docs, metas = [], [], []
    for s in snaps:
        d = s.to_dict() or {}
        ids.append(s.id)
        docs.append(d.get("document", ""))
        metas.append({
            "scheme_id": d.get("scheme_id", s.id),
            "name": d.get("name", ""),
            "benefit_amount": d.get("benefit_amount", ""),
            "state_list": json.dumps(d.get("state_list", ["all"])),
        })

    return {"ids": [ids], "documents": [docs], "metadatas": [metas]}


def get_scheme_details(scheme_id: str, language: str) -> dict:
    """Fetch full scheme details from the bundled schemes.json by ID (unchanged)."""
    schemes_path = os.path.join(os.path.dirname(__file__), "schemes.json")
    if not os.path.exists(schemes_path):
        return {}

    with open(schemes_path, "r", encoding="utf-8") as f:
        schemes = json.load(f)

    for scheme in schemes:
        if scheme.get("scheme_id") == scheme_id:
            return {
                "scheme_id": scheme_id,
                "name_en": scheme.get("name", "Unknown Scheme"),
                "name_local": scheme.get("name", "Unknown Scheme"),
                "benefit_amount": scheme.get("benefit_amount", "Varies"),
                "eligibility_match_score": 0.0,
                "required_documents": scheme.get("required_documents", ["Aadhaar", "Bank Account"]),
                "steps_to_apply": scheme.get("steps_to_apply", [
                    {"step": 1, "action_en": "Register online", "action_local": "Register online", "link": None}
                ]),
                "apply_link": "",
                "state_specific": "",
                "contact": {"Toll-free": "1800-000-0000"},
            }

    return {}
