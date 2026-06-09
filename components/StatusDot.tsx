import { STATUS_COLORS } from "@/lib/tokens";
import type { ComponentStatus } from "@/lib/types";

interface Props {
  status: ComponentStatus;
  size?:  "xs" | "sm" | "md";
  pulse?: boolean;
}

const DOT_SIZE:  Record<NonNullable<Props["size"]>, string> = { xs: "size-1.5", sm: "size-2", md: "size-2.5" };
const RING_SIZE: Record<NonNullable<Props["size"]>, string> = { xs: "size-3",   sm: "size-4", md: "size-5"   };

export function StatusDot({ status, size = "sm", pulse = false }: Props) {
  const c = STATUS_COLORS[status] ?? STATUS_COLORS.operational;
  const d = DOT_SIZE[size];
  const r = RING_SIZE[size];
  const isPulsing = pulse && status !== "operational";

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      aria-label={`Status: ${status}`}
    >
      {/* Ping ring */}
      {isPulsing && (
        <span className={`absolute inline-flex ${r} rounded-full ${c.dot} opacity-25 animate-ping`} />
      )}
      {/* Core dot */}
      <span className={`relative inline-flex rounded-full ${d} ${c.dot}`} />
    </span>
  );
}
