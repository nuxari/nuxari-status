"use client";

import { useState, useRef } from "react";
import { subscribeToStatus } from "@/lib/api";
import { TurnstileWidget } from "./TurnstileWidget";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export function SubscribeForm() {
  const [email,          setEmail]          = useState("");
  const [status,         setStatus]         = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message,        setMessage]        = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);
  const turnstileKeyRef                     = useRef(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setMessage("Please complete the verification before subscribing.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      await subscribeToStatus(email, [], turnstileToken ?? undefined);
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Subscription failed. Please try again.");
      // Reset Turnstile so the user can try again
      turnstileKeyRef.current += 1;
      setTurnstileToken(null);
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
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
            disabled={status === "loading" || (!!TURNSTILE_SITE_KEY && !turnstileToken)}
            className="shrink-0 px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
            style={{ background: "#2f4bff" }}
            onMouseEnter={(e) => { if (status !== "loading") (e.currentTarget as HTMLElement).style.background = "#1f37e0"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#2f4bff"; }}
          >
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
        </div>

        {/* Turnstile — only render when a site key is configured */}
        {TURNSTILE_SITE_KEY && (
          <div>
            <TurnstileWidget
              key={turnstileKeyRef.current}
              siteKey={TURNSTILE_SITE_KEY}
              onToken={(token) => { setTurnstileToken(token); setTurnstileError(false); }}
              onExpire={() => setTurnstileToken(null)}
              onError={() => { setTurnstileToken(null); setTurnstileError(true); }}
              theme="light"
              compact
            />
            {turnstileError && (
              <p className="mt-1.5 text-xs" style={{ color: "#dc2626" }}>
                Verification failed. Please refresh and try again.
              </p>
            )}
          </div>
        )}
      </form>

      {status === "error" && message && (
        <p className="mt-2.5 text-xs" style={{ color: "#dc2626" }}>
          {message}
        </p>
      )}
    </div>
  );
}
