import type { Metadata } from "next";
import { ContactSection } from "@/components/profile-sections";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TurnstileScript } from "@/components/turnstile";
import { professionalDescriptor } from "@/lib/interactive-resume-content";
import { siteProfile } from "@/lib/site-profile";

export const metadata: Metadata = {
  title: "Contact | Reuben Moddel",
  description:
    "Contact Reuben Moddel about a role, collaboration, personalized AI or software solution, or a cumbersome process that should work better.",
  alternates: {
    canonical: "/contact"
  }
};

export default function ContactPage() {
  return (
    <main className="pageShell">
      <TurnstileScript />
      <SiteHeader brandLine={professionalDescriptor} />
      <ContactSection />
      <SiteFooter
        name={siteProfile.identity.name}
        summary={siteProfile.positioning.summary}
        title={professionalDescriptor}
      />
    </main>
  );
}
