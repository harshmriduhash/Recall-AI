# MVP Launch Checklist

**Minimum viable product** — must-haves before first real users or beta.

## Core product

- [ ] User can sign up and sign in (email/password)
- [ ] User can add memories (title, content, type, layer, tags)
- [ ] User can view, search (timeline), and delete their memories
- [ ] User can chat with AI that uses **their** memories (session JWT sent to chat API)
- [ ] Memory Inspector shows which memories were used for the last answer
- [ ] Demo data loader works for quick tryout
- [ ] 404 and auth redirects work (e.g. unauthenticated → /auth)

## Data & backend

- [ ] Supabase migration applied (profiles, memories, RLS, triggers, indexes)
- [ ] RLS policies verified: users only access their own data
- [ ] Chat Edge Function deployed; loads user memories by JWT; streams response
- [ ] No secrets in repo; `.env` in `.gitignore`; env vars documented (e.g. README)

## Quality & safety

- [ ] Build passes: `npm run build`
- [ ] Critical path manually tested: sign up → add memory → chat → sign out
- [ ] Auth errors and chat errors (rate limit, AI failure) show user-friendly messages
- [ ] File upload: accept only supported types (e.g. .md, .txt; clarify PDF behavior or remove)

## Go-live basics

- [ ] App deployed and reachable (e.g. Vercel/Netlify)
- [ ] Production env vars set (Supabase URL, anon key; function secrets)
- [ ] Supabase Auth redirect URLs include production URL
- [ ] One full E2E pass in production (sign up → add memory → chat)

## Optional for MVP

- [ ] `verify_jwt = true` on chat function (recommended before opening to many users)
- [ ] Basic error tracking (e.g. Sentry)
- [ ] Privacy Policy / Terms (required if you have paying or EU users)
