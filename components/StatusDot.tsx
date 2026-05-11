import { STATUS_COLORS } from "@/lib/tokens";
import type { ComponentStatus } from "@/lib/types";

interface Props {
  status: ComponentStatus;
  size?: "xs" | "sm" | "md";
  pulse?: boolean;
}

const SIZE = { xs: "size-1.5", sm: "size-2", md: "size-2.5" };
const RING = { xs: "size-3",   sm: "size-4", md: "size-5"   };

export function StatusDot({ status, size = "sm", pulse = false }: Props) {
  const c = STATUS_COLORS[status] ?? STATUS_COLORS.operational;
  const d = SIZE[size];
  const r = RING[size];
  const isPulsing = pulse && status !== "operational";

  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: RING[size].replace("size-", ""), height: RING[size].replace("size-", "") }}>
      {isPulsing && (
        <span className={`absolute inline-flex ${r} rounded-full ${c.dot} opacity-30 animate-ping`} />
      )}
      <span className={`relative inline-flex rounded-full ${d} ${c.dot}`} />
    </span>
  );
}
