import type { Metadata } from "next";
import { ExperienceSection } from "@/components/profile-sections";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { professionalDescriptor } from "@/lib/interactive-resume-content";
import { siteProfile } from "@/lib/site-profile";

export const metadata: Metadata = {
  title: "Experience | Technical Builder to Operations Leader",
  description:
    "Experience arc for Reuben Moddel, from hands-on web development through business systems, technical operations, product operations, people leadership, and AI-enabled execution.",
  alternates: {
    canonical: "/experience"
  }
};

export default function ExperiencePage() {
  return (
    <main className="pageShell">
      <SiteHeader brandLine={professionalDescriptor} />
      <ExperienceSection />
      <SiteFooter
        name={siteProfile.identity.name}
        summary={siteProfile.positioning.summary}
        title={professionalDescriptor}
      />
    </main>
  );
}
