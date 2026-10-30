"use client";

import { useId, useState } from "react";
import { onTabKeys } from "@/lib/tabKeys";
import d from "@/components/demos/demo.module.css";
import s from "./MarketingStudio.module.css";

/**
 * Digital marketing demonstration (Meta Ads + SEO) for a fictional business. Everything here is
 * illustrative: no live data, no results or performance figures are shown or implied.
 * `view` / `onViewChange` let the Solutions film drive the open view from scroll; visitors can still
 * switch views and use every control.
 */
const VIEWS = ["Meta Ads", "Tracking", "SEO"] as const;
export type MarketingView = (typeof VIEWS)[number];

const OBJECTIVES = {
  Enquiries: { headline: "Questions about what we offer? Message us.", cta: "Send message", lands: "Enquiry form" },
  Bookings: { headline: "Book your appointment this week", cta: "Book now", lands: "Booking page" },
  "Online sales": { headline: "Our latest range, delivered", cta: "Shop now", lands: "Product page" },
} as const;
type Objective = keyof typeof OBJECTIVES;

const AUDIENCE = [
  { id: "near", label: "Near your business location" },
  { id: "age", label: "Ages 25–54" },
  { id: "interest", label: "Interested in what you offer" },
  { id: "visited", label: "Visited the website (retargeting)" },
];

const TRACKING = [
  { id: "pixel", label: "Meta Pixel on every page", why: "Without it, nothing that happens on the site can be linked back to an ad." },
  { id: "event", label: "Enquiry, booking or purchase recorded as an event", why: "Counts the action you actually want, not just clicks." },
  { id: "utm", label: "Campaign tags on every ad link", why: "Lets analytics tell campaigns, ads and organic visits apart." },
  { id: "consent", label: "Cookie consent respected", why: "Tracking only runs where the visitor has agreed to it." },
];

const SEO_CHECKS = [
  { id: "speed", label: "Pages load quickly on phones" },
  { id: "titles", label: "Every page has its own title and description" },
  { id: "schema", label: "Business details marked up for search engines" },
  { id: "local", label: "Business profile and location listings kept consistent" },
];

export function MarketingStudio({ view: viewProp, onViewChange, embedded = false }: { view?: MarketingView; onViewChange?: (v: MarketingView) => void; embedded?: boolean } = {}) {
  const uid = useId();
  const [viewState, setViewState] = useState<MarketingView>("Meta Ads");
  const view = viewProp ?? viewState;
  const setView = (v: MarketingView) => {
    setViewState(v);
    onViewChange?.(v);
  };
  const [objective, setObjective] = useState<Objective>("Enquiries");
  const [aud, setAud] = useState<string[]>(["near", "interest"]);
  const [track, setTrack] = useState<string[]>(["pixel", "utm"]);
  const [title, setTitle] = useState("Your Service in Your City | Your Business Name");
  const [desc, setDesc] = useState("What you offer, who it is for, and why customers choose you. Enquire, book or order online in a minute.");
  const [seo, setSeo] = useState<string[]>(["titles"]);
  const o = OBJECTIVES[objective];
  const toggle = (list: string[], set: (v: string[]) => void, id: string) => set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  const ready = TRACKING.every((t) => track.includes(t.id));

  return (
    <div className={`${d.frame} ${embedded ? s.embedded : ""}`} data-demo="marketing">
      <div className={d.toolbar}>
        <span className={d.toolbarTitle}>Campaign planner</span>
        <span className={d.illustrative}>Illustrative demonstration · any business · no live data</span>
      </div>
      <div className={s.tabs} role="tablist" aria-label="Marketing views" onKeyDown={onTabKeys}>
        {VIEWS.map((v) => (
          <button key={v} type="button" role="tab" id={`${uid}-tab-${v}`} aria-selected={view === v} aria-controls={`${uid}-panel`} tabIndex={view === v ? 0 : -1} className={d.segment} onClick={() => setView(v)}>
            {v}
          </button>
        ))}
      </div>
      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${view}`} className={s.panel}>
        {view === "Meta Ads" && (
          <div className={s.split}>
            <div className={s.controls}>
              <p className={s.label}>What should the ad lead to?</p>
              <div className={d.segmented} role="group" aria-label="Campaign objective">
                {(Object.keys(OBJECTIVES) as Objective[]).map((k) => (
                  <button key={k} type="button" className={d.segment} aria-pressed={objective === k} onClick={() => setObjective(k)}>
                    {k}
                  </button>
                ))}
              </div>
              <p className={s.label}>Who should see it?</p>
              <ul className={s.checks}>
                {AUDIENCE.map((a) => (
                  <li key={a.id}>
                    <label>
                      <input type="checkbox" checked={aud.includes(a.id)} onChange={() => toggle(aud, setAud, a.id)} />
                      {a.label}
                    </label>
                  </li>
                ))}
              </ul>
              <p className={s.note}>Budget, schedule and spend are agreed with you; advertising is paid to the platform separately.</p>
            </div>
            <figure className={s.ad} aria-label="Ad preview">
              <div className={s.adHead}>
                <span className={s.avatar} aria-hidden="true" />
                <span>
                  <b>Your Business</b>
                  <small>Sponsored</small>
                </span>
              </div>
              <div className={s.adImage} role="img" aria-label="Example ad image" />
              <figcaption className={s.adFoot}>
                <span>{o.headline}</span>
                <span className={s.adCta}>{o.cta}</span>
              </figcaption>
              <p className={s.adMeta}>
                Shown to: {aud.length ? AUDIENCE.filter((a) => aud.includes(a.id)).map((a) => a.label.toLowerCase()).join(" · ") : "choose at least one audience"} → lands on the {o.lands.toLowerCase()}
              </p>
            </figure>
          </div>
        )}

        {view === "Tracking" && (
          <div className={s.split}>
            <ol className={s.funnel} aria-label="From ad to recorded enquiry">
              {["Ad shown", "Click", o.lands, `${objective === "Online sales" ? "Purchase" : objective === "Bookings" ? "Booking" : "Enquiry"} recorded`].map((step, i) => {
                const ok = i < 2 || (i === 2 ? track.includes("utm") : track.includes("pixel") && track.includes("event"));
                return (
                  <li key={step} data-ok={ok ? "true" : undefined}>
                    <span className={s.stepNo}>{i + 1}</span>
                    {step}
                    <span className={d.chip} data-tone={ok ? "ok" : "warn"}>
                      {ok ? "measured" : "not measured"}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className={s.controls}>
              <p className={s.label}>What is set up on the website?</p>
              <ul className={s.checks}>
                {TRACKING.map((t) => (
                  <li key={t.id}>
                    <label>
                      <input type="checkbox" checked={track.includes(t.id)} onChange={() => toggle(track, setTrack, t.id)} />
                      <span>
                        {t.label}
                        <small>{t.why}</small>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              <p className={s.status} aria-live="polite">
                {ready ? "Ready: every enquiry can be traced to the campaign that brought it." : "Some results would be invisible: complete the checklist before spending on ads."}
              </p>
            </div>
          </div>
        )}

        {view === "SEO" && (
          <div className={s.split}>
            <div className={s.controls}>
              <label className={s.field}>
                Page title <small>{title.length} / 60</small>
                <input value={title} onChange={(e) => setTitle(e.target.value)} aria-invalid={title.length > 60} />
              </label>
              <label className={s.field}>
                Meta description <small>{desc.length} / 155</small>
                <textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} aria-invalid={desc.length > 155} />
              </label>
              <ul className={s.checks}>
                {SEO_CHECKS.map((c) => (
                  <li key={c.id}>
                    <label>
                      <input type="checkbox" checked={seo.includes(c.id)} onChange={() => toggle(seo, setSeo, c.id)} />
                      {c.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.serp} aria-label="Search result preview">
              <p className={s.serpUrl}>yourbusiness.com › services</p>
              <p className={s.serpTitle}>{title.length > 60 ? `${title.slice(0, 57)}…` : title}</p>
              <p className={s.serpDesc}>{desc.length > 155 ? `${desc.slice(0, 152)}…` : desc}</p>
              <p className={s.note}>
                {seo.length}/{SEO_CHECKS.length} foundations in place. Rankings depend on search engines and competition; we do not promise positions.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
