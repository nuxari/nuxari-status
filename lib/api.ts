import type {
  PublicStatusSummary,
  StatusIncidentRecord,
  StatusComponentRecord,
} from "./types";

const API = process.env.NEXT_PUBLIC_STATUS_API_URL ?? "https://api.nuxari.com";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message ?? "API returned error");
  return json.data as T;
}

export async function getPublicStatus(): Promise<PublicStatusSummary> {
  return apiFetch<PublicStatusSummary>("/api/status/public");
}

export async function getComponents(): Promise<{ components: StatusComponentRecord[]; total: number }> {
  return apiFetch("/api/status/components");
}

export async function getIncidents(opts?: {
  resolved?: boolean;
  limit?: number;
}): Promise<{ incidents: StatusIncidentRecord[]; total: number }> {
  const params = new URLSearchParams();
  if (opts?.resolved !== undefined) params.set("resolved", String(opts.resolved));
  if (opts?.limit)                  params.set("limit",    String(opts.limit));
  const qs = params.toString();
  return apiFetch(`/api/status/incidents${qs ? `?${qs}` : ""}`);
}

export async function getIncidentById(id: string): Promise<StatusIncidentRecord | null> {
  try {
    return await apiFetch<StatusIncidentRecord>(`/api/status/incidents/${id}`);
  } catch {
    return null;
  }
}

export async function subscribeToStatus(
  email: string,
  components?: string[],
  turnstileToken?: string,
): Promise<void> {
  const res = await fetch(`${API}/api/status/subscribe`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email, components, turnstileToken }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message ?? "Subscription failed");
  }
}

export async function unsubscribeFromStatus(token: string): Promise<void> {
  const res = await fetch(`${API}/api/status/unsubscribe`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ token }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message ?? "Unsubscribe failed");
  }
}
