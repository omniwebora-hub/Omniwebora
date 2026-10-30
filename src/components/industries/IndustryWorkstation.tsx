"use client";

import Link from "next/link";
import { useState } from "react";
import { industries } from "@/content/industries";
import { solutionBySlug } from "@/content/solutions";
import { onTabKeys } from "@/lib/tabKeys";
import d from "@/components/demos/demo.module.css";
import s from "./IndustryWorkstation.module.css";

/** One workstation that reconfigures its modules for each business context. Sample figures only. */
export function IndustryWorkstation() {
  const [sel, setSel] = useState(industries[0].id);
  const ind = industries.find((x) => x.id === sel)!;

  return (
    <div className={s.wrap}>
      <div className={s.tabs} role="tablist" aria-label="Business contexts" onKeyDown={onTabKeys}>
        {industries.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            id={`ind-${x.id}`}
            aria-selected={sel === x.id}
            aria-controls="ind-panel"
            tabIndex={sel === x.id ? 0 : -1}
            className={s.tab}
            onClick={() => setSel(x.id)}
          >
            {x.name}
          </button>
        ))}
      </div>

      <div id="ind-panel" role="tabpanel" aria-labelledby={`ind-${ind.id}`} className={s.panel}>
        <div className={`${d.frame} ${s.station}`}>
          <div className={d.toolbar}>
            <span className={d.toolbarTitle}>{ind.name} workspace</span>
            <span className={d.illustrative}>Illustrative · sample figures</span>
          </div>
          <ul className={s.modules} key={ind.id}>
            {ind.modules.map((m, i) => (
              <li key={m.name} className={s.module} style={{ "--i": i } as React.CSSProperties}>
                <span className={s.moduleName}>{m.name}</span>
                <span className={s.moduleSample}>{m.sample}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={s.copy}>
          <h2 className={s.title}>{ind.name}</h2>
          <p className={s.context}>{ind.context}</p>
          <p className={s.label}>Typical systems</p>
          <ul className={s.systems}>
            {ind.systems.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          {ind.caution && <p className={s.caution}>{ind.caution}</p>}
          <p className={s.source}>
            {ind.proposal ? "Editorial example (not listed in the brochure as a sector): " : "From the brochure: "}
            {ind.brochure}. These are possible solution areas, not a list of clients.
          </p>
          <p className={s.related}>
            Related:{" "}
            {ind.solutions.map((slug, i) => (
              <span key={slug}>
                {i > 0 && " · "}
                <Link href={`/solutions#${slug}`}>{solutionBySlug(slug)!.short}</Link>
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
