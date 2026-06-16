export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  helpType: string;
  project: string;
  timeline?: string;
  budget?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function field(label: string, value: string) {
  return `<tr><td style="padding:8px 0;font-weight:700;vertical-align:top;">${escapeHtml(
    label
  )}</td><td style="padding:8px 0;">${escapeHtml(value || "Not provided")}</td></tr>`;
}

export function createContactEmail(payload: ContactPayload) {
  const subject = `New rmoddel.com inquiry from ${payload.name}`;

  const text = [
    "New website inquiry",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "Not provided"}`,
    `Need help with: ${payload.helpType}`,
    `Timeline: ${payload.timeline || "Not provided"}`,
    `Budget: ${payload.budget || "Not provided"}`,
    "",
    "Project",
    payload.project
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1d1a18;line-height:1.6">
      <h1 style="margin:0 0 16px;font-size:24px;">New website inquiry</h1>
      <p style="margin:0 0 20px;">A new contact form submission came in from rmoddel.com.</p>
      <table style="width:100%;border-collapse:collapse">
        ${field("Name", payload.name)}
        ${field("Email", payload.email)}
        ${field("Phone", payload.phone || "Not provided")}
        ${field("Need help with", payload.helpType)}
        ${field("Timeline", payload.timeline || "Not provided")}
        ${field("Budget", payload.budget || "Not provided")}
      </table>
      <div style="margin-top:24px;padding:16px;border-radius:12px;background:#f4efe7;">
        <div style="font-weight:700;margin-bottom:8px;">Project description</div>
        <div>${escapeHtml(payload.project).replace(/\n/g, "<br />")}</div>
      </div>
    </div>
  `.trim();

  return { subject, text, html };
}
