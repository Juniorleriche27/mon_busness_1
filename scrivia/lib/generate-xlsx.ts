/**
 * Génération XLSX via exceljs
 * Utilisé principalement pour les services : finances, devis, bmc (tableaux)
 * Reçoit le contenu texte et le structure en feuilles Excel
 */

import ExcelJS from "exceljs";

// ─── Couleurs Scrivia ─────────────────────────────────────
const GOLD_BG   = "C8A96E";
const DARK_BG   = "07070F";
const SURFACE   = "0D0D1A";
const TEXT      = "F0EBE0";
const MUTED     = "9E9A8E";
const WHITE     = "FFFFFF";
const LIGHT_BG  = "F7F4EF";

// ─── Helpers styles ───────────────────────────────────────
const headerStyle = (wb: ExcelJS.Workbook): Partial<ExcelJS.Style> => ({
  font:      { bold: true, color: { argb: "FF" + WHITE }, size: 11, name: "Calibri" },
  fill:      { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + DARK_BG } },
  alignment: { vertical: "middle", horizontal: "center", wrapText: true },
  border: {
    top:    { style: "thin", color: { argb: "FF" + GOLD_BG } },
    bottom: { style: "thin", color: { argb: "FF" + GOLD_BG } },
    left:   { style: "thin", color: { argb: "FF" + GOLD_BG } },
    right:  { style: "thin", color: { argb: "FF" + GOLD_BG } },
  },
});

const goldHeaderStyle: Partial<ExcelJS.Style> = {
  font:      { bold: true, color: { argb: "FF" + DARK_BG }, size: 12, name: "Garamond" },
  fill:      { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + GOLD_BG } },
  alignment: { vertical: "middle", horizontal: "left" },
  border: {
    bottom: { style: "medium", color: { argb: "FF" + DARK_BG } },
  },
};

const rowEvenStyle: Partial<ExcelJS.Style> = {
  fill:      { type: "pattern", pattern: "solid", fgColor: { argb: "FFF7F4EF" } },
  alignment: { vertical: "middle", wrapText: true },
};

const rowOddStyle: Partial<ExcelJS.Style> = {
  fill:      { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } },
  alignment: { vertical: "middle", wrapText: true },
};

// ─── Parseur simple : extrait les sections du contenu ─────
function extractSections(content: string): { title: string; rows: string[][] }[] {
  const sections: { title: string; rows: string[][] }[] = [];
  let current: { title: string; rows: string[][] } | null = null;

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("# ") || trimmed.startsWith("## ")) {
      if (current) sections.push(current);
      current = { title: trimmed.replace(/^#+\s/, ""), rows: [] };
    } else if (current) {
      // Cherche des lignes tableau (séparées par |)
      if (trimmed.includes("|")) {
        const cols = trimmed.split("|").map(c => c.trim()).filter(Boolean);
        if (cols.length > 0 && !cols.every(c => c.match(/^[-:]+$/))) {
          current.rows.push(cols);
        }
      } else if (trimmed.startsWith("- ")) {
        current.rows.push([trimmed.slice(2)]);
      } else {
        current.rows.push([trimmed]);
      }
    }
  }

  if (current) sections.push(current);
  return sections;
}

// ─── Export ──────────────────────────────────────────────
export async function generateXlsx(params: {
  content:     string;
  title:       string;
  serviceName: string;
}): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator  = "Scrivia";
  wb.created  = new Date();
  wb.title    = params.title;

  const generatedAt = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  // ── Feuille principale ────────────────────────────────
  const ws = wb.addWorksheet(params.serviceName.slice(0, 31), {
    properties: { tabColor: { argb: "FF" + GOLD_BG } },
    pageSetup:  { paperSize: 9, orientation: "portrait", fitToPage: true },
    views:      [{ showGridLines: true }],
  });

  // Colonnes par défaut
  ws.columns = [
    { width: 40 },
    { width: 25 },
    { width: 20 },
    { width: 15 },
    { width: 15 },
  ];

  // En-tête Scrivia
  ws.mergeCells("A1:E1");
  const titleCell = ws.getCell("A1");
  titleCell.value  = `SCRIVIA · ${params.title}`;
  titleCell.style  = {
    font: { bold: true, size: 16, color: { argb: "FF" + DARK_BG }, name: "Garamond" },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + GOLD_BG } },
    alignment: { vertical: "middle", horizontal: "center" },
  };
  ws.getRow(1).height = 36;

  ws.mergeCells("A2:E2");
  const metaCell = ws.getCell("A2");
  metaCell.value = `${params.serviceName}  ·  Généré le ${generatedAt}  ·  scrivia.app`;
  metaCell.style = {
    font: { size: 9, color: { argb: "FF" + MUTED }, italic: true },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + DARK_BG } },
    alignment: { vertical: "middle", horizontal: "center" },
  };
  ws.getRow(2).height = 20;

  // Espace
  ws.addRow([]);

  // Sections parsées
  const sections = extractSections(params.content);

  if (sections.length === 0) {
    // Fallback : dump brut du contenu
    const lines = params.content.split("\n").filter(l => l.trim());
    for (const [i, line] of lines.entries()) {
      const row = ws.addRow([line]);
      row.getCell(1).style = i % 2 === 0 ? rowEvenStyle : rowOddStyle;
    }
  } else {
    for (const section of sections) {
      // Titre de section
      ws.mergeCells(`A${ws.rowCount + 1}:E${ws.rowCount + 1}`);
      const sectionRow = ws.addRow([section.title]);
      sectionRow.getCell(1).style = goldHeaderStyle;
      sectionRow.height = 28;

      // Lignes
      for (const [i, rowData] of section.rows.entries()) {
        const r = ws.addRow(rowData);
        const style = i % 2 === 0 ? rowEvenStyle : rowOddStyle;
        r.eachCell(cell => { cell.style = style; });
        r.height = 20;
      }

      ws.addRow([]); // espace entre sections
    }
  }

  // Freeze header
  ws.views = [{ state: "frozen", xSplit: 0, ySplit: 3 }];

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
