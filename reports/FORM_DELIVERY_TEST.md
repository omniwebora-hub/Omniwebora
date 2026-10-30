# Form delivery test

## What exists
- UI: `/contact` Project Brief Studio (`src/components/contact/BriefStudio.tsx`): need → situation/timing/budget (optional) → details → review → send. Live brief summary; prefill from `?service=` (incl. legacy values) or from the pricing scope guide (sessionStorage, never the URL).
- API: `POST /api/inquiry` (`src/app/api/inquiry/route.ts`): same-origin check, JSON size limit, Zod schema shared with the client (`src/lib/inquiry/schema.ts`), honeypot (`website`), minimum fill time (3 s), per-instance rate limit, delivery via `src/lib/inquiry/transport.ts`.
- Transports: Resend email (`RESEND_API_KEY`, `INQUIRY_TO_EMAIL`, `INQUIRY_FROM_EMAIL`) or JSON webhook (`INQUIRY_WEBHOOK_URL`); dev-only console log (`INQUIRY_DEV_LOG=1`, never in production). **None is configured in this repo**, so the live site answers HTTP 503 `transport_unconfigured` and the UI says so.
- The structured brief (need, situation, timing, budget band, scope-guide summary) is attached to the email/webhook payload, HTML-escaped.

## Tests run (2026-10-29)
| Test | How | Result |
|---|---|---|
| Client validation, focus on first invalid field, accessible errors | Playwright (`project brief and API`) | ✓ desktop + mobile |
| Unconfigured transport → honest message, no fake success, stays on /contact | Playwright | ✓ desktop + mobile |
| Scope guide → brief hand-off (sessionStorage, `?from=pricing`, service preselected, summary shown) | Playwright | ✓ desktop + mobile |
| API: 405 on GET, 400 invalid email, bot honeypot accepted silently, 403 foreign origin, 503/429 when unconfigured | Playwright `request` | ✓ |
| Schema: situation enum, brief ≤ 2000 chars; header-injection-safe email rendering | Vitest `tests/unit/inquiry.test.ts` | ✓ |
| **Real delivery, success path** | `node qa/form-delivery.mjs`: local webhook receiver + `next start` with `INQUIRY_WEBHOOK_URL`, submit through the UI | ✓ receiver got `service=custom-software`, `situation=automate`, `budget=1-5l`, `brief="Need: Custom software\nSituation: Automate tasks\nBudget band: ₹1–5 lakh"`, honeypot stripped; visitor navigated to `/thank-you` only after the 200 acknowledgement |
| **Real delivery, failure path** | same script, receiver returns 500 | ✓ visitor sees "Your brief couldn't be delivered just now…", stays on `/contact` |

## Not tested (needs the owner)
Delivery to a real mailbox or CRM: requires the owner's Resend account (verified sending domain) or CRM webhook URL. After configuring, run `node qa/form-delivery.mjs` (adapted to the real endpoint) or submit one brief manually and confirm receipt. On serverless/multi-instance hosting, back the rate limiter with a shared store (`src/lib/inquiry/rateLimit.ts`). Publish an approved privacy notice before accepting real submissions.
