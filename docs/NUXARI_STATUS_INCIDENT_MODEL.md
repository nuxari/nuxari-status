# Nuxari Status — Incident Model

## Incident Fields

```ts
interface StatusIncidentRecord {
  id:                 string;             // UUID
  title:              string;             // Short description
  summary:            string | null;      // Longer description shown publicly
  status:             IncidentStatus;     // Current lifecycle stage
  severity:           IncidentSeverity;   // Impact level
  affectedComponents: string[];           // Component keys affected
  startedAt:          string;             // ISO 8601 — when incident began
  resolvedAt:         string | null;      // ISO 8601 — null if unresolved
  customerImpact:     string | null;      // Impact statement shown to customers
  createdAt:          string;             // ISO 8601 — record creation
  updatedAt:          string;             // ISO 8601 — last modification
  updates:            StatusUpdateRecord[]; // Timeline of status changes
}
```

## Incident Status Lifecycle

```
investigating → identified → monitoring → resolved
```

| Status | Meaning |
|---|---|
| `investigating` | Team is actively investigating the root cause |
| `identified` | Root cause has been identified; fix in progress |
| `monitoring` | Fix deployed; team is monitoring to confirm resolution |
| `resolved` | Incident is fully resolved |

## Severity Levels

| Severity | Meaning |
|---|---|
| `informational` | No impact; informational notice only |
| `minor` | Minimal impact; workarounds available |
| `major` | Significant impact; many customers affected |
| `critical` | Complete outage or data-affecting incident |

## Incident Update Record

Each status change or communication is recorded as an update:

```ts
interface StatusUpdateRecord {
  id:        string;   // UUID
  message:   string;   // Public-facing status message
  status:    string;   // IncidentStatus value at time of update
  createdAt: string;   // ISO 8601
}
```

Updates are displayed in chronological order (oldest first) on the incident detail page.

## Creating an Incident

Incidents are created via the Nuxari admin API (not from the status page frontend). The status page reads incident data from:

```
GET /api/status/public          — active incidents (embedded in summary)
GET /api/status/incidents       — incident list with filters
GET /api/status/incidents/:id   — individual incident
```

## Updating an Incident

Incident updates (timeline entries) are added via the admin API. Each update should:
- Change the `status` if the lifecycle stage has changed
- Include a clear, customer-facing `message`
- Be authored by the responding engineer

## Resolving an Incident

When resolved:
- Set `status: "resolved"`
- Set `resolvedAt` to the resolution timestamp
- Add a final update describing what was done
- Optionally add `rootCause` and `remediation` fields

## Display Rules

- Active incidents (not resolved) appear in the "Active Incidents" section at the top of the status page
- Resolved incidents appear in "Incident History" (last 30)
- Individual incidents have a dedicated URL: `/incidents/:id`
- Compact mode (history list) shows title and badges only, no latest update preview
