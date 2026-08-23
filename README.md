# Temper

An adaptive coding workspace that retrieves a developer's preferences and project context before every AI response. Developers can also choose an AI character for the session.

## Run locally

```bash
npm install
npm run dev
```

The interface runs with realistic demo data by default. To enable persistent memory, create a Firebase project with Cloud Firestore, copy `.env.example` to `.env`, add Firebase Admin credentials, then start the API separately:

```bash
npm run dev:server
```

The response pipeline calls `POST /api/context/retrieve` before generation and ranks relevant global and project preferences from Firestore. Feedback is recorded through `POST /api/feedback`. Explicit “Remember this” feedback is promoted immediately; accepted and edited suggestions are retained as evidence until they pass a confidence threshold; rejected suggestions are never converted directly into preferences.

WebSocket clients connect at `/workspace` and receive `profile.updated` events for live workspace refreshes. Character selection controls tone while Firestore preferences control technical decisions.
