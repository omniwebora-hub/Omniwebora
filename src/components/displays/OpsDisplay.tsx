"use client";

import x from "./displays.module.css";
import s from "./OpsDisplay.module.css";

/**
 * ERP / CRM console on the Business software room's wall. One order travels through the system:
 * the customer record (CRM) → stock reserved (Inventory) → invoice raised (Billing), with no retyping.
 * Clicking a module jumps there. Sample data only.
 */
const MODULES = ["CRM", "Inventory", "Billing"] as const;

export function OpsDisplay({ step, go }: { step: number; go: (n: number) => void }) {
  return (
    <div className={`${x.screen} ${s.console}`}>
      <aside className={s.side}>
        <b className={s.app}>
          <span aria-hidden="true" /> Operations
        </b>
        {MODULES.map((m, i) => (
          <button key={m} type="button" className={s.nav} data-on={i === step ? "true" : undefined} onClick={() => go(i)}>
            {m}
          </button>
        ))}
        <span className={s.navDim}>Reports</span>
        <span className={s.navDim}>Team</span>
      </aside>

      <main className={s.main}>
        <div className={s.flow} aria-label="Order 2207 across modules">
          <span className={s.flowLabel}>Order #2207</span>
          {MODULES.map((m, i) => (
            <span key={m} className={s.flowStep} data-state={i < step ? "done" : i === step ? "now" : undefined}>
              {i < step ? "✓ " : ""}
              {m === "CRM" ? "Order created" : m === "Inventory" ? "Stock reserved" : "Invoice raised"}
            </span>
          ))}
          <span className={x.chip} data-tone="ok">
            One shared record
          </span>
        </div>

        <div className={s.panel} key={step}>
          {step === 0 && (
            <div className={`${s.grid} ${x.fade}`}>
              <div className={x.card}>
                <p className={x.muted}>Customer</p>
                <h3 className={`${x.h} ${s.big}`}>Sample customer</h3>
                <p className={x.muted}>C-104 · repeat customer · owner: sales team</p>
              </div>
              <ol className={`${x.card} ${s.timeline}`}>
                <li>
                  <b>Enquiry received</b> <span className={x.muted}>from the website</span>
                </li>
                <li>
                  <b>Quote accepted</b> <span className={x.muted}>Q-318</span>
                </li>
                <li data-now="true">
                  <b>Order #2207 created</b> <span className={x.muted}>2 items</span>
                </li>
              </ol>
            </div>
          )}
          {step === 1 && (
            <div className={`${s.rows} ${x.fade}`}>
              {[
                { item: "Product A", need: 24, have: 120, ok: true },
                { item: "Product B", need: 6, have: 4, ok: false },
              ].map((r) => (
                <div key={r.item} className={`${x.card} ${s.stock}`}>
                  <b>{r.item}</b>
                  <span className={s.bar}>
                    <i style={{ width: `${Math.min(100, (r.need / Math.max(r.have, r.need)) * 100)}%` }} />
                  </span>
                  <span className={x.muted}>
                    {r.need} needed · {r.have} in stock
                  </span>
                  <span className={x.chip} data-tone={r.ok ? "ok" : "warn"}>
                    {r.ok ? `${r.need} reserved` : "Reorder raised"}
                  </span>
                </div>
              ))}
            </div>
          )}
          {step === 2 && (
            <div className={`${s.grid} ${x.fade}`}>
              <div className={x.card}>
                <p className={x.muted}>Invoice</p>
                <h3 className={`${x.h} ${s.big}`}>INV-881</h3>
                <p className={x.muted}>For order #2207 · Sample customer</p>
                <span className={x.chip} data-tone="ok">
                  Sent to customer
                </span>
              </div>
              <div className={`${x.card} ${s.lines}`}>
                <p>
                  <span>Product A × 24</span>
                  <span className={x.muted}>from the order</span>
                </p>
                <p>
                  <span>Product B × 6</span>
                  <span className={x.muted}>from the order</span>
                </p>
                <p className={s.note}>Created from the order: nothing was typed twice.</p>
              </div>
            </div>
          )}
        </div>
      </main>
      <span className={x.tag}>Illustrative · sample data</span>
    </div>
  );
}
