"use client";

import { useState } from "react";
import d from "@/components/demos/demo.module.css";
import s from "./PhoneJourney.module.css";

/**
 * ILLUSTRATIVE DEMO: one core mobile journey (book a service) with real screen state, plus the
 * backend pieces each step relies on. Keyboard: Back / Continue buttons; every option is a button.
 */

const SERVICES = [
  { id: "consult", name: "Consultation", mins: 30 },
  { id: "service", name: "Service appointment", mins: 60 },
  { id: "followup", name: "Follow-up", mins: 15 },
];
const TIMES = ["09:30", "11:00", "13:30", "16:00"];
const STEPS = ["Welcome", "Choose", "Time", "Confirm", "Done"] as const;
const SYSTEMS = ["App", "API", "Database", "Notifications"] as const;
/** Which systems each step talks to. */
const USES: Record<number, (typeof SYSTEMS)[number][]> = {
  0: ["App"],
  1: ["App", "API", "Database"],
  2: ["App", "API", "Database"],
  3: ["App", "API", "Database"],
  4: ["App", "API", "Database", "Notifications"],
};
const EXPLAIN: Record<number, string> = {
  0: "Onboarding runs on the phone only; nothing is sent until the person chooses to continue.",
  1: "Services and durations are loaded from the backend, so the team can change them without an app update.",
  2: "Availability is read live through the API, so two people cannot take the same slot.",
  3: "Confirming writes the booking to the database in one transaction.",
  4: "A notification service sends the confirmation and reminders; staff see the booking immediately.",
};

/**
 * `step` / `onStepChange` let the Solutions film drive the journey from scroll (the visitor can still
 * tap through it); `embedded` renders the app screen only, to sit on a phone-shaped display.
 */
export function PhoneJourney({ step: stepProp, onStepChange, embedded = false }: { step?: number; onStepChange?: (n: number) => void; embedded?: boolean } = {}) {
  const [stepState, setStepState] = useState(0);
  const step = stepProp ?? stepState;
  const go = (n: number) => {
    setStepState(n);
    onStepChange?.(n);
  };
  const [serviceState, setService] = useState<string | null>(null);
  const [timeState, setTime] = useState<string | null>(null);
  // When the film plays the journey, show the choices a visitor would make.
  const driven = stepProp !== undefined;
  const service = serviceState ?? (driven && step >= 2 ? SERVICES[0].id : null);
  const time = timeState ?? (driven && step >= 3 ? TIMES[0] : null);
  const svc = SERVICES.find((x) => x.id === service);
  const canNext = step === 0 || (step === 1 && !!service) || (step === 2 && !!time) || step === 3;

  const screen = (
          <div className={s.screen} key={step}>
            {step === 0 && (
              <div className={s.screenBody}>
                <span className={s.appMark} aria-hidden="true" />
                <p className={s.appTitle}>Book an appointment in under a minute.</p>
                <p className={s.appText}>Choose a service, pick a time, and we&rsquo;ll confirm by notification.</p>
              </div>
            )}
            {step === 1 && (
              <div className={s.screenBody}>
                <p className={s.appTitle}>What do you need?</p>
                {SERVICES.map((x) => (
                  <button key={x.id} type="button" className={s.option} aria-pressed={service === x.id} onClick={() => setService(x.id)}>
                    <b>{x.name}</b>
                    <span>{x.mins} min</span>
                  </button>
                ))}
              </div>
            )}
            {step === 2 && (
              <div className={s.screenBody}>
                <p className={s.appTitle}>Tomorrow</p>
                <div className={s.times}>
                  {TIMES.map((t, i) =>
                    i === 1 ? (
                      <span key={t} className={s.timeTaken}>
                        {t}
                      </span>
                    ) : (
                      <button key={t} type="button" className={s.time} aria-pressed={time === t} onClick={() => setTime(t)}>
                        {t}
                      </button>
                    ),
                  )}
                </div>
                <p className={s.appText}>Greyed times are already taken.</p>
              </div>
            )}
            {step === 3 && (
              <div className={s.screenBody}>
                <p className={s.appTitle}>Confirm visit</p>
                <dl className={s.summary}>
                  <dt>Service</dt>
                  <dd>{svc?.name}</dd>
                  <dt>When</dt>
                  <dd>Tomorrow, {time}</dd>
                  <dt>Duration</dt>
                  <dd>{svc?.mins} minutes</dd>
                </dl>
              </div>
            )}
            {step === 4 && (
              <div className={s.screenBody}>
                <span className={s.tick} aria-hidden="true">
                  ✓
                </span>
                <p className={s.appTitle}>You&rsquo;re booked.</p>
                <p className={s.appText}>
                  {svc?.name}, tomorrow at {time}. A reminder will arrive the evening before.
                </p>
              </div>
            )}
            <div className={s.screenFoot}>
              {step > 0 && step < 4 && (
                <button type="button" className={s.back} onClick={() => go(step - 1)}>
                  Back
                </button>
              )}
              {step < 4 ? (
                <button type="button" className={s.next} disabled={!canNext} onClick={() => go(step + 1)}>
                  {step === 0 ? "Get started" : step === 3 ? "Confirm booking" : "Continue"}
                </button>
              ) : (
                <button
                  type="button"
                  className={s.next}
                  onClick={() => {
                    go(0);
                    setService(null);
                    setTime(null);
                  }}
                >
                  Start again
                </button>
              )}
            </div>
          </div>
  );
  if (embedded) return <div className={s.embeddedScreen}>{screen}</div>;

  return (
    <div className={s.wrap}>
      <div className={s.phoneCol}>
        <div className={s.phone} aria-label={`Example app, step ${step + 1} of 5: ${STEPS[step]}`} role="group">
          <span className={s.notch} aria-hidden="true" />
          {screen}
        </div>
        <ol className={s.dots} aria-label="Journey progress">
          {STEPS.map((x, i) => (
            <li key={x} data-on={i <= step ? "true" : undefined} aria-current={i === step ? "step" : undefined}>
              <span className="visually-hidden">{x}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className={s.side}>
        <span className={d.illustrative}>Illustrative demonstration</span>
        <h3 className={s.sideTitle}>
          Step {step + 1}: {STEPS[step]}
        </h3>
        <p className={s.sideText} aria-live="polite">
          {EXPLAIN[step]}
        </p>
        <ol className={s.systems} aria-label="Systems involved in this step">
          {SYSTEMS.map((sys) => (
            <li key={sys} data-on={USES[step].includes(sys) ? "true" : undefined}>
              {sys}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
