# Production Checklist

Technical readiness for **running the app in production** (reliability, security, observability).

## Infrastructure & deploy

- [ ] App deployed to a production host (Vercel, Netlify, etc.)
- [ ] Environment variables set in host (no `.env` in repo); no secrets in client bundle
- [ ] Supabase project on appropriate plan; connection pooling considered if needed
- [ ] Edge Function (chat) deployed; `LOVABLE_API_KEY` and Supabase secrets set
- [ ] Custom domain configured and SSL valid
- [ ] CDN / static asset caching enabled (often default on Vercel/Netlify)

## Security

- [ ] `.env` and `.env.*` in `.gitignore`; no secrets committed
- [ ] Chat Edge Function: `verify_jwt = true` in `supabase/config.toml` for production
- [ ] RLS policies verified: users can only read/write their own `profiles` and `memories`
- [ ] Auth: email confirmation enabled in Supabase (recommended for production)
- [ ] CORS and allowed redirect URLs restricted to your domains
- [ ] Dependency audit: `npm audit`; fix or accept high/critical issues

## Reliability & performance

- [ ] Error boundary in React app for uncaught UI errors
- [ ] API/chat errors surfaced to user (toasts); no silent failures on critical paths
- [ ] Timeouts and retries considered for chat and Supabase calls
- [ ] Database indexes in place (migration already has `idx_memories_*`)

## Observability

- [ ] Error tracking (e.g. Sentry) integrated; source maps for production
- [ ] Logging: structured logs in Edge Function; log aggregation if needed
- [ ] Uptime / health checks (e.g. cron hitting a health endpoint or main page)
- [ ] Alerts on error rate, latency, or downtime (host or third-party)

## Compliance & ops

- [ ] Backup strategy for Supabase DB (Supabase handles backups on paid plans)
- [ ] Data retention and deletion process considered (GDPR, etc.)
- [ ] Rate limiting on chat or auth endpoints to prevent abuse (optional but recommended)
