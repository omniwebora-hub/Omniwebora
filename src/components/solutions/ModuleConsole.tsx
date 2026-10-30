"use client";

import { useState } from "react";
import { onTabKeys } from "@/lib/tabKeys";
import d from "@/components/demos/demo.module.css";
import s from "./ModuleConsole.module.css";

/**
 * ILLUSTRATIVE DEMO: four modules over one shared data model. Selecting a record shows every
 * module where the same record appears, which is the point of custom software over spreadsheets.
 */

const MODULES = ["CRM", "Inventory", "Billing", "Teams"] as const;
export type Module = (typeof MODULES)[number];

type Row = { id: string; cells: string[]; refs: string[] };
const DATA: Record<Module, { cols: string[]; rows: Row[]; note: string }> = {
  CRM: {
    cols: ["Customer", "Stage", "Owner"],
    note: "Customers and their history, owned by a named person.",
    rows: [
      { id: "C-104", cells: ["C-104 · Sample customer", "Repeat customer", "Anita (sales)"], refs: ["C-104", "O-2207", "S-12"] },
      { id: "C-117", cells: ["C-117 · Sample company", "Proposal sent", "Rahul (sales)"], refs: ["C-117", "S-07"] },
      { id: "C-121", cells: ["C-121 · Sample client", "New lead", "Anita (sales)"], refs: ["C-121", "S-12"] },
    ],
  },
  Inventory: {
    cols: ["Order", "Items", "Stock check"],
    note: "Orders reserve stock the moment they are confirmed.",
    rows: [
      { id: "O-2207", cells: ["O-2207 for C-104", "24 × product A", "Reserved"], refs: ["O-2207", "C-104", "INV-881", "S-21"] },
      { id: "O-2211", cells: ["O-2211 for C-117", "6 × product B", "Awaiting stock"], refs: ["O-2211", "C-117", "S-21"] },
    ],
  },
  Billing: {
    cols: ["Invoice", "For", "Status"],
    note: "Invoices are raised from orders, never retyped.",
    rows: [
      { id: "INV-881", cells: ["INV-881", "O-2207 · C-104", "Due in 12 days"], refs: ["INV-881", "O-2207", "C-104"] },
      { id: "INV-879", cells: ["INV-879", "O-2198 · C-121", "Paid"], refs: ["INV-879", "C-121"] },
    ],
  },
  Teams: {
    cols: ["Person", "Role", "Working on"],
    note: "Roles decide what each person can see and change.",
    rows: [
      { id: "S-12", cells: ["Anita", "Sales · CRM edit", "C-104, C-121"], refs: ["S-12", "C-104", "C-121"] },
      { id: "S-07", cells: ["Rahul", "Sales · CRM edit", "C-117"], refs: ["S-07", "C-117"] },
      { id: "S-21", cells: ["Meera", "Warehouse · Inventory", "O-2207, O-2211"], refs: ["S-21", "O-2207", "O-2211"] },
    ],
  },
};

/**
 * `module` / `onModuleChange` let the Solutions film drive the open module from scroll while the
 * visitor can still click any module or record.
 */
export function ModuleConsole({ module: moduleProp, onModuleChange, embedded = false }: { module?: Module; onModuleChange?: (m: Module) => void; embedded?: boolean } = {}) {
  const [moduleState, setModuleState] = useState<Module>("CRM");
  const active = moduleProp ?? moduleState;
  const setModule = (m: Module) => {
    setModuleState(m);
    onModuleChange?.(m);
  };
  const [focus, setFocus] = useState<string | null>("C-104");
  const [model, setModel] = useState(false);

  const linked = focus
    ? MODULES.filter((m) => DATA[m].rows.some((r) => r.id === focus || r.refs.includes(focus)))
    : [];

  return (
    <div className={`${d.frame} ${embedded ? s.embedded : ""}`} data-demo="console">
      <div className={d.toolbar}>
        <span className={d.toolbarTitle}>Operations console</span>
        <span className={d.illustrative}>Illustrative demonstration · sample records</span>
      </div>
      <div className={s.layout}>
        <div className={s.rail}>
          <div className={s.tabs} role="tablist" aria-label="Modules" aria-orientation="vertical" onKeyDown={onTabKeys}>
          {MODULES.map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              id={`mc-tab-${m}`}
              aria-selected={active === m}
              aria-controls="mc-panel"
              tabIndex={active === m ? 0 : -1}
              className={s.tab}
              data-linked={focus && linked.includes(m) ? "true" : undefined}
              onClick={() => setModule(m)}
            >
              {m}
              {focus && linked.includes(m) && (
                <>
                  <span className={s.dot} aria-hidden="true" />
                  <span className="visually-hidden">, contains {focus}</span>
                </>
              )}
            </button>
          ))}
          </div>
          <label className={s.toggle}>
            <input type="checkbox" checked={model} onChange={(e) => setModel(e.target.checked)} />
            Show data model
          </label>
        </div>

        <div id="mc-panel" role="tabpanel" aria-labelledby={`mc-tab-${active}`} className={s.panel}>
          <p className={s.note}>{DATA[active].note}</p>
          <table className={s.table}>
            <caption className="visually-hidden">{active} sample records</caption>
            <thead>
              <tr>
                {DATA[active].cols.map((c) => (
                  <th key={c} scope="col">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DATA[active].rows.map((r) => {
                const hit = focus && (r.id === focus || r.refs.includes(focus));
                return (
                  <tr key={r.id} data-hit={hit ? "true" : undefined}>
                    {r.cells.map((c, i) =>
                      i === 0 ? (
                        <th key={i} scope="row">
                          <button type="button" className={s.recordBtn} aria-pressed={focus === r.id} onClick={() => setFocus(focus === r.id ? null : r.id)}>
                            {c}
                          </button>
                        </th>
                      ) : (
                        <td key={i}>{c}</td>
                      ),
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className={s.trace} aria-live="polite">
            {focus ? (
              <>
                <b>{focus}</b> appears in {linked.join(", ")}. Change it once and every module sees the same record.
              </>
            ) : (
              "Select a record to trace it across modules."
            )}
          </p>

          {model && (
            <div className={s.model} aria-label="Data model">
              {["Customer", "Order", "Invoice", "Product", "Employee"].map((e, i, arr) => (
                <span key={e} className={s.entity}>
                  {e}
                  {i < arr.length - 1 && <span className={s.rel} aria-hidden="true" />}
                </span>
              ))}
              <p className={d.note}>One database, related tables, role-based access on top.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
