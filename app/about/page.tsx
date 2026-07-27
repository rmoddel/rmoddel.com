import type { Metadata } from "next";
import {
  AboutDetailSection,
  AboutSection,
  AiLeverageSection,
  ExperienceSection,
  GpsSection,
  HowIWorkSection
} from "@/components/profile-sections";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { professionalDescriptor } from "@/lib/interactive-resume-content";
import { siteProfile } from "@/lib/site-profile";

export const metadata: Metadata = {
  title: "About Reuben Moddel",
  description:
    "About Reuben Moddel's career story, human understanding, leadership style, work ethic, AI philosophy, and GPS approach to personalized solutions.",
  alternates: {
    canonical: "/about"
  }
};

export default function AboutPage() {
  return (
    <main className="pageShell">
      <SiteHeader brandLine={professionalDescriptor} />
      <AboutSection />
      <AboutDetailSection />
      <ExperienceSection />
      <HowIWorkSection />
      <AiLeverageSection />
      <GpsSection />
      <SiteFooter
        name={siteProfile.identity.name}
        summary={siteProfile.positioning.summary}
        title={professionalDescriptor}
      />
    </main>
  );
}
