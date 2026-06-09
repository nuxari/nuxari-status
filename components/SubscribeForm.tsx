"use client";

import { useState } from "react";
import { subscribeToStatus } from "@/lib/api";

export function SubscribeForm() {
  const [email, setEmail]     = useState("");
  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      await subscribeToStatus(email);
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Subscription failed. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        className="border px-6 py-6 flex items-center gap-4"
        style={{ background: "#f5f3ee", borderColor: "rgba(16,185,129,0.35)" }}
      >
        <div
          className="flex size-10 shrink-0 items-center justify-center text-sm font-bold"
          style={{ background: "rgba(16,185,129,0.1)", color: "#059669", border: "1px solid rgba(16,185,129,0.25)" }}
        >
          ✓
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#161616" }}>
            You&apos;re subscribed
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "#5b5b54" }}>
            You&apos;ll receive email notifications during incidents and when they resolve.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="border px-6 py-6"
      style={{ background: "#f5f3ee", borderColor: "#d3cfc3" }}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold" style={{ color: "#161616" }}>
          Get notified about incidents
        </h3>
        <p className="mt-0.5 text-xs" style={{ color: "#5b5b54" }}>
          Receive an email when incidents are opened, updated, or resolved.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          disabled={status === "loading"}
          className="min-w-0 flex-1 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 disabled:opacity-50"
          style={{
            background: "#ece9e1",
            border: "1px solid #d3cfc3",
            color: "#161616",
            "--tw-ring-color": "rgba(47,75,255,0.3)",
          } as React.CSSProperties}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
          style={{ background: "#2f4bff" }}
          onMouseEnter={(e) => { if (status !== "loading") (e.currentTarget as HTMLElement).style.background = "#1f37e0"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#2f4bff"; }}
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {status === "error" && (
        <p className="mt-2.5 text-xs" style={{ color: "#dc2626" }}>
          {message}
        </p>
      )}
    </div>
  );
}
