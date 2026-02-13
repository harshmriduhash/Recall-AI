# MVP Strategy & Roadmap — 100 Users

**Goal:** Make HMS a reliable, shippable MVP that can support **at least 100 real users** without critical breakage or trust issues.

---

## 1. Feature audit (current state)

### 1.1 Voice input — **WAS BROKEN, NOW FIXED**

| Issue | Status | Fix |
|-------|--------|-----|
| Transcript overwritten on each `onresult` (no accumulation) | ✅ Fixed | Accumulate final results in a ref; show accumulated + interim; set content on stop |
| No secure-context check (fails on HTTP) | ✅ Fixed | Check `window.isSecureContext`; toast clear message if not HTTPS/localhost |
| Unclear error in unsupported browsers (e.g. Firefox) | ✅ Fixed | Toast: "Voice not supported in this browser. Try Chrome or Edge." |
| Microphone permission denied | ✅ Fixed | Handle `not-allowed` in `onerror` with specific message |
| Language not set | ✅ Fixed | `recognition.lang = "en-US"` for better accuracy |

**Remaining limitations (product choice, not bugs):**  
Voice only works in **Chrome/Edge** (and Safari with limitations). Firefox does not support the Web Speech API. On **HTTP** (non-localhost) it will not work; production must use **HTTPS**.

---

### 1.2 File upload — **WAS MISLEADING, NOW FIXED**

| Issue | Status | Fix |
|-------|--------|-----|
| Accept included `.pdf` but only text was read (PDF is binary) | ✅ Fixed | Accept only `.md`, `.txt`, `text/plain`, `text/markdown`; validate extension; toast if wrong type |
| No error handling for `file.text()` | ✅ Fixed | try/catch with user-facing toast |

---

### 1.3 Auth — **WORKS**

- Sign up, sign in, sign out work.
- Email confirmation: depends on Supabase project settings (recommend enabling for production).
- Session persistence and redirect after login work.
- **Suggestion:** Add “Forgot password?” link and flow before scaling to 100 users.

---

### 1.4 Memories (CRUD) — **WORKS**

- Add memory (title, content, type, layer, tags) works.
- List (timeline), select, delete work.
- RLS enforces per-user isolation.
- **Suggestion:** For 100+ users, add pagination or “load more” on the timeline so large lists don’t slow the UI.

---

### 1.5 Chat + Memory Inspector — **WORKS (after JWT fix)**

- Chat sends user JWT; Edge Function loads that user’s memories and streams AI response.
- Memory Inspector shows retrieved memories and reasoning in the right panel.
- Rate limit (429) and payment (402) errors show toasts.
- **Risks:** No per-user rate limit on your side; AI cost can grow. Plan: add simple rate limiting (e.g. N messages per user per hour) before opening to many users.

---

### 1.6 Demo data — **WORKS**

- “Load Demo Data” inserts sample memories for the current user and refreshes the list.

---

### 1.7 UI / UX — **ACCEPTABLE FOR MVP**

- Responsive layout; panels collapsible; 404 and auth redirects work.
- No global error boundary: one component crash can blank the screen. **Recommendation:** Add a simple React error boundary and “Something went wrong” + reload CTA before 100 users.

---

## 2. Is it ready for 100 real users today?

**Short answer: almost, but not quite.**

| Area | Ready? | Blocker / action |
|------|--------|-------------------|
| Core flows (auth, add/list/delete memories, chat) | ✅ | None |
| Voice | ✅ | Fixed; document “Chrome/Edge + HTTPS” |
| File upload | ✅ | Fixed; only .md/.txt |
| Reliability | ⚠️ | Add error boundary; optional retry for chat |
| Scale (100 users) | ⚠️ | Pagination or limit on timeline; rate limit chat |
| Trust / safety | ⚠️ | Enable email confirmation; set `verify_jwt = true` on chat |
| Support / feedback | ❌ | Add “Help” or “Feedback” (e.g. link or simple form) |
| Monitoring | ❌ | Add error tracking (e.g. Sentry) to see real failures |

So: **feature-wise it’s close; for 100 users you need a few hardening and ops steps** (below).

---

## 3. Strategy to reach 100 users

### Principles

1. **Stability first** — Fix known bugs (done for voice/file), add error boundary and basic monitoring so you see breakage before users complain.
2. **Trust** — Email confirmation + JWT verification so only real, logged-in users use the app and chat.
3. **Cost control** — Rate limit chat per user so AI cost doesn’t explode.
4. **Learn** — One simple feedback path and basic metrics (signups, “first memory”, “first chat”) so you can iterate.

### Phased approach

- **Phase 1 (pre–100):** Hardening and safety (error boundary, JWT, email confirmation, rate limit, monitoring, feedback).
- **Phase 2 (0→100):** Invite-only or waitlist; onboard in small batches; watch errors and feedback.
- **Phase 3 (at 100):** Decide next step (e.g. open signup, pricing, or more features) based on usage and feedback.

---

## 4. Roadmap to a ready MVP (100 users)

### Phase 1 — Hardening (before inviting users)

| # | Task | Owner | Done |
|---|------|--------|------|
| 1.1 | Add React error boundary (fallback UI + “Reload” / “Go home”) | Dev | [ ] |
| 1.2 | Set `verify_jwt = true` for the `chat` Edge Function in `supabase/config.toml` | Dev | [ ] |
| 1.3 | Enable “Confirm email” in Supabase Auth for production | Dev/Ops | [ ] |
| 1.4 | Add simple rate limiting for chat (e.g. 30 req/user/hour in Edge Function or Supabase) | Dev | [ ] |
| 1.5 | Add error tracking (e.g. Sentry) in frontend and optionally in Edge Function | Dev | [ ] |
| 1.6 | Add “Forgot password?” on Auth page (link to Supabase reset flow) | Dev | [ ] |
| 1.7 | Add pagination or “Load more” (e.g. 50 items) for memory timeline | Dev | [ ] |
| 1.8 | Add a “Feedback” or “Help” entry point (link to form or email) in app footer or dashboard | Dev | [ ] |

### Phase 2 — Launch and grow to 100

| # | Task | Owner | Done |
|---|------|--------|------|
| 2.1 | Deploy to production (e.g. Vercel/Netlify); env vars and Supabase URLs correct | Dev | [ ] |
| 2.2 | Smoke test: sign up → confirm email → add memory (text + voice on HTTPS) → chat → sign out | Dev | [ ] |
| 2.3 | Publish a short “How to use HMS” (README or in-app copy): voice = Chrome/Edge + HTTPS | Dev | [ ] |
| 2.4 | Create invite/waitlist flow (e.g. Typeform, Google Form, or simple landing + email list) | Marketing/Dev | [ ] |
| 2.5 | Invite first 10–20 users; collect feedback and fix top issues | Product | [ ] |
| 2.6 | Scale to 50, then 100; monitor errors, rate limits, and “first memory” / “first chat” | Product/Ops | [ ] |

### Phase 3 — After 100 users

| # | Task | Notes |
|---|------|--------|
| 3.1 | Decide: open signup vs. paid vs. waitlist | Product |
| 3.2 | Consider usage limits or tiers (e.g. memories/month, chat messages/month) | Product/Dev |
| 3.3 | Improve onboarding (e.g. first-run tips, “Load Demo Data” more visible) | Product |
| 3.4 | Add basic analytics (signup, first memory, first chat, weekly active) | Dev |

---

## 5. Priority order (if time is limited)

1. **Must-have before any real users:** 1.1 (error boundary), 1.2 (verify_jwt), 1.5 (Sentry or similar).
2. **Must-have before 100 users:** 1.3 (email confirmation), 1.4 (rate limit), 1.6 (forgot password), 1.8 (feedback).
3. **Should-have for smooth 100:** 1.7 (timeline pagination), 2.3 (docs/copy for voice), 2.4–2.6 (invite and monitor).

---

## 6. Summary

- **Voice** and **file upload** are fixed and documented; voice is “Chrome/Edge + HTTPS” only.
- **Core product** (auth, memories, chat, inspector, demo data) works; a few **hardening** and **ops** steps are needed before supporting 100 users.
- Follow **Phase 1** (hardening) first, then **Phase 2** (controlled invite and growth). Use the checkboxes in this doc and in [MVP_LAUNCH_CHECKLIST.md](../MVP_LAUNCH_CHECKLIST.md) to track progress toward a ready MVP for 100 users.
