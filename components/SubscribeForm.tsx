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
        className="rounded-xl border px-6 py-6 flex items-center gap-4"
        style={{ background: "#161616", borderColor: "rgba(16,185,129,0.3)" }}
      >
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-lg"
          style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}
        >
          ✓
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#f3f2ee" }}>
            You&apos;re subscribed
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "#9a9a94" }}>
            You&apos;ll receive email notifications during incidents and when they resolve.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border px-6 py-6"
      style={{ background: "#161616", borderColor: "#2b2b2b" }}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold" style={{ color: "#f3f2ee" }}>
          Get notified about incidents
        </h3>
        <p className="mt-0.5 text-xs" style={{ color: "#9a9a94" }}>
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
          className="min-w-0 flex-1 rounded-lg px-4 py-2.5 text-sm placeholder:text-[#6b6b66] focus:outline-none focus:ring-2 disabled:opacity-50"
          style={{
            background: "#1d1d1d",
            border: "1px solid #2b2b2b",
            color: "#f3f2ee",
            "--tw-ring-color": "rgba(47,75,255,0.3)",
          } as React.CSSProperties}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
          style={{ background: "#2f4bff" }}
          onMouseEnter={(e) => { if (status !== "loading") (e.currentTarget as HTMLElement).style.background = "#1f37e0"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#2f4bff"; }}
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>

      {status === "error" && (
        <p className="mt-2.5 text-xs" style={{ color: "#ef4444" }}>
          {message}
        </p>
      )}
    </div>
  );
}
