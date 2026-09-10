import {
  education,
  employmentHistory,
  leadershipSkills,
  professionalDevelopment,
  resumeIdentity,
  resumeSummary,
  selectedClientWork,
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
        heading: "Technical, AI & Systems Execution",
        items: [...technicalSkills]
      },
      {
        heading: "Leadership & Operations",
        items: [...leadershipSkills]
      }
    ],
    projectsHeading: "SELECTED CLIENT & CONTRACT WORK (2025-2026)",
    educationBeforeProjects: true,
    projects: selectedClientWork.map((project) => ({
      title: `${project.title} (${project.year})`,
      summary: project.summary
    })),
    education,
    development: professionalDevelopment,
    experience: employmentHistory,
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
