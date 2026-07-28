import type { Metadata } from "next";
import {
  CapabilitiesSection,
  CredentialTicker,
  GpsSection,
  HeroSection,
  PathwaysSection,
  WorkSection
} from "@/components/profile-sections";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { professionalDescriptor } from "@/lib/interactive-resume-content";
import { absoluteOpenGraphImageUrl, openGraphImagePath, twitterImagePath } from "@/lib/seo";
import { technicalBackground } from "@/lib/site-content";
import { siteProfile } from "@/lib/site-profile";

const technicalKnowsAbout = technicalBackground.flatMap((group) => group.items);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://rmoddel.com/#person",
      name: siteProfile.identity.name,
      url: "https://rmoddel.com",
      image: absoluteOpenGraphImageUrl,
      jobTitle: siteProfile.identity.primaryTitle,
      description: siteProfile.positioning.summary,
      knowsAbout: [
        "AI solutions",
        "Personalized software",
        "Operations and program management",
        "People leadership",
        "Process improvement",
        "Cross-functional execution",
        "Stakeholder alignment",
        "Client communication",
        "Technical problem solving",
        "Business systems",
        "Advanced AI solutions",
        "OpenAI API integrations",
        "Automation-enabled operations",
        ...technicalKnowsAbout
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://rmoddel.com/#website",
      name: "rmoddel.com",
      url: "https://rmoddel.com",
      inLanguage: "en-US",
      description:
        "Personal career site for Reuben Moddel, focused on AI solutions, operations, people leadership, personalized software, and process improvement.",
      author: {
        "@id": "https://rmoddel.com/#person"
      }
    },
    {
      "@type": "ProfilePage",
      "@id": "https://rmoddel.com/#profile",
      url: "https://rmoddel.com",
      name: siteProfile.identity.name,
      description:
        "Personal portfolio and working profile for Reuben Moddel.",
      mainEntity: {
        "@id": "https://rmoddel.com/#person"
      },
      isPartOf: {
        "@id": "https://rmoddel.com/#website"
      }
    }
  ]
};

export const metadata: Metadata = {
  title: "Reuben Moddel | AI Solutions, Operations, and People Leadership",
  description:
    "Reuben Moddel combines 15+ years across operations, systems, team leadership, and software delivery with AI-enabled solutions that improve cumbersome real-world processes.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Reuben Moddel | AI Solutions, Operations, and People Leadership",
    description:
      "AI-enabled solutions, operations leadership, people leadership, personalized software, and process improvement for cumbersome real-world workflows.",
    url: "/",
    siteName: "rmoddel.com",
    locale: "en_US",
    type: "profile",
    firstName: "Reuben",
    lastName: "Moddel",
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
      "AI-enabled solutions, operations leadership, people leadership, and personalized software for cumbersome processes.",
    images: [twitterImagePath]
  }
};

export default function HomePage() {
  return (
    <main className="pageShell">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <SiteHeader brandLine={professionalDescriptor} />

      <HeroSection />
      <CredentialTicker />
      <GpsSection />
      <CapabilitiesSection />
      <PathwaysSection />
      <WorkSection compact />
      <SiteFooter
        name={siteProfile.identity.name}
        summary={siteProfile.positioning.summary}
        title={professionalDescriptor}
      />
    </main>
  );
}
