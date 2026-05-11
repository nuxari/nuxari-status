import type { Metadata } from "next";
import { notFound }        from "next/navigation";
import Link               from "next/link";
import { getIncidentById } from "@/lib/api";
import { SEVERITY_CONFIG, INCIDENT_STATUS_CONFIG, STATUS_COLORS, STATUS_LABELS } from "@/lib/tokens";
import { IncidentTimeline } from "@/components/IncidentTimeline";
import { StatusDot }        from "@/components/StatusDot";
import { SiteHeader }       from "@/components/SiteHeader";
import { SiteFooter }       from "@/components/SiteFooter";
import { formatDateTime, duration } from "@/lib/utils";
import type { ComponentStatus } from "@/lib/types";

export const revalidate = 30;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const incident = await getIncidentById(id);
  if (!incident) return { title: "Incident Not Found" };
  return { title: incident.title };
}

export default async function IncidentPage({ params }: PageProps) {
  const { id } = await params;
  const incident = await getIncidentById(id);
  if (!incident) notFound();

  const sev = SEVERITY_CONFIG[incident.severity] ?? SEVERITY_CONFIG.minor;
  const st  = INCIDENT_STATUS_CONFIG[incident.status] ?? INCIDENT_STATUS_CONFIG.investigating;
  const isResolved = incident.status === "resolved";

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8"
        >
          ← Back to status
        </Link>

        {/* Incident header */}
        <div className={`rounded-2xl border bg-white shadow-sm overflow-hidden ${sev.border} mb-8`}>
          <div className={`px-6 py-5 ${sev.bg}`}>
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${sev.bg} ${sev.text} ${sev.border}`}>
                {sev.label}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/70 ${st.text}`}>
                <span className={`size-1.5 rounded-full ${st.dot}`} />
                {st.label}
              </span>
            </div>

            <h1 className="text-xl font-semibold text-gray-900">{incident.title}</h1>
            {incident.summary && (
              <p className="mt-1.5 text-sm text-gray-600">{incident.summary}</p>
            )}
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-gray-100 border-t border-gray-100">
            <MetaCell label="Started"  value={formatDateTime(incident.startedAt)} />
            <MetaCell label="Duration" value={duration(incident.startedAt, incident.resolvedAt)} />
            <MetaCell label="Status"   value={st.label} />
            {isResolved && incident.resolvedAt
              ? <MetaCell label="Resolved" value={formatDateTime(incident.resolvedAt)} />
              : <MetaCell label="Resolved" value="—" />
            }
          </div>
        </div>

        <div className="space-y-8">
          {/* Affected services */}
          {incident.affectedComponents.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                Affected Services
              </h2>
              <div className="flex flex-wrap gap-2">
                {incident.affectedComponents.map((key) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700"
                  >
                    <StatusDot status={"degraded" as ComponentStatus} size="xs" />
                    {key.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Customer impact */}
          {incident.customerImpact && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                Customer Impact
              </h2>
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm text-amber-800">{incident.customerImpact}</p>
              </div>
            </section>
          )}

          {/* Timeline */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">
              Incident Timeline
            </h2>
            <IncidentTimeline updates={incident.updates} />
          </section>

          {/* Root cause + remediation — visible once resolved */}
          {(incident as { rootCause?: string | null }).rootCause && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                Root Cause
              </h2>
              <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                <p className="text-sm text-gray-700">{(incident as { rootCause?: string | null }).rootCause}</p>
              </div>
            </section>
          )}

          {(incident as { remediation?: string | null }).remediation && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                Remediation
              </h2>
              <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                <p className="text-sm text-gray-700">{(incident as { remediation?: string | null }).remediation}</p>
              </div>
            </section>
          )}
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            ← Back to all systems status
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-0.5 text-xs font-medium text-gray-900 truncate">{value}</p>
    </div>
  );
}
