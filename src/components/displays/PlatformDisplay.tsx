"use client";

import { useState } from "react";
import x from "./displays.module.css";
import s from "./PlatformDisplay.module.css";

/**
 * Platform map on the Enterprise room's panoramic display: departments on top, the shared platform
 * layers below, and the connections each department relies on. Clicking a department focuses it.
 */
const DEPTS = ["Sales", "Finance", "Operations", "People", "Leadership"] as const;
const LAYERS = [
  { id: "apps", name: "Applications", note: "Website, apps and internal tools" },
  { id: "flows", name: "Workflows", note: "Approvals and automations" },
  { id: "data", name: "Shared data", note: "One customer, product and people record" },
  { id: "links", name: "Integrations", note: "Payments, accounting, messaging" },
  { id: "access", name: "Security & access", note: "Roles, audit, backups" },
];
const USES: Record<(typeof DEPTS)[number], string[]> = {
  Sales: ["apps", "data", "access"],
  Finance: ["flows", "data", "links", "access"],
  Operations: ["apps", "flows", "data", "links"],
  People: ["apps", "flows", "access"],
  Leadership: ["data", "access"],
};
/** Film steps: the whole platform, then Sales, Finance, Operations. */
const FOCUS: ((typeof DEPTS)[number] | null)[] = [null, "Sales", "Finance", "Operations"];
const STORY: Record<string, string> = {
  all: "Five departments, one platform: each works in its own tools, all on the same shared layers.",
  Sales: "Sales sees every customer's full history, because orders and support write to the same record.",
  Finance: "Finance approves and reconciles from the same data Sales and Operations use: no exports.",
  Operations: "Operations runs stock, schedules and suppliers through workflows connected to everything else.",
  People: "People and roles decide who can see and change what, everywhere at once.",
  Leadership: "Leadership reads one set of figures, built from the records everyone already keeps.",
};

export function PlatformDisplay({ step }: { step: number }) {
  // A visitor's pick holds until the film moves to its next step.
  const [picked, setPicked] = useState<{ step: number; dept: (typeof DEPTS)[number] } | null>(null);
  const dept = picked?.step === step ? picked.dept : FOCUS[step];
  const used = dept ? USES[dept] : LAYERS.map((l) => l.id);
  return (
    <div className={`${x.screen} ${s.map}`}>
      <div className={s.left}>
        <div className={s.depts} role="group" aria-label="Departments">
          {DEPTS.map((d) => (
            <button key={d} type="button" data-on={d === dept ? "true" : undefined} onClick={() => setPicked({ step, dept: d })}>
              {d}
            </button>
          ))}
        </div>
        <ol className={s.layers}>
          {LAYERS.map((l) => (
            <li key={l.id} data-on={used.includes(l.id) ? "true" : undefined}>
              <b>{l.name}</b>
              <span>{l.note}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className={s.right} key={dept ?? "all"}>
        <p className={s.label}>{dept ?? "The whole platform"}</p>
        <p className={`${x.h} ${s.story} ${x.fade}`}>{STORY[dept ?? "all"]}</p>
        <p className={x.muted}>
          Uses {used.length} of {LAYERS.length} shared layers
        </p>
      </div>
      <span className={x.tag}>Illustrative architecture</span>
    </div>
  );
}
