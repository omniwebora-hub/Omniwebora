"use client";

import { useState } from "react";
import d from "@/components/demos/demo.module.css";
import s from "./LayerExplorer.module.css";

/** ILLUSTRATIVE: the layers of one enterprise platform, and which ones each department touches. */

const LAYERS = [
  {
    id: "access",
    name: "Roles & access",
    holds: "Who can see and change what: departments, roles, approvals and audit logs.",
    users: "Every user; administered by IT or operations leads.",
    depends: "Identity source, Applications",
    question: "Which roles exist today, and who grants or removes access?",
  },
  {
    id: "apps",
    name: "Applications",
    holds: "The website, web application, mobile app and internal portals people actually use.",
    users: "Customers, staff, partners.",
    depends: "Workflows, Data",
    question: "Which applications are new, and which existing ones stay?",
  },
  {
    id: "workflows",
    name: "Workflows & automation",
    holds: "Approvals, routing, notifications and automated steps shared across departments.",
    users: "Operations, finance, HR.",
    depends: "Data, Integrations",
    question: "Which processes cross departments, and where must a person decide?",
  },
  {
    id: "data",
    name: "Data & analytics",
    holds: "The shared database, master records (customers, products, people) and reporting.",
    users: "Leadership, analysts, every module.",
    depends: "Infrastructure",
    question: "Which system is the source of truth for each kind of record?",
  },
  {
    id: "integrations",
    name: "Integrations & APIs",
    holds: "Connections to payments, accounting, CRM/ERP and partners through managed APIs.",
    users: "Systems, on behalf of every team.",
    depends: "Infrastructure, Roles & access",
    question: "Which external systems must exchange data, and how often?",
  },
  {
    id: "infra",
    name: "Infrastructure & operations",
    holds: "Cloud hosting, backups and recovery, monitoring, security management and maintenance.",
    users: "Technical support and maintenance team.",
    depends: "—",
    question: "What availability, backup and support levels does the organisation need?",
  },
];

const DEPARTMENTS: Record<string, string[]> = {
  Sales: ["access", "apps", "data", "integrations"],
  Finance: ["access", "workflows", "data", "integrations"],
  Operations: ["access", "apps", "workflows", "data"],
  "HR & people": ["access", "apps", "workflows"],
  Leadership: ["access", "data"],
};

/** Film steps: the platform as a whole, then three departments and the layer each leans on most. */
const FOCUS: { dept: string | null; sel: string }[] = [
  { dept: null, sel: "apps" },
  { dept: "Sales", sel: "data" },
  { dept: "Finance", sel: "workflows" },
  { dept: "Operations", sel: "integrations" },
];

/**
 * `step` lets the Solutions film walk through departments from scroll; any click hands control to the
 * visitor until the film reaches its next step. `embedded` fits it to a display.
 */
export function LayerExplorer({ step, embedded = false }: { step?: number; embedded?: boolean } = {}) {
  const [selState, setSelState] = useState("data");
  const [deptState, setDeptState] = useState<string | null>(null);
  const [touchedAt, setTouchedAt] = useState<number | null>(null);
  const driven = step !== undefined && touchedAt !== step;
  const f = driven ? FOCUS[Math.min(FOCUS.length - 1, Math.max(0, step))] : null;
  const sel = f ? f.sel : selState;
  const dept = f ? f.dept : deptState;
  const take = () => {
    if (step === undefined) return;
    setTouchedAt(step);
    setSelState(sel);
    setDeptState(dept);
  };
  const setSel = (v: string) => {
    take();
    setSelState(v);
  };
  const setDept = (v: string | null) => {
    take();
    setDeptState(v);
  };
  const layer = LAYERS.find((l) => l.id === sel)!;

  return (
    <div className={`${s.wrap} ${embedded ? s.embedded : ""}`}>
      <div className={s.stackCol}>
        <div className={d.segmented} role="group" aria-label="Highlight a department">
          {Object.keys(DEPARTMENTS).map((k) => (
            <button key={k} type="button" className={d.segment} aria-pressed={dept === k} onClick={() => setDept(dept === k ? null : k)}>
              {k}
            </button>
          ))}
        </div>
        <ol className={s.stack} aria-label="Platform layers">
          {LAYERS.map((l, i) => (
            <li key={l.id} style={{ "--n": i } as React.CSSProperties}>
              <button
                type="button"
                className={s.layer}
                aria-pressed={sel === l.id}
                data-dim={dept && !DEPARTMENTS[dept].includes(l.id) ? "true" : undefined}
                onClick={() => setSel(l.id)}
              >
                <span className={s.layerIndex}>0{i + 1}</span>
                {l.name}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className={s.detail} aria-live="polite">
        <span className={d.illustrative}>Illustrative architecture</span>
        <h3 className={s.detailTitle}>{layer.name}</h3>
        <dl className={s.facts}>
          <dt>What it holds</dt>
          <dd>{layer.holds}</dd>
          <dt>Who uses it</dt>
          <dd>{layer.users}</dd>
          <dt>Depends on</dt>
          <dd>{layer.depends}</dd>
          <dt>Question for discovery</dt>
          <dd>{layer.question}</dd>
        </dl>
        {dept && (
          <p className={d.note}>
            {dept} touches {DEPARTMENTS[dept].length} of 6 layers. The rest still matter to them, but indirectly.
          </p>
        )}
      </div>
    </div>
  );
}
