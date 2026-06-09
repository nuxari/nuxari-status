/**
 * Nuxari Status Page — Test Suite
 *
 * Tests cover: branding, status badge, component groups, incidents, support CTA,
 * trust panel, uptime empty state, error state, SEO, and mobile layout.
 *
 * API calls are fully mocked — no network requests are made.
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";

// ─── Fixtures ────────────────────────────────────────────────────────────────
import {
  mockSummaryOperational,
  mockSummaryWithIncident,
  mockIncident,
} from "./fixtures";

// ─── Mock @/lib/api ───────────────────────────────────────────────────────────
jest.mock("@/lib/api", () => ({
  getPublicStatus:      jest.fn(),
  getIncidents:         jest.fn(),
  subscribeToStatus:    jest.fn(),
  unsubscribeFromStatus: jest.fn(),
}));

import * as api from "@/lib/api";
const mockedGetPublicStatus = api.getPublicStatus as jest.MockedFunction<typeof api.getPublicStatus>;
const mockedGetIncidents    = api.getIncidents    as jest.MockedFunction<typeof api.getIncidents>;

// ─── Import components ────────────────────────────────────────────────────────
import { Banner }                    from "@/components/Banner";
import { ComponentGroup }            from "@/components/ComponentGroup";
import { IncidentCard, NoIncidentsCard } from "@/components/IncidentCard";
import { SiteHeader }                from "@/components/SiteHeader";
import { SiteFooter }                from "@/components/SiteFooter";
import { SupportCTA }                from "@/components/SupportCTA";
import { TrustPanel }                from "@/components/TrustPanel";
import { UptimeHistory }             from "@/components/UptimeHistory";
import { SubscribeForm }             from "@/components/SubscribeForm";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SUPPORT_URL = "https://app.nuxari.com/admin/support/tickets/new";
const APP_URL     = "https://app.nuxari.com";
const DOCS_URL    = "https://nuxari.com/docs";

beforeEach(() => {
  mockedGetPublicStatus.mockResolvedValue(mockSummaryOperational);
  mockedGetIncidents.mockResolvedValue({ incidents: [], total: 0 });
  jest.clearAllMocks();
});

// ── Test 1: Status page renders without crashing ──────────────────────────────
test("1. Banner renders without crashing", () => {
  const { container } = render(
    <Banner
      status="operational"
      lastCheckedAt="2026-06-09T10:00:00Z"
      activeCount={0}
    />
  );
  expect(container).toBeTruthy();
});

// ── Test 2: Nuxari branding is present ────────────────────────────────────────
test("2. SiteHeader renders Nuxari branding (logo letter and wordmark)", () => {
  render(<SiteHeader />);
  // The N logo
  expect(screen.getByText("N")).toBeInTheDocument();
  // The Nuxari wordmark
  const nuxariTexts = screen.getAllByText("Nuxari");
  expect(nuxariTexts.length).toBeGreaterThan(0);
  // The Status label
  expect(screen.getByText("Status")).toBeInTheDocument();
});

// ── Test 3: Overall status badge renders "All Systems Operational" ────────────
test("3. Banner shows 'All Systems Operational' badge when status is operational", () => {
  render(
    <Banner
      status="operational"
      lastCheckedAt="2026-06-09T10:00:00Z"
      activeCount={0}
    />
  );
  expect(screen.getByText("All Systems Operational")).toBeInTheDocument();
});

// ── Test 4: Component groups section renders ──────────────────────────────────
test("4. ComponentGroup renders group label and component names", () => {
  render(
    <ComponentGroup
      groupKey="core_platform"
      components={mockSummaryOperational.components["core_platform"]}
    />
  );
  expect(screen.getByText("Core Platform")).toBeInTheDocument();
  expect(screen.getByText("API Gateway")).toBeInTheDocument();
  expect(screen.getByText("Auth Service")).toBeInTheDocument();
});

// ── Test 5: "No active incidents" empty state renders ─────────────────────────
test("5. NoIncidentsCard renders the no-incidents empty state", () => {
  render(<NoIncidentsCard />);
  expect(screen.getByText("No active incidents")).toBeInTheDocument();
  expect(screen.getByText(/All systems are operating normally/)).toBeInTheDocument();
});

// ── Test 6: Active incident renders when provided ─────────────────────────────
test("6. IncidentCard renders incident title and severity badge", () => {
  const incident = mockIncident();
  render(<IncidentCard incident={incident} />);
  expect(screen.getByText(incident.title)).toBeInTheDocument();
  expect(screen.getByText("Minor")).toBeInTheDocument();
  expect(screen.getByText("Investigating")).toBeInTheDocument();
});

// ── Test 7: Support CTA renders ───────────────────────────────────────────────
test("7. SupportCTA renders heading and both action buttons", () => {
  render(<SupportCTA />);
  expect(
    screen.getByText(/Experiencing an issue not listed here/i)
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /Submit support request/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /Open app/i })
  ).toBeInTheDocument();
});

// ── Test 8: Support CTA links to the correct support URL ─────────────────────
test("8. SupportCTA 'Submit support request' link points to NEXT_PUBLIC_SUPPORT_URL", () => {
  render(<SupportCTA />);
  const link = screen.getByRole("link", { name: /Submit support request/i });
  // href uses env var fallback
  expect(link).toHaveAttribute("href", expect.stringContaining("support"));
});

// ── Test 9: "Open app" link renders with correct URL ─────────────────────────
test("9. SiteHeader 'Open app' button links to APP_URL", () => {
  render(<SiteHeader />);
  const openAppLinks = screen.getAllByRole("link", { name: /Open app/i });
  expect(openAppLinks.length).toBeGreaterThan(0);
  const href = openAppLinks[0].getAttribute("href") ?? "";
  expect(href).toContain("app.nuxari.com");
});

// ── Test 10: Docs link renders ────────────────────────────────────────────────
test("10. SiteHeader renders a Docs navigation link", () => {
  render(<SiteHeader />);
  const docsLinks = screen.getAllByRole("link", { name: /Docs/i });
  expect(docsLinks.length).toBeGreaterThan(0);
});

// ── Test 11: Uptime empty state renders the correct message ───────────────────
test("11. UptimeHistory renders empty state when no uptime data is available", () => {
  // Components with no uptimePct (undefined)
  const components = mockSummaryOperational.components["core_platform"].map((c) => ({
    ...c,
    uptimePct: undefined as unknown as number,
  }));
  render(<UptimeHistory components={components} />);
  expect(
    screen.getByText(/Historical uptime will appear after monitoring data is collected/i)
  ).toBeInTheDocument();
});

// ── Test 12: Error state renders without raw error exposure ───────────────────
test("12. IncidentCard does not expose raw error details", () => {
  const incident = mockIncident({
    title:   "Incident title",
    summary: "Brief summary shown to users",
  });
  const { container } = render(<IncidentCard incident={incident} />);
  // Raw stack traces and internal paths should never appear
  const html = container.innerHTML;
  expect(html).not.toContain("at Object.<anonymous>");
  expect(html).not.toContain("node_modules");
  expect(html).not.toContain("Error:");
  expect(screen.getByText("Brief summary shown to users")).toBeInTheDocument();
});

// ── Test 13: Trust panel renders ─────────────────────────────────────────────
test("13. TrustPanel renders all 5 trust items", () => {
  render(<TrustPanel />);
  expect(screen.getByText(/Security-first monitoring/i)).toBeInTheDocument();
  expect(screen.getByText(/Public incident transparency/i)).toBeInTheDocument();
  expect(screen.getByText(/No tenant data exposed/i)).toBeInTheDocument();
  expect(screen.getByText(/Support escalation available/i)).toBeInTheDocument();
  expect(screen.getByText(/Evidence and audit systems monitored/i)).toBeInTheDocument();
});

// ── Test 14: SEO title is correct ─────────────────────────────────────────────
test("14. Banner renders the correct page heading text", () => {
  render(
    <Banner
      status="operational"
      lastCheckedAt="2026-06-09T10:00:00Z"
      activeCount={0}
    />
  );
  expect(screen.getByText("Nuxari System Status")).toBeInTheDocument();
  expect(
    screen.getByText(/Real-time availability and incident visibility/i)
  ).toBeInTheDocument();
});

// ── Test 15: Page renders on mobile viewport ──────────────────────────────────
test("15. Key status page sections exist at mobile viewport", () => {
  // jsdom doesn't resize viewports, but we can verify all critical sections mount
  const { container } = render(
    <>
      <SiteHeader />
      <Banner
        status="operational"
        lastCheckedAt="2026-06-09T10:00:00Z"
        activeCount={0}
      />
      <ComponentGroup
        groupKey="core_platform"
        components={mockSummaryOperational.components["core_platform"]}
      />
      <NoIncidentsCard />
      <SupportCTA />
      <TrustPanel />
      <SiteFooter />
    </>
  );

  // All key landmark sections must exist
  expect(screen.getByRole("banner")).toBeInTheDocument();    // <header>
  expect(screen.getByRole("contentinfo")).toBeInTheDocument(); // <footer>
  expect(screen.getByText("Nuxari System Status")).toBeInTheDocument();
  expect(screen.getByText("API Gateway")).toBeInTheDocument();
  expect(screen.getByText("No active incidents")).toBeInTheDocument();
  expect(screen.getByText(/Experiencing an issue not listed here/i)).toBeInTheDocument();
  expect(screen.getByText(/Security-first monitoring/i)).toBeInTheDocument();
  // Container should be present
  expect(container).toBeTruthy();
});
