import type { Metadata } from "next";
import { Fraunces, Sora } from "next/font/google";
import { siteProfile } from "@/lib/site-profile";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rmoddel.com"),
  title: {
    default: "Reuben Moddel | Business Operations and Organizational Leader",
    template: "%s | Reuben Moddel"
  },
  description:
    "Personal portfolio for Reuben Moddel, focused on operations leadership, people management, process improvement, stakeholder alignment, and organized execution.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" }
    ],
    shortcut: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }]
  },
  applicationName: "rmoddel.com",
  authors: [{ name: "Reuben Moddel", url: "https://rmoddel.com" }],
  creator: "Reuben Moddel",
  publisher: "Reuben Moddel",
  category: "Business",
  referrer: "origin-when-cross-origin",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/"
  },
  keywords: [
    "Reuben Moddel",
    siteProfile.identity.primaryTitle,
    "operations leadership",
    "people leadership",
    "operations and program management",
    "process improvement",
    "stakeholder alignment",
    "cross-functional execution",
    "organizational leadership",
    "business systems",
    "requirements documentation",
    "business writing",
    "cross-functional communication",
    "human-centered management"
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rmoddel.com",
    siteName: "rmoddel.com",
    title: "Reuben Moddel | Business Operations and Organizational Leader",
    description:
      "Personal portfolio focused on operations leadership, people management, process improvement, stakeholder alignment, and practical execution.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Reuben Moddel - Business Operations and Organizational Leader"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Reuben Moddel | Business Operations and Organizational Leader",
    description:
      "Personal portfolio focused on operations leadership, people management, process improvement, stakeholder alignment, and practical execution.",
    images: ["/twitter-image"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${sora.variable} ${fraunces.variable}`} lang="en">
      <body>{children}</body>
    </html>
  );
}
