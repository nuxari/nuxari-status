# Nuxari Status — Architecture

## Overview

`status.nuxari.com` is a standalone public Next.js application that displays the real-time operational status of all Nuxari services. It is intentionally isolated from the main `app.nuxari.com` product and requires no authentication.

---

## Deployment Topology

```
status.nuxari.com  ─── Vercel (nuxari-status project)
       │
       │  HTTPS API calls (server-side ISR + client-side)
       ▼
api.nuxari.com  ─── Railway (nuxari-api)
       │
       ▼
  Supabase PostgreSQL
  (StatusComponent, StatusIncident, StatusSubscriber, ...)
```

---

## Repository

| Item | Value |
|---|---|
| Repo | `nuxari-status` |
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 (CSS-first) |
| Language | TypeScript 5 |
| Runtime | Node.js 20 |
| Deployment | Vercel |
| Domain | `status.nuxari.com` |

---

## Environment Variables

| Variable | Purpose | Production value |
|---|---|---|
| `NEXT_PUBLIC_STATUS_API_URL` | Base URL of the Nuxari API | `https://api.nuxari.com` |
| `NEXT_PUBLIC_STATUS_PAGE_URL` | Canonical URL of this site | `https://status.nuxari.com` |

No secrets are stored in this project. All variables are public and safe to expose to browsers.

---

## Pages

### `/` — System status dashboard

- **Type:** Server Component with ISR (`revalidate: 60`)
- **Data:** `GET /api/status/public` + `GET /api/status/incidents?resolved=true`
- **Shows:** Overall banner, component groups, active incidents, maintenance windows, incident history, subscribe form

### `/incidents/[id]` — Incident detail

- **Type:** Server Component with ISR (`revalidate: 30`)
- **Data:** `GET /api/status/incidents/:id`
- **Shows:** Incident metadata, affected services, customer impact, full timeline, root cause, remediation

### `/unsubscribe` — Email unsubscribe

- **Type:** Client Component
- **Behaviour:** Reads `?token=xxx` from the URL, calls `POST /api/status/unsubscribe`, renders success/error state

---

## API Endpoints Used

All calls go to `NEXT_PUBLIC_STATUS_API_URL` (`api.nuxari.com`). No authentication required.

| Method | Path | Used by |
|---|---|---|
| GET | `/api/status/public` | Main page (server-side ISR) |
| GET | `/api/status/incidents?resolved=true` | Incident history (server-side ISR) |
| GET | `/api/status/incidents/:id` | Incident detail (server-side ISR) |
| POST | `/api/status/subscribe` | Subscribe form (client-side) |
| POST | `/api/status/unsubscribe` | Unsubscribe page (client-side, JSON) |

---

## Data Flow

### Server-rendered pages (main page + incident detail)

```
Browser request
  → Vercel Edge (CDN hit if cached, ISR revalidation if stale)
    → Next.js server fetches from api.nuxari.com
      → Prisma queries Supabase
        → Response rendered to HTML
          → Served to browser
```

### Client interactions (subscribe, unsubscribe)

```
Browser
  → fetch() to api.nuxari.com/api/status/...
    → Express route handler
      → Prisma write
        → Response JSON
```

---

## Status Components

The nine default status components tracked:

| Key | Name | Group |
|---|---|---|
| `api` | API | core |
| `database` | Database | core |
| `authentication` | Authentication | core |
| `frontend` | Web Application | core |
| `email` | Email Delivery | notifications |
| `notifications` | Notifications | notifications |
| `workflow_engine` | Workflow Engine | operations |
| `integrations` | Integration Sync | operations |
| `edge_agents` | Edge Agent Control Plane | operations |

---

## Incident Lifecycle on the Status Site

1. Incident created (via admin API) → component status automatically changes → active incident appears on `/`
2. Admin adds updates (via admin API) → visible on both `/` and `/incidents/:id`
3. Incident resolved → component restores to operational → incident moves to history section
4. Subscribers receive email at each step; unsubscribe links point to `https://status.nuxari.com/unsubscribe?token=xxx`

---

## Caching Strategy

| Page | Strategy | TTL |
|---|---|---|
| `/` | ISR | 60s |
| `/incidents/[id]` | ISR | 30s |
| `/unsubscribe` | No cache (client-only) | — |

For active incidents, the 30–60s cache lag is acceptable. The status page is not a real-time dashboard — it is a signal of known health. For live incident tracking, the timeline updates provide the necessary detail.
