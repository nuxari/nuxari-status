import type { StatusComponentRecord } from "@/lib/types";
import { STATUS_COLORS } from "@/lib/tokens";

interface Props {
  components: StatusComponentRecord[];
}

/** Returns the CSS color string for the uptime bar given a percentage */
function uptimeBarColor(pct: number): string {
  if (pct >= 99.9) return "#10b981";  // emerald — excellent
  if (pct >= 99.0) return "#10b981";  // emerald — good
  if (pct >= 97.0) return "#f59e0b";  // amber — degraded
  if (pct >= 90.0) return "#f97316";  // orange — partial outage
  return "#ef4444";                    // red — major outage
}

function UptimeBar({ component }: { component: StatusComponentRecord }) {
  const pct      = component.uptimePct ?? 0;
  const colToken = STATUS_COLORS[component.status] ?? STATUS_COLORS.operational;
  const barColor = uptimeBarColor(pct);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`inline-flex size-1.5 rounded-full shrink-0 ${colToken.dot}`} />
          <span className="text-xs truncate" style={{ color: "#f3f2ee" }}>
            {component.name}
          </span>
        </div>
        <span className="text-xs shrink-0 tabular-nums" style={{ color: "#9a9a94" }}>
          {pct.toFixed(2)}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 w-full rounded-full overflow-hidden"
        style={{ background: "#2b2b2b" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(pct, 100)}%`, background: barColor }}
        />
      </div>
    </div>
  );
}

export function UptimeHistory({ components }: Props) {
  // Filter to components that actually have uptime data
  const withUptime = components.filter(
    (c) => c.uptimePct !== undefined && c.uptimePct !== null
  );

  return (
    <section>
      <h2
        className="mb-4 text-xs font-semibold uppercase tracking-widest"
        style={{ color: "#9a9a94" }}
      >
        30-Day Uptime
      </h2>

      {withUptime.length === 0 ? (
        <div
          className="rounded-xl border px-6 py-8 text-center"
          style={{ background: "#161616", borderColor: "#2b2b2b" }}
        >
          <p className="text-sm" style={{ color: "#9a9a94" }}>
            Historical uptime will appear after monitoring data is collected.
          </p>
        </div>
      ) : (
        <div
          className="rounded-xl border px-5 py-5 space-y-4"
          style={{ background: "#161616", borderColor: "#2b2b2b" }}
        >
          {withUptime.map((c) => (
            <UptimeBar key={c.id} component={c} />
          ))}
        </div>
      )}
    </section>
  );
}
