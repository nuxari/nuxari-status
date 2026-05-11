import Link from "next/link";
import { INCIDENT_STATUS_CONFIG, SEVERITY_CONFIG } from "@/lib/tokens";
import type { StatusIncidentRecord } from "@/lib/types";
import { formatDateTime, timeAgo } from "@/lib/utils";

interface Props {
  incident:  StatusIncidentRecord;
  compact?:  boolean;
}

export function IncidentCard({ incident, compact = false }: Props) {
  const sev = SEVERITY_CONFIG[incident.severity] ?? SEVERITY_CONFIG.minor;
  const st  = INCIDENT_STATUS_CONFIG[incident.status] ?? INCIDENT_STATUS_CONFIG.investigating;
  const latest = incident.updates[0];

  return (
    <div className={`rounded-2xl border bg-white shadow-sm overflow-hidden ${sev.border}`}>
      {/* Header */}
      <div className={`px-5 py-4 ${sev.bg}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${sev.bg} ${sev.text} ${sev.border}`}>
                {sev.label}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/70 ${st.text}`}>
                <span className={`inline-flex size-1.5 rounded-full ${st.dot}`} />
                {st.label}
              </span>
              {incident.resolvedAt && (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/70 text-gray-500">
                  Resolved {timeAgo(incident.resolvedAt)}
                </span>
              )}
            </div>
            <Link
              href={`/incidents/${incident.id}`}
              className="block text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
            >
              {incident.title}
            </Link>
            {incident.summary && !compact && (
              <p className="mt-1 text-sm text-gray-600">{incident.summary}</p>
            )}
            <p className="mt-1.5 text-xs text-gray-400">
              Started {formatDateTime(incident.startedAt)}
            </p>
          </div>
          <Link
            href={`/incidents/${incident.id}`}
            className="shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-700 whitespace-nowrap"
          >
            View details →
          </Link>
        </div>
      </div>

      {/* Latest update */}
      {latest && !compact && (
        <div className="px-5 py-3.5 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
            Latest update · {timeAgo(latest.createdAt)}
          </p>
          <p className="text-sm text-gray-700 line-clamp-2">{latest.message}</p>
        </div>
      )}
    </div>
  );
}
