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
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-center">
        <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-lg">✓</div>
        <p className="text-sm font-semibold text-emerald-800">You&apos;re subscribed</p>
        <p className="mt-0.5 text-xs text-emerald-600">
          You&apos;ll receive email notifications during incidents and when they resolve.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm px-6 py-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Get notified about incidents</h3>
        <p className="mt-0.5 text-xs text-gray-500">
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
          className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>

      {status === "error" && (
        <p className="mt-2.5 text-xs text-red-600">{message}</p>
      )}
    </div>
  );
}
