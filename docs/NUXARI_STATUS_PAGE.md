# Nuxari Status Page

The Nuxari Status Page is a public-facing Next.js application that shows real-time system health, active incidents, scheduled maintenance, and 30-day uptime history for the Nuxari governance platform.

## Overview

- Framework: Next.js 16 (App Router, ISR)
- Styling: Tailwind CSS v4 with a dark enterprise theme
- Data: Fetched server-side from the Nuxari API
- Rendering: Incremental Static Regeneration (60s revalidation)
- Port: 3002 (dev and start)

## Setup

```bash
cp .env.example .env.local
# Fill in your values in .env.local
npm install
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_STATUS_PAGE_URL` | Yes | Public URL of this status page |
| `NEXT_PUBLIC_STATUS_API_URL` | Yes | Nuxari backend API base URL |
| `NEXT_PUBLIC_APP_URL` | Yes | Nuxari app URL |
| `NEXT_PUBLIC_WWW_URL` | Yes | Nuxari marketing site URL |
| `NEXT_PUBLIC_DOCS_URL` | Yes | Nuxari docs URL |
| `NEXT_PUBLIC_SUPPORT_URL` | Yes | Support ticket creation URL |
| `NUXARI_API_URL` | Server only | Used by health-check route |
| `NUXARI_APP_URL` | Server only | Used by health-check route |
| `NUXARI_WWW_URL` | Server only | Used by health-check route |
| `NUXARI_DOCS_URL` | Server only | Used by health-check route |
| `NUXARI_AUTH_HEALTH_URL` | Server only | Auth service health endpoint |

All `NEXT_PUBLIC_*` variables are exposed to the browser. Server-only variables (no `NEXT_PUBLIC_` prefix) are never sent to the client.

## Development

```bash
npm run dev       # Start dev server on :3002
npm run build     # Production build
npm run start     # Start production server on :3002
npm test          # Run test suite
npm run test:ci   # CI mode with coverage
```

## Deployment

The status page should be deployed to a separate domain from the main app (e.g., `status.nuxari.com`). This ensures the status page remains accessible even when the main app is experiencing issues.

Set `NEXT_PUBLIC_STATUS_PAGE_URL` to the deployed URL before building.

## Architecture

```
app/
  page.tsx                  — Main status page (server component, ISR 60s)
  layout.tsx                — Root layout with SEO metadata
  globals.css               — Dark enterprise CSS design system
  api/
    health-check/route.ts   — Server-side health check endpoint
  incidents/[id]/page.tsx   — Individual incident detail page
  unsubscribe/page.tsx      — Email unsubscribe handler

components/
  SiteHeader.tsx            — Dark nav bar with Nuxari branding
  Banner.tsx                — Hero section with overall status badge
  ComponentGroup.tsx        — Group of system components
  IncidentCard.tsx          — Active/historical incident card
  MaintenanceCard.tsx       — Scheduled maintenance card
  IncidentTimeline.tsx      — Incident update timeline
  SubscribeForm.tsx         — Email subscription form
  SiteFooter.tsx            — Dark footer with links
  SupportCTA.tsx            — Support request call-to-action
  TrustPanel.tsx            — Enterprise trust indicators
  UptimeHistory.tsx         — 30-day uptime bars

lib/
  api.ts                    — API client (fetch wrappers)
  tokens.ts                 — Status colors, labels, group config
  types.ts                  — TypeScript type definitions
  utils.ts                  — Date/time formatting utilities
```

## API Data Flow

The status page fetches from two endpoints:
1. `GET /api/status/public` — Overall status, components, active incidents, maintenance
2. `GET /api/status/incidents?resolved=true&limit=30` — Incident history

Both are fetched server-side during page render. The page degrades gracefully if either call fails (incident history failure is non-fatal).

## Resilience

The page HTML shell renders even if the API is down, showing a safe error state. The shell never depends on dynamic data for rendering the header, footer, or layout.
