import { GROUP_LABELS, STATUS_COLORS, STATUS_LABELS } from "@/lib/tokens";
import type { StatusComponentRecord } from "@/lib/types";
import { StatusDot } from "./StatusDot";

function ComponentRow({ c }: { c: StatusComponentRecord }) {
  const col = STATUS_COLORS[c.status] ?? STATUS_COLORS.operational;

  return (
    <div
      className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
      style={{ borderColor: "#d3cfc3" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <StatusDot status={c.status} pulse={c.status !== "operational"} />
        <div className="min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: "#161616" }}>
            {c.name}
          </p>
          {c.description && (
            <p className="text-xs truncate mt-0.5" style={{ color: "#5b5b54" }}>
              {c.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {c.uptimePct !== undefined && c.uptimePct !== null && (
          <span className="text-xs hidden sm:block" style={{ color: "#8a8a80" }}>
            {c.uptimePct.toFixed(2)}%
          </span>
        )}

        {/* Status badge — light theme, sharp edges */}
        <span
          className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border ${col.bg} ${col.text} ${col.border}`}
        >
          {STATUS_LABELS[c.status] ?? c.status}
        </span>
      </div>
    </div>
  );
}

interface Props {
  groupKey:   string;
  components: StatusComponentRecord[];
}

export function ComponentGroup({ groupKey, components }: Props) {
  const label = GROUP_LABELS[groupKey] ?? groupKey.replace(/_/g, " ");
  const allOp = components.every((c) => c.status === "operational");

  return (
    <div
      className="border overflow-hidden"
      style={{ background: "#f5f3ee", borderColor: "#d3cfc3" }}
    >
      {/* Group header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ background: "#ece9e1", borderColor: "#d3cfc3" }}
      >
        <h3
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "#8a8a80" }}
        >
          {label}
        </h3>
        {allOp && (
          <span className="text-xs font-medium" style={{ color: "#059669" }}>
            All operational
          </span>
        )}
      </div>

      {/* Component rows */}
      <div className="divide-y px-5 py-1" style={{ "--tw-divide-opacity": "1" } as React.CSSProperties}>
        {components.map((c) => (
          <div key={c.id} style={{ borderColor: "#d3cfc3" }}>
            <ComponentRow c={c} />
          </div>
        ))}
      </div>
    </div>
  );
}
