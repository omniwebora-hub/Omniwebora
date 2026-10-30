import type { Inquiry } from "./schema";
import { cleanText, escapeHtml, singleLine } from "./sanitize";
import { serviceOptions, situationOptions, timelineOptions, budgetOptions } from "./options";

export type TransportResult =
  | { ok: true; via: "resend" | "webhook" | "log" }
  | { ok: false; code: "transport_unconfigured" | "transport_failed" };

type Env = Record<string, string | undefined>;

/** Where every brief goes (owner, 2026-10-30); INQUIRY_TO_EMAIL may override it. */
export const INQUIRY_INBOX = "info@omniwebora.com";
const inbox = (env: Env) => env.INQUIRY_TO_EMAIL || INQUIRY_INBOX;

const label = (opts: readonly { value: string; label: string }[], v?: string) => opts.find((o) => o.value === v)?.label ?? "—";

export function describeTransport(env: Env = process.env): "resend" | "webhook" | "log" | "none" {
  if (env.RESEND_API_KEY && env.INQUIRY_FROM_EMAIL) return "resend";
  if (env.INQUIRY_WEBHOOK_URL) return "webhook";
  if (env.NODE_ENV !== "production" && env.INQUIRY_DEV_LOG === "1") return "log";
  return "none";
}

export function renderEmail(i: Inquiry) {
  const rows: [string, string][] = [
    ["Name", i.name],
    ["Email", i.email],
    ["Company", i.company || "—"],
    ["Service", label(serviceOptions, i.service)],
    ...(i.situation ? ([["Situation", label(situationOptions, i.situation)]] as [string, string][]) : []),
    ["Timeline", label(timelineOptions, i.timeline)],
    ...(i.budget ? ([["Plan in mind", label(budgetOptions, i.budget)]] as [string, string][]) : []),
    ["Page", i.page ?? "—"],
    [
      "Attribution",
      i.attribution
        ? Object.entries(i.attribution)
            .filter(([, v]) => v)
            .map(([k, v]) => `${k}=${v}`)
            .join(", ") || "—"
        : "—",
    ],
  ];
  const message = cleanText(i.message);
  const brief = i.brief ? cleanText(i.brief) : "";
  const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;color:#0C2349">
<h2 style="margin:0 0 12px">New project inquiry</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#4D5B70">${escapeHtml(k)}</td><td>${escapeHtml(cleanText(v))}</td></tr>`)
    .join("")}</table>
<h3 style="margin:20px 0 8px">Project description</h3>
<p style="white-space:pre-wrap;line-height:1.5">${escapeHtml(message)}</p>
${brief ? `<h3 style="margin:20px 0 8px">Brief summary (project brief studio)</h3><p style="white-space:pre-wrap;line-height:1.5">${escapeHtml(brief)}</p>` : ""}
</body></html>`;
  const text = `New project inquiry\n\n${rows.map(([k, v]) => `${k}: ${cleanText(v)}`).join("\n")}\n\n${message}${brief ? `\n\nBrief summary\n${brief}` : ""}`;
  const subject = singleLine(`Project inquiry: ${label(serviceOptions, i.service)} from ${i.name}`).slice(0, 150);
  return { html, text, subject };
}

export async function deliverInquiry(i: Inquiry, env: Env = process.env): Promise<TransportResult> {
  const mode = describeTransport(env);
  const email = renderEmail(i);

  try {
    if (mode === "resend") {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: env.INQUIRY_FROM_EMAIL,
          to: inbox(env).split(",").map((s) => s.trim()),
          reply_to: i.email,
          subject: email.subject,
          html: email.html,
          text: email.text,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        console.error("[inquiry] resend failed", res.status);
        return { ok: false, code: "transport_failed" };
      }
      return { ok: true, via: "resend" };
    }

    if (mode === "webhook") {
      const res = await fetch(env.INQUIRY_WEBHOOK_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "project_inquiry",
          receivedAt: new Date().toISOString(),
          inquiry: { ...i, website: undefined },
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        console.error("[inquiry] webhook failed", res.status);
        return { ok: false, code: "transport_failed" };
      }
      return { ok: true, via: "webhook" };
    }

    if (mode === "log") {
      console.info("[inquiry:dev-log] Not sent anywhere (INQUIRY_DEV_LOG=1).\n" + email.text);
      return { ok: true, via: "log" };
    }

    return { ok: false, code: "transport_unconfigured" };
  } catch (err) {
    console.error("[inquiry] delivery error", err instanceof Error ? err.message : "unknown");
    return { ok: false, code: "transport_failed" };
  }
}
