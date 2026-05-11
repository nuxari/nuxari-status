import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:       { default: "Nuxari Status", template: "%s — Nuxari Status" },
  description: "Live operational status for all Nuxari services.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_STATUS_PAGE_URL ?? "https://status.nuxari.com"),
  openGraph: {
    type:        "website",
    siteName:    "Nuxari Status",
    title:       "Nuxari Status",
    description: "Live operational status for all Nuxari services.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width:        "device-width",
  initialScale: 1,
  themeColor:   "#4f46e5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
