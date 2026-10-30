/**
 * First-touch attribution for the current browser session (sessionStorage only, no cookies).
 * Disclosed next to the inquiry form; only sent if the visitor submits the form.
 */
export type Attribution = Partial<Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_term" | "utm_content" | "referrer" | "landing", string>>;

const KEY = "omni_attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export function captureAttribution() {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const data: Attribution = {};
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) data[k] = v.slice(0, 120);
    }
    if (document.referrer) {
      try {
        const ref = new URL(document.referrer);
        if (ref.origin !== window.location.origin) data.referrer = ref.origin;
      } catch {}
    }
    data.landing = window.location.pathname.slice(0, 120);
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable: attribution is optional */
  }
}

export function getAttribution(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}") as Attribution;
  } catch {
    return {};
  }
}
