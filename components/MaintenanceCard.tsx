import type { StatusMaintenanceRecord } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

interface Props {
  window: StatusMaintenanceRecord;
}

export function MaintenanceCard({ window: mw }: Props) {
  const isActive = mw.status === "in_progress";

  return (
    <div
      className="border px-5 py-4"
      style={{
        background: "#f5f3ee",
        borderColor: isActive ? "rgba(124,58,237,0.35)" : "#d3cfc3",
      }}
    >
      <div className="flex items-start gap-3">
        {/* Status indicator bar */}
        <div
          className="mt-1 w-1 self-stretch shrink-0"
          style={{
            background: isActive ? "#7c3aed" : "#d3cfc3",
          }}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="text-sm font-semibold" style={{ color: "#161616" }}>
              {mw.title}
            </p>
            {isActive && (
              <span
                className="inline-flex items-center px-2 py-0.5 text-xs font-medium border"
                style={{
                  background: "rgba(124,58,237,0.08)",
                  color: "#4c1d95",
                  borderColor: "rgba(124,58,237,0.25)",
                }}
              >
                In Progress
              </span>
            )}
          </div>

          {mw.description && (
            <p className="text-sm mb-1.5" style={{ color: "#5b5b54" }}>
              {mw.description}
            </p>
          )}

          <p className="text-xs" style={{ color: "#8a8a80" }}>
            {formatDateTime(mw.scheduledAt)} — {formatDateTime(mw.endsAt)}
          </p>

          {mw.components.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {mw.components.map((c) => (
                <span
                  key={c}
                  className="inline-flex px-2 py-0.5 text-xs border"
                  style={{ background: "#ece9e1", borderColor: "#d3cfc3", color: "#5b5b54" }}
                >
                  {c.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
