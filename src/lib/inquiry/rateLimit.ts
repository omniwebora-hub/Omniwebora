/**
 * Sliding-window, in-memory rate limiter.
 * Per server instance only: on multi-instance/serverless hosting, back this with a shared store
 * (e.g. Upstash Redis) using the same interface.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  return {
    check(key: string, now = Date.now()): { allowed: boolean; retryAfterMs: number } {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return { allowed: false, retryAfterMs: windowMs - (now - recent[0]) };
      }
      recent.push(now);
      hits.set(key, recent);
      if (hits.size > 5000) {
        for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
      }
      return { allowed: true, retryAfterMs: 0 };
    },
  };
}
