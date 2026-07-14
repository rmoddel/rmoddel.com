import type { Metadata } from "next";
import { Fraunces, Sora } from "next/font/google";
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
    default: "Reuben Moddel | Product Operations and Technical Leadership",
    template: "%s | Reuben Moddel"
  },
  description:
    "Personal portfolio for Reuben Moddel, focused on product operations, technical leadership, workflow design, clear communication, and AI-enabled execution.",
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
    "product operations",
    "technical operations",
    "technical leadership",
    "workflow design",
    "AI-enabled workflows",
    "requirements documentation",
    "developer support",
    "business writing",
    "cross-functional communication",
    "human-centered execution"
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rmoddel.com",
    siteName: "rmoddel.com",
    title: "Reuben Moddel | Product Operations and Technical Leadership",
    description:
      "Personal portfolio focused on product operations, technical leadership, workflow design, clear thinking, and practical execution.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Reuben Moddel - Product Operations and Technical Leadership"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Reuben Moddel | Product Operations and Technical Leadership",
    description:
      "Personal portfolio focused on product operations, technical leadership, workflow design, clear thinking, and practical execution.",
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
