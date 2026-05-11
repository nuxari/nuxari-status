import type { StatusMaintenanceRecord } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

interface Props {
  window: StatusMaintenanceRecord;
}

export function MaintenanceCard({ window: mw }: Props) {
  const isActive = mw.status === "in_progress";

  return (
    <div className={`rounded-2xl border bg-white shadow-sm px-5 py-4 ${isActive ? "border-violet-200" : "border-gray-200"}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl text-base ${isActive ? "bg-violet-100 text-violet-600" : "bg-gray-100 text-gray-500"}`}>
          ⚙
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-gray-900">{mw.title}</p>
            {isActive && (
              <span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                In Progress
              </span>
            )}
          </div>
          {mw.description && (
            <p className="text-sm text-gray-500 mb-1.5">{mw.description}</p>
          )}
          <p className="text-xs text-gray-400">
            {formatDateTime(mw.scheduledAt)} — {formatDateTime(mw.endsAt)}
          </p>
          {mw.components.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {mw.components.map((c) => (
                <span key={c} className="inline-flex rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {c.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
