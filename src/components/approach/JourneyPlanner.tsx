"use client";

import Link from "next/link";
import { stages } from "@/content/approach";
import { MAX_WANTS, planFor, TRADES, WANTS } from "@/content/planner";
import { usePlanner, useSendPlan } from "./plannerState";
import s from "./JourneyPlanner.module.css";

/**
 * "How we work, for you": the visitor says what they do and what they want, and the seven brochure
 * stages are rewritten in their terms (content/planner.ts). Inside a PlannerProvider it shares its
 * selection with the planning table above it. Hand-off to the brief via sessionStorage.
 */
export function JourneyPlanner() {
  const { trade, setTrade, wants, toggleWant } = usePlanner();
  const send = useSendPlan();
  const plan = planFor(trade, wants);
  const { ready, services, lines } = plan;

  return (
    <div className={s.planner}>
      <div className={s.ask}>
        <fieldset className={s.group}>
          <legend>
            <span className={s.n}>1</span> How does your business work?
          </legend>
          <div className={s.chips}>
            {TRADES.map((x) => (
              <label key={x.id} className={s.chip}>
                <input type="radio" name="jp-trade" checked={trade === x.id} onChange={() => setTrade(x.id)} />
                <span>{x.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className={s.group}>
          <legend>
            <span className={s.n}>2</span> What do you want? <small>Choose up to three</small>
          </legend>
          <div className={s.chips}>
            {WANTS.map((w) => (
              <label key={w.id} className={s.chip}>
                <input
                  type="checkbox"
                  checked={wants.includes(w.id)}
                  disabled={!wants.includes(w.id) && wants.length >= MAX_WANTS}
                  onChange={(e) => toggleWant(w.id, e.target.checked)}
                />
                <span>{w.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className={s.path} aria-live="polite" data-ready={ready ? "true" : undefined}>
        <p className={s.pathHead}>{ready ? `Your project, step by step` : "Your project, step by step, appears here"}</p>
        <ol className={s.stages}>
          {stages.map((st, i) => (
            <li key={st.id} id={st.id}>
              <span className={s.sn}>0{i + 1}</span>
              <div>
                <h3>{st.name}</h3>
                <p>{lines[st.id]}</p>
              </div>
            </li>
          ))}
        </ol>
        {ready && (
          <div className={s.result}>
            <div>
              <p className={s.label}>Services in your plan</p>
              <ul className={s.services}>
                {services.map((x) => (
                  <li key={x.slug}>
                    <Link href={`/solutions#${x.slug}`}>{x.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className={s.label}>What we would ask you first</p>
              <ul className={s.questions}>
                {services.slice(0, 3).map((x) => (
                  <li key={x.slug}>{x.scopeQuestions[0]}</li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => send(trade, wants)}
            >
              Start my brief with this
            </button>
          </div>
        )}
        <p className={s.note}>Typical of how we work; the exact stages and scope are agreed in each proposal.</p>
      </div>
    </div>
  );
}
