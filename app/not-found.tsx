import Link        from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#ece9e1" }}>
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-sm">
          <p className="text-6xl font-light" style={{ color: "#d3cfc3", letterSpacing: "-0.04em" }}>
            404
          </p>
          <h2 className="mt-3 text-base font-semibold" style={{ color: "#161616" }}>
            Page not found
          </h2>
          <p className="mt-1 text-sm" style={{ color: "#5b5b54" }}>
            The page or incident you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center px-4 py-2.5 text-sm font-semibold text-white transition-colors"
            style={{ background: "#2f4bff" }}
          >
            Back to status
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
