import Link        from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-sm">
          <p className="text-6xl font-bold text-gray-200">404</p>
          <h2 className="mt-3 text-base font-semibold text-gray-900">Page not found</h2>
          <p className="mt-1 text-sm text-gray-500">The page or incident you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Back to status
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
