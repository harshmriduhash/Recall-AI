# Hybrid Memory System (HMS)

**The second brain for developers.** Store, search, and reason about your knowledge with AI-powered memory intelligence.

HMS lets you capture notes, code snippets, decisions, and conversations in a structured way (with types and layers), then chat with an AI that uses **your** memories as context and shows you which memories were used (Memory Inspector).

---

## Features

- **Auth** — Email/password sign up and sign in (Supabase Auth). Each user has an isolated memory space.
- **Memory timeline** — Left panel lists all memories (newest first) with type (note/code/decision/conversation), layer (working/episodic/semantic), and tags. Click to open a detail drawer.
- **Add memories** — Title, content, type, layer, tags. Optional: voice input (Web Speech API) and file upload (.md, .txt).
- **AI chat** — Ask questions about your memories. Responses stream and can cite memory titles. Memory Inspector (right panel) shows which memories were retrieved and why.
- **Insights** — Right panel shows memory stats, layer distribution, top tags, and simple AI-generated insights.
- **Demo data** — “Load Demo Data” button seeds sample memories for quick demos.

---

## Tech stack

| Layer        | Tech |
|-------------|------|
| Frontend    | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Query, Framer Motion |
| Backend     | Supabase (Auth, Postgres, RLS, Edge Functions) |
| AI          | Lovable AI (Gemini) via Supabase Edge Function; streaming chat |

---

## Project structure

```
mvp-launchpad/
├── index.html
├── src/
│   ├── main.tsx              # Entry; mounts App
│   ├── App.tsx               # Providers + React Router (/, /auth, 404)
│   ├── index.css             # Tailwind + theme variables
│   ├── pages/
│   │   ├── Index.tsx         # Auth gate → Dashboard or redirect to /auth
│   │   ├── Auth.tsx          # Sign in / Sign up
│   │   ├── Dashboard.tsx     # Main app: timeline, chat, add memory, insights
│   │   └── NotFound.tsx      # 404
│   ├── components/
│   │   ├── dashboard/        # MemoryTimeline, AddMemoryForm, ChatPanel, InsightsPanel, DemoDataLoader
│   │   └── ui/               # shadcn components
│   ├── hooks/
│   │   ├── useAuth.tsx       # Auth context (user, signIn, signUp, signOut)
│   │   └── useMemories.ts    # React Query: list, add, delete memories
│   ├── integrations/supabase/
│   │   ├── client.ts         # Supabase client (env: VITE_SUPABASE_*)
│   │   └── types.ts         # DB types
│   └── types/
│       └── memory.ts        # Memory, ChatMessage, MemoryInspectorData
├── supabase/
│   ├── config.toml           # Project + function config (e.g. verify_jwt)
│   ├── migrations/          # profiles + memories tables, RLS, triggers, indexes
│   └── functions/
│       └── chat/            # Edge function: loads user memories, calls AI, streams response
├── public/
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Getting started

### Prerequisites

- Node.js 18+ and npm

### 1. Clone and install

```bash
git clone <your-repo-url>
cd mvp-launchpad
npm install
```

### 2. Environment variables

Create a `.env` in the project root (see [Security](#security) below; do not commit real keys):

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
```

Optional (for local tooling only):

```env
VITE_SUPABASE_PROJECT_ID=<your-project-id>
```

### 3. Supabase setup

- Create a [Supabase](https://supabase.com) project.
- In the SQL editor, run the migration in `supabase/migrations/` (creates `profiles`, `memories`, RLS, triggers, indexes).
- In **Authentication → URL Configuration**, set Site URL and Redirect URLs if needed (e.g. `http://localhost:8080` for dev).
- Deploy the **chat** Edge Function and set its secrets in the Supabase dashboard:
  - `LOVABLE_API_KEY` (for the AI gateway)
  - Supabase provides `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` for functions.

### 4. Run locally

```bash
npm run dev
```

App runs at `http://localhost:8080`. Sign up, add memories (or load demo data), then use the chat.

### 5. Build for production

```bash
npm run build
npm run preview   # optional: local preview of build
```

---

## Scripts

| Command           | Description                |
|------------------|----------------------------|
| `npm run dev`    | Start Vite dev server      |
| `npm run build`  | Production build           |
| `npm run preview`| Preview production build   |
| `npm run lint`   | Run ESLint                 |
| `npm run test`   | Run Vitest                 |

---

## Security

- **Do not commit `.env`.** It is listed in `.gitignore`. Use a `.env.example` (without real values) if you want to document required variables.
- **Supabase anon key** is safe to use in the browser; RLS ensures users only access their own data. The **service role key** must never be used in the frontend.
- **Chat Edge Function** should use the user’s JWT (sent as `Authorization: Bearer <session.access_token>`) so it can load that user’s memories. In production, consider setting `verify_jwt = true` for the chat function in `supabase/config.toml`.

---

## Production readiness

Summary of what’s in place and what to do before real users:

| Area | Status | Notes |
|------|--------|--------|
| Auth & RLS | ✅ | Email/password, per-user data isolation |
| Chat with user context | ✅ | Chat now sends the user’s session JWT so the AI gets their memories |
| Env / secrets | ✅ | `.env` in `.gitignore`; use env vars in hosting |
| Error handling | ⚠️ | Toasts for auth/chat; add global error boundary and retries if desired |
| Rate limiting | ⚠️ | Handled by AI gateway (429); consider rate limiting per user on your side |
| File upload | ⚠️ | Add Memory accepts .md, .txt, .pdf; only text files are read correctly (PDF not parsed) |
| Tests | ⚠️ | Placeholder test only; add unit/integration tests for critical paths |
| Accessibility | ⚠️ | Basic semantics; add ARIA/labels and keyboard nav where needed |
| Monitoring | ❌ | Add logging/APM and optional Sentry (or similar) for production |

**Verdict:** The app is suitable for a **controlled MVP or beta** (invite-only, low traffic). Before opening to general production users, address: env and JWT verification, file upload behavior (or remove PDF), tests, and monitoring.

---

## License

Private. All rights reserved.
