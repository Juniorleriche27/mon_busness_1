/**
 * Génération DOCX via le package 'docx'
 * Template professionnel Scrivia — Page de couverture + contenu structuré
 */

import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, Header, Footer,
  NumberFormat, Table, TableRow, TableCell, WidthType,
  ShadingType, PageBreak,
} from "docx";

// ─── Couleurs Scrivia ─────────────────────────────────────
const GOLD   = "C8A96E";
const DARK   = "07070F";
const MUTED  = "9E9A8E";
const WHITE  = "FFFFFF";
const OFFWHT = "F9F7F3";

// ─── Inline bold parser ───────────────────────────────────
function parseInlineRuns(text: string, baseSize = 22, baseColor = "1A1A1A"): TextRun[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map(part => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return new TextRun({ text: part.slice(2, -2), bold: true, size: baseSize, color: baseColor });
    }
    return new TextRun({ text: part, size: baseSize, color: baseColor });
  });
}

// ─── Table parser ────────────────────────────────────────
function parseDocxTable(lines: string[]): Table {
  const rows = lines.filter(l => l.trim().startsWith("|") && !l.match(/^\|[\s\-|]+\|$/));
  const parsed = rows.map(r =>
    r.trim().split("|").filter((_, i, a) => i > 0 && i < a.length - 1).map(c => c.trim())
  );
  const colCount = Math.max(...parsed.map(r => r.length));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: parsed.map((cols, ri) => {
      const isHeader = ri === 0;
      return new TableRow({
        children: Array.from({ length: colCount }).map((_, ci) => {
          const cellText = cols[ci] ?? "";
          return new TableCell({
            shading: isHeader
              ? { type: ShadingType.SOLID, color: GOLD }
              : ri % 2 === 0
                ? { type: ShadingType.SOLID, color: WHITE }
                : { type: ShadingType.SOLID, color: OFFWHT },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: cellText,
                    bold: isHeader,
                    color: isHeader ? WHITE : "1A1A1A",
                    size: 18,
                  }),
                ],
                spacing: { before: 60, after: 60 },
              }),
            ],
          });
        }),
      });
    }),
  });
}

// ─── Markdown → DOCX paragraphs ──────────────────────────
function parseToDocx(content: string): (Paragraph | Table)[] {
  const lines   = content.split("\n");
  const result: (Paragraph | Table)[] = [];
  let i = 0;

  while (i < lines.length) {
    const line    = lines[i];
    const trimmed = line.trim();

    // Empty
    if (!trimmed) {
      result.push(new Paragraph({ text: "", spacing: { before: 40, after: 40 } }));
      i++; continue;
    }

    // Table — collect contiguous table lines
    if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      result.push(parseDocxTable(tableLines));
      result.push(new Paragraph({ text: "", spacing: { before: 80, after: 80 } }));
      continue;
    }

    // Separator ---
    if (trimmed === "---" || trimmed === "___" || trimmed === "***") {
      result.push(new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: GOLD } },
        spacing: { before: 160, after: 160 },
        text: "",
      }));
      i++; continue;
    }

    // H1
    if (trimmed.startsWith("# ")) {
      result.push(new Paragraph({
        text: trimmed.slice(2).replace(/\*\*/g, ""),
        heading: HeadingLevel.HEADING_1,
        border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: GOLD } },
        spacing: { before: 320, after: 160 },
      }));
      i++; continue;
    }

    // H2
    if (trimmed.startsWith("## ")) {
      result.push(new Paragraph({
        text: trimmed.slice(3).replace(/\*\*/g, ""),
        heading: HeadingLevel.HEADING_2,
        border: { left: { style: BorderStyle.SINGLE, size: 6, color: GOLD } },
        spacing: { before: 240, after: 120 },
        indent: { left: 160 },
      }));
      i++; continue;
    }

    // H3
    if (trimmed.startsWith("### ")) {
      result.push(new Paragraph({
        text: trimmed.slice(4).replace(/\*\*/g, ""),
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 160, after: 80 },
      }));
      i++; continue;
    }

    // Bullet
    if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      const text = trimmed.slice(2);
      result.push(new Paragraph({
        bullet: { level: 0 },
        children: parseInlineRuns(text),
        spacing: { before: 60, after: 60 },
      }));
      i++; continue;
    }

    // Numbered list
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numMatch) {
      result.push(new Paragraph({
        children: [
          new TextRun({ text: numMatch[1] + ".  ", bold: true, color: GOLD, size: 22 }),
          ...parseInlineRuns(numMatch[2]),
        ],
        spacing: { before: 60, after: 60 },
      }));
      i++; continue;
    }

    // Paragraph with inline bold
    result.push(new Paragraph({
      children: parseInlineRuns(trimmed),
      spacing: { before: 60, after: 80 },
      alignment: AlignmentType.JUSTIFIED,
    }));
    i++;
  }

  return result;
}

// ─── Cover page paragraphs ────────────────────────────────
function buildCoverPage(title: string, serviceName: string, generatedAt: string): Paragraph[] {
  return [
    // Big top spacing
    new Paragraph({ text: "", spacing: { before: 2400, after: 0 } }),
    // Decorative rule before title
    new Paragraph({
      border: { top: { style: BorderStyle.SINGLE, size: 2, color: GOLD } },
      spacing: { before: 0, after: 160 },
      text: "",
    }),
    // Main title
    new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 64,
          color: DARK,
          font: "Garamond",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 200 },
    }),
    // Service name (gold)
    new Paragraph({
      children: [
        new TextRun({
          text: serviceName,
          size: 28,
          color: GOLD,
          font: "Calibri",
          italics: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
    }),
    // Decorative rule after
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: GOLD } },
      spacing: { before: 80, after: 800 },
      text: "",
    }),
    // Date row
    new Paragraph({
      children: [
        new TextRun({ text: "Généré le ", size: 20, color: MUTED }),
        new TextRun({ text: generatedAt, size: 20, bold: true, color: DARK }),
        new TextRun({ text: "  ·  scrivia.app", size: 20, color: MUTED }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 2400 },
    }),
    // Page break
    new Paragraph({
      children: [new PageBreak()],
    }),
  ];
}

// ─── Export ──────────────────────────────────────────────
export async function generateDocx(params: {
  content:     string;
  title:       string;
  serviceName: string;
}): Promise<Buffer> {
  const generatedAt = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  const doc = new Document({
    title:   params.title,
    creator: "Scrivia",
    styles: {
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          run: { color: GOLD, bold: true, size: 36, font: "Garamond" },
          paragraph: { spacing: { before: 320, after: 160 } },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          run: { color: DARK, bold: true, size: 28, font: "Garamond" },
          paragraph: { spacing: { before: 240, after: 120 } },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          run: { color: "333333", bold: true, size: 24, font: "Calibri" },
          paragraph: { spacing: { before: 160, after: 80 } },
        },
      ],
    },
    sections: [{
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "SCRIVIA", bold: true, color: GOLD, size: 18, font: "Calibri" }),
                new TextRun({ text: "  ·  ", color: MUTED, size: 16 }),
                new TextRun({ text: params.title, color: DARK, size: 16, bold: true }),
                new TextRun({ text: "  ·  " + params.serviceName, color: MUTED, size: 16 }),
              ],
              border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: GOLD } },
              spacing: { after: 120 },
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "scrivia.app  ·  Documents IA professionnels  ·  Généré le " + generatedAt, color: MUTED, size: 16 }),
              ],
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 1, color: GOLD } },
              spacing: { before: 80 },
            }),
          ],
        }),
      },
      properties: {
        page: {
          margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
        },
      },
      children: [
        // Cover page
        ...buildCoverPage(params.title, params.serviceName, generatedAt),
        // Content
        ...parseToDocx(params.content),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}
