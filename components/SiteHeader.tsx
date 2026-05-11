import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* Wordmark */}
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-600">
              <span className="text-xs font-bold text-white">N</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              Nuxari
            </span>
          </div>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-500">Status</span>
        </Link>

        <a
          href="https://app.nuxari.com"
          className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
        >
          Go to app →
        </a>
      </div>
    </header>
  );
}
