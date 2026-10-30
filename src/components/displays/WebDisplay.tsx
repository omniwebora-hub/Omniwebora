"use client";

import x from "./displays.module.css";
import s from "./WebDisplay.module.css";

/**
 * The website on the Websites room's wall: one homepage for any business, reflowing desktop → tablet
 * → phone with scroll, and finishing with an enquiry arriving. Real responsive CSS (container
 * queries), not a picture. Sample content only.
 */
const DEVICES = ["Desktop", "Tablet", "Phone"] as const;

export function WebDisplay({ step, go }: { step: number; go: (n: number) => void }) {
  return (
    <div className={`${x.screen} ${s.wall}`}>
      <div className={s.device} data-device={DEVICES[step]}>
        <div className={s.chrome} aria-hidden="true">
          <i />
          <i />
          <i />
          <span>yourbusiness.com</span>
        </div>
        <div className={s.site}>
          <nav className={s.nav}>
            <b className={s.brand}>
              <span aria-hidden="true" /> Your Business
            </b>
            <span className={s.links}>
              <span>Services</span>
              <span>About</span>
              <span>Contact</span>
            </span>
            <button type="button" className={s.cta} onClick={() => go(2)}>
              Book now
            </button>
          </nav>
          <section className={s.hero}>
            <div className={s.copy}>
              <p className={s.kicker}>Trusted local service</p>
              <h3 className={x.h}>Clear about what we do. Easy to book.</h3>
              <p className={x.muted}>See what we offer, check availability and get in touch in under a minute, on any screen.</p>
              <span className={s.actions}>
                <button type="button" className={x.btn} onClick={() => go(2)}>
                  Book an appointment
                </button>
                <span className={s.ghost}>See services</span>
              </span>
            </div>
            <div className={s.image} aria-hidden="true" />
          </section>
          <ul className={s.cards}>
            {[
              ["Consultation", "Tell us what you need"],
              ["Our services", "What we offer, clearly priced on request"],
              ["Support", "Help after you buy or book"],
            ].map(([t, d]) => (
              <li key={t}>
                <b>{t}</b>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {step === 2 && (
        <div className={`${s.toast} ${x.fade}`} role="status">
          <span className={x.chip} data-tone="ok">
            New enquiry
          </span>
          <span>
            <b>Consultation request</b>
            <small>Sent from a phone · name, number and preferred time included</small>
          </span>
        </div>
      )}
      <span className={x.tag}>Example site · any business</span>
    </div>
  );
}
