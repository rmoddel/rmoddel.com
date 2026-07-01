export type ResumeJob = {
  title: string;
  company: string;
  location: string;
  dates: string;
  points: readonly string[];
};

export type ResumePdfContent = {
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  summary: readonly string[];
  skillSections: Array<{
    heading: string;
    items: readonly string[];
  }>;
  education: {
    school: string;
    degree: string;
    completed: string;
  };
  development: {
    program: string;
    year: string;
  };
  experience: readonly ResumeJob[];
  filename: string;
};

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

function horizontalRule(y: number, color: [number, number, number], width = CONTENT_WIDTH) {
  const [r, g, b] = color.map((value) => value.toFixed(3));

  return `q
${r} ${g} ${b} RG
1 w
${MARGIN_X} ${y} m
${MARGIN_X + width} ${y} l
S
Q`;
}

export function buildSinglePageResumePdf(content: ResumePdfContent) {
  const accent: [number, number, number] = [0.91, 0.435, 0.259];
  const titleTone: [number, number, number] = [0.09, 0.2, 0.29];
  const mutedTone: [number, number, number] = [0.36, 0.33, 0.37];
  const bodyTone: [number, number, number] = [0.1, 0.09, 0.1];
  const commands: string[] = [];
  let y = PAGE_HEIGHT - MARGIN_TOP;

  commands.push(textBlock([content.name], MARGIN_X, y, "F2", 21, 24, titleTone));
  y -= 24;

  commands.push(textBlock([content.title], MARGIN_X, y, "F1", 10.5, 13, mutedTone));
  commands.push(
    textBlock(
      [`${content.location}   |   ${content.phone}   |   ${content.email}`],
      340,
      y,
      "F1",
      9.5,
      12,
      mutedTone
    )
  );
  y -= 16;

  commands.push(horizontalRule(y, accent));
  y -= 20;

  commands.push(textBlock(["SUMMARY"], MARGIN_X, y, "F2", 10.5, 12, accent));
  y -= 16;

  const summaryLines = content.summary.flatMap((paragraph) => [
    ...wrapText(paragraph, 108),
    ""
  ]);
  summaryLines.pop();
  commands.push(textBlock(summaryLines, MARGIN_X, y, "F1", 9.1, 12.2, bodyTone));
  y -= summaryLines.length * 12.2 + 16;

  commands.push(textBlock(["CORE SKILLS"], MARGIN_X, y, "F2", 10.5, 12, accent));
  y -= 15;

  const [leftSkills = { heading: "", items: [] }, rightSkills = { heading: "", items: [] }] =
    content.skillSections;

  const leftSkillLines = [
    leftSkills.heading,
    ...leftSkills.items.flatMap((skill) => wrapText(`- ${skill}`, 43))
  ];
  const rightSkillLines = [
    rightSkills.heading,
    ...rightSkills.items.flatMap((skill) => wrapText(`- ${skill}`, 43))
  ];

  commands.push(textBlock(leftSkillLines, MARGIN_X, y, "F1", 8.7, 11, bodyTone));
  commands.push(textBlock(rightSkillLines, 322, y, "F1", 8.7, 11, bodyTone));
  y -= Math.max(leftSkillLines.length, rightSkillLines.length) * 11 + 16;

  commands.push(textBlock(["EDUCATION & DEVELOPMENT"], MARGIN_X, y, "F2", 10.5, 12, accent));
  y -= 15;

  const educationLines = [content.education.school, content.education.degree, content.education.completed];
  const developmentLines = [content.development.program, content.development.year];

  commands.push(textBlock(educationLines, MARGIN_X, y, "F1", 8.7, 11, bodyTone));
  commands.push(textBlock(developmentLines, 322, y, "F1", 8.7, 11, bodyTone));
  y -= Math.max(educationLines.length, developmentLines.length) * 11 + 18;

  commands.push(textBlock(["EMPLOYMENT HISTORY"], MARGIN_X, y, "F2", 10.5, 12, accent));
  y -= 14;

  for (const role of content.experience) {
    commands.push(textBlock([role.title], MARGIN_X, y, "F2", 9.3, 10.7, titleTone));
    commands.push(textBlock([role.dates], 432, y, "F1", 8.2, 9.8, mutedTone));
    y -= 11;

    commands.push(
      textBlock([`${role.company} | ${role.location}`], MARGIN_X, y, "F1", 8.2, 9.8, mutedTone)
    );
    y -= 10;

    const pointLines = role.points.flatMap((point) => wrapText(`- ${point}`, 97));
    commands.push(textBlock(pointLines, MARGIN_X + 8, y, "F1", 7.9, 9.1, bodyTone));
    y -= pointLines.length * 9.1 + 8;
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
