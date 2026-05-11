import { BANNER_CONFIG, OVERALL_STATUS_LABELS } from "@/lib/tokens";
import type { ComponentStatus } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

interface Props {
  status:        ComponentStatus;
  lastCheckedAt: string;
  activeCount:   number;
}

export function Banner({ status, lastCheckedAt, activeCount }: Props) {
  const cfg = BANNER_CONFIG[status];

  return (
    <div className={`bg-gradient-to-br ${cfg.gradient}`}>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Status icon */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <span className={`text-2xl font-bold ${cfg.text}`}>{cfg.icon}</span>
          </div>

          {/* Headline */}
          <div className="min-w-0 flex-1">
            <h1 className={`text-2xl font-semibold tracking-tight ${cfg.text}`}>
              {OVERALL_STATUS_LABELS[status]}
            </h1>
            <p className={`mt-1 text-sm ${cfg.subtext}`}>
              {activeCount > 0
                ? `${activeCount} active incident${activeCount !== 1 ? "s" : ""} · Updated ${timeAgo(lastCheckedAt)}`
                : `Updated ${timeAgo(lastCheckedAt)}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
