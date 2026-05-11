import { GROUP_LABELS, STATUS_COLORS, STATUS_LABELS } from "@/lib/tokens";
import type { StatusComponentRecord } from "@/lib/types";
import { StatusDot } from "./StatusDot";

function ComponentRow({ c }: { c: StatusComponentRecord }) {
  const col = STATUS_COLORS[c.status] ?? STATUS_COLORS.operational;
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3 min-w-0">
        <StatusDot status={c.status} pulse={c.status !== "operational"} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
          {c.description && (
            <p className="text-xs text-gray-400 truncate mt-0.5">{c.description}</p>
          )}
        </div>
      </div>
      <span className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${col.bg} ${col.text}`}>
        {STATUS_LABELS[c.status] ?? c.status}
      </span>
    </div>
  );
}

interface Props {
  groupKey:   string;
  components: StatusComponentRecord[];
}

export function ComponentGroup({ groupKey, components }: Props) {
  const label = GROUP_LABELS[groupKey] ?? groupKey;
  const allOp = components.every((c) => c.status === "operational");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-5 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</h3>
        {allOp && (
          <span className="text-xs font-medium text-emerald-600">All operational</span>
        )}
      </div>
      <div className="divide-y divide-gray-50 px-5 py-1">
        {components.map((c) => <ComponentRow key={c.id} c={c} />)}
      </div>
    </div>
  );
}
