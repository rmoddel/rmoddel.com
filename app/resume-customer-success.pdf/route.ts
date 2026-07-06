import {
  customerSuccessEducation,
  customerSuccessExperience,
  customerSuccessProfessionalDevelopment,
  customerSuccessResumeIdentity,
  customerSuccessResumeSummary,
  customerSuccessSkillSections
} from "@/lib/resume-customer-success-content";
import { buildSinglePageResumePdf } from "@/lib/resume-pdf";

export function GET() {
  const filename = "reuben-moddel-customer-success-resume.pdf";
  const pdf = buildSinglePageResumePdf({
    name: customerSuccessResumeIdentity.name,
    title: customerSuccessResumeIdentity.title,
    location: customerSuccessResumeIdentity.location,
    phone: customerSuccessResumeIdentity.phone,
    email: customerSuccessResumeIdentity.email,
    summary: [...customerSuccessResumeSummary],
    skillSections: [...customerSuccessSkillSections],
    education: customerSuccessEducation,
    development: customerSuccessProfessionalDevelopment,
    experience: [...customerSuccessExperience],
    filename
  });

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store"
    }
  });
}
