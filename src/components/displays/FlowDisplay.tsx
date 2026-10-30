"use client";

import x from "./displays.module.css";
import s from "./FlowDisplay.module.css";

/**
 * Workflow automation on the Business automation room's display: one incoming request moves through
 * Receive → Classify → Route → Review → Action. Rules decide, a person approves, everything is logged.
 * Approve / Edit move it on. Sample content only.
 */
const STEPS = ["Receive", "Classify", "Route", "Review", "Action"] as const;
const LOG = [
  "Request received by email",
  "Classified: quote request (rule: “quote”, quantity, deadline)",
  "Routed to the sales team with a draft reply",
  "Approved by a team member",
  "Reply sent · follow-up scheduled in 3 days",
];

export function FlowDisplay({ step, go }: { step: number; go: (n: number) => void }) {
  return (
    <div className={`${x.screen} ${x.dark} ${s.flow}`}>
      <header className={s.head}>
        <b>Request automation</b>
        <span className={x.chip} data-tone="ok">
          Running · people approve
        </span>
      </header>
      <ol className={s.pipe} aria-label="Automation steps">
        {STEPS.map((n, i) => (
          <li key={n} data-state={i < step ? "done" : i === step ? "now" : undefined}>
            <span className={s.node}>{i < step ? "✓" : i + 1}</span>
            {n}
          </li>
        ))}
      </ol>
      <div className={s.body}>
        <div className={`${x.card} ${s.mail}`}>
          <p className={x.muted}>Incoming · just now</p>
          <b>Quote request</b>
          <p>&ldquo;Hi, could you send a quote for 40 units by the end of next month?&rdquo;</p>
        </div>
        <div className={s.stage} key={step}>
          {step === 0 && (
            <div className={`${x.card} ${x.fade}`}>
              <b className={s.big}>Received</b>
              <p className={x.muted}>Picked up from the shared inbox the moment it arrived, so nothing waits to be noticed.</p>
            </div>
          )}
          {step === 1 && (
            <div className={`${x.card} ${x.fade}`}>
              <b className={s.big}>Classified</b>
              <span className={s.tags}>
                <span className={x.chip}>Quote request</span>
                <span className={x.chip}>Quantity: 40</span>
                <span className={x.chip}>Due: next month</span>
              </span>
              <p className={x.muted}>Matched by simple rules; unclear messages go to a person instead.</p>
            </div>
          )}
          {step === 2 && (
            <div className={`${x.card} ${x.fade}`}>
              <b className={s.big}>Routed to Sales</b>
              <p className={x.muted}>With a draft reply and the customer&rsquo;s history attached.</p>
            </div>
          )}
          {step === 3 && (
            <div className={`${x.card} ${x.fade}`}>
              <b className={s.big}>Waiting for approval</b>
              <p className={s.draft}>&ldquo;Thanks for asking. Could you confirm the exact specification so we can quote accurately?&rdquo;</p>
              <span className={s.actions}>
                <button type="button" className={x.gold} onClick={() => go(4)}>
                  Approve &amp; send
                </button>
                <button type="button" className={x.btnGhost} onClick={() => go(4)}>
                  Edit first
                </button>
              </span>
            </div>
          )}
          {step === 4 && (
            <div className={`${x.card} ${x.fade}`}>
              <b className={s.big}>Done</b>
              <p className={x.muted}>Reply sent, the CRM updated and a follow-up scheduled. Nothing went out without a person agreeing.</p>
            </div>
          )}
        </div>
        <ol className={s.log} aria-label="Audit trail">
          {LOG.slice(0, step + 1).map((l, i) => (
            <li key={l}>
              <time>10:0{2 + i}</time>
              {l}
            </li>
          ))}
        </ol>
      </div>
      <span className={x.tag}>Illustrative · rules, not a trained model</span>
    </div>
  );
}
