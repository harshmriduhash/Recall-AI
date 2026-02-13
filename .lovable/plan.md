

# Hybrid Memory System (HMS) — MVP Plan

**"The Second Brain for Developers — with inspectable, layered memory intelligence"**

---

## 1. Authentication & User Management
- Real email/password signup and login using Supabase Auth
- Each user gets their own isolated memory space
- Clean, minimal login/signup page with the HMS branding
- Profile creation on signup (name, email)

---

## 2. Dashboard — Three-Panel Layout (Dark Mode)
The main app uses a premium dark-mode UI with three panels:

- **Left Sidebar** — Memory Timeline: vertical scrollable timeline showing all memories (newest first), each with title, type badge (note/code/decision/conversation), and timestamp. Click to expand in a detail drawer.
- **Center Panel** — Chat & Memory Input: the primary interaction zone. Users can switch between Chat mode (ask AI about their memories) and Add Memory mode.
- **Right Panel** — Insights & Memory Inspector: shows AI-generated insights ("You document *what* but not *why*"), memory layer visualization, and context inspection for the last AI query.

---

## 3. Memory Ingestion (3 Methods)
**A. Text Input** — Rich text area to add notes, decisions, architecture explanations. User sets title and type (note/code/decision/conversation).

**B. File Upload** — Accept `.md`, `.txt`, `.pdf` files. Extract text content and store as a memory.

**C. Voice Input** — Mic button using browser's Web Speech API for real transcription (falls back to simulated if unsupported). Transcribed text becomes a memory.

All memories stored in Supabase with: `id`, `user_id`, `title`, `content`, `type`, `memory_layer` (working/episodic/semantic), `tags`, `created_at`.

---

## 4. Conversational AI (Real, Powered by Lovable AI)
- Chat interface where users ask questions about their memories
- Edge function retrieves the user's relevant memories from the database, passes them as context to Lovable AI (Gemini)
- AI responds with answers that **cite specific memory titles**
- Streaming responses for a premium feel
- Example queries: "What did I decide about auth?", "Summarize my architecture notes", "What are my knowledge gaps?"

---

## 5. Memory Inspector
When the AI answers a question, the right panel shows:
- Which memories were retrieved and used
- Which memory layer each came from
- A relevance indicator
- Why certain memories were included

This is the key differentiator — making memory usage **transparent and explainable**.

---

## 6. Agentic AI Agents (Visible in UI)
Three lightweight agents shown as cards/steps:
- **Memory Organizer** — Auto-suggests tags when adding memories
- **Recall Agent** — Selects the best memories for a query (shown in inspector)
- **Insight Agent** — Generates 1-2 patterns/gaps from the user's memory collection

These run sequentially and their activity is visible in the UI.

---

## 7. Insights Panel
Right-side panel showing AI-generated observations:
- Topic distribution ("70% of your memories are about Backend")
- Pattern detection ("You document decisions but rarely outcomes")
- Knowledge gap suggestions
- Memory stats (total count, types breakdown)

---

## 8. Demo Mode
- A "Load Demo Data" toggle that populates the app with pre-built memories:
  - Architecture decision about microservices vs monolith
  - Interview prep notes on system design
  - Bug post-mortem from a production incident
- Makes the product instantly impressive for demos

---

## 9. Design & Polish
- Dark mode by default with neutral grays + electric blue/violet accents
- Smooth animations: timeline items slide in, chat messages fade up, drawer opens with spring animation
- Memory layer visualization with animated stacked layers
- Context budget meter showing token usage
- Fully responsive (desktop-first, functional on tablet)

---

## Tech Stack Summary
- **Frontend**: React + Tailwind + shadcn/ui (already set up)
- **Backend**: Supabase (Auth + Database + Edge Functions)
- **AI**: Lovable AI (Gemini) via edge functions for chat, tagging, and insights
- **Voice**: Browser Web Speech API

