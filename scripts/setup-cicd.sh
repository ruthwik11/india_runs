#!/usr/bin/env bash
# One-time setup for keyless GitHub Actions -> GCP deploys (Workload Identity Federation).
# Run as a project Owner/admin:  gcloud auth login && ./scripts/setup-cicd.sh
# Idempotent: safe to re-run.
set -euo pipefail

PROJECT="sarkarisaathi-687f1"
PROJECT_NUM="525215721719"
REGION="asia-south1"
REPO="kalyanbandaru11/India_Runs"

POOL="github-pool"
PROVIDER="github-provider"
DEPLOY_SA="github-deployer@${PROJECT}.iam.gserviceaccount.com"
RUNTIME_SA="firebase-adminsdk-fbsvc@${PROJECT}.iam.gserviceaccount.com"

gcloud config set project "$PROJECT"

echo "== enable APIs =="
gcloud services enable iamcredentials.googleapis.com sts.googleapis.com \
  run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com \
  firebasehosting.googleapis.com

echo "== create deployer SA (ignore error if exists) =="
gcloud iam service-accounts create github-deployer \
  --display-name="GitHub Actions deployer" || true

echo "== grant deploy roles to deployer SA =="
for ROLE in roles/run.admin roles/cloudbuild.builds.editor roles/artifactregistry.admin \
            roles/storage.admin roles/iam.serviceAccountUser \
            roles/firebasehosting.admin roles/serviceusage.serviceUsageConsumer; do
  gcloud projects add-iam-policy-binding "$PROJECT" \
    --member="serviceAccount:${DEPLOY_SA}" --role="$ROLE" --condition=None >/dev/null
done

echo "== allow deployer SA to act as the Cloud Run runtime SA =="
gcloud iam service-accounts add-iam-policy-binding "$RUNTIME_SA" \
  --member="serviceAccount:${DEPLOY_SA}" --role="roles/iam.serviceAccountUser" >/dev/null

echo "== workload identity pool + provider (restricted to repo) =="
gcloud iam workload-identity-pools create "$POOL" --location=global \
  --display-name="GitHub Actions" || true
gcloud iam workload-identity-pools providers create-oidc "$PROVIDER" \
  --location=global --workload-identity-pool="$POOL" \
  --display-name="GitHub provider" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
  --attribute-condition="assertion.repository=='${REPO}'" || true

echo "== let the GitHub repo impersonate the deployer SA =="
gcloud iam service-accounts add-iam-policy-binding "$DEPLOY_SA" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUM}/locations/global/workloadIdentityPools/${POOL}/attribute.repository/${REPO}" >/dev/null

WIF_PROVIDER="projects/${PROJECT_NUM}/locations/global/workloadIdentityPools/${POOL}/providers/${PROVIDER}"

echo
echo "================ GitHub repo config (needs repo admin) ================"
echo "Variables:"
echo "  GCP_PROJECT  = ${PROJECT}"
echo "  GCP_REGION   = ${REGION}"
echo "  WIF_PROVIDER = ${WIF_PROVIDER}"
echo "  DEPLOY_SA    = ${DEPLOY_SA}"
echo "  RUNTIME_SA   = ${RUNTIME_SA}"
echo "Secret:"
echo "  GROQ_API_KEY = <your groq key>"
echo
echo "If you have gh admin on the repo, set them with:"
cat <<EOF
  gh variable set GCP_PROJECT  --repo ${REPO} --body "${PROJECT}"
  gh variable set GCP_REGION   --repo ${REPO} --body "${REGION}"
  gh variable set WIF_PROVIDER --repo ${REPO} --body "${WIF_PROVIDER}"
  gh variable set DEPLOY_SA    --repo ${REPO} --body "${DEPLOY_SA}"
  gh variable set RUNTIME_SA   --repo ${REPO} --body "${RUNTIME_SA}"
  gh secret   set GROQ_API_KEY --repo ${REPO} --body "<your groq key>"
EOF
echo "======================================================================"
