<p align="center">
  <img src="https://img.shields.io/badge/Recall-Second%20Brain%20for%20Developers-7C3AED?style=for-the-badge&logo=brain&logoColor=white" alt="Recall" />
</p>

<h1 align="center">Recall</h1>

<p align="center">
  <strong>The second brain for developers.</strong><br/>
  Store, search, and reason about your knowledge — with AI-powered memory intelligence and full transparency.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=flat-square&logo=clerk" alt="Clerk" />
  <img src="https://img.shields.io/badge/Vercel-Postgres-000000?style=flat-square&logo=vercel" alt="Vercel" />
  <img src="https://img.shields.io/badge/AI-Gemini-4285F4?style=flat-square&logo=google" alt="AI" />
</p>

---

## 🧠 What is Recall?

Recall is a **structured knowledge management platform** built for developers. It captures your notes, code snippets, architecture decisions, and conversations — then lets you **chat with an AI** that uses *only your memories* as context and **shows you exactly which ones it used**.

Unlike generic note apps or chatbots, Recall gives you:

- **Structured memory layers** — Working, Episodic, and Semantic — inspired by cognitive science
- **A Memory Inspector** — full transparency into which memories powered each AI response
- **Multi-modal input** — type, speak, or upload files to capture knowledge fast

---

## ✨ Features

### Core

| Feature | Description |
|---------|-------------|
| **Memory Timeline** | Searchable, filterable timeline of all stored memories with type badges, layer indicators, and pagination |
| **AI Chat** | Ask questions about your knowledge — AI responds with citations to specific memory titles |
| **Memory Inspector** | See exactly which memories were retrieved, their layers, relevance scores, and the AI's reasoning |
| **Voice Input** | Record audio via microphone → transcribed by AI — works in any browser |
| **File Upload** | Import `.md` and `.txt` files directly as memories |
| **AI Auto-Tagging** | Get intelligent tag suggestions based on memory content |
| **Demo Mode** | One-click demo data loader with realistic developer memories |

### Memory System

| Layer | Purpose | Example |
|-------|---------|---------|
| **Working** | Active, in-progress thoughts | Sprint standup notes, current blockers |
| **Episodic** | Event-based memories | Production incidents, interview experiences |
| **Semantic** | Permanent knowledge | Architecture patterns, auth best practices |

Each memory also has a **type**: `Note`, `Code`, `Decision`, or `Conversation`.

### Intelligence

| Agent | Role |
|-------|------|
| **Memory Organizer** | Auto-suggests tags when adding memories |
| **Recall Agent** | Selects the best memories for each query (visible in Inspector) |
| **Insight Agent** | Generates patterns, gaps, and stats from your memory collection |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  Frontend (SPA)                                                  │
│  React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui        │
│  Framer Motion · React Query · React Router                     │
├──────────────────────────────────────────────────────────────────┤
│  Pages: Landing → Auth → Dashboard (3-panel layout)              │
│  Components: Timeline · Chat · AddMemory · Insights · Inspector  │
└──────────────────┬───────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────┐  ┌────────────────────────────────────┐
│  API Layer (Vercel)      │  │  External Services                 │
│  • Clerk Auth Verification│  │  • Clerk (Auth & Identity)         │
│  • Vercel Postgres (SQL)  │  │  • AI Gateway (Gemini/OAI)         │
│  • Memory CRUD Operations │  │  • Voice Processing (OpenAI)       │
└──────────────────────────┘  └────────────────────────────────────┘
```

### Data Model

```sql
memories
├── id          (uuid, PK)
├── user_id     (text, NOT NULL) -- Clerk User ID
├── title       (text, NOT NULL)
├── content     (text, NOT NULL)
├── type        (text: note | code | decision | conversation)
├── memory_layer(text: working | episodic | semantic)
├── tags        (jsonb) -- Array of strings
├── created_at  (timestamptz)
```

No more manual RLS management—user data is scoped via `user_id` in the API layer.

---

## 🔐 Security

| Measure | Implementation |
|---------|----------------|
| **Authentication** | Secure identity by **Clerk** |
| **Data Scope** | All API queries are server-side scoped to the authenticated Clerk user |
| **JWT Verification** | Clerk backend SDK validates all incoming requests |
| **Rate Limiting** | Vercel platform-level controls |
| **Secret Management** | All keys stored in Vercel Environment Variables |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Vercel Postgres database
- A Clerk account

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd recall

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Clerk and Vercel Postgres credentials

# Start development server
npm run dev
```

The app runs at `http://localhost:8080`.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk Publishable Key (for frontend) |
| `CLERK_SECRET_KEY` | Clerk Secret Key (for API layer) |
| `POSTGRES_URL` | Vercel Postgres connection URL |

---

## 📁 Project Structure

```
recall/
├── src/
│   ├── pages/
│   │   ├── Landing.tsx           # Public homepage with hero & CTA
│   │   ├── Auth.tsx              # Sign in / Sign up / Clerk logic
│   │   ├── DashboardGuard.tsx    # Auth-protected route wrapper
│   │   ├── Dashboard.tsx         # Three-panel app layout
│   │   └── NotFound.tsx          # 404 page
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── MemoryTimeline.tsx # Searchable timeline
│   │   │   ├── AddMemoryForm.tsx  # Memory creation
│   │   │   ├── ChatPanel.tsx      # AI conversation interface
│   │   │   └── InsightsPanel.tsx   # Stats & inspector
│   │   ├── landing/               # Navbar, Footer
│   │   └── ui/                    # shadcn/ui components
│   ├── hooks/
│   │   ├── useAuth.tsx            # Auth context & methods
│   │   └── useMemories.ts        # React Query CRUD operations
│   └── types/
│       └── memory.ts              # TypeScript interfaces
├── supabase/
│   ├── functions/
│   │   ├── chat/                  # AI chat with memory context
│   │   ├── transcribe/            # Voice-to-text transcription
│   │   └── suggest-tags/          # AI tag suggestions
│   └── migrations/                # Database schema & RLS
└── docs/                          # Strategy & build docs
```

---

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest test suite |

---

## 🗺️ Roadmap

- [ ] Semantic search with embeddings for smarter memory retrieval
- [ ] Memory connections — link related memories together
- [ ] Export/import — backup and migrate your knowledge base
- [ ] Team workspaces — shared memory spaces for engineering teams
- [ ] Browser extension — capture knowledge from anywhere on the web
- [ ] Mobile PWA — full offline support with sync

---

## 📄 License

Private. All rights reserved.
