# Firestore vector DB — backend setup

Semantic search now runs against **Firestore (Native mode) KNN** instead of a local
ChromaDB store. Data lives in project `sarkarisaathi-687f1`, collections
`schemes_<lang>` (en, hi, te, ta, kn, mr, ml, gu, or, pa, bn, ur, mni, as), each doc
carrying a 384-dim `embedding` Vector field with a vector index.

## How it connects
```
frontend (axios)  ->  backend /chat  ->  matcher.query_schemes()
                                          -> firestore_client.find_nearest()  -> Firestore
```
- `backend/src/database/firestore_client.py` — the client (drop-in for the old chroma_client).
- Query embeddings use ChromaDB's `DefaultEmbeddingFunction` (all-MiniLM-L6-v2, 384-dim),
  the **same** model the stored vectors were built with — required or KNN results are wrong.
- Full scheme details (documents, steps) still come from `database/schemes.json`.
- Frontend needs **no** Firebase code; the DB is server-side only.

## Run locally
```bash
cd backend
pip install -r requirements.txt
export GOOGLE_APPLICATION_CREDENTIALS=/abs/path/to/firebase-sa.json
export GCP_PROJECT_ID=sarkarisaathi-687f1
uvicorn src.main:app --reload --port 8000
```

## Run with docker-compose (from repo root)
```bash
# point SA_KEY_PATH at your service-account JSON, then:
SA_KEY_PATH=/abs/path/to/firebase-sa.json GROQ_API_KEY=xxx docker-compose up
```
The key is mounted read-only at `/app/secrets/firebase-sa.json` inside the container.

## Deploy on Render
`render.yaml` already declares the env vars. In the Render dashboard set (sync:false):
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` = the **entire** service-account JSON (one line)
- `GROQ_API_KEY`

The client auto-detects inline JSON, so no file is needed on Render.

## Config knobs (env / src/config.py)
| var | default | meaning |
|---|---|---|
| `GCP_PROJECT_ID` | sarkarisaathi-687f1 | Firebase/GCP project |
| `FIRESTORE_DATABASE` | (default) | Firestore database id |
| `GOOGLE_APPLICATION_CREDENTIALS` | "" | path to SA JSON (or use ADC) |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | "" | inline SA JSON (Render/Cloud Run) |
| `VECTOR_DISTANCE` | COSINE | COSINE \| EUCLIDEAN \| DOT_PRODUCT |

## ⚠️ Security
Never commit the service-account JSON. `.gitignore` already blocks `secrets/`,
`*firebase-adminsdk*.json`, `*-sa.json`, etc. Rotate keys in the Firebase console
(Project settings → Service accounts) if one leaks.
