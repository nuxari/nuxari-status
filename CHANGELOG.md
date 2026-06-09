# Changelog

All notable changes to the Nuxari Status Page are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added

**Brand redesign — dark enterprise theme**
- Replaced light theme with full dark operations dashboard matching the Nuxari brand palette (`#0f0f0f` bg, `#161616` surface, `#2f4bff` blue accent, `#f3f2ee` text)
- New `globals.css` with CSS custom properties, dot-grid background pattern, and status ping animations
- All components now use the dark theme — no light-themed leftovers

**SiteHeader redesign**
- Dark nav bar (`#161616`) with bottom border (`#2b2b2b`)
- Blue square N logo, Nuxari wordmark, "/" separator, Status label
- Desktop nav: Home, Docs, Support ghost links + "Open app" primary button
- Mobile: collapsible hamburger menu
- All URLs driven by `NEXT_PUBLIC_*` env vars

**Banner (Hero) redesign**
- Full enterprise hero with title "Nuxari System Status", descriptive subtitle
- Large status badge with pulse dot (operational/degraded/outage/maintenance states)
- Live "Last checked X ago" indicator with green pulse dot
- Active incident count callout
- CSS-only dot-grid background pattern
- Top accent line with status-colored gradient
- `major_outage` shows urgent red/dark background overlay

**Component groups expanded**
- `GROUP_ORDER` now covers `core_platform`, `governance_services`, `connectors_automation`, `data_layer`
- `GROUP_LABELS` updated with human-readable names
- Legacy group keys (`core`, `notifications`, `operations`) preserved for backwards compatibility

**ComponentGroup redesign**
- Dark card (`#161616`), dark header (`#1d1d1d`), border `#2b2b2b`
- Group header: uppercase tracking-widest label in muted color
- Component rows: dark dividers, `#f3f2ee` names, `#9a9a94` descriptions
- Dark pill status badges (colored text on dark background)
- Uptime percentage shown inline when available

**IncidentCard redesign**
- Dark card with dark header section
- Dark severity badges (e.g. `bg-red-950/50 text-red-400 border-red-800/50`)
- Dark status badges with colored dot
- `NoIncidentsCard` component — clean empty state with green checkmark

**MaintenanceCard redesign**
- Dark card with violet accent border when in-progress
- Dark component tags

**SubscribeForm redesign**
- Dark input field and subscribe button
- Dark success state with emerald green accent
- Dark error text

**IncidentTimeline redesign**
- Dark connector line (`#2b2b2b`)
- Colored status dots with dark ring
- Muted text colors for timestamps and messages

**SiteFooter redesign**
- Dark footer (`#161616`) with border-top `#2b2b2b`
- Logo + copyright, nav links (Home/Docs/Support/Privacy/Terms/Security)
- "View all incidents" link + RSS badge (coming soon)
- All URLs from env vars

**New components**
- `SupportCTA` — "Experiencing an issue not listed here?" card with support request + open app buttons
- `TrustPanel` — 5-item horizontal enterprise trust row (security, transparency, tenant isolation, support, audit systems)
- `UptimeHistory` — 30-day uptime bars per component; controlled empty state when no data

**New API route**
- `app/api/health-check/route.ts` — server-side health checks against 5 Nuxari endpoints
- Parallel HEAD requests with 3-second timeout per target
- Safe error mapping: timeout/network error → `down`, HTTP 5xx → `down`, 4xx → `degraded`, 2xx-3xx → `ok`
- No raw errors in response
- `Cache-Control: s-maxage=30` response caching
- Configured via server-only env vars (`NUXARI_*`)

**SEO improvements (`app/layout.tsx`)**
- Title: "Nuxari Status | System Health and Incident Updates"
- Description: "Real-time system status, uptime, incidents, and maintenance updates for the Nuxari governance platform."
- Full OpenGraph tags with image, URL, site name
- Twitter card (`summary_large_image`)
- `themeColor: "#2f4bff"` (Nuxari electric blue)

**Testing infrastructure**
- Jest 30 + `@testing-library/react` 16 + `@testing-library/jest-dom` 6 + `ts-jest` 29
- `jest.config.js` with jsdom environment and `@/` path alias resolution
- `jest.setup.ts` with jest-dom matchers, Next.js router mock, Next.js Link mock
- `__tests__/status-page.test.tsx` — 15 tests covering: render, branding, status badge, component groups, no-incidents state, active incident, support CTA, support URL, open app URL, docs link, uptime empty state, no raw error exposure, trust panel, SEO heading, mobile layout
- `__tests__/fixtures.ts` — controlled test data (no real API calls)
- All 15 tests passing

**Environment variables**
- `.env.example` updated with all public and server-side variables
- Complete documentation of which variables are browser-safe vs. server-only

**Documentation**
- `docs/NUXARI_STATUS_PAGE.md` — overview, setup, env vars, architecture, deployment
- `docs/NUXARI_STATUS_HEALTH_CHECKS.md` — health check behavior, timeouts, safe error mapping, caching
- `docs/NUXARI_STATUS_INCIDENT_MODEL.md` — incident fields, lifecycle, severity, update model
- `docs/NUXARI_STATUS_SUPPORT_REQUESTS.md` — support CTA, URL config, escalation flow
- `docs/NUXARI_STATUS_SECURITY_MODEL.md` — what is/isn't exposed, CORS, rate limits, CSP guidance

**Incident detail page**
- Full dark theme applied
- Dark incident header, badges, metadata grid, customer impact callout, timeline
- Dark affected services chips, root cause and remediation sections
- Blue back links

**Unsubscribe page**
- Full dark theme applied to all four card states: loading, success, error, missing

### Changed

- `lib/tokens.ts`: Added `darkBg`, `darkText`, `darkBorder` to all `STATUS_COLORS` and `SEVERITY_CONFIG` entries for dark-theme badge rendering
- `lib/tokens.ts`: Added `darkText` to `INCIDENT_STATUS_CONFIG` entries
- `app/page.tsx`: Always shows Active Incidents section (with `NoIncidentsCard` empty state); added `UptimeHistory`, `SupportCTA`, `TrustPanel`; `ErrorState` updated to dark theme
- `package.json`: Added test dependencies and `test`, `test:watch`, `test:ci` scripts

### Fixed

- Removed all `onMouseEnter`/`onMouseLeave` event handlers from server components (Next.js does not allow event handlers in server components)
- Dark theme is consistent throughout — no light-background remnants
