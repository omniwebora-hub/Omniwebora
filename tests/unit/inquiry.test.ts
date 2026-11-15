import { describe, expect, it } from "vitest";
import { inquirySchema, fieldErrors } from "@/lib/inquiry/schema";

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

describe("brief summary", () => {
  it("accepts the brief studio summary and situation, and rejects oversized briefs", () => {
    expect(inquirySchema.safeParse({ ...valid, situation: "integrate", brief: "Need: Website\nTiming: In 1–3 months" }).success).toBe(true);
    expect(inquirySchema.safeParse({ ...valid, situation: "teleport" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, brief: "x".repeat(2001) }).success).toBe(false);
  });
});

