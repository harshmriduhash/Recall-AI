# Production Checklist

Technical readiness for **running the app in production** (reliability, security, observability).

## Infrastructure & deploy

- [ ] App deployed to a production host (Vercel, Netlify, etc.)
- [ ] Environment variables set in host (no `.env` in repo); no secrets in client bundle
- [ ] Clerk project on appropriate plan (check usage limits)
- [ ] Vercel Postgres on appropriate plan; connection pooling considered for serverless scale
- [ ] API routes verified as deployed and healthy
- [ ] Custom domain configured and SSL valid
- [ ] CDN / static asset caching enabled (default on Vercel)

## Security

- [ ] `.env` and `.env.*` in `.gitignore`; no secrets committed
- [ ] Clerk keys (`VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) set in Vercel
- [ ] API layer correctly filters queries by `userId` (verified in `api/memories/index.ts`)
- [ ] Clerk security: email verification enabled; MFA considered for production
- [ ] CORS and allowed redirect URLs restricted to your domains in Clerk dashboard
- [ ] Dependency audit: `npm audit`; fix or accept high/critical issues

## Reliability & performance

- [ ] Error boundary in React app for uncaught UI errors
- [ ] API/chat errors surfaced to user (toasts); no silent failures on critical paths
- [ ] Timeouts and retries considered for Vercel API calls
- [ ] Database indexes in place for Vercel Postgres

## Observability

- [ ] Error tracking (e.g. Sentry) integrated; source maps for production
- [ ] Logging: structured logs in Vercel Functions; log aggregation if needed
- [ ] Uptime / health checks (e.g. cron hitting the `/api/memories` health check)
- [ ] Alerts on error rate, latency, or downtime (Vercel notifications)

## Compliance & ops

- [ ] Backup strategy for Vercel Postgres
- [ ] Data retention and deletion process considered (GDPR, etc.)
- [ ] Rate limiting on API endpoints to prevent abuse
