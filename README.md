# SarkariSaathi Backend

AI-powered scheme eligibility matching engine.

## Setup
1. `python -m venv venv`
2. `source venv/bin/activate` or `venv\Scripts\activate` on Windows
3. `pip install -r requirements.txt`
4. Copy `.env.example` to `.env` and add your GROQ API key.

## Data Pipeline
Fetch schemes from MyScheme.gov.in:
`python -m src.data_pipeline.myscheme_scraper`

## Run
`python src/main.py`
Server starts on http://localhost:8000

## API
POST `/chat` with JSON profile.
