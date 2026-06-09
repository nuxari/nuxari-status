import Link from "next/link";
import { INCIDENT_STATUS_CONFIG, SEVERITY_CONFIG } from "@/lib/tokens";
import type { StatusIncidentRecord } from "@/lib/types";
import { formatDateTime, timeAgo } from "@/lib/utils";

interface Props {
  incident:  StatusIncidentRecord;
  compact?:  boolean;
}

export function IncidentCard({ incident, compact = false }: Props) {
  const sev    = SEVERITY_CONFIG[incident.severity] ?? SEVERITY_CONFIG.minor;
  const st     = INCIDENT_STATUS_CONFIG[incident.status] ?? INCIDENT_STATUS_CONFIG.investigating;
  const latest = incident.updates[0];

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: "#161616", borderColor: "#2b2b2b" }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b"
        style={{ background: "#1d1d1d", borderColor: "#2b2b2b" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              {/* Severity badge */}
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${sev.darkBg} ${sev.darkText} ${sev.darkBorder}`}
              >
                {sev.label}
              </span>

              {/* Status badge */}
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "#2b2b2b" }}
              >
                <span className={`inline-flex size-1.5 rounded-full ${st.dot}`} />
                <span className={st.darkText}>{st.label}</span>
              </span>

              {incident.resolvedAt && (
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border"
                  style={{ background: "transparent", borderColor: "#2b2b2b", color: "#9a9a94" }}
                >
                  Resolved {timeAgo(incident.resolvedAt)}
                </span>
              )}
            </div>

            <Link
              href={`/incidents/${incident.id}`}
              className="block text-base font-semibold transition-colors"
              style={{ color: "#f3f2ee" }}
            >
              {incident.title}
            </Link>

            {incident.summary && !compact && (
              <p className="mt-1 text-sm" style={{ color: "#9a9a94" }}>
                {incident.summary}
              </p>
            )}

            <p className="mt-1.5 text-xs" style={{ color: "#6b6b66" }}>
              Started {formatDateTime(incident.startedAt)}
            </p>
          </div>

          <Link
            href={`/incidents/${incident.id}`}
            className="shrink-0 text-xs font-medium transition-colors whitespace-nowrap"
            style={{ color: "#2f4bff" }}
          >
            View details →
          </Link>
        </div>
      </div>

      {/* Latest update */}
      {latest && !compact && (
        <div className="px-5 py-3.5">
          <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "#6b6b66" }}>
            Latest update · {timeAgo(latest.createdAt)}
          </p>
          <p className="text-sm line-clamp-2" style={{ color: "#9a9a94" }}>
            {latest.message}
          </p>
        </div>
      )}
    </div>
  );
}

/** Empty state shown when no active incidents */
export function NoIncidentsCard() {
  return (
    <div
      className="rounded-xl border px-6 py-8 flex items-center gap-4"
      style={{ background: "#161616", borderColor: "#2b2b2b" }}
    >
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-full text-lg"
        style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}
      >
        ✓
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: "#f3f2ee" }}>
          No active incidents
        </p>
        <p className="mt-0.5 text-xs" style={{ color: "#9a9a94" }}>
          All systems are operating normally.
        </p>
      </div>
    </div>
  );
}
