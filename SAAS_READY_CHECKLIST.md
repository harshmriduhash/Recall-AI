# SaaS Ready Checklist

**SaaS-specific** — billing, multi-tenant, scale, and operations.

## Billing & monetization

- [ ] Pricing model defined (free tier, tiers, usage-based, etc.)
- [ ] Billing provider integrated (Stripe, Paddle, etc.) or planned
- [ ] Subscription and usage metering (if applicable) designed
- [ ] Invoices and receipts (or link to provider) available
- [ ] Upgrade/downgrade and cancel flows implemented
- [ ] Usage limits enforced (e.g. memories per user, chat messages per month)

## Multi-tenant & data

- [ ] Data isolated per user (RLS ✅ for HMS)
- [ ] No cross-tenant data leakage in API or Edge Functions
- [ ] Export and delete-my-data flows (GDPR, CCPA) implemented or planned
- [ ] Backup and restore tested (Supabase backups on paid plan)

## Scale & performance

- [ ] Database indexes on hot paths (memories: user_id, created_at, type ✅)
- [ ] Pagination or limits on list endpoints (e.g. memories timeline)
- [ ] Chat: rate limit per user or per IP to protect AI costs
- [ ] Edge Function cold start and timeout acceptable; consider caching if needed
- [ ] Static assets on CDN; cache headers set

## Reliability & SLAs

- [ ] Uptime target defined (e.g. 99.5%)
- [ ] Monitoring and alerting on errors, latency, and availability
- [ ] Status page or incident communication (optional)
- [ ] Runbooks for common incidents (auth down, AI gateway down, DB issues)

## Support & success

- [ ] In-app help or docs (e.g. “How to add memories”, “What are layers?”)
- [ ] Support channel (email, chat, or ticket system)
- [ ] Onboarding flow or first-run experience (e.g. demo data, empty state copy)
- [ ] Feedback mechanism (survey, in-app, or email)

## Legal & compliance

- [ ] Privacy Policy and Terms of Service published
- [ ] DPA (Data Processing Agreement) available for B2B if required
- [ ] Cookie consent and preference center if using non-essential cookies
- [ ] Compliance scope documented (GDPR, SOC2, etc.) and roadmap if needed

## Analytics & product

- [ ] Key metrics defined (signups, DAU, memories added, chat sessions)
- [ ] Analytics integrated (product events, not just pageviews)
- [ ] Funnels and retention analyzed (signup → first memory → weekly active)
