/**
 * Génération DOCX via le package 'docx'
 * Reçoit le contenu texte et produit un Buffer DOCX
 */

import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, Header, Footer,
  NumberFormat,
} from "docx";

// ─── Couleurs Scrivia ─────────────────────────────────────
const GOLD   = "C8A96E";
const DARK   = "07070F";
const MUTED  = "9E9A8E";

// ─── Parser markdown → paragraphes docx ──────────────────
function parseToDocx(content: string): Paragraph[] {
  const lines   = content.split("\n");
  const paras: Paragraph[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      paras.push(new Paragraph({ text: "" }));
      continue;
    }

    if (trimmed.startsWith("# ")) {
      paras.push(new Paragraph({
        text: trimmed.slice(2),
        heading: HeadingLevel.HEADING_1,
        thematicBreak: false,
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: GOLD } },
        spacing: { before: 320, after: 160 },
      }));
    } else if (trimmed.startsWith("## ")) {
      paras.push(new Paragraph({
        text: trimmed.slice(3),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
      }));
    } else if (trimmed.startsWith("### ")) {
      paras.push(new Paragraph({
        text: trimmed.slice(4),
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 160, after: 80 },
      }));
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      paras.push(new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: trimmed.slice(2), size: 22 })],
        spacing: { before: 60, after: 60 },
      }));
    } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      paras.push(new Paragraph({
        children: [new TextRun({ text: trimmed.slice(2, -2), bold: true, size: 22 })],
        spacing: { before: 80, after: 80 },
      }));
    } else {
      paras.push(new Paragraph({
        children: [new TextRun({ text: trimmed, size: 22 })],
        spacing: { before: 60, after: 60 },
        alignment: AlignmentType.JUSTIFIED,
      }));
    }
  }

  return paras;
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
    title:    params.title,
    creator:  "Scrivia",
    styles: {
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          run: { color: DARK, bold: true, size: 36, font: "Garamond" },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          run: { color: DARK, bold: true, size: 28, font: "Garamond" },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          run: { color: "333333", bold: true, size: 24, font: "Calibri" },
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
                new TextRun({ text: "scrivia.app  ·  Généré le " + generatedAt, color: MUTED, size: 16 }),
              ],
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 1, color: "E8E8E8" } },
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
        // Titre principal
        new Paragraph({
          children: [new TextRun({ text: params.title, bold: true, size: 48, color: DARK, font: "Garamond" })],
          spacing: { after: 240 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: GOLD } },
        }),
        // Contenu parsé
        ...parseToDocx(params.content),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}
