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
      className="border overflow-hidden"
      style={{ background: "#f5f3ee", borderColor: "#d3cfc3" }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b"
        style={{ background: "#ece9e1", borderColor: "#d3cfc3" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              {/* Severity badge — light, sharp */}
              <span
                className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold border ${sev.bg} ${sev.text} ${sev.border}`}
              >
                {sev.label}
              </span>

              {/* Status badge — light, sharp */}
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium border"
                style={{ background: "#f5f3ee", borderColor: "#d3cfc3" }}
              >
                <span className={`inline-flex size-1.5 ${st.dot}`} />
                <span className={st.text}>{st.label}</span>
              </span>

              {incident.resolvedAt && (
                <span
                  className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium border"
                  style={{ background: "transparent", borderColor: "#d3cfc3", color: "#8a8a80" }}
                >
                  Resolved {timeAgo(incident.resolvedAt)}
                </span>
              )}
            </div>

            <Link
              href={`/incidents/${incident.id}`}
              className="block text-base font-semibold transition-colors"
              style={{ color: "#161616" }}
            >
              {incident.title}
            </Link>

            {incident.summary && !compact && (
              <p className="mt-1 text-sm" style={{ color: "#5b5b54" }}>
                {incident.summary}
              </p>
            )}

            <p className="mt-1.5 text-xs" style={{ color: "#8a8a80" }}>
              Started {formatDateTime(incident.startedAt)}
            </p>
          </div>

          <Link
            href={`/incidents/${incident.id}`}
            className="shrink-0 text-xs font-medium transition-colors whitespace-nowrap"
            style={{ color: "#2f4bff" }}
          >
            View details
          </Link>
        </div>
      </div>

      {/* Latest update */}
      {latest && !compact && (
        <div className="px-5 py-3.5">
          <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "#8a8a80" }}>
            Latest update · {timeAgo(latest.createdAt)}
          </p>
          <p className="text-sm line-clamp-2" style={{ color: "#5b5b54" }}>
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
      className="border px-6 py-8 flex items-center gap-4"
      style={{ background: "#f5f3ee", borderColor: "#d3cfc3" }}
    >
      <div
        className="flex size-10 shrink-0 items-center justify-center text-sm font-bold"
        style={{ background: "rgba(16,185,129,0.12)", color: "#059669", border: "1px solid rgba(16,185,129,0.25)" }}
      >
        ✓
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: "#161616" }}>
          No active incidents
        </p>
        <p className="mt-0.5 text-xs" style={{ color: "#5b5b54" }}>
          All systems are operating normally.
        </p>
      </div>
    </div>
  );
}
