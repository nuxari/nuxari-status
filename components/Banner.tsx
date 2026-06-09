import { OVERALL_STATUS_LABELS } from "@/lib/tokens";
import type { ComponentStatus } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

interface Props {
  status:        ComponentStatus;
  lastCheckedAt: string;
  activeCount:   number;
}

const HERO_STATUS_CONFIG: Record<ComponentStatus, {
  badgeBg:    string;
  badgeText:  string;
  badgeBorder:string;
  dotColor:   string;
  heroBg?:    string;
}> = {
  operational:    { badgeBg: "rgba(16,185,129,0.1)",  badgeText: "#065f46", badgeBorder: "rgba(16,185,129,0.3)",  dotColor: "#10b981" },
  degraded:       { badgeBg: "rgba(217,119,6,0.1)",   badgeText: "#92400e", badgeBorder: "rgba(217,119,6,0.3)",   dotColor: "#d97706" },
  partial_outage: { badgeBg: "rgba(234,88,12,0.1)",   badgeText: "#7c2d12", badgeBorder: "rgba(234,88,12,0.3)",   dotColor: "#ea580c" },
  major_outage:   { badgeBg: "rgba(220,38,38,0.1)",   badgeText: "#7f1d1d", badgeBorder: "rgba(220,38,38,0.3)",   dotColor: "#dc2626", heroBg: "rgba(220,38,38,0.04)" },
  maintenance:    { badgeBg: "rgba(124,58,237,0.1)",  badgeText: "#4c1d95", badgeBorder: "rgba(124,58,237,0.3)",  dotColor: "#7c3aed" },
};

export function Banner({ status, lastCheckedAt, activeCount }: Props) {
  const cfg = HERO_STATUS_CONFIG[status] ?? HERO_STATUS_CONFIG.operational;
  const label = OVERALL_STATUS_LABELS[status];

  return (
    <section
      style={{
        background: cfg.heroBg
          ? `linear-gradient(180deg, ${cfg.heroBg} 0%, #ece9e1 100%)`
          : "#ece9e1",
        borderBottom: "1px solid #d3cfc3",
      }}
    >
      {/* Top accent line */}
      <div
        className="h-px"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${cfg.dotColor}50 50%, transparent 100%)` }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="flex flex-col items-start gap-5 sm:items-center sm:text-center">

          {/* Status badge — sharp edges */}
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2 text-sm font-semibold border"
            style={{
              background:   cfg.badgeBg,
              color:        cfg.badgeText,
              borderColor:  cfg.badgeBorder,
            }}
          >
            <span className="relative inline-flex size-2 shrink-0">
              {status !== "operational" && (
                <span
                  className="absolute inline-flex size-full opacity-40 animate-status-ping"
                  style={{ background: cfg.dotColor }}
                />
              )}
              <span
                className="relative inline-flex size-2"
                style={{ background: cfg.dotColor }}
              />
            </span>
            <span>{label}</span>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-medium tracking-tight" style={{ color: "#161616", letterSpacing: "-0.03em" }}>
              Nuxari System Status
            </h1>
            <p className="text-base max-w-lg mx-auto" style={{ color: "#5b5b54" }}>
              Real-time availability and incident visibility for the Nuxari governance platform.
            </p>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: "#8a8a80" }}>
            <span className="flex items-center gap-1.5">
              <span className="relative inline-flex size-1.5">
                <span className="absolute inline-flex size-full opacity-50 animate-status-ping" style={{ background: "#10b981" }} />
                <span className="relative inline-flex size-1.5" style={{ background: "#10b981" }} />
              </span>
              Last checked {timeAgo(lastCheckedAt)}
            </span>

            {activeCount > 0 && (
              <>
                <span style={{ color: "#d3cfc3" }}>·</span>
                <span
                  className="flex items-center gap-1.5 font-medium"
                  style={{ color: cfg.badgeText }}
                >
                  {activeCount} active incident{activeCount !== 1 ? "s" : ""}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
