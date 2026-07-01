import {
  productEducation,
  productExperience,
  productProfessionalDevelopment,
  productResumeIdentity,
  productResumeSummary,
  productSkillSections
} from "@/lib/resume-product-content";
import { buildSinglePageResumePdf } from "@/lib/resume-pdf";

export function GET() {
  const pdf = buildSinglePageResumePdf({
    name: productResumeIdentity.name,
    title: productResumeIdentity.title,
    location: productResumeIdentity.location,
    phone: productResumeIdentity.phone,
    email: productResumeIdentity.email,
    summary: [...productResumeSummary],
    skillSections: [...productSkillSections],
    education: productEducation,
    development: productProfessionalDevelopment,
    experience: [...productExperience],
    filename: "reuben-moddel-product-operations-resume.pdf"
  });

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="reuben-moddel-product-operations-resume.pdf"',
      "Cache-Control": "no-store"
    }
  });
}
