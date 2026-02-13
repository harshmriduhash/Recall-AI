# Execution Checklist

**Day-to-day and sprint execution** — use per release or iteration.

## Before starting work

- [ ] Current sprint / iteration goal clear
- [ ] Tasks broken into small, testable items
- [ ] Dependencies (design, API, content) unblocked or tracked
- [ ] Local env and Supabase (or local Supabase) working

## During development

- [ ] Branch naming consistent (e.g. `feature/`, `fix/`, `chore/`)
- [ ] Commits atomic and messages clear
- [ ] No secrets or `.env` values in code or commits
- [ ] New features behind auth where appropriate; RLS respected
- [ ] Lint and type-check passing: `npm run lint`; `tsc` if script exists
- [ ] Manual test of changed flows (auth, add memory, chat)
- [ ] Edge Function changes tested locally (e.g. `supabase functions serve`) if applicable

## Before merging / releasing

- [ ] Code review (if team) or self-review against [READY_CHECKLIST](READY_CHECKLIST.md) where relevant
- [ ] No debug logs or temporary credentials
- [ ] Build succeeds: `npm run build`
- [ ] Tests run: `npm run test`; add or update tests for new behavior when possible
- [ ] Changelog or release notes updated (if you maintain them)
- [ ] Migration run against target DB (staging/production) if schema changed

## After release

- [ ] Deploy to staging/production per your process
- [ ] Smoke test critical path (sign up → add memory → chat)
- [ ] Monitor errors and key metrics for 24h
- [ ] Document any new env vars or config for team/docs
