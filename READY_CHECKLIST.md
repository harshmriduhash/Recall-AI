# Ready Checklist

**“Ready to ship” gate** — quality, compliance, and consistency before release.

## Code & build

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] `npm run test` passes (expand tests for critical paths over time)
- [ ] No `console.log` / debug code in production paths
- [ ] TypeScript strict; no `any` where avoidable in new code
- [ ] Dependencies up to date; `npm audit` reviewed

## Security & config

- [ ] No secrets in code or in repo; env vars used for all config
- [ ] Auth and RLS tested; no cross-user data leakage
- [ ] Chat or other sensitive endpoints use user JWT where required
- [ ] CORS and redirect URLs limited to your domains

## User experience

- [ ] Critical flows work: sign up, sign in, add memory, chat, sign out
- [ ] Errors show clear messages (toasts or inline); no raw stack traces to user
- [ ] Loading states and disabled buttons where needed (e.g. during submit)
- [ ] Mobile/tablet usable (responsive layout)
- [ ] Basic accessibility: form labels, focus order, contrast (improve over time)

## Legal & compliance (as needed)

- [ ] Privacy Policy published and linked (required for EU/international)
- [ ] Terms of Service published and linked (recommended for SaaS)
- [ ] Cookie consent if you use non-essential cookies or tracking
- [ ] Data retention and deletion approach documented

## Release process

- [ ] Version or release tag updated (if you version)
- [ ] Changelog or release notes updated
- [ ] Deploy steps documented; rollback plan known
- [ ] Post-deploy smoke test planned
