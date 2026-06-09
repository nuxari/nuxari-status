import type { StatusMaintenanceRecord } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

interface Props {
  window: StatusMaintenanceRecord;
}

export function MaintenanceCard({ window: mw }: Props) {
  const isActive = mw.status === "in_progress";

  return (
    <div
      className="rounded-xl border px-5 py-4"
      style={{
        background: "#161616",
        borderColor: isActive ? "rgba(139,92,246,0.4)" : "#2b2b2b",
      }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg text-base"
          style={
            isActive
              ? { background: "rgba(139,92,246,0.15)", color: "#8b5cf6" }
              : { background: "#1d1d1d", color: "#9a9a94" }
          }
        >
          ⚙
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="text-sm font-semibold" style={{ color: "#f3f2ee" }}>
              {mw.title}
            </p>
            {isActive && (
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border"
                style={{
                  background: "rgba(139,92,246,0.12)",
                  color: "#8b5cf6",
                  borderColor: "rgba(139,92,246,0.3)",
                }}
              >
                In Progress
              </span>
            )}
          </div>

          {mw.description && (
            <p className="text-sm mb-1.5" style={{ color: "#9a9a94" }}>
              {mw.description}
            </p>
          )}

          <p className="text-xs" style={{ color: "#6b6b66" }}>
            {formatDateTime(mw.scheduledAt)} — {formatDateTime(mw.endsAt)}
          </p>

          {mw.components.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {mw.components.map((c) => (
                <span
                  key={c}
                  className="inline-flex rounded-md px-2 py-0.5 text-xs"
                  style={{ background: "#1d1d1d", color: "#9a9a94" }}
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
