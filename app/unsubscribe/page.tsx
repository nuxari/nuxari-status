"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams }     from "next/navigation";
import Link                    from "next/link";
import { unsubscribeFromStatus } from "@/lib/api";
import { SiteHeader }           from "@/components/SiteHeader";
import { SiteFooter }           from "@/components/SiteFooter";

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
    <div className="min-h-screen flex flex-col">
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
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm px-8 py-10">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-gray-100">
        <span className="text-gray-400 text-xl animate-spin inline-block">◌</span>
      </div>
      <p className="text-sm font-semibold text-gray-900">Processing…</p>
      <p className="mt-1 text-xs text-gray-500">Unsubscribing you from status notifications.</p>
    </div>
  );
}

function SuccessCard() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 shadow-sm px-8 py-10">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 text-xl">
        ✓
      </div>
      <h1 className="text-base font-semibold text-emerald-900">Unsubscribed</h1>
      <p className="mt-1 text-sm text-emerald-700">
        You will no longer receive Nuxari status notifications.
      </p>
      <Link
        href="/"
        className="mt-5 inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
      >
        Return to status page
      </Link>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 shadow-sm px-8 py-10">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 text-xl">
        ✕
      </div>
      <h1 className="text-base font-semibold text-red-900">Unable to unsubscribe</h1>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      <Link
        href="/"
        className="mt-5 inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
      >
        Return to status page
      </Link>
    </div>
  );
}

function MissingCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm px-8 py-10">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 text-xl">
        ?
      </div>
      <h1 className="text-base font-semibold text-gray-900">Invalid link</h1>
      <p className="mt-1 text-sm text-gray-500">
        This unsubscribe link is missing a token. Please use the link from your notification email.
      </p>
      <Link
        href="/"
        className="mt-5 inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
      >
        Return to status page
      </Link>
    </div>
  );
}
