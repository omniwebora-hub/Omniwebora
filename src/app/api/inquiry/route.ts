import { NextResponse, type NextRequest } from "next/server";
import { inquirySchema, fieldErrors } from "@/lib/inquiry/schema";
import { LIMITS } from "@/lib/inquiry/options";
import { createRateLimiter } from "@/lib/inquiry/rateLimit";
import { deliverInquiry } from "@/lib/inquiry/transport";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const json = (status: number, body: Record<string, unknown>, headers?: Record<string, string>) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

function clientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  // Same-origin only: reject cross-site form posts.
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) return json(403, { ok: false, code: "forbidden" });

  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > LIMITS.bodyBytes) return json(413, { ok: false, code: "too_large" });

  const raw = await req.text();
  if (raw.length > LIMITS.bodyBytes) return json(413, { ok: false, code: "too_large" });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, code: "invalid_json" });
  }

  const parsed = inquirySchema.safeParse(body);

  // Bots: honeypot filled or impossibly fast. Respond like success, deliver nothing.
  const b = body as { website?: unknown; startedAt?: unknown };
  if ((typeof b?.website === "string" && b.website.length > 0) ||
      (typeof b?.startedAt === "number" && Date.now() - b.startedAt < LIMITS.minFillMs)) {
    return json(200, { ok: true });
  }

  const rate = limiter.check(clientIp(req));
  if (!rate.allowed) {
    return json(429, { ok: false, code: "rate_limited" }, { "Retry-After": String(Math.ceil(rate.retryAfterMs / 1000)) });
  }

  if (!parsed.success) return json(400, { ok: false, code: "invalid", fieldErrors: fieldErrors(parsed.error) });

  const result = await deliverInquiry(parsed.data);
  if (result.ok) return json(200, { ok: true });
  return json(result.code === "transport_unconfigured" ? 503 : 502, { ok: false, code: result.code });
}

export function GET() {
  return json(405, { ok: false, code: "method_not_allowed" }, { Allow: "POST" });
}
