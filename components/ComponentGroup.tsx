import { GROUP_LABELS, STATUS_COLORS, STATUS_LABELS } from "@/lib/tokens";
import type { StatusComponentRecord } from "@/lib/types";
import { StatusDot } from "./StatusDot";

function ComponentRow({ c }: { c: StatusComponentRecord }) {
  const col = STATUS_COLORS[c.status] ?? STATUS_COLORS.operational;

  return (
    <div
      className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
      style={{ borderColor: "#2b2b2b" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <StatusDot status={c.status} pulse={c.status !== "operational"} />
        <div className="min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: "#f3f2ee" }}>
            {c.name}
          </p>
          {c.description && (
            <p className="text-xs truncate mt-0.5" style={{ color: "#9a9a94" }}>
              {c.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Uptime percentage */}
        {c.uptimePct !== undefined && c.uptimePct !== null && (
          <span className="text-xs hidden sm:block" style={{ color: "#9a9a94" }}>
            {c.uptimePct.toFixed(2)}%
          </span>
        )}

        {/* Status badge */}
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${col.darkBg} ${col.darkText} ${col.darkBorder}`}
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
      className="rounded-xl border overflow-hidden"
      style={{ background: "#161616", borderColor: "#2b2b2b" }}
    >
      {/* Group header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ background: "#1d1d1d", borderColor: "#2b2b2b" }}
      >
        <h3
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "#9a9a94" }}
        >
          {label}
        </h3>
        {allOp && (
          <span className="text-xs font-medium" style={{ color: "#10b981" }}>
            All operational
          </span>
        )}
      </div>

      {/* Component rows */}
      <div className="divide-y px-5 py-1" style={{ "--tw-divide-opacity": "1" } as React.CSSProperties}>
        {components.map((c) => (
          <div key={c.id} style={{ borderColor: "#2b2b2b" }}>
            <ComponentRow c={c} />
          </div>
        ))}
      </div>
    </div>
  );
}
