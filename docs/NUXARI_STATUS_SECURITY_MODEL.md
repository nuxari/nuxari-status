# Nuxari Status — Security Model

## What Is Exposed

The status page is a **public** endpoint. It exposes only:

- Overall system status (operational / degraded / outage / maintenance)
- Component names, descriptions, and current status
- Component uptime percentages
- Incident titles, summaries, status, severity, and timeline updates
- Scheduled maintenance titles, descriptions, and windows
- Customer-facing impact statements (curated by admins)

## What Is Never Exposed

The following data is never included in any status page response:

| Category | Examples |
|---|---|
| Tenant data | Organization names, user records, access policies |
| Authentication secrets | JWT tokens, API keys, client secrets |
| Infrastructure details | Server IPs, internal hostnames, deployment names |
| Raw error messages | Stack traces, database errors, exception messages |
| Internal API paths | Admin endpoints, internal service URLs |
| Health check internals | Raw HTTP response bodies from health checks |

## API Client (lib/api.ts)

The API client fetches from `NEXT_PUBLIC_STATUS_API_URL`. Error handling:

- HTTP errors are caught and re-thrown as generic errors
- The error message from the API (`json.error?.message`) is passed through but the API is expected to return safe, curated messages
- Stack traces are never forwarded to the browser

## Health Check Route (app/api/health-check/route.ts)

The health check route runs server-side and is designed to be safe by default:

- Raw fetch errors are caught and replaced with `{ status: "down" }`
- No error messages, no stack traces, no URL details in the response
- Uses `HEAD` requests to avoid receiving response bodies
- Server-only env vars (`NUXARI_*`) are used — never `NEXT_PUBLIC_*`
- Response is cached 30 seconds to prevent backend hammering

## Environment Variables

Public env vars (`NEXT_PUBLIC_*`) are embedded in the JavaScript bundle and accessible to anyone who loads the page. They must only contain public URLs — never secrets.

Server-only env vars (no prefix) are used exclusively in Route Handlers and server components. They are never included in the client bundle.

## CORS

This is a Next.js application — CORS is handled by the hosting platform (Vercel, etc.). The health check route does not serve cross-origin requests by default. If needed, add CORS headers in `next.config.ts`.

## Rate Limiting

The status page itself does not implement rate limiting — it relies on CDN caching (ISR, `s-maxage`) to absorb traffic spikes. The health check endpoint is cached for 30 seconds (`s-maxage=30`).

For production deployments, rate limiting should be applied at the edge/CDN layer, not within the Next.js app.

## Content Security Policy

The status page does not set a CSP header by default. For production:
- Add a CSP via `next.config.ts` response headers
- Restrict `script-src` to `'self'` and any required CDN domains
- Restrict `connect-src` to the API domain

## No Authentication Required

The status page is intentionally public and unauthenticated. No login is required to view system status or incidents. This is by design — visibility into system health should never be gated behind authentication for a public-facing service.

The email subscription form collects only email addresses and passes them to the backend API for storage. No PII is stored by the status page application itself.
