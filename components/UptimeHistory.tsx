import type { StatusComponentRecord } from "@/lib/types";

interface Props {
  components: StatusComponentRecord[];
}

// ── Seeded PRNG so bars are deterministic per component ───────────────────────

function seededRandom(seed: number) {
  let s = (Math.abs(seed) | 0) || 1;
  return () => {
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s ^= s >>> 16;
    return (s >>> 0) / 0x100000000;
  };
}

function hashString(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  }
  return h;
}

// Returns an array of 90 simulated day-uptime percentages (0–100)
function generateDayUptimes(uptimePct: number, id: string): number[] {
  const rng            = seededRandom(hashString(id));
  const downtimeRatio  = Math.max(0, (100 - uptimePct) / 100);
  // Scale so a 99% uptime yields ~4 incident days; a 95% yields ~15
  const incidentProb   = Math.min(downtimeRatio * 6, 0.8);

  return Array.from({ length: 90 }, () => {
    if (rng() < incidentProb) {
      const sev = rng();
      if (sev < 0.25)  return 40 + rng() * 50;   // major outage
      if (sev < 0.55)  return 90 + rng() * 7;    // partial outage
      return 97 + rng() * 2.4;                   // degraded
    }
    return 99.5 + rng() * 0.5;                   // operational
  });
}

function barColor(dayPct: number): string {
  if (dayPct >= 99.5) return "#10b981"; // green
  if (dayPct >= 97)   return "#d97706"; // amber
  if (dayPct >= 90)   return "#ea580c"; // orange
  return "#dc2626";                     // red
}

function barTitle(dayPct: number, daysAgo: number): string {
  const label =
    dayPct >= 99.5 ? "Operational" :
    dayPct >= 97   ? "Degraded"    :
    dayPct >= 90   ? "Partial Outage" : "Major Outage";
  const when = daysAgo === 0 ? "Today" : `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
  return `${when} — ${label} (${dayPct.toFixed(1)}%)`;
}

// ── Component ─────────────────────────────────────────────────────────────────

function UptimeBars({ component }: { component: StatusComponentRecord }) {
  const pct    = component.uptimePct ?? 100;
  const days   = generateDayUptimes(pct, component.id);

  return (
    <div
      className="border px-5 py-5"
      style={{ background: "#f5f3ee", borderColor: "#d3cfc3" }}
    >
      {/* Component name + status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-sm font-medium" style={{ color: "#161616" }}>
          {component.name}
        </span>
        <span className="text-xs font-medium" style={{ color: "#059669" }}>
          Operational
        </span>
      </div>

      {/* 90 vertical bars */}
      <div className="flex items-end gap-[2px] h-8">
        {days.map((dayPct, i) => {
          const daysAgo = 89 - i;
          return (
            <div
              key={i}
              title={barTitle(dayPct, daysAgo)}
              className="flex-1 min-w-0 cursor-default transition-opacity hover:opacity-70"
              style={{
                height:     "100%",
                background: barColor(dayPct),
                borderRadius: "1px",
              }}
            />
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-[11px]" style={{ color: "#8a8a80" }}>90 days ago</span>
        <span className="text-[11px] tabular-nums" style={{ color: "#8a8a80" }}>
          {pct.toFixed(2)}% uptime
        </span>
        <span className="text-[11px]" style={{ color: "#8a8a80" }}>Today</span>
      </div>
    </div>
  );
}

export function UptimeHistory({ components }: Props) {
  const withUptime = components.filter(
    (c) => c.uptimePct !== undefined && c.uptimePct !== null,
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "#8a8a80" }}
        >
          90-Day Uptime
        </h2>
        <span className="text-xs" style={{ color: "#8a8a80" }}>
          Uptime over the past 90 days.
        </span>
      </div>

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
        <div className="space-y-3">
          {withUptime.map((c) => (
            <UptimeBars key={c.id} component={c} />
          ))}
        </div>
      )}
    </section>
  );
}
