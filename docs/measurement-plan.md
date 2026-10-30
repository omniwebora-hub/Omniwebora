# Measurement plan

## Principles
- Privacy-first: no cookies, no cross-site tracking, no personal data in events.
- Nothing is sent anywhere until a provider is configured. Today every event is a local DOM `CustomEvent` only.
- Measure the conversion path (do people find the right service and send an inquiry?), not vanity numbers.

## Implementation
`src/lib/analytics.ts → track(event, props)`
1. Always dispatches `window` event `omni:track` with `{ event, props }` (used by the e2e tests).
2. If `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set, the root layout loads Plausible (cookieless) and `track` forwards the event.
   Without that variable no third-party script loads.

## Events
| Event | Fired when | Props |
|---|---|---|
| `select_hero_service` | A hero panel is opened | `service` |
| `view_service` | A link to a service page is clicked | `service`, `location` |
| `start_project` | Any "Start a project" / "Let's Talk" CTA is clicked | `location`, `service?` |
| `click_process` | "View Our Process" / process links | `location` |
| `view_work` | Link to the work page | `location` |
| `submit_inquiry` | A valid form is submitted (before the server responds) | `location`, `service` |
| `inquiry_success` | Server confirmed delivery | `location`, `service` |
| `inquiry_error` | Delivery failed or the network is offline | `location`, `code` |

## Funnel to monitor (once analytics are enabled)
`page view → select_hero_service / view_service → start_project → submit_inquiry → inquiry_success`
- `submit_inquiry` without a following `inquiry_success` points to transport problems. Check `inquiry_error.code`.
- `start_project` by `location` shows which CTAs work.

## Before enabling
- [ ] Choose a provider (Plausible recommended for parity with the code) and set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
- [ ] Update the privacy notice with the provider name and data retention.
- [ ] If a cookie-based tool is ever added, add a consent banner first. The current code assumes cookieless analytics only.
- [ ] Register custom goals in the provider for the events above.

## Web performance
Track Core Web Vitals in production (Plausible doesn't, so use Search Console CrUX, or add the `web-vitals` package
reporting to the same endpoint). Targets: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at the 75th percentile.
