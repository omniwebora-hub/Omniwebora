"use client";

import x from "./displays.module.css";
import s from "./IdeaWall.module.css";

/**
 * The Home product wall: one business idea ("let customers book without calling") becomes an app,
 * a website and a connected system. The same booking (#1042) appears on every screen, which is the
 * point. Steps: 0 idea · 1 app · 2 website · 3 one system. General, sample content only.
 */

export function IdeaTablet({ step }: { step: number }) {
  if (step < 2) return <Sketch label="Website" />;
  return (
    <div className={`${x.screen} ${s.tablet}`}>
      <div className={s.siteBar}>
        <b>
          <i aria-hidden="true" /> Your Business
        </b>
        <span>Book online</span>
      </div>
      <div className={`${s.siteBody} ${x.fade}`} key={step}>
        <h3 className={x.h}>Book an appointment</h3>
        <p className={x.muted}>Tuesday 4</p>
        <div className={s.slots}>
          {["09:30", "11:00", "12:30", "14:00", "15:30", "17:00"].map((t) => (
            <span key={t} data-on={t === "12:30" ? "true" : undefined} data-off={t === "11:00" ? "true" : undefined}>
              {t}
            </span>
          ))}
        </div>
        {step === 3 ? (
          <>
            <p className={s.booked}>
              <span className={x.chip} data-tone="ok">
                Booked
              </span>{" "}
              #1042 · Tue 12:30
            </p>
            <dl className={s.summary}>
              <div>
                <dt>Service</dt>
                <dd>Consultation · 45 min</dd>
              </div>
              <div>
                <dt>With</dt>
                <dd>First available team member</dd>
              </div>
              <div>
                <dt>Reminder</dt>
                <dd>The day before, by message</dd>
              </div>
            </dl>
            <p className={s.sync}>
              <span aria-hidden="true">✓</span> Already in the team&rsquo;s schedule. Nothing to retype.
            </p>
          </>
        ) : (
          <button type="button" className={`${x.btn} ${s.wide}`}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

export function IdeaWide({ step }: { step: number }) {
  if (step === 0)
    return (
      <div className={`${x.screen} ${s.idea}`}>
        <p className={s.ideaKicker}>The idea</p>
        <p className={`${x.h} ${s.ideaText} ${x.fade}`}>&ldquo;Let customers book without calling.&rdquo;</p>
        <p className={x.muted}>One sentence is enough to start.</p>
      </div>
    );
  if (step < 3) return <Sketch label="Operations system" wide />;
  return (
    <div className={`${x.screen} ${s.ops}`}>
      <header className={s.opsHead}>
        <b>Today&rsquo;s schedule</b>
        <span className={x.chip} data-tone="ok">
          Live · one system
        </span>
      </header>
      <ol className={`${s.rows} ${x.fade}`}>
        {[
          { t: "09:30", what: "Consultation", from: "Phone call" },
          { t: "12:30", what: "Service appointment · #1042", from: "App", hot: true },
          { t: "14:00", what: "Follow-up", from: "Website" },
          { t: "17:00", what: "Consultation", from: "Website" },
        ].map((r) => (
          <li key={r.t} data-hot={r.hot ? "true" : undefined}>
            <time>{r.t}</time>
            <b>{r.what}</b>
            <span>{r.from}</span>
            {r.hot && (
              <span className={x.chip} data-tone="ok">
                New · reminder set
              </span>
            )}
          </li>
        ))}
      </ol>
      <span className={x.tag}>Illustrative · sample data</span>
    </div>
  );
}

function Sketch({ label, wide = false }: { label: string; wide?: boolean }) {
  return (
    <div className={`${x.screen} ${s.sketch}`} data-wide={wide ? "true" : undefined}>
      <span className={s.sketchLabel}>{label}</span>
      <i />
      <i />
      <i />
      {wide && <i />}
    </div>
  );
}
