# Nuxari Status — Health Check Behavior

The `/api/health-check` route performs live server-side health checks against Nuxari endpoints. It is designed to be safe, fast, and never expose internal details.

## Endpoint

```
GET /api/health-check
Cache-Control: public, s-maxage=30, stale-while-revalidate=60
```

## Response Shape

```ts
{
  checks: {
    [key: string]: {
      key:       string;       // e.g. "api", "app", "www"
      name:      string;       // Human-readable label
      status:    "ok" | "degraded" | "down" | "unknown";
      latencyMs: number | null; // null if timeout or network error
      checkedAt: string;       // ISO 8601 timestamp
    }
  };
  checkedAt: string;           // ISO 8601 timestamp (when the batch ran)
}
```

## Status Mapping

| Condition | Status |
|---|---|
| URL env var not set | `unknown` |
| fetch throws (network error, CORS, DNS) | `down` |
| AbortController timeout (3 seconds) | `down` |
| HTTP 500–599 | `down` |
| HTTP 400–499 | `degraded` |
| HTTP 200–399 | `ok` |

## Targets Checked

| Key | Name | Env Var |
|---|---|---|
| `app` | Nuxari App | `NUXARI_APP_URL` |
| `api` | Nuxari API | `NUXARI_API_URL` |
| `www` | Nuxari Website | `NUXARI_WWW_URL` |
| `docs` | Documentation | `NUXARI_DOCS_URL` |
| `auth` | Auth Service | `NUXARI_AUTH_HEALTH_URL` |

## Timeout

Each check has a hard 3-second timeout via `AbortController`. All checks run in parallel via `Promise.all`, so the total response time is bounded by the slowest check (max 3s + overhead).

## Safety

- Raw errors are never included in the response
- Internal URLs, stack traces, or infrastructure details are never exposed
- Server-only env vars (`NUXARI_*`) are never sent to the client
- The route uses `HEAD` requests to minimize bandwidth

## Caching

The response is cached for 30 seconds at the CDN/edge (`s-maxage=30`) and served stale for up to 60 more seconds while revalidating (`stale-while-revalidate=60`). This prevents the status page from hammering backend services on every page load.

## Missing Targets

If a target URL env var is not set, its check returns `status: "unknown"` rather than failing. This allows partial deployments without breaking the endpoint.
