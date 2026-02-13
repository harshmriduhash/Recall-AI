# Hybrid Memory System (HMS)

**The second brain for developers.** Store, search, and reason about your knowledge with AI-powered memory intelligence.

HMS lets you capture notes, code snippets, decisions, and conversations in a structured way (with types and layers), then chat with an AI that uses **your** memories as context and shows you which memories were used (Memory Inspector).

---

## What problem does it solve?

- **Scattered knowledge** — Notes, decisions, and code snippets live in docs, chats, and tickets. There’s no single place that “knows” everything you’ve learned or decided.
- **Context loss** — When you switch projects or return after a while, you lose the “why” behind past choices. Reconstructing context is slow and error-prone.
- **Non-inspectable AI** — Generic chatbots don’t use your private knowledge and can’t show which sources they used. You can’t trust or audit answers.

HMS gives you one place to store **your** knowledge (memories), then an AI that reasons over **only** that knowledge and **shows** which memories it used (Memory Inspector). So you get answers grounded in your own notes and decisions, with transparency.

---

## How does this product solve the problem?

1. **Structured capture** — You add memories with a type (note, code, decision, conversation), a layer (working / episodic / semantic), and tags. That structure makes it easier to retrieve and reason about them later.
2. **Single source of truth** — All memories live in your HMS timeline. One search, one timeline, one chat that sees everything you’ve stored.
3. **AI over your data only** — The chat API loads **your** memories (using your session), sends them as context to the AI, and streams the answer. The AI is instructed to cite memory titles and say when something isn’t in your memories.
4. **Transparency** — The Memory Inspector shows which memories were retrieved for each answer and a short reasoning note. You can verify and correct your knowledge base.
5. **Low friction** — Text, voice (Web Speech API), and file upload (.md, .txt) let you capture quickly without leaving the app.

---

## Does it save time? Does it save money?

**Time**

- **Less re-reading** — You ask the AI “What did I decide about auth?” instead of digging through old docs or tickets.
- **Faster onboarding back** — After context switches, you query your own memories instead of re-discovering everything.
- **Faster capture** — One place to dump notes and decisions with types and tags; voice and file upload speed up input.
- **Less duplicate work** — You can check “Do I already have a note on this?” via chat or timeline before redoing research.

**Money**

- **Fewer costly mistakes** — Reusing past decisions and post-mortems reduces repeat incidents and wrong assumptions.
- **Better use of paid AI** — The AI uses your curated context instead of generic web knowledge, so answers are more relevant per query (and you can control usage via limits).
- **Cheaper than ad-hoc tools** — One integrated system can replace multiple note/search/wiki tools and reduce subscription sprawl (depending on how you use it).

Exact time and cost savings depend on usage; the product is designed to reduce context-switching and rework and to make AI usage auditable and grounded in your data.

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

## Software architecture

High-level layers and responsibilities:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Presentation (Browser)                                                 │
│  React 18 + TypeScript + Vite + Tailwind + shadcn/ui                    │
│  • Pages: Index (gate), Auth, Dashboard, NotFound                        │
│  • Dashboard: MemoryTimeline, AddMemoryForm, ChatPanel, InsightsPanel    │
│  • State: React Query (memories), Auth context (user/session)           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
┌───────────────────────────────┐   ┌───────────────────────────────────┐
│  Supabase Client (SDK)        │   │  Chat API (fetch)                  │
│  • Auth (signIn, signUp,      │   │  POST /functions/v1/chat          │
│    signOut, getSession)       │   │  Authorization: Bearer <user JWT>  │
│  • Postgres: profiles,        │   │  Body: { messages }                │
│    memories (CRUD via RLS)    │   │  Response: SSE stream +            │
└───────────────────────────────┘   │  X-Memory-Inspector header        │
                    │                └───────────────────────────────────┘
                    ▼                               │
┌───────────────────────────────┐                   ▼
│  Supabase Backend             │   ┌───────────────────────────────────┐
│  • Auth (JWT, email confirm)  │   │  Edge Function: chat               │
│  • Postgres + RLS             │   │  • Validate JWT → user_id          │
│  • Edge Functions (Deno)      │   │  • Load user memories (last 20)    │
└───────────────────────────────┘   │  • Build system prompt + context │
                                    │  • Call Lovable AI (Gemini); stream│
                                    │  • Return stream + inspector JSON  │
                                    └───────────────────────────────────┘
```

- **Frontend** is a SPA: auth gate at `/`, `/auth` for login/signup, dashboard at `/` when authenticated. All data access is either via Supabase client (auth + DB) or the chat HTTP API.
- **Backend** is Supabase: Auth for identity, Postgres for `profiles` and `memories`, Edge Function for chat. No separate app server; Supabase handles API and DB.
- **AI** is external (Lovable AI gateway, Gemini). The Edge Function is the only component that talks to the AI and injects user memories into the prompt.

---

## System design

### Components and data flow

| Component | Role | In/Out |
|-----------|------|--------|
| **React app** | UI, routing, forms, chat UI | Reads/writes via Supabase client; sends chat messages to Edge Function with user JWT |
| **Supabase Auth** | Identity, session, JWT | Sign up/in/out; session used for RLS and as Bearer token for chat |
| **Postgres (Supabase)** | Persistent storage | `profiles` (id, display_name, email), `memories` (id, user_id, title, content, type, memory_layer, tags, created_at, updated_at) |
| **RLS** | Row-level security | All memory and profile access scoped by `auth.uid()` |
| **Edge Function `chat`** | Orchestration + AI | Receives JWT and messages → loads memories for user → builds prompt → calls AI → streams response; returns inspector data in header |
| **Lovable AI (Gemini)** | LLM | Receives system prompt (with memory context) + messages; streams completion |

### Key flows

1. **Sign up / Sign in**  
   Client → Supabase Auth → JWT and session. Trigger creates/updates `profiles`. Client stores session (e.g. localStorage) and uses it for all subsequent requests.

2. **Add memory**  
   Client → Supabase client `insert` into `memories` with `user_id` from session. RLS ensures `user_id = auth.uid()`. React Query invalidates list; timeline updates.

3. **Chat**  
   Client gets `session.access_token` → `POST /functions/v1/chat` with `Authorization: Bearer <token>` and `{ messages }`. Edge Function: validates JWT (or anon if `verify_jwt = false`), loads last 20 memories for that user, builds system prompt with memory context, calls Lovable AI with streaming, returns stream and `X-Memory-Inspector` (retrieved memories + reasoning). Client renders stream and updates Insights panel from header.

4. **Memory Inspector**  
   Inspector data is computed in the Edge Function (which memories were sent to the AI and a short reasoning string) and returned in the response header. No separate API.

### Scaling and constraints

- **Database**: Indexes on `memories(user_id)`, `memories(type)`, `memories(created_at DESC)` support list and filter. For very large accounts, add pagination or cursor-based listing.
- **Chat**: One request per user message; context is last 20 memories. For larger context, consider summarization or semantic search (embeddings) later. Rate limiting (per user or IP) recommended to protect AI cost and availability.
- **Edge Function**: Stateless; cold starts possible. Timeout and payload limits follow Supabase/Deno limits. No caching of memories in the function today.
- **Frontend**: Static assets can be served from CDN. No server-side rendering; SEO is limited to what’s in `index.html` and meta tags.

---

## Checklists

Use these before launch, production, or scaling:

| Checklist | Purpose |
|-----------|---------|
| [MVP_LAUNCH_CHECKLIST.md](MVP_LAUNCH_CHECKLIST.md) | Minimum viable product — core features and first users |
| [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) | Technical production readiness — infra, security, monitoring |
| [READY_CHECKLIST.md](READY_CHECKLIST.md) | “Ready to ship” gate — quality, compliance, release |
| [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) | General launch — marketing, go-live, support |
| [EXECUTION_CHECKLIST.md](EXECUTION_CHECKLIST.md) | Day-to-day execution — sprints, merges, releases |
| [SAAS_READY_CHECKLIST.md](SAAS_READY_CHECKLIST.md) | SaaS-specific — billing, multi-tenant, scale, SLAs |
| [docs/MVP_STRATEGY_AND_ROADMAP.md](docs/MVP_STRATEGY_AND_ROADMAP.md) | Strategy and roadmap to a ready MVP for 100 users (feature audit, fixes, phased plan) |
| [docs/BUILD_SUMMARY.md](docs/BUILD_SUMMARY.md) | Complete build summary — all features implemented, ready for production |

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
