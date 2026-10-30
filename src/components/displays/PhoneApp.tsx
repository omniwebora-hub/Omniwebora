"use client";

import x from "./displays.module.css";
import s from "./PhoneApp.module.css";

/**
 * A real-feeling phone app for the phone on the Mobile room's stand: status bar, app header, one
 * booking journey (any business: services, appointments) and a tab bar. `step` comes from scroll;
 * tapping the primary button moves the journey on. Sample content only.
 */
const SERVICES = [
  { name: "Consultation", mins: 30, note: "Talk through what you need" },
  { name: "Service appointment", mins: 60, note: "Our most booked option" },
  { name: "Follow-up", mins: 15, note: "Quick check after a visit" },
];
const DAYS = ["Mon 3", "Tue 4", "Wed 5", "Thu 6"];
const TIMES = ["09:30", "11:00", "12:30", "14:00", "15:30", "17:00"];
const TAKEN = new Set(["11:00", "15:30"]);

export function PhoneApp({ step, go }: { step: number; go: (n: number) => void }) {
  const next = () => go(step >= 4 ? 0 : step + 1);
  return (
    <div className={`${x.screen} ${s.phone}`}>
      <div className={s.status} aria-hidden="true">
        <b>9:41</b>
        <span className={s.icons}>
          <i className={s.signal} />
          <i className={s.wifi} />
          <i className={s.battery} />
        </span>
      </div>
      <header className={s.appBar}>
        <span className={s.logo} aria-hidden="true" />
        <b>Your Business</b>
        <span className={s.avatar} aria-hidden="true" />
      </header>

      <div className={s.body} key={step}>
        {step === 0 && (
          <div className={`${s.view} ${x.fade}`}>
            <p className={x.muted}>Good afternoon</p>
            <h3 className={`${x.h} ${s.title}`}>What can we do for you today?</h3>
            <button type="button" className={s.hero} onClick={next}>
              <span>Book an appointment</span>
              <small>Pick a service and a time in under a minute</small>
            </button>
            <div className={s.quick}>
              {["My bookings", "Orders", "Messages", "Support"].map((q) => (
                <span key={q} className={s.quickItem}>
                  <i />
                  {q}
                </span>
              ))}
            </div>
          </div>
        )}
        {step === 1 && (
          <div className={`${s.view} ${x.fade}`}>
            <h3 className={`${x.h} ${s.title}`}>Choose a service</h3>
            {SERVICES.map((v, i) => (
              <button key={v.name} type="button" className={s.option} data-on={i === 1 ? "true" : undefined} onClick={next}>
                <span>
                  <b>{v.name}</b>
                  <small>{v.note}</small>
                </span>
                <em>{v.mins} min</em>
              </button>
            ))}
          </div>
        )}
        {step === 2 && (
          <div className={`${s.view} ${x.fade}`}>
            <h3 className={`${x.h} ${s.title}`}>Pick a time</h3>
            <div className={s.days}>
              {DAYS.map((d, i) => (
                <span key={d} data-on={i === 1 ? "true" : undefined}>
                  {d}
                </span>
              ))}
            </div>
            <div className={s.times}>
              {TIMES.map((t) => (
                <button key={t} type="button" disabled={TAKEN.has(t)} data-on={t === "12:30" ? "true" : undefined} onClick={next}>
                  {t}
                </button>
              ))}
            </div>
            <p className={`${x.muted} ${s.small}`}>Greyed times are already taken: availability is live.</p>
          </div>
        )}
        {step === 3 && (
          <div className={`${s.view} ${x.fade}`}>
            <h3 className={`${x.h} ${s.title}`}>Confirm your booking</h3>
            <dl className={s.summary}>
              <dt>Service</dt>
              <dd>Service appointment · 60 min</dd>
              <dt>When</dt>
              <dd>Tue 4, 12:30</dd>
              <dt>Reminder</dt>
              <dd>The day before</dd>
            </dl>
            <button type="button" className={`${x.btn} ${s.wide}`} onClick={next}>
              Confirm booking
            </button>
          </div>
        )}
        {step === 4 && (
          <div className={`${s.view} ${s.done} ${x.fade}`}>
            <span className={s.tick} aria-hidden="true">
              ✓
            </span>
            <h3 className={`${x.h} ${s.title}`}>You&rsquo;re booked</h3>
            <p className={x.muted}>Tue 4 at 12:30 · Service appointment</p>
            <ul className={s.after}>
              <li>Added to your calendar</li>
              <li>Reminder set for the day before</li>
              <li>Appears instantly in the team&rsquo;s schedule</li>
            </ul>
            <button type="button" className={`${x.btnGhost} ${s.wide}`} onClick={next}>
              Done
            </button>
          </div>
        )}
      </div>

      <nav className={s.tabs} aria-hidden="true">
        {["Home", "Bookings", "Messages", "Account"].map((t, i) => (
          <span key={t} data-on={(step === 0 ? 0 : 1) === i ? "true" : undefined}>
            <i />
            {t}
          </span>
        ))}
      </nav>
      <span className={s.home} aria-hidden="true" />
    </div>
  );
}
