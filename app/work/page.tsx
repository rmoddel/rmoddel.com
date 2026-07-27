import type { Metadata } from "next";
import { WorkSection } from "@/components/profile-sections";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { professionalDescriptor } from "@/lib/interactive-resume-content";
import { siteProfile } from "@/lib/site-profile";

export const metadata: Metadata = {
  title: "Selected Projects | Reuben Moddel",
  description:
    "Approved project examples for Reuben Moddel, including a self-service flyer generator and community announcement broadcast system.",
  alternates: {
    canonical: "/work"
  }
};

export default function WorkPage() {
  return (
    <main className="pageShell">
      <SiteHeader brandLine={professionalDescriptor} />
      <WorkSection />
      <SiteFooter
        name={siteProfile.identity.name}
        summary={siteProfile.positioning.summary}
        title={professionalDescriptor}
      />
    </main>
  );
}
