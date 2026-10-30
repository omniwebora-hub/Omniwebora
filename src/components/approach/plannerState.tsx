"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { MAX_WANTS, planFor, type TradeId } from "@/content/planner";
import { track } from "@/lib/analytics";

type PlannerState = {
  trade: TradeId | null;
  setTrade: (t: TradeId) => void;
  wants: string[];
  toggleWant: (id: string, on: boolean) => void;
};

const Ctx = createContext<PlannerState | null>(null);

function useLocalPlanner(): PlannerState {
  const [trade, setTrade] = useState<TradeId | null>(null);
  const [wants, setWants] = useState<string[]>([]);
  return {
    trade,
    setTrade,
    wants,
    toggleWant: (id, on) => setWants((prev) => (on ? (prev.includes(id) || prev.length >= MAX_WANTS ? prev : [...prev, id]) : prev.filter((x) => x !== id))),
  };
}

/** One selection shared by everything inside (the planning table and the full planner below it). */
export function PlannerProvider({ children }: { children: React.ReactNode }) {
  return <Ctx.Provider value={useLocalPlanner()}>{children}</Ctx.Provider>;
}

/** The shared selection inside a PlannerProvider, otherwise a private one. */
export function usePlanner() {
  const local = useLocalPlanner();
  return useContext(Ctx) ?? local;
}

/** Hands the plan to the brief (sessionStorage, never the URL) and opens Contact. */
export function useSendPlan() {
  const router = useRouter();
  return (trade: TradeId | null, wants: string[]) => {
    const plan = planFor(trade, wants);
    if (!plan.ready) return;
    try {
      sessionStorage.setItem("omni:scope", JSON.stringify({ service: plan.services.length === 1 ? plan.services[0].inquiry : "not-sure", summary: plan.summary }));
    } catch {
      /* storage unavailable: the brief simply starts empty */
    }
    track("scope_guide_complete", { category: trade ?? "", plan: "approach" });
    router.push("/contact?from=approach");
  };
}
