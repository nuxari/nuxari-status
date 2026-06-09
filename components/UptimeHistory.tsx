import type { StatusComponentRecord } from "@/lib/types";

interface Props {
  components: StatusComponentRecord[];
}

function uptimeBarColor(pct: number): string {
  if (pct >= 99.0) return "#10b981";
  if (pct >= 97.0) return "#d97706";
  if (pct >= 90.0) return "#ea580c";
  return "#dc2626";
}

function UptimeBar({ component }: { component: StatusComponentRecord }) {
  const pct      = component.uptimePct ?? 0;
  const barColor = uptimeBarColor(pct);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs truncate" style={{ color: "#161616" }}>
          {component.name}
        </span>
        <span className="text-xs shrink-0 tabular-nums" style={{ color: "#8a8a80" }}>
          {pct.toFixed(2)}%
        </span>
      </div>

      {/* Progress bar — sharp edges */}
      <div
        className="h-1.5 w-full overflow-hidden"
        style={{ background: "#d3cfc3" }}
      >
        <div
          className="h-full transition-all"
          style={{ width: `${Math.min(pct, 100)}%`, background: barColor }}
        />
      </div>
    </div>
  );
}

export function UptimeHistory({ components }: Props) {
  const withUptime = components.filter(
    (c) => c.uptimePct !== undefined && c.uptimePct !== null
  );

  return (
    <section>
      <h2
        className="mb-4 text-xs font-semibold uppercase tracking-widest"
        style={{ color: "#8a8a80" }}
      >
        30-Day Uptime
      </h2>

      {withUptime.length === 0 ? (
        <div
          className="border px-6 py-8 text-center"
          style={{ background: "#f5f3ee", borderColor: "#d3cfc3" }}
        >
          <p className="text-sm" style={{ color: "#5b5b54" }}>
            Historical uptime will appear after monitoring data is collected.
          </p>
        </div>
      ) : (
        <div
          className="border px-5 py-5 space-y-4"
          style={{ background: "#f5f3ee", borderColor: "#d3cfc3" }}
        >
          {withUptime.map((c) => (
            <UptimeBar key={c.id} component={c} />
          ))}
        </div>
      )}
    </section>
  );
}
