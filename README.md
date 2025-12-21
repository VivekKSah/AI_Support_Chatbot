---

# AI Live Chat Support

A simple customer support chatbot with persistent sessions and AI-powered responses using **Google GenAI (Gemini 2.5 Flash)**. The frontend is built with React + TypeScript, and the backend uses Express + TypeScript with PostgreSQL for persistence.

---

## Features

* Persistent chat sessions across page reloads (via `localStorage` and session IDs)
* Full conversation history fetching from backend
* Basic guardrails:

  * Input validation (empty messages, length limits)
  * Prompt grounding using store FAQ context
  * Limited conversational context (last 8 messages)
  * Graceful LLM error handling
* Responsive frontend UI with auto-scrolling and modern message bubbles

---

## Assumptions

* Users are anonymous; session is identified only via `sessionId` stored in `localStorage`.
* Chat is limited to English language and store-related queries.
* No authentication or user management is implemented.

---

## Architecture Overview

**Backend Layers:**

1. **Routes (`/routes`)** – Handles HTTP endpoints.
2. **Controllers (`/controllers`)** – Validate requests and call services.
3. **Services (`/services`)** – Core business logic, LLM calls, and database interaction.
4. **Models (`/models`)** – Type definitions for `Conversation` and `Message`.

**Frontend:**

* React functional components with hooks (`useChat`) for state management.
* `localStorage` used for persisting session IDs.
* Auto-scroll and scroll-to-bottom button for better UX.

---

## LLM Notes

* **Provider:** Google GenAI
* **Model:** Gemini 2.5 Flash
* **Prompting:**

  * System prompt includes guidelines and store information
  * Conversation history is truncated to last 8 messages for context
  * FAQ context is prepended to avoid hallucination
* **Trade-offs:**

  * Could implement Redis caching for sessions and responses
  * Better LLM prompt templating and moderation
  * UI enhancements
  * Add unit/integration tests for services and controllers

---

## Getting Started

### Backend

1. Navigate to the backend folder:

```bash
cd backend
npm install
```

2. Create a PostgreSQL database.
3. Run migrations:

```bash
psql <DATABASE_URL> -f migrations/init.sql
```

4. Create `.env` from `.env.example` and fill in required keys:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/db_name
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
```

5. Start development server:

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

---

### Frontend

1. Navigate to the frontend folder:

```bash
cd frontend
npm install
```

2. Start development server:

```bash
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## Usage

1. Open frontend in browser.
2. Start typing a question in the chat input.
3. Messages are sent to backend and AI responds.
4. On page reload, the chat continues with previous messages.

---

### Notes

* Input validation ensures messages cannot be empty or too long.
* Conversations are persisted in PostgreSQL; `sessionId` in `localStorage` allows seamless continuation.

