"use client";

import { useEffect, useRef, useState } from "react";
import d from "@/components/demos/demo.module.css";
import s from "./AutomationRunner.module.css";

/**
 * ILLUSTRATIVE DEMO: input → classification → routing rules → human review → action, with an audit
 * trail. Classification here is simple keyword matching so the result is deterministic and
 * explainable; it is not a trained model and makes no accuracy claim.
 */

type Sample = { id: string; from: string; text: string; signals: string[]; category: string; team: string; draft: string };
const SAMPLES: Sample[] = [
  {
    id: "a",
    from: "Sample sender A",
    text: "Hi, could you send a quote for 40 units by the end of next month?",
    signals: ["quote", "40", "by … next month"],
    category: "Sales enquiry",
    team: "Sales",
    draft: "Thanks for asking. Could you confirm the exact specification so we can quote accurately?",
  },
  {
    id: "b",
    from: "Sample sender B",
    text: "Invoice 882 shows the wrong GST number. Please correct and resend.",
    signals: ["invoice", "GST", "correct"],
    category: "Billing correction",
    team: "Accounts",
    draft: "Sorry about that. We'll reissue invoice 882 with the corrected GST number today.",
  },
  {
    id: "c",
    from: "Sample sender C",
    text: "Can someone call me back about something?",
    signals: [],
    category: "Unclear: needs a person",
    team: "Front desk",
    draft: "",
  },
];

const STEPS = ["Receive", "Classify", "Route", "Human review", "Action"] as const;

const entriesFor = (sample: (typeof SAMPLES)[number]) => [
  `Received message from ${sample.from}`,
  sample.signals.length ? `Classified as “${sample.category}” (matched: ${sample.signals.join(", ")})` : "No rule matched with confidence → marked for a person",
  `Routed to ${sample.team}${sample.draft ? " with a draft reply" : ""}`,
];
const decisionLines = (sample: (typeof SAMPLES)[number], kind: "approved" | "edited") => [
  kind === "approved" ? `${sample.team} approved the draft` : `${sample.team} edited the reply before sending`,
  sample.draft ? "Reply sent · ticket created in the CRM" : "Call-back task created for the front desk",
];

/**
 * `step` (0 Receive … 4 Action) lets the Solutions film play the run from scroll; any click hands
 * control to the visitor until the film moves to its next step. `embedded` fits it to a display.
 */
export function AutomationRunner({ step: stepProp, embedded = false }: { step?: number; embedded?: boolean } = {}) {
  const [sampleId, setSampleId] = useState("a");
  const [stepState, setStep] = useState(-1);
  const [decisionState, setDecision] = useState<"approved" | "edited" | null>(null);
  const [logState, setLog] = useState<string[]>([]);
  const [touchedAt, setTouchedAt] = useState<number | null>(null);
  const timer = useRef<number>(0);
  const sample = SAMPLES.find((x) => x.id === sampleId)!;
  const driven = stepProp !== undefined && touchedAt !== stepProp;
  const touch = () => {
    if (stepProp !== undefined) setTouchedAt(stepProp);
  };
  const step = driven ? stepProp : stepState;
  const decision = driven ? (stepProp >= 4 ? "approved" : null) : decisionState;
  const log = driven ? [...entriesFor(sample).slice(0, Math.min(stepProp + 1, 3)), ...(stepProp >= 4 ? decisionLines(sample, "approved") : [])] : logState;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function run() {
    touch();
    window.clearTimeout(timer.current);
    setDecision(null);
    setLog([]);
    const entries = entriesFor(sample);
    let i = 0;
    const tick = () => {
      setStep(i);
      setLog((l) => [...l, entries[i]]);
      i += 1;
      if (i < entries.length) timer.current = window.setTimeout(tick, reduced() ? 0 : 650);
      else timer.current = window.setTimeout(() => setStep(3), reduced() ? 0 : 650);
    };
    tick();
  }

  function decide(kind: "approved" | "edited") {
    // Taking over from the film mid-run keeps what the visitor is looking at.
    if (driven) setLog(entriesFor(sample));
    touch();
    setDecision(kind);
    setStep(4);
    setLog((l) => [...l, ...decisionLines(sample, kind)]);
  }

  return (
    <div className={`${d.frame} ${d.frameDark} ${embedded ? s.embedded : ""}`} data-demo="automation">
      <div className={d.toolbar}>
        <span className={d.toolbarTitle}>Enquiry intake automation</span>
        <span className={d.illustrative}>Illustrative demonstration · rules, not a trained model</span>
      </div>
      <div className={`${d.body} ${s.grid}`}>
        <div className={s.inbox}>
          <p className={s.label} id="ar-samples">
            Sample messages
          </p>
          <div role="group" aria-labelledby="ar-samples" className={s.samples}>
            {SAMPLES.map((x) => (
              <button
                key={x.id}
                type="button"

                aria-pressed={sampleId === x.id}
                className={s.sample}
                onClick={() => {
                  touch();
                  setSampleId(x.id);
                  setStep(-1);
                  setDecision(null);
                  setLog([]);
                }}
              >
                <b>{x.from}</b>
                <span>{x.text}</span>
              </button>
            ))}
          </div>
          <button type="button" className={d.buttonGold} onClick={run} disabled={step >= 0 && step < 3}>
            {step === -1 ? "Run automation" : "Run again"}
          </button>
        </div>

        <div className={s.flow}>
          <ol className={s.steps}>
            {STEPS.map((x, i) => (
              <li key={x} data-state={i < step || (i === 4 && decision) ? "done" : i === step ? "active" : undefined}>
                <span className={s.stepName}>{x}</span>
                {i === 1 && step >= 1 && <span className={s.stepDetail}>{sample.category}</span>}
                {i === 2 && step >= 2 && <span className={s.stepDetail}>→ {sample.team}</span>}
              </li>
            ))}
          </ol>

          <div className={s.review} aria-live="polite">
            {step === 3 && !decision && (
              <>
                <p className={s.label}>Waiting for {sample.team}</p>
                {sample.draft ? <blockquote className={s.draft}>{sample.draft}</blockquote> : <p className={d.note}>No draft: a person decides what happens next.</p>}
                <div className={s.reviewActions}>
                  <button type="button" className={d.buttonGold} onClick={() => decide("approved")}>
                    {sample.draft ? "Approve & send" : "Create call-back task"}
                  </button>
                  {sample.draft && (
                    <button type="button" className={d.buttonGhost} onClick={() => decide("edited")}>
                      Edit first
                    </button>
                  )}
                </div>
              </>
            )}
            {decision && <p className={d.note}>Done. Nothing was sent unattended: a person made the final call.</p>}
            {step === -1 && <p className={d.note}>Pick a message and run it. The automation proposes, a person decides.</p>}
          </div>
        </div>

        <div className={s.auditCol}>
          <p className={s.label} id="ar-audit">
            Audit trail
          </p>
          {log.length ? (
            <ol className={d.log} aria-labelledby="ar-audit">
              {log.map((l, i) => (
                <li key={i} className={d.enter}>
                  <time>{`10:${String(2 + i).padStart(2, "0")}`}</time>
                  {l}
                </li>
              ))}
            </ol>
          ) : (
            <p className={d.note}>Each decision is recorded with its time and who made it.</p>
          )}
        </div>
      </div>
    </div>
  );
}
