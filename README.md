# Temper

An adaptive coding workspace that retrieves a developer's preferences and project context before every AI response.

## Run locally

```bash
npm install
npm run dev
```

The interface runs with realistic demo data by default. To enable persistent memory, copy `.env.example` to `.env`, add a MongoDB Atlas connection string, then start the API separately:

```bash
npm run dev:server
```

Create a vector-search index named `developer_memory` on the `preferences.embedding` field. The response pipeline calls `POST /api/context/retrieve` before generation, while feedback is recorded through `POST /api/feedback`. Explicit “Remember this” feedback is promoted immediately; accepted and edited suggestions are retained as evidence until they pass a confidence threshold; rejected suggestions are never converted directly into preferences.

WebSocket clients connect at `/workspace` and receive `profile.updated` events for live workspace refreshes.
