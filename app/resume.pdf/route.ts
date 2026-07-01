import {
  education,
  employmentHistory,
  leadershipSkills,
  professionalDevelopment,
  resumeIdentity,
  resumeSummary,
  technicalSkills
} from "@/lib/resume-content";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN_X = 40;
const MARGIN_TOP = 42;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

function escapePdfText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapText(text: string, maxChars: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;

    if (next.length <= maxChars) {
      current = next;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    current = word;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function textBlock(
  lines: string[],
  x: number,
  y: number,
  font: "F1" | "F2",
  size: number,
  leading: number,
  color: [number, number, number]
) {
  const [r, g, b] = color.map((value) => value.toFixed(3));
  const escapedLines = lines.map((line) => `(${escapePdfText(line)}) Tj`);

  return `BT
/${font} ${size} Tf
${r} ${g} ${b} rg
1 0 0 1 ${x} ${y} Tm
${leading} TL
${escapedLines.join("\nT*\n")}
ET`;
}

function horizontalRule(y: number, width = CONTENT_WIDTH) {
  return `q
0.910 0.435 0.259 RG
1 w
${MARGIN_X} ${y} m
${MARGIN_X + width} ${y} l
S
Q`;
}

function buildResumePdf() {
  const commands: string[] = [];
  let y = PAGE_HEIGHT - MARGIN_TOP;

  commands.push(
    textBlock([resumeIdentity.name], MARGIN_X, y, "F2", 21, 24, [0.09, 0.2, 0.29])
  );
  y -= 24;

  commands.push(
    textBlock([resumeIdentity.title], MARGIN_X, y, "F1", 10.5, 13, [0.36, 0.33, 0.37])
  );
  commands.push(
    textBlock(
      [`${resumeIdentity.location}   |   ${resumeIdentity.phone}   |   ${resumeIdentity.email}`],
      340,
      y,
      "F1",
      9.5,
      12,
      [0.36, 0.33, 0.37]
    )
  );
  y -= 16;

  commands.push(horizontalRule(y));
  y -= 20;

  commands.push(textBlock(["SUMMARY"], MARGIN_X, y, "F2", 10.5, 12, [0.91, 0.435, 0.259]));
  y -= 16;

  const summaryLines = resumeSummary.flatMap((paragraph) => [
    ...wrapText(paragraph, 108),
    ""
  ]);
  summaryLines.pop();
  commands.push(textBlock(summaryLines, MARGIN_X, y, "F1", 9.2, 12.4, [0.1, 0.09, 0.1]));
  y -= summaryLines.length * 12.4 + 16;

  commands.push(textBlock(["CORE SKILLS"], MARGIN_X, y, "F2", 10.5, 12, [0.91, 0.435, 0.259]));
  y -= 15;

  const leftSkillLines = [
    "Technical & Professional",
    ...technicalSkills.flatMap((skill) => wrapText(`- ${skill}`, 43))
  ];
  const rightSkillLines = [
    "Leadership & Operations",
    ...leadershipSkills.flatMap((skill) => wrapText(`- ${skill}`, 43))
  ];

  commands.push(textBlock(leftSkillLines, MARGIN_X, y, "F1", 8.8, 11.2, [0.1, 0.09, 0.1]));
  commands.push(textBlock(rightSkillLines, 322, y, "F1", 8.8, 11.2, [0.1, 0.09, 0.1]));
  y -= Math.max(leftSkillLines.length, rightSkillLines.length) * 11.2 + 16;

  commands.push(
    textBlock(["EDUCATION & DEVELOPMENT"], MARGIN_X, y, "F2", 10.5, 12, [0.91, 0.435, 0.259])
  );
  y -= 15;

  const educationLines = [
    education.school,
    education.degree,
    education.completed
  ];
  const developmentLines = [
    professionalDevelopment.program,
    professionalDevelopment.year
  ];

  commands.push(textBlock(educationLines, MARGIN_X, y, "F1", 8.8, 11.2, [0.1, 0.09, 0.1]));
  commands.push(textBlock(developmentLines, 322, y, "F1", 8.8, 11.2, [0.1, 0.09, 0.1]));
  y -= Math.max(educationLines.length, developmentLines.length) * 11.2 + 18;

  commands.push(
    textBlock(["EMPLOYMENT HISTORY"], MARGIN_X, y, "F2", 10.5, 12, [0.91, 0.435, 0.259])
  );
  y -= 14;

  for (const role of employmentHistory) {
    commands.push(
      textBlock([role.title], MARGIN_X, y, "F2", 9.5, 11, [0.09, 0.2, 0.29])
    );
    commands.push(
      textBlock([role.dates], 432, y, "F1", 8.4, 10, [0.36, 0.33, 0.37])
    );
    y -= 11;

    commands.push(
      textBlock(
        [`${role.company} | ${role.location}`],
        MARGIN_X,
        y,
        "F1",
        8.4,
        10,
        [0.36, 0.33, 0.37]
      )
    );
    y -= 10;

    const pointLines = role.points.flatMap((point) => wrapText(`- ${point}`, 98));
    commands.push(textBlock(pointLines, MARGIN_X + 8, y, "F1", 8.1, 9.4, [0.1, 0.09, 0.1]));
    y -= pointLines.length * 9.4 + 8;
  }

  const contentStream = commands.join("\n");
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj",
    `3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>
endobj`,
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj",
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj",
    `6 0 obj
<< /Length ${Buffer.byteLength(contentStream, "utf8")} >>
stream
${contentStream}
endstream
endobj`
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${object}\n`;
  }

  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref
0 ${objects.length + 1}
0000000000 65535 f 
`;

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${offsets[index].toString().padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer
<< /Size ${objects.length + 1} /Root 1 0 R >>
startxref
${xrefOffset}
%%EOF`;

  return Buffer.from(pdf, "utf8");
}

export function GET() {
  const pdf = buildResumePdf();

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="reuben-moddel-resume.pdf"',
      "Cache-Control": "no-store"
    }
  });
}
