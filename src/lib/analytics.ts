/**
 * Minimal, consent-aware analytics facade. See docs/measurement-plan.md.
 *
 * - Always dispatches a DOM CustomEvent ("omni:track") so behaviour is testable and a future
 *   provider can subscribe without touching components.
 * - Forwards to Plausible (cookieless) only when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is configured and
 *   the script has loaded. Nothing is sent anywhere otherwise.
 */
export type TrackEvent =
  | "nav_service_click"
  | "pricing_track_select"
  | "scope_guide_complete"
  | "contact_start"
  | "contact_submit_success"
  | "demo_open"
  | "project_cta_click"
  | "view_service"
  | "start_project"
  | "submit_inquiry"
  | "inquiry_success"
  | "inquiry_error"
  | "click_process"
  | "view_work";

type Props = Record<string, string | number | boolean>;
type PlausibleWindow = Window & { plausible?: (event: string, options?: { props?: Props }) => void };

export function track(event: TrackEvent, props?: Props) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("omni:track", { detail: { event, props } }));
  (window as PlausibleWindow).plausible?.(event, props ? { props } : undefined);
}
