import type { Metadata } from "next";
import { Fraunces, Sora } from "next/font/google";
import { openGraphImagePath, twitterImagePath } from "@/lib/seo";
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
    default: "Reuben Moddel | AI Solutions, Operations, and People Leadership",
    template: "%s | Reuben Moddel"
  },
  description:
    "Reuben Moddel combines 13+ years across operations, systems, team leadership, and software delivery with AI-enabled solutions that improve cumbersome real-world processes.",
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
    "AI solutions",
    "personalized software",
    "interactive resume",
    "Genuine Personalized Solutions",
    "operations leadership",
    "people leadership",
    "operations and program management",
    "process improvement",
    "stakeholder alignment",
    "cross-functional execution",
    "technical problem solving",
    "advanced AI solutions",
    "AI-enabled automation",
    "OpenAI API integrations",
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
    title: "Reuben Moddel | AI Solutions, Operations, and People Leadership",
    description:
      "Personal career site focused on AI solutions, operations leadership, people leadership, personalized software, and process improvement.",
    images: [
      {
        url: openGraphImagePath,
        width: 1200,
        height: 630,
        alt: "Reuben Moddel - AI Solutions, Operations, and People Leadership"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Reuben Moddel | AI Solutions, Operations, and People Leadership",
    description:
      "AI solutions, operations leadership, people leadership, personalized software, and process improvement.",
    images: [twitterImagePath]
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
