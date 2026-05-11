export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-200 bg-white mt-16">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-indigo-600">
              <span className="text-[10px] font-bold text-white">N</span>
            </div>
            <span className="text-sm font-medium text-gray-500">
              © {year} Nuxari. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href="https://nuxari.com" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              nuxari.com
            </a>
            <a href="https://app.nuxari.com" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Nuxari Ops
            </a>
            <a href="https://app.nuxari.com/settings" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
