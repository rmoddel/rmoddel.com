import {
  education,
  employmentHistory,
  leadershipSkills,
  professionalDevelopment,
  resumeIdentity,
  resumeSummary,
  technicalSkills
} from "@/lib/resume-content";
import { buildSinglePageResumePdf } from "@/lib/resume-pdf";

export function GET() {
  const pdf = buildSinglePageResumePdf({
    name: resumeIdentity.name,
    title: resumeIdentity.title,
    location: resumeIdentity.location,
    phone: resumeIdentity.phone,
    email: resumeIdentity.email,
    summary: [...resumeSummary],
    skillSections: [
      {
        heading: "Operations, Systems & Execution",
        items: [...technicalSkills]
      },
      {
        heading: "Leadership & Operations",
        items: [...leadershipSkills]
      }
    ],
    education,
    development: professionalDevelopment,
    experience: [...employmentHistory],
    filename: "reuben-moddel-resume.pdf"
  });

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="reuben-moddel-resume.pdf"',
      "Cache-Control": "no-store"
    }
  });
}
