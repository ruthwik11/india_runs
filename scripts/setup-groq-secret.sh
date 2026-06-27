#!/usr/bin/env bash
# Store the Groq API key in Secret Manager and let Cloud Run's runtime SA read it.
# Usage:  GROQ_API_KEY=gsk_xxx ./scripts/setup-groq-secret.sh
# Idempotent.
set -euo pipefail

PROJECT="sarkarisaathi-687f1"
RUNTIME_SA="firebase-adminsdk-fbsvc@${PROJECT}.iam.gserviceaccount.com"
SECRET="groq-api-key"

: "${GROQ_API_KEY:?set GROQ_API_KEY env var}"

gcloud config set project "$PROJECT"
gcloud services enable secretmanager.googleapis.com

# create secret if missing
if ! gcloud secrets describe "$SECRET" >/dev/null 2>&1; then
  gcloud secrets create "$SECRET" --replication-policy=automatic
fi

# add a new version with the current key
printf '%s' "$GROQ_API_KEY" | gcloud secrets versions add "$SECRET" --data-file=-

# let the Cloud Run runtime SA read it
gcloud secrets add-iam-policy-binding "$SECRET" \
  --member="serviceAccount:${RUNTIME_SA}" \
  --role="roles/secretmanager.secretAccessor" >/dev/null

echo "OK: secret '$SECRET' set and readable by ${RUNTIME_SA}"
