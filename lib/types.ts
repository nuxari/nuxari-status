export type ComponentStatus  = "operational" | "degraded" | "partial_outage" | "major_outage" | "maintenance";
export type IncidentStatus   = "investigating" | "identified" | "monitoring" | "resolved";
export type IncidentSeverity = "informational" | "minor" | "major" | "critical";

export interface StatusComponentRecord {
  id:            string;
  key:           string;
  name:          string;
  description:   string | null;
  group:         string;
  status:        ComponentStatus;
  order:         number;
  uptimePct:     number;
  lastCheckedAt: string | null;
  updatedAt:     string;
}

export interface StatusUpdateRecord {
  id:        string;
  message:   string;
  status:    string;
  createdAt: string;
}

export interface StatusIncidentRecord {
  id:                 string;
  title:              string;
  summary:            string | null;
  status:             IncidentStatus;
  severity:           IncidentSeverity;
  affectedComponents: string[];
  startedAt:          string;
  resolvedAt:         string | null;
  customerImpact:     string | null;
  createdAt:          string;
  updatedAt:          string;
  updates:            StatusUpdateRecord[];
}

export interface StatusMaintenanceRecord {
  id:          string;
  title:       string;
  description: string | null;
  components:  string[];
  scheduledAt: string;
  endsAt:      string;
  status:      string;
}

export interface PublicStatusSummary {
  status:              ComponentStatus;
  statusLabel:         string;
  components:          Record<string, StatusComponentRecord[]>;
  activeIncidents:     StatusIncidentRecord[];
  upcomingMaintenance: StatusMaintenanceRecord[];
  lastCheckedAt:       string;
}
