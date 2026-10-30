"use client";

import x from "./displays.module.css";
import s from "./CampaignDisplay.module.css";

/**
 * Campaign workspace on the Digital marketing room's display: a Meta ad and who sees it, the tracking
 * that proves what it brought in, and how the page appears in search. No results or figures are shown
 * or implied. Tabs switch views. Sample content only.
 */
const VIEWS = ["Meta Ads", "Tracking", "SEO"] as const;

export function CampaignDisplay({ step, go }: { step: number; go: (n: number) => void }) {
  return (
    <div className={`${x.screen} ${s.studio}`}>
      <header className={s.head}>
        <b>Campaign workspace</b>
        <span className={s.tabs} role="group" aria-label="Views">
          {VIEWS.map((v, i) => (
            <button key={v} type="button" data-on={i === step ? "true" : undefined} onClick={() => go(i)}>
              {v}
            </button>
          ))}
        </span>
      </header>
      <div className={s.body} key={step}>
        {step === 0 && (
          <div className={`${s.split} ${x.fade}`}>
            <figure className={`${x.card} ${s.ad}`}>
              <div className={s.adHead}>
                <span aria-hidden="true" />
                <span>
                  <b>Your Business</b>
                  <small>Sponsored</small>
                </span>
              </div>
              <div className={s.adImg} aria-hidden="true" />
              <figcaption>
                <span>Book your appointment this week</span>
                <em>Book now</em>
              </figcaption>
            </figure>
            <div className={s.plan}>
              <p className={s.label}>Goal</p>
              <span className={x.chip} data-tone="ink">
                Bookings
              </span>
              <p className={s.label}>Who sees it</p>
              <span className={s.chips}>
                <span className={x.chip}>Near your location</span>
                <span className={x.chip}>Interested in what you offer</span>
                <span className={x.chip}>Visited your site</span>
              </span>
              <p className={x.muted}>Facebook and Instagram, scheduled and budgeted with you.</p>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className={`${s.split} ${x.fade}`}>
            <ol className={s.funnel}>
              {["Ad shown", "Clicked", "Booking page", "Booking recorded"].map((f, i) => (
                <li key={f} style={{ width: `${100 - i * 12}%` }}>
                  <span>{f}</span>
                  <span className={x.chip} data-tone="ok">
                    tracked
                  </span>
                </li>
              ))}
            </ol>
            <div className={s.plan}>
              <p className={s.label}>Set up before spending</p>
              <ul className={s.checks}>
                <li>Pixel on every page</li>
                <li>Booking recorded as a conversion</li>
                <li>Campaign tags on every link</li>
                <li>Cookie consent respected</li>
              </ul>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className={`${s.split} ${x.fade}`}>
            <div className={`${x.card} ${s.serp}`}>
              <span className={s.query}>your service near me</span>
              <p className={s.url}>yourbusiness.com › services</p>
              <p className={s.title}>Your Service in Your City | Your Business</p>
              <p className={x.muted}>What you offer, who it is for and why customers choose you. Book or enquire online in a minute.</p>
              <p className={s.sitelinks}>
                <span>Services</span>
                <span>Book now</span>
                <span>Contact</span>
              </p>
            </div>
            <div className={s.plan}>
              <p className={s.label}>Foundations</p>
              <ul className={s.checks}>
                <li>A clear title and description for every page</li>
                <li>Fast on phones</li>
                <li>Business details marked up for search</li>
                <li>Listings consistent everywhere</li>
              </ul>
              <p className={x.muted}>No ranking promises: we build what search engines reward.</p>
            </div>
          </div>
        )}
      </div>
      <span className={x.tag}>Illustrative · no live data</span>
    </div>
  );
}
