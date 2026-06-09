"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams }     from "next/navigation";
import Link                    from "next/link";
import { unsubscribeFromStatus } from "@/lib/api";
import { SiteHeader }           from "@/components/SiteHeader";
import { SiteFooter }           from "@/components/SiteFooter";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.nuxari.com";

type State = "loading" | "success" | "error" | "missing";

function UnsubscribeContent() {
  const params = useSearchParams();
  const token  = params.get("token");
  const [state, setState]     = useState<State>(token ? "loading" : "missing");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) { setState("missing"); return; }

    unsubscribeFromStatus(token)
      .then(() => setState("success"))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Something went wrong.";
        setMessage(msg);
        setState("error");
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="w-full max-w-sm text-center">
      {state === "loading" && <LoadingCard />}
      {state === "success" && <SuccessCard />}
      {state === "error"   && <ErrorCard message={message} />}
      {state === "missing" && <MissingCard />}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0f0f0f" }}>
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <Suspense fallback={<LoadingCard />}>
          <UnsubscribeContent />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="rounded-xl border px-8 py-10" style={{ background: "#161616", borderColor: "#2b2b2b" }}>
      <div
        className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl"
        style={{ background: "#1d1d1d" }}
      >
        <span className="text-xl animate-spin inline-block" style={{ color: "#9a9a94" }}>◌</span>
      </div>
      <p className="text-sm font-semibold" style={{ color: "#f3f2ee" }}>Processing…</p>
      <p className="mt-1 text-xs" style={{ color: "#9a9a94" }}>
        Unsubscribing you from status notifications.
      </p>
    </div>
  );
}

function SuccessCard() {
  return (
    <div
      className="rounded-xl border px-8 py-10"
      style={{ background: "#161616", borderColor: "rgba(16,185,129,0.3)" }}
    >
      <div
        className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full text-xl"
        style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}
      >
        ✓
      </div>
      <h1 className="text-base font-semibold" style={{ color: "#f3f2ee" }}>
        Unsubscribed
      </h1>
      <p className="mt-1 text-sm" style={{ color: "#9a9a94" }}>
        You will no longer receive Nuxari status notifications.
      </p>
      <Link
        href="/"
        className="mt-5 inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors"
        style={{ background: "#2f4bff" }}
      >
        Return to status page
      </Link>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div
      className="rounded-xl border px-8 py-10"
      style={{ background: "#161616", borderColor: "rgba(239,68,68,0.3)" }}
    >
      <div
        className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full text-xl"
        style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}
      >
        ✕
      </div>
      <h1 className="text-base font-semibold" style={{ color: "#f3f2ee" }}>
        Unable to unsubscribe
      </h1>
      <p className="mt-1 text-sm" style={{ color: "#9a9a94" }}>
        {/* Safe message — never expose raw API errors in detail */}
        {message || "We could not process your request. Please try again or contact support."}
      </p>
      <div className="mt-5 flex items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors"
          style={{ background: "#2f4bff" }}
        >
          Return to status page
        </Link>
      </div>
    </div>
  );
}

function MissingCard() {
  return (
    <div
      className="rounded-xl border px-8 py-10"
      style={{ background: "#161616", borderColor: "#2b2b2b" }}
    >
      <div
        className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl text-xl"
        style={{ background: "#1d1d1d", color: "#9a9a94" }}
      >
        ?
      </div>
      <h1 className="text-base font-semibold" style={{ color: "#f3f2ee" }}>
        Invalid link
      </h1>
      <p className="mt-1 text-sm" style={{ color: "#9a9a94" }}>
        This unsubscribe link is missing a token. Please use the link from your notification email.
      </p>
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors"
          style={{ background: "#2f4bff" }}
        >
          Return to status page
        </Link>
        <a
          href={APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
          style={{ color: "#9a9a94", borderColor: "#2b2b2b" }}
        >
          Open app
        </a>
      </div>
    </div>
  );
}
