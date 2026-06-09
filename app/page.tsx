import type { Metadata } from "next";
import { getPublicStatus, getIncidents } from "@/lib/api";
import { GROUP_ORDER, GROUP_LABELS }     from "@/lib/tokens";
import { Banner }          from "@/components/Banner";
import { ComponentGroup }  from "@/components/ComponentGroup";
import { IncidentCard, NoIncidentsCard } from "@/components/IncidentCard";
import { MaintenanceCard } from "@/components/MaintenanceCard";
import { SubscribeForm }   from "@/components/SubscribeForm";
import { SiteHeader }      from "@/components/SiteHeader";
import { SiteFooter }      from "@/components/SiteFooter";
import { SupportCTA }      from "@/components/SupportCTA";
import { TrustPanel }      from "@/components/TrustPanel";
import { UptimeHistory }   from "@/components/UptimeHistory";

export const metadata: Metadata = {
  title: "Nuxari Status | System Health and Incident Updates",
};

// Revalidate every 60 seconds (ISR) — fresh enough for a status page
export const revalidate = 60;

export default async function StatusPage() {
  let summary;
  try {
    summary = await getPublicStatus();
  } catch {
    return <ErrorState />;
  }

  // Resolved incidents for history (last 30)
  let history: Awaited<ReturnType<typeof getIncidents>>["incidents"] = [];
  try {
    const res = await getIncidents({ resolved: true, limit: 30 });
    history = res.incidents;
  } catch { /* non-fatal */ }

  const orderedGroups = [
    ...GROUP_ORDER.filter((g) => summary.components[g]),
    ...Object.keys(summary.components).filter((g) => !GROUP_ORDER.includes(g)),
  ];

  // Flatten all components for UptimeHistory
  const allComponents = orderedGroups.flatMap((g) => summary.components[g] ?? []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0f0f0f" }}>
      <SiteHeader />
      <Banner
        status={summary.status}
        lastCheckedAt={summary.lastCheckedAt}
        activeCount={summary.activeIncidents.length}
      />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">

        {/* Active incidents */}
        <section>
          <SectionHeading>Active Incidents</SectionHeading>
          {summary.activeIncidents.length > 0 ? (
            <div className="space-y-4">
              {summary.activeIncidents.map((inc) => (
                <IncidentCard key={inc.id} incident={inc} />
              ))}
            </div>
          ) : (
            <NoIncidentsCard />
          )}
        </section>

        {/* Upcoming maintenance */}
        {summary.upcomingMaintenance.length > 0 && (
          <section>
            <SectionHeading>Scheduled Maintenance</SectionHeading>
            <div className="space-y-3">
              {summary.upcomingMaintenance.map((mw) => (
                <MaintenanceCard key={mw.id} window={mw} />
              ))}
            </div>
          </section>
        )}

        {/* Component status */}
        <section>
          <SectionHeading>System Components</SectionHeading>
          <div className="space-y-4">
            {orderedGroups.map((g) => (
              <ComponentGroup
                key={g}
                groupKey={g}
                components={summary.components[g]}
              />
            ))}
            {orderedGroups.length === 0 && (
              <div
                className="rounded-xl border px-6 py-8 text-center"
                style={{ background: "#161616", borderColor: "#2b2b2b" }}
              >
                <p className="text-sm" style={{ color: "#9a9a94" }}>
                  Component data is not yet available.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 30-day uptime history */}
        <UptimeHistory components={allComponents} />

        {/* Incident history */}
        {history.length > 0 && (
          <section>
            <SectionHeading>Incident History</SectionHeading>
            <div className="space-y-3">
              {history.map((inc) => (
                <IncidentCard key={inc.id} incident={inc} compact />
              ))}
            </div>
          </section>
        )}

        {/* Subscribe */}
        <section>
          <SubscribeForm />
        </section>

        {/* Support CTA */}
        <SupportCTA />

        {/* Trust panel */}
        <TrustPanel />
      </main>

      <SiteFooter />
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-4 text-xs font-semibold uppercase tracking-widest"
      style={{ color: "#9a9a94" }}
    >
      {children}
    </h2>
  );
}

function ErrorState() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0f0f0f" }}>
      <SiteHeader />
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-sm">
          <div
            className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl"
            style={{ background: "#1d1d1d" }}
          >
            <span style={{ color: "#9a9a94", fontSize: "1.25rem" }}>—</span>
          </div>
          <h2 className="text-base font-semibold" style={{ color: "#f3f2ee" }}>
            Status unavailable
          </h2>
          <p className="mt-1 text-sm" style={{ color: "#9a9a94" }}>
            We couldn&apos;t load the current system status. Please try again shortly.
          </p>
          <a
            href="/"
            className="mt-4 inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
            style={{ background: "#2f4bff" }}
          >
            Refresh
          </a>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
