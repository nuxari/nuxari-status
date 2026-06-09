import type { ComponentStatus, IncidentSeverity, IncidentStatus } from "./types";

export const STATUS_LABELS: Record<ComponentStatus, string> = {
  operational:    "Operational",
  degraded:       "Degraded Performance",
  partial_outage: "Partial Outage",
  major_outage:   "Major Outage",
  maintenance:    "Under Maintenance",
};

export const OVERALL_STATUS_LABELS: Record<ComponentStatus, string> = {
  operational:    "All Systems Operational",
  degraded:       "Degraded Performance",
  partial_outage: "Partial System Outage",
  major_outage:   "Major System Outage",
  maintenance:    "Scheduled Maintenance",
};

/** Dark-theme status colors — pill/badge variants */
export const STATUS_COLORS: Record<ComponentStatus, {
  dot: string; bg: string; text: string; border: string; ring: string;
  darkBg: string; darkText: string; darkBorder: string;
}> = {
  operational:    {
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",   text: "text-emerald-700",  border: "border-emerald-200", ring: "ring-emerald-500/20",
    darkBg: "bg-emerald-950/50", darkText: "text-emerald-400", darkBorder: "border-emerald-800/50",
  },
  degraded:       {
    dot: "bg-amber-500",
    bg: "bg-amber-50",     text: "text-amber-700",    border: "border-amber-200",   ring: "ring-amber-500/20",
    darkBg: "bg-amber-950/50",   darkText: "text-amber-400",   darkBorder: "border-amber-800/50",
  },
  partial_outage: {
    dot: "bg-orange-500",
    bg: "bg-orange-50",    text: "text-orange-700",   border: "border-orange-200",  ring: "ring-orange-500/20",
    darkBg: "bg-orange-950/50",  darkText: "text-orange-400",  darkBorder: "border-orange-800/50",
  },
  major_outage:   {
    dot: "bg-red-500",
    bg: "bg-red-50",       text: "text-red-700",      border: "border-red-200",     ring: "ring-red-500/20",
    darkBg: "bg-red-950/50",     darkText: "text-red-400",     darkBorder: "border-red-800/50",
  },
  maintenance:    {
    dot: "bg-violet-500",
    bg: "bg-violet-50",    text: "text-violet-700",   border: "border-violet-200",  ring: "ring-violet-500/20",
    darkBg: "bg-violet-950/50",  darkText: "text-violet-400",  darkBorder: "border-violet-800/50",
  },
};

export const BANNER_CONFIG: Record<ComponentStatus, {
  gradient: string; text: string; subtext: string; icon: string;
  urgentBar?: string;
}> = {
  operational:    { gradient: "from-emerald-600 to-emerald-700", text: "text-white",            subtext: "text-emerald-100", icon: "✓" },
  degraded:       { gradient: "from-amber-500 to-amber-600",     text: "text-white",            subtext: "text-amber-100",   icon: "▲" },
  partial_outage: { gradient: "from-orange-600 to-orange-700",   text: "text-white",            subtext: "text-orange-100",  icon: "▲" },
  major_outage:   { gradient: "from-red-600 to-red-700",         text: "text-white",            subtext: "text-red-100",     icon: "✕", urgentBar: "bg-red-950 border-red-800" },
  maintenance:    { gradient: "from-violet-600 to-violet-700",   text: "text-white",            subtext: "text-violet-100",  icon: "⚙" },
};

export const SEVERITY_CONFIG: Record<IncidentSeverity, {
  label: string; bg: string; text: string; border: string;
  darkBg: string; darkText: string; darkBorder: string;
}> = {
  informational: {
    label: "Informational",
    bg: "bg-sky-50",    text: "text-sky-700",    border: "border-sky-200",
    darkBg: "bg-sky-950/50",    darkText: "text-sky-400",    darkBorder: "border-sky-800/50",
  },
  minor:         {
    label: "Minor",
    bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",
    darkBg: "bg-amber-950/50",  darkText: "text-amber-400",  darkBorder: "border-amber-800/50",
  },
  major:         {
    label: "Major",
    bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200",
    darkBg: "bg-orange-950/50", darkText: "text-orange-400", darkBorder: "border-orange-800/50",
  },
  critical:      {
    label: "Critical",
    bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",
    darkBg: "bg-red-950/50",    darkText: "text-red-400",    darkBorder: "border-red-800/50",
  },
};

export const INCIDENT_STATUS_CONFIG: Record<IncidentStatus, {
  label: string; dot: string; text: string; darkText: string;
}> = {
  investigating: { label: "Investigating",            dot: "bg-amber-500",   text: "text-amber-700",   darkText: "text-amber-400"   },
  identified:    { label: "Root Cause Identified",    dot: "bg-orange-500",  text: "text-orange-700",  darkText: "text-orange-400"  },
  monitoring:    { label: "Monitoring",               dot: "bg-sky-500",     text: "text-sky-700",     darkText: "text-sky-400"     },
  resolved:      { label: "Resolved",                 dot: "bg-emerald-500", text: "text-emerald-700", darkText: "text-emerald-400" },
};

export const GROUP_LABELS: Record<string, string> = {
  core_platform:          "Core Platform",
  governance_services:    "Governance Services",
  connectors_automation:  "Connectors & Automation",
  data_layer:             "Data Layer",
  /* legacy keys preserved for backwards compat */
  core:                   "Core Services",
  notifications:          "Notifications",
  operations:             "Operational Systems",
};

export const GROUP_ORDER = [
  "core_platform",
  "governance_services",
  "connectors_automation",
  "data_layer",
  /* legacy fallbacks */
  "core",
  "notifications",
  "operations",
];
