"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { LIMITS, budgetOptions, serviceOptions, situationOptions, timelineOptions } from "@/lib/inquiry/options";
import type { InquiryFieldErrors } from "@/lib/inquiry/schema";
import { getAttribution } from "@/lib/utm";
import { track } from "@/lib/analytics";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/content/site";
import s from "./BriefStudio.module.css";

const SERVER_MESSAGES: Record<string, string> = {
  transport_unconfigured:
    "This form isn't connected to a mailbox yet, so your brief was not sent from here.",
  transport_failed: "Your brief couldn't be delivered just now. Nothing was lost on your side: please try again in a minute.",
  rate_limited: "Too many submissions from this connection. Wait a few minutes, then send it again.",
  too_large: "That brief is too long to send. Shorten the description and try again.",
  forbidden: "The form couldn't be submitted from this page. Reload the page and try again.",
  invalid_json: "Something went wrong preparing your brief. Reload the page and try again.",
};

/** Legacy ?service= values from older links map onto the current categories. */
const LEGACY: Record<string, string> = { websites: "website", "mobile-apps": "mobile", "business-software": "custom-software", "ai-automation": "business-automation", cloud: "not-sure" };

const STEP_NAMES = ["What you need", "Your situation", "Your details", "Review & send"] as const;
const label = <T extends readonly { value: string; label: string }[]>(opts: T, v?: string) => opts.find((o) => o.value === v)?.label;

function readScope(fromPricing: boolean): { service?: string; summary?: string } | null {
  if (!fromPricing || typeof window === "undefined") return null;
  try {
    return JSON.parse(sessionStorage.getItem("omni:scope") ?? "null");
  } catch {
    return null;
  }
}

type Fields = { name: string; email: string; company: string; message: string; consent: boolean; website: string };

/** Reads ?service= and ?from= and renders the studio with them (wrap in Suspense). */
export function BriefStudioFromUrl() {
  const params = useSearchParams();
  return <BriefStudio initialService={params.get("service") ?? ""} initialPlan={params.get("plan") ?? ""} fromPricing={["pricing", "approach"].includes(params.get("from") ?? "")} />;
}

/**
 * Guided project brief. Rendered on the server without prefill (also the Suspense fallback, so the
 * layout never shifts), then re-rendered with the URL prefill on the client.
 */
export function BriefStudio({ initialService = "", initialPlan = "", fromPricing = false }: { initialService?: string; initialPlan?: string; fromPricing?: boolean }) {
  const id = useId();
  const router = useRouter();
  const startedAt = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  // Prefill: ?service= (legacy values mapped) or the How We Work plan hand-off in sessionStorage.
  const [saved] = useState(() => readScope(fromPricing));
  const [service, setService] = useState(() => {
    const v = LEGACY[initialService] ?? initialService;
    if (saved?.service && serviceOptions.some((o) => o.value === saved.service)) return saved.service;
    return serviceOptions.some((o) => o.value === v) ? v : "";
  });
  const [situation, setSituation] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState(() => (budgetOptions.some((o) => o.value === initialPlan) ? initialPlan : ""));
  const [scope, setScope] = useState<string>(saved?.summary ?? "");
  const [fields, setFields] = useState<Fields>({ name: "", email: "", company: "", message: "", consent: false, website: "" });
  const [errors, setErrors] = useState<InquiryFieldErrors>({});
  const [status, setStatus] = useState<{ kind: "idle" | "sending" } | { kind: "error"; message: string }>({ kind: "idle" });
  useEffect(() => {
    startedAt.current = Date.now();
    track("contact_start", { prefilled: initialService ? "service" : fromPricing ? "pricing" : "none" });
  }, [initialService, fromPricing]);

  // The scene behind the brief answers its progress (ContactFilm): the pavilion draws nearer and warmer.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("omni:brief", { detail: Math.min(1, (step + (service ? 1 : 0)) / 4) }));
  }, [step, service]);

  // Move focus to the step heading whenever the step changes (after the first render).
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    panelRef.current?.querySelector<HTMLElement>("h2")?.focus();
  }, [step]);

  const set = (k: keyof Fields, v: string | boolean) => setFields((f) => ({ ...f, [k]: v }));

  const briefText = () =>
    [
      `Need: ${label(serviceOptions, service) ?? "Not sure yet"}`,
      situation && `Situation: ${label(situationOptions, situation)}`,
      timeline && `Timing: ${label(timelineOptions, timeline)}`,
      budget && `Plan in mind: ${label(budgetOptions, budget)}`,
      scope && `From your plan:\n${scope}`,
    ]
      .filter(Boolean)
      .join("\n");

  // If the site cannot deliver the brief, the visitor can send the same brief by email in one tap.
  const mailto = () => {
    const subject = `Project brief: ${label(serviceOptions, service) ?? "Not sure yet"} from ${fields.name}`;
    const body = `${fields.message}\n\n${briefText()}\n\n${fields.name}${fields.company ? `, ${fields.company}` : ""}\n${fields.email}`;
    return `mailto:${site.contactEmail.value}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  async function validateDetails() {
    const { inquirySchema, fieldErrors } = await import("@/lib/inquiry/schema");
    const parsed = inquirySchema.safeParse(payload());
    if (parsed.success) {
      setErrors({});
      return true;
    }
    const errs = fieldErrors(parsed.error);
    setErrors(errs);
    const firstKey = (["name", "email", "message", "consent"] as const).find((k) => errs[k]);
    if (firstKey) document.getElementById(`${id}-${firstKey}`)?.focus();
    return !firstKey;
  }

  function payload() {
    return {
      ...fields,
      service: service || "not-sure",
      situation: situation || undefined,
      timeline: timeline || undefined,
      budget: budget || undefined,
      brief: briefText(),
      startedAt: startedAt.current || Date.now(),
      page: window.location.pathname,
      attribution: getAttribution(),
    };
  }

  async function send() {
    if (status.kind === "sending") return;
    if (!(await validateDetails())) {
      setStep(2);
      return;
    }
    setStatus({ kind: "sending" });
    track("submit_inquiry", { location: "contact", service: service || "not-sure" });
    try {
      const res = await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload()) });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; code?: string; fieldErrors?: InquiryFieldErrors };
      if (res.ok && body.ok) {
        track("contact_submit_success", { service: service || "not-sure" });
        try {
          sessionStorage.removeItem("omni:scope");
        } catch {
          /* ignore */
        }
        router.push("/thank-you");
        return;
      }
      if (body.code === "invalid" && body.fieldErrors) {
        setErrors(body.fieldErrors);
        setStatus({ kind: "idle" });
        setStep(2);
        return;
      }
      setStatus({ kind: "error", message: SERVER_MESSAGES[body.code ?? ""] ?? "Your brief couldn't be sent. Please try again." });
      track("inquiry_error", { location: "contact", code: body.code ?? String(res.status) });
    } catch {
      setStatus({ kind: "error", message: "You appear to be offline. Check your connection and send it again." });
      track("inquiry_error", { location: "contact", code: "network" });
    }
  }

  const err = (k: keyof InquiryFieldErrors) =>
    errors[k] ? (
      <span id={`${id}-${k}-err`} className={s.err}>
        <Icon name="alert" size={15} /> {errors[k]}
      </span>
    ) : null;

  return (
    <div className={s.studio}>
      <aside className={s.summary} aria-label="Your brief so far">
        <p className={s.sumLabel}>Your brief</p>
        <p className={s.sumLead}>
          {service ? (
            <>
              You&rsquo;re planning <b>{(label(serviceOptions, service) ?? "").toLowerCase()}</b>
              {situation ? <> ({label(situationOptions, situation)?.toLowerCase()})</> : null}.
            </>
          ) : (
            "Choose what you need, or skip straight to the short form."
          )}
        </p>
        <dl className={s.sumList}>
          <dt>Timing</dt>
          <dd>{label(timelineOptions, timeline) ?? "Not set"}</dd>
          <dt>Plan in mind</dt>
          <dd>{label(budgetOptions, budget) ?? "Not set"}</dd>
          <dt>Contact</dt>
          <dd>{fields.name ? `${fields.name}${fields.company ? `, ${fields.company}` : ""}` : "Not yet"}</dd>
        </dl>
        {scope && (
          <div className={s.scope}>
            <p className={s.sumLabel}>From your plan</p>
            <pre>{scope}</pre>
            <button type="button" className="text-link" onClick={() => setScope("")}>
              Remove from brief
            </button>
          </div>
        )}
        <p className={s.next}>
          We read every brief and reply by email to talk through scope and next steps. Plans are confirmed in a written proposal.
        </p>
      </aside>

      <div className={s.form}>
        <ol className={s.progress} aria-label="Brief steps">
          {STEP_NAMES.map((n, i) => (
            <li key={n} aria-current={step === i ? "step" : undefined} data-done={i < step ? "true" : undefined}>
              <span>{i + 1}</span> {n}
            </li>
          ))}
        </ol>

        <noscript>
          <p className={s.noscript}>This project brief needs JavaScript to send. Please enable it, or return later.</p>
        </noscript>

        <div ref={panelRef} className={s.panel}>
          {step === 0 && (
            <fieldset className={s.fieldset}>
              <legend>
                <h2 tabIndex={-1} className={s.stepTitle}>
                  What do you need?
                </h2>
              </legend>
              <div className={s.cards}>
                {serviceOptions.map((o) => (
                  <label key={o.value} className={s.card}>
                    <input type="radio" name="service" value={o.value} checked={service === o.value} onChange={() => setService(o.value)} />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
              <div className={s.actions}>
                <button type="button" className="btn btn-primary" onClick={() => setStep(1)}>
                  Continue <Icon name="arrow-right" size={18} className="btn-arrow" />
                </button>
                <button type="button" className={s.skip} onClick={() => setStep(2)}>
                  Skip to the short form
                </button>
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <div className={s.fieldset}>
              <h2 tabIndex={-1} className={s.stepTitle}>
                Where are you starting from? <span className={s.optional}>(optional)</span>
              </h2>
              <fieldset className={s.group}>
                <legend>Situation</legend>
                <div className={s.chips}>
                  {situationOptions.map((o) => (
                    <label key={o.value} className={s.chip}>
                      <input type="radio" name="situation" value={o.value} checked={situation === o.value} onChange={() => setSituation(o.value)} />
                      <span>{o.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className={s.group}>
                <legend>Timing</legend>
                <div className={s.chips}>
                  {timelineOptions.map((o) => (
                    <label key={o.value} className={s.chip}>
                      <input type="radio" name="timeline" value={o.value} checked={timeline === o.value} onChange={() => setTimeline(o.value)} />
                      <span>{o.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className={s.group}>
                <legend>Plan in mind (optional)</legend>
                <div className={s.chips}>
                  {budgetOptions.map((o) => (
                    <label key={o.value} className={s.chip}>
                      <input type="radio" name="budget" value={o.value} checked={budget === o.value} onChange={() => setBudget(o.value)} />
                      <span>{o.label}</span>
                    </label>
                  ))}
                </div>
                <p className={s.hint}>
                  Website plans are Basic, Standard and Premium. See <Link href="/pricing">plans</Link>; other services are scoped per project.
                </p>
              </fieldset>
              <div className={s.actions}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>
                  Back
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                  Continue <Icon name="arrow-right" size={18} className="btn-arrow" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form
              className={s.fieldset}
              noValidate
              onSubmit={async (e) => {
                e.preventDefault();
                if (await validateDetails()) setStep(3);
              }}
            >
              <h2 tabIndex={-1} className={s.stepTitle}>
                Your details
              </h2>
              <p className={s.hint}>Fields marked * are required.</p>
              <div className={s.grid}>
                <div className={s.field}>
                  <label htmlFor={`${id}-name`}>Your name *</label>
                  <input id={`${id}-name`} name="name" autoComplete="name" value={fields.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-err` : undefined} maxLength={LIMITS.name.max} />
                  {err("name")}
                </div>
                <div className={s.field}>
                  <label htmlFor={`${id}-email`}>Business email *</label>
                  <input id={`${id}-email`} name="email" type="email" autoComplete="email" value={fields.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-err` : undefined} maxLength={LIMITS.email.max} />
                  {err("email")}
                </div>
                <div className={`${s.field} ${s.wide}`}>
                  <label htmlFor={`${id}-company`}>Company (optional)</label>
                  <input id={`${id}-company`} name="company" autoComplete="organization" value={fields.company} onChange={(e) => set("company", e.target.value)} maxLength={LIMITS.company.max} />
                </div>
                <div className={`${s.field} ${s.wide}`}>
                  <label htmlFor={`${id}-message`}>What are you trying to build or fix? *</label>
                  <textarea id={`${id}-message`} name="message" rows={5} value={fields.message} onChange={(e) => set("message", e.target.value)} aria-invalid={!!errors.message} aria-describedby={`${id}-message-help${errors.message ? ` ${id}-message-err` : ""}`} maxLength={LIMITS.message.max} />
                  <span id={`${id}-message-help`} className={s.hint}>
                    A few sentences is plenty: the problem, who it affects, and anything that must connect. {fields.message.length}/{LIMITS.message.max}
                  </span>
                  {err("message")}
                </div>
                <div className={s.hp} aria-hidden="true">
                  <label htmlFor={`${id}-website`}>Leave this empty</label>
                  <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" value={fields.website} onChange={(e) => set("website", e.target.value)} />
                </div>
                <div className={`${s.field} ${s.wide}`}>
                  <label className={s.consent}>
                    <input id={`${id}-consent`} type="checkbox" checked={fields.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? `${id}-consent-err` : undefined} />
                    <span>
                      I agree that Omniwebora may use these details to reply to my brief, as described in the <Link href="/privacy">privacy notice</Link>. The page I sent this from and any campaign tags in my link are included. *
                    </span>
                  </label>
                  {err("consent")}
                </div>
              </div>
              <div className={s.actions}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                  Back
                </button>
                <button type="submit" className="btn btn-primary">
                  Review brief <Icon name="arrow-right" size={18} className="btn-arrow" />
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className={s.fieldset}>
              <h2 tabIndex={-1} className={s.stepTitle}>
                Review and send
              </h2>
              <dl className={s.review}>
                <dt>Need</dt>
                <dd>
                  {label(serviceOptions, service) ?? "Not sure yet"}{" "}
                  <button type="button" className={s.edit} onClick={() => setStep(0)}>
                    Edit
                  </button>
                </dd>
                <dt>Situation, timing, plan</dt>
                <dd>
                  {[label(situationOptions, situation), label(timelineOptions, timeline), label(budgetOptions, budget)].filter(Boolean).join(" · ") || "Not set"}{" "}
                  <button type="button" className={s.edit} onClick={() => setStep(1)}>
                    Edit
                  </button>
                </dd>
                <dt>Contact</dt>
                <dd>
                  {fields.name} · {fields.email}
                  {fields.company ? ` · ${fields.company}` : ""}{" "}
                  <button type="button" className={s.edit} onClick={() => setStep(2)}>
                    Edit
                  </button>
                </dd>
                <dt>Description</dt>
                <dd className={s.reviewMessage}>{fields.message}</dd>
              </dl>
              {status.kind === "error" && (
                <div className={s.error} role="alert">
                  <Icon name="alert" size={18} />
                  <span>
                    {status.message}{" "}
                    <a href={mailto()} className={s.mailto}>
                      Email it to {site.contactEmail.value} instead
                    </a>
                  </span>
                </div>
              )}
              <div className={s.actions}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
                  Back
                </button>
                <button type="button" className="btn btn-primary" onClick={send} aria-busy={status.kind === "sending"} disabled={status.kind === "sending"}>
                  {status.kind === "sending" ? "Sending…" : "Send brief"}
                  <Icon name="arrow-right" size={18} className="btn-arrow" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
