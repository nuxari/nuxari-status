import { INCIDENT_STATUS_CONFIG } from "@/lib/tokens";
import type { StatusUpdateRecord, IncidentStatus } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

interface Props {
  updates: StatusUpdateRecord[];
}

export function IncidentTimeline({ updates }: Props) {
  if (updates.length === 0) return null;

  const ordered = [...updates].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {ordered.map((u, i) => {
          const cfg    = INCIDENT_STATUS_CONFIG[u.status as IncidentStatus] ?? INCIDENT_STATUS_CONFIG.investigating;
          const isLast = i === ordered.length - 1;

          return (
            <li key={u.id}>
              <div className="relative pb-8">
                {/* Connector line */}
                {!isLast && (
                  <span
                    className="absolute left-3.5 top-5 -ml-px h-full w-px"
                    style={{ background: "#d3cfc3" }}
                    aria-hidden="true"
                  />
                )}

                <div className="relative flex items-start gap-4">
                  {/* Dot */}
                  <div className="relative flex size-7 shrink-0 items-center justify-center">
                    <span
                      className={`size-2.5 ring-4 ${cfg.dot}`}
                      style={{ "--tw-ring-color": "#ece9e1" } as React.CSSProperties}
                    />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.text}`}>
                        {cfg.label}
                      </span>
                      <time className="text-xs" style={{ color: "#8a8a80" }}>
                        {formatDateTime(u.createdAt)}
                      </time>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#5b5b54" }}>
                      {u.message}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
