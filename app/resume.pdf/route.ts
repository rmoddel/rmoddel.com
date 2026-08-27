import {
  education,
  employmentHistory,
  professionalDevelopment,
  resumeIdentity,
  singlePageLeadershipSkills,
  singlePageResumeSummary,
  singlePageTechnicalSkills
} from "@/lib/resume-content";
import { buildSinglePageResumePdf } from "@/lib/resume-pdf";
import { siteProfile } from "@/lib/site-profile";

export function GET() {
  const pdf = buildSinglePageResumePdf({
    name: resumeIdentity.name,
    title: resumeIdentity.title,
    location: resumeIdentity.location,
    phone: resumeIdentity.phone,
    email: resumeIdentity.email,
    summary: [...singlePageResumeSummary],
    skillSections: [
      {
        heading: "Technical, AI & Systems Execution",
        items: [...singlePageTechnicalSkills]
      },
      {
        heading: "Leadership & Operations",
        items: [...singlePageLeadershipSkills]
      }
    ],
    projectsHeading: "RECENT CLIENT & CONTRACT WORK",
    educationBeforeProjects: true,
    projects: siteProfile.caseStudies.slice(0, 3).map((project) => ({
      title: `${project.title} (${project.status})`,
      summary: project.summary
    })),
    education,
    development: professionalDevelopment,
    experience: employmentHistory.map((role) => ({
      ...role,
      points: role.points.slice(0, 2)
    })),
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
