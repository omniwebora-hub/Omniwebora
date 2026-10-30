"use client";

import { useState } from "react";
import { stages, type Stage } from "@/content/approach";
import { onTabKeys } from "@/lib/tabKeys";
import s from "./StageExplorer.module.css";

/**
 * The seven brochure stages (Discover → Scale) on one rail. Each stage shows the artefact it
 * typically produces, drawn in HTML. Tabs pattern: click, or arrow keys once a stage is focused.
 */
export function StageExplorer({ compact = false, initial = 0 }: { compact?: boolean; initial?: number }) {
  const [i, setI] = useState(initial);
  const stage = stages[i];

  return (
    <div className={`${s.wrap} ${compact ? s.compact : ""}`}>
      <div className={s.rail} role="tablist" aria-label="Seven stages" onKeyDown={onTabKeys}>
        <span className={s.track} aria-hidden="true">
          <span className={s.fill} style={{ transform: `scaleX(${i / (stages.length - 1)})` }} />
        </span>
        {stages.map((x, n) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            id={`stage-${x.id}`}
            aria-selected={i === n}
            aria-controls="stage-panel"
            tabIndex={i === n ? 0 : -1}
            className={s.stop}
            data-past={n < i ? "true" : undefined}
            onClick={() => setI(n)}
          >
            <span className={s.stopDot} aria-hidden="true" />
            <span className={s.stopNum}>0{n + 1}</span>
            <span className={s.stopName}>{x.name}</span>
          </button>
        ))}
      </div>

      <div id="stage-panel" role="tabpanel" aria-labelledby={`stage-${stage.id}`} className={s.panel}>
        <div className={s.desk} aria-hidden="true">
          <Artefact kind={stage.artefact} key={stage.id} />
        </div>
        <div className={s.copy}>
          <p className={s.kicker}>
            Stage {i + 1} of 7 · typical, adapted to each project
          </p>
          <h3 className={s.title}>{stage.name}</h3>
          <p className={s.summary}>{stage.summary}</p>
          {!compact && (
            <ul className={s.activities}>
              {stage.activities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          )}
          <dl className={s.meta}>
            <div>
              <dt>Typical deliverable</dt>
              <dd>{stage.deliverable}</dd>
            </div>
            {!compact && (
              <div>
                <dt>What you bring</dt>
                <dd>{stage.you}</dd>
              </div>
            )}
          </dl>
          <div className={s.nav}>
            <button type="button" className={s.navBtn} onClick={() => setI((n) => Math.max(0, n - 1))} disabled={i === 0}>
              Previous stage
            </button>
            <button type="button" className={s.navBtn} onClick={() => setI((n) => Math.min(stages.length - 1, n + 1))} disabled={i === stages.length - 1}>
              Next stage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Artefact({ kind }: { kind: Stage["artefact"] }) {
  switch (kind) {
    case "brief":
      return (
        <div className={`${s.paper} ${s.brief}`}>
          <b className={s.paperTitle}>Project brief</b>
          <p>
            <em>Goal</em> Let customers book visits without calling.
          </p>
          <p>
            <em>Users</em> Customers, front desk, two field staff.
          </p>
          <p>
            <em>Today</em> Calls, a shared calendar, WhatsApp.
          </p>
          <p>
            <em>Success</em> Fewer missed bookings; staff see one schedule.
          </p>
          <span className={s.stamp}>Draft 1</span>
        </div>
      );
    case "wireframe":
      return (
        <div className={`${s.paper} ${s.wire}`}>
          <span className={s.wBar} />
          <span className={s.wHero}>
            <span className={s.wNote}>1 · one clear action</span>
          </span>
          <span className={s.wRow}>
            <span />
            <span />
            <span>
              <span className={s.wNote}>2 · live availability</span>
            </span>
          </span>
        </div>
      );
    case "interface":
      return (
        <div className={`${s.paper} ${s.ui}`}>
          <b className={s.uiTitle}>Book a visit</b>
          <span className={s.uiDays}>
            {["Mon", "Tue", "Wed", "Thu"].map((d, n) => (
              <span key={d} data-on={n === 1 ? "true" : undefined}>
                {d}
              </span>
            ))}
          </span>
          <span className={s.uiSlots}>
            {["10:00", "11:30", "14:00", "16:30"].map((t, n) => (
              <span key={t} data-on={n === 2 ? "true" : undefined}>
                {t}
              </span>
            ))}
          </span>
          <span className={s.uiBtn}>Confirm</span>
        </div>
      );
    case "integration":
      return (
        <div className={`${s.paper} ${s.integration}`}>
          {["Booking app", "API", "Calendar", "WhatsApp", "Accounts"].map((n, k) => (
            <span key={n} className={s.iNode} data-hub={k === 1 ? "true" : undefined}>
              {n}
            </span>
          ))}
          <span className={s.iCaption}>Tested: availability sync · confirmations · invoices</span>
        </div>
      );
    case "checklist":
      return (
        <div className={`${s.paper} ${s.checklist}`}>
          <b className={s.paperTitle}>Release checklist</b>
          {["Backups verified", "Access handed over", "Analytics live", "Forms reach the inbox", "Rollback path agreed"].map((c, k) => (
            <span key={c} className={s.check} data-done={k < 4 ? "true" : undefined}>
              {c}
            </span>
          ))}
        </div>
      );
    case "monitor":
      return (
        <div className={`${s.paper} ${s.monitor}`}>
          <b className={s.paperTitle}>Support view</b>
          <svg viewBox="0 0 120 30" className={s.spark}>
            <polyline points="0,20 10,18 20,22 30,15 40,17 50,12 60,14 70,9 80,12 90,8 100,10 110,7 120,9" />
          </svg>
          <span className={s.mRow}>
            <span>Last backup</span>
            <b>02:00</b>
          </span>
          <span className={s.mRow}>
            <span>Open requests</span>
            <b>2</b>
          </span>
          <span className={s.mRow}>
            <span>Updates applied</span>
            <b>This week</b>
          </span>
        </div>
      );
    case "roadmap":
      return (
        <div className={`${s.paper} ${s.roadmap}`}>
          {[
            ["Now", "Online booking", "Reminders"],
            ["Next", "Staff app", "Payments"],
            ["Later", "Reports", "Second branch"],
          ].map(([col, ...items]) => (
            <span key={col} className={s.rCol}>
              <b>{col}</b>
              {items.map((it) => (
                <span key={it} className={s.rItem}>
                  {it}
                </span>
              ))}
            </span>
          ))}
        </div>
      );
  }
}
