FROM python:3.11-slim

WORKDIR /app

# build deps for onnxruntime / native wheels
RUN apt-get update && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the MiniLM-L6-v2 ONNX model into the image so Cloud Run
# cold starts don't fetch ~79MB on the first request.
RUN python -c "from chromadb.utils.embedding_functions import DefaultEmbeddingFunction as D; D()(['warmup'])"

# Copy source code
COPY . .

# Cloud Run injects PORT (default 8080); fall back to 8080 locally.
ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
