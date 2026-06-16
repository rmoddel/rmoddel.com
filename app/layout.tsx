import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rmoddel.com"),
  title: {
    default: "Reuben Moddel | Creative AI Operator for Real-World Business",
    template: "%s | Reuben Moddel"
  },
  description:
    "Turn rough ideas into polished websites, ads, campaigns, business documents, workflows, and AI-powered systems.",
  applicationName: "rmoddel.com",
  authors: [{ name: "Reuben Moddel", url: "https://rmoddel.com" }],
  creator: "Reuben Moddel",
  publisher: "Reuben Moddel",
  category: "Business",
  alternates: {
    canonical: "/"
  },
  keywords: [
    "Reuben Moddel",
    "creative AI operator",
    "website copywriting",
    "AI workflow consulting",
    "MVP planning",
    "business writing",
    "campaign materials",
    "logo and branding direction",
    "product blueprinting",
    "idea to execution"
  ],
  openGraph: {
    type: "website",
    url: "https://rmoddel.com",
    siteName: "rmoddel.com",
    title: "Reuben Moddel | Creative AI Operator for Real-World Business",
    description:
      "Websites, ads, writing, workflows, and app plans for businesses, nonprofits, founders, and community organizations.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Reuben Moddel - Turn Rough Ideas Into Polished Results"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Reuben Moddel | Creative AI Operator for Real-World Business",
    description:
      "Turn rough ideas into polished websites, ads, campaigns, business writing, workflows, and app plans.",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
