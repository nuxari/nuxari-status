import type {
  PublicStatusSummary,
  StatusComponentRecord,
  StatusIncidentRecord,
} from "@/lib/types";

export const mockComponent = (overrides: Partial<StatusComponentRecord> = {}): StatusComponentRecord => ({
  id:            "comp-1",
  key:           "api_gateway",
  name:          "API Gateway",
  description:   "Primary API entry point",
  group:         "core_platform",
  status:        "operational",
  order:         1,
  uptimePct:     99.98,
  lastCheckedAt: "2026-06-09T10:00:00Z",
  updatedAt:     "2026-06-09T10:00:00Z",
  ...overrides,
});

export const mockIncident = (overrides: Partial<StatusIncidentRecord> = {}): StatusIncidentRecord => ({
  id:                 "inc-1",
  title:              "API latency elevated",
  summary:            "We are investigating elevated latency on the API gateway.",
  status:             "investigating",
  severity:           "minor",
  affectedComponents: ["api_gateway"],
  startedAt:          "2026-06-09T09:00:00Z",
  resolvedAt:         null,
  customerImpact:     "Some requests may be slower than normal.",
  createdAt:          "2026-06-09T09:00:00Z",
  updatedAt:          "2026-06-09T10:00:00Z",
  updates: [
    {
      id:        "upd-1",
      message:   "We are investigating the issue.",
      status:    "investigating",
      createdAt: "2026-06-09T09:05:00Z",
    },
  ],
  ...overrides,
});

export const mockSummaryOperational: PublicStatusSummary = {
  status:      "operational",
  statusLabel: "All Systems Operational",
  components: {
    core_platform: [
      mockComponent({ id: "comp-1", name: "API Gateway",     key: "api_gateway"     }),
      mockComponent({ id: "comp-2", name: "Auth Service",    key: "auth_service"    }),
      mockComponent({ id: "comp-3", name: "Workflow Engine", key: "workflow_engine" }),
    ],
    governance_services: [
      mockComponent({ id: "comp-4", name: "Audit Log", key: "audit_log", group: "governance_services" }),
    ],
  },
  activeIncidents:     [],
  upcomingMaintenance: [],
  lastCheckedAt:       "2026-06-09T10:00:00Z",
};

export const mockSummaryWithIncident: PublicStatusSummary = {
  ...mockSummaryOperational,
  status:      "degraded",
  statusLabel: "Degraded Performance",
  activeIncidents: [mockIncident()],
};
