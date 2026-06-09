import { NextResponse } from "next/server";

// Server-side only — these are NOT exposed to the client
const TARGETS = {
  app:      { name: "Nuxari App",        url: process.env.NUXARI_APP_URL      ?? "" },
  api:      { name: "Nuxari API",        url: process.env.NUXARI_API_URL      ?? "" },
  www:      { name: "Nuxari Website",    url: process.env.NUXARI_WWW_URL      ?? "" },
  docs:     { name: "Documentation",     url: process.env.NUXARI_DOCS_URL     ?? "" },
  auth:     { name: "Auth Service",      url: process.env.NUXARI_AUTH_HEALTH_URL ?? "" },
};

type HealthStatus = "ok" | "degraded" | "down" | "unknown";

interface CheckResult {
  key:        string;
  name:       string;
  status:     HealthStatus;
  latencyMs:  number | null;
  checkedAt:  string;
}

const TIMEOUT_MS = 3_000;

async function runCheck(key: string, name: string, url: string): Promise<CheckResult> {
  const checkedAt = new Date().toISOString();

  if (!url) {
    return { key, name, status: "unknown", latencyMs: null, checkedAt };
  }

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const start      = Date.now();

  try {
    const res = await fetch(url, {
      method:  "HEAD",
      signal:  controller.signal,
      cache:   "no-store",
      headers: { "User-Agent": "NuxariStatusCheck/1.0" },
    });
    const latencyMs = Date.now() - start;

    if (res.status >= 500) return { key, name, status: "down",     latencyMs, checkedAt };
    if (res.status >= 400) return { key, name, status: "degraded", latencyMs, checkedAt };
    return                        { key, name, status: "ok",       latencyMs, checkedAt };
  } catch {
    // fetch threw (network error, abort/timeout, etc.) — never expose the raw error
    return { key, name, status: "down", latencyMs: null, checkedAt };
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const now = new Date().toISOString();

  // Run all checks in parallel
  const results = await Promise.all(
    Object.entries(TARGETS).map(([key, { name, url }]) => runCheck(key, name, url))
  );

  const checks: Record<string, CheckResult> = {};
  for (const r of results) {
    checks[r.key] = r;
  }

  return NextResponse.json(
    { checks, checkedAt: now },
    {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        "Content-Type":  "application/json",
      },
    }
  );
}
