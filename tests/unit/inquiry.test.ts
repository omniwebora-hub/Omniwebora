import { describe, expect, it, vi } from "vitest";
import { inquirySchema, fieldErrors } from "@/lib/inquiry/schema";
import { escapeHtml, cleanText, singleLine } from "@/lib/inquiry/sanitize";
import { createRateLimiter } from "@/lib/inquiry/rateLimit";
import { describeTransport, deliverInquiry, renderEmail } from "@/lib/inquiry/transport";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Ltd",
  service: "website",
  message: "We need a new website that explains our services clearly.",
  timeline: "1-3-months",
  consent: true,
  website: "",
  startedAt: Date.now() - 10_000,
  page: "/contact",
  attribution: { utm_source: "newsletter" },
};

describe("inquirySchema", () => {
  it("accepts a complete, valid inquiry", () => {
    expect(inquirySchema.safeParse(valid).success).toBe(true);
  });

  it("defaults service to not-sure and company to empty", () => {
    const { service, company, ...rest } = valid;
    void service;
    void company;
    const r = inquirySchema.parse(rest);
    expect(r.service).toBe("not-sure");
    expect(r.company).toBe("");
  });

  it("requires consent to be exactly true", () => {
    const r = inquirySchema.safeParse({ ...valid, consent: false });
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrors(r.error).consent).toMatch(/privacy notice/);
  });

  it("rejects malformed email with a helpful message", () => {
    const r = inquirySchema.safeParse({ ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrors(r.error).email).toMatch(/name@company.com/);
  });

  it("enforces length caps", () => {
    expect(inquirySchema.safeParse({ ...valid, message: "too short" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, message: "x".repeat(4001) }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, name: "x".repeat(101) }).success).toBe(false);
  });

  it("rejects unknown services and a filled honeypot", () => {
    expect(inquirySchema.safeParse({ ...valid, service: "crypto" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, website: "http://spam" }).success).toBe(false);
  });

  it("trims whitespace", () => {
    expect(inquirySchema.parse({ ...valid, name: "  Ada  " }).name).toBe("Ada");
  });
});

describe("sanitize", () => {
  it("escapes HTML", () => {
    expect(escapeHtml(`<script>alert("x")</script>&'`)).toBe("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;&amp;&#39;");
  });
  it("strips control characters and normalises newlines", () => {
    expect(cleanText("a\u0000b\r\nc\u0007")).toBe("ab\nc");
  });
  it("collapses header-injection attempts to one line", () => {
    expect(singleLine("Hello\nBcc: evil@example.com")).toBe("Hello Bcc: evil@example.com");
  });
});

describe("rate limiter", () => {
  it("allows up to the limit within the window, then blocks", () => {
    const rl = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(rl.check("ip", 0).allowed).toBe(true);
    expect(rl.check("ip", 10).allowed).toBe(true);
    const blocked = rl.check("ip", 20);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBe(980);
    expect(rl.check("ip", 1001).allowed).toBe(true);
    expect(rl.check("other", 20).allowed).toBe(true);
  });
});

describe("brief summary", () => {
  it("accepts the brief studio summary and situation, and rejects oversized briefs", () => {
    expect(inquirySchema.safeParse({ ...valid, situation: "integrate", brief: "Need: Website\nTiming: In 1–3 months" }).success).toBe(true);
    expect(inquirySchema.safeParse({ ...valid, situation: "teleport" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, brief: "x".repeat(2001) }).success).toBe(false);
  });
});

describe("transport", () => {
  const data = inquirySchema.parse(valid);

  it("selects the configured transport, never faking success", () => {
    expect(describeTransport({ NODE_ENV: "production" })).toBe("none");
    expect(describeTransport({ NODE_ENV: "production", INQUIRY_DEV_LOG: "1" })).toBe("none");
    expect(describeTransport({ NODE_ENV: "development", INQUIRY_DEV_LOG: "1" })).toBe("log");
    expect(describeTransport({ INQUIRY_WEBHOOK_URL: "https://hooks.example.com/x" })).toBe("webhook");
    expect(describeTransport({ RESEND_API_KEY: "k", INQUIRY_TO_EMAIL: "a@b.c", INQUIRY_FROM_EMAIL: "d@e.f" })).toBe("resend");
  });

  it("returns transport_unconfigured in production without credentials", async () => {
    await expect(deliverInquiry(data, { NODE_ENV: "production" })).resolves.toEqual({ ok: false, code: "transport_unconfigured" });
  });

  it("reports provider failures instead of succeeding", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("nope", { status: 500 }));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(deliverInquiry(data, { INQUIRY_WEBHOOK_URL: "https://hooks.example.com/x" })).resolves.toEqual({ ok: false, code: "transport_failed" });
    fetchMock.mockRestore();
    errSpy.mockRestore();
  });

  it("posts escaped HTML to Resend with reply-to set to the visitor", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 200 }));
    const evil = inquirySchema.parse({ ...valid, name: "<b>Mallory</b>" });
    const res = await deliverInquiry(evil, { RESEND_API_KEY: "test-key", INQUIRY_TO_EMAIL: "team@example.com", INQUIRY_FROM_EMAIL: "site@example.com" });
    expect(res).toEqual({ ok: true, via: "resend" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    const body = JSON.parse(String((init as RequestInit).body));
    expect(body.reply_to).toBe("ada@example.com");
    expect(body.html).toContain("&lt;b&gt;Mallory&lt;/b&gt;");
    expect(body.html).not.toContain("<b>Mallory</b>");
    fetchMock.mockRestore();
  });

  it("renders a single-line subject", () => {
    const e = renderEmail(inquirySchema.parse({ ...valid, name: "Ada\nBcc: x@y.z" }));
    expect(e.subject).not.toMatch(/\n/);
  });
});
