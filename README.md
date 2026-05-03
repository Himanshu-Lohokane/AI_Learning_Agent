# AI Learning Assistant (Mini)

This is a minimal Next.js app that generates a simplified explanation, key points and a short quiz for a given topic and grade level using an LLM.

Setup

1. Copy `.env.example` to `.env.local` and set `OPENAI_API_KEY`.

2. Install deps and run:

```bash
npm install
npm run dev
```

API

- `POST /api/generate` accepts `{topic, grade}` and returns JSON:

```
{ summary, originalSummary, keyPoints, quiz }
```

Notes

- The app saves the last 3 searches in localStorage.
- Toggle between simplified and normal summary in the UI.
