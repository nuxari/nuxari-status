import type { Metadata, Viewport } from "next";
import "./globals.css";

const STATUS_URL = process.env.NEXT_PUBLIC_STATUS_PAGE_URL ?? "https://status.nuxari.com";

export const metadata: Metadata = {
  title: {
    default:  "Nuxari Status | System Health and Incident Updates",
    template: "%s — Nuxari Status",
  },
  description:
    "Real-time system status, uptime, incidents, and maintenance updates for the Nuxari governance platform.",
  metadataBase: new URL(STATUS_URL),
  openGraph: {
    type:        "website",
    siteName:    "Nuxari Status",
    title:       "Nuxari Status | System Health and Incident Updates",
    description: "Real-time system status, uptime, incidents, and maintenance updates for the Nuxari governance platform.",
    url:         STATUS_URL,
    images: [
      {
        url:   "/og-image.png",
        width:  1200,
        height: 630,
        alt:    "Nuxari System Status",
      },
    ],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Nuxari Status | System Health and Incident Updates",
    description: "Real-time system status, uptime, incidents, and maintenance updates for the Nuxari governance platform.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width:        "device-width",
  initialScale: 1,
  themeColor:   "#2f4bff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
