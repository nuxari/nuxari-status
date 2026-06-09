import { OVERALL_STATUS_LABELS } from "@/lib/tokens";
import type { ComponentStatus } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

interface Props {
  status:        ComponentStatus;
  lastCheckedAt: string;
  activeCount:   number;
}

const HERO_STATUS_CONFIG: Record<ComponentStatus, {
  icon:       string;
  badgeBg:    string;
  badgeText:  string;
  badgeBorder:string;
  dotColor:   string;
  urgentBg?:  string;
}> = {
  operational:    { icon: "✓",  badgeBg: "rgba(16,185,129,0.12)",  badgeText: "#10b981", badgeBorder: "rgba(16,185,129,0.25)",  dotColor: "#10b981" },
  degraded:       { icon: "▲",  badgeBg: "rgba(245,158,11,0.12)",  badgeText: "#f59e0b", badgeBorder: "rgba(245,158,11,0.25)",  dotColor: "#f59e0b" },
  partial_outage: { icon: "▲",  badgeBg: "rgba(249,115,22,0.12)",  badgeText: "#f97316", badgeBorder: "rgba(249,115,22,0.25)",  dotColor: "#f97316" },
  major_outage:   { icon: "✕",  badgeBg: "rgba(239,68,68,0.12)",   badgeText: "#ef4444", badgeBorder: "rgba(239,68,68,0.25)",   dotColor: "#ef4444", urgentBg: "rgba(239,68,68,0.08)" },
  maintenance:    { icon: "⚙",  badgeBg: "rgba(139,92,246,0.12)",  badgeText: "#8b5cf6", badgeBorder: "rgba(139,92,246,0.25)",  dotColor: "#8b5cf6" },
};

export function Banner({ status, lastCheckedAt, activeCount }: Props) {
  const cfg = HERO_STATUS_CONFIG[status] ?? HERO_STATUS_CONFIG.operational;
  const label = OVERALL_STATUS_LABELS[status];

  return (
    <section
      className="relative overflow-hidden bg-dot-grid"
      style={{ background: cfg.urgentBg ? `linear-gradient(180deg, ${cfg.urgentBg} 0%, #0f0f0f 100%)` : "#0f0f0f" }}
    >
      {/* Dot grid overlay */}
      <div className="absolute inset-0 bg-dot-grid pointer-events-none" />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent 0%, ${cfg.dotColor}40 50%, transparent 100%)` }} />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col items-start gap-6 sm:items-center sm:text-center">

          {/* Status badge */}
          <div
            className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-semibold border"
            style={{
              background: cfg.badgeBg,
              color: cfg.badgeText,
              borderColor: cfg.badgeBorder,
            }}
          >
            {/* Pulse dot */}
            <span className="relative inline-flex size-2 shrink-0">
              {status !== "operational" && (
                <span
                  className="absolute inline-flex size-full rounded-full opacity-40 animate-status-ping"
                  style={{ background: cfg.dotColor }}
                />
              )}
              <span
                className="relative inline-flex size-2 rounded-full"
                style={{ background: cfg.dotColor }}
              />
            </span>
            <span>{label}</span>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "#f3f2ee" }}>
              Nuxari System Status
            </h1>
            <p className="text-base max-w-lg mx-auto" style={{ color: "#9a9a94" }}>
              Real-time availability and incident visibility for the Nuxari governance platform.
            </p>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: "#9a9a94" }}>
            <span className="flex items-center gap-1.5">
              {/* Live indicator */}
              <span className="relative inline-flex size-1.5">
                <span className="absolute inline-flex size-full rounded-full opacity-50 animate-status-ping" style={{ background: "#10b981" }} />
                <span className="relative inline-flex size-1.5 rounded-full" style={{ background: "#10b981" }} />
              </span>
              Last checked {timeAgo(lastCheckedAt)}
            </span>

            {activeCount > 0 && (
              <>
                <span style={{ color: "#2b2b2b" }}>·</span>
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

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "#2b2b2b" }} />
    </section>
  );
}
