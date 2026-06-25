# SarkariSaathi — Government Schemes Discovery AI

An AI assistant that finds what the government already owes you.

## Quick Start

```bash
docker-compose up
```
Frontend: http://localhost:3000
Backend: http://localhost:8000/health

## Structure
`backend/` — Dev 1's Python FastAPI + LangGraph agent
`frontend/` — Dev 2's React web UI

## First-Time Setup
1. Add your `.env` file (see `.env.example`)
2. Run `docker-compose up`
3. Frontend waits for backend to be healthy
4. Test on http://localhost:3000
