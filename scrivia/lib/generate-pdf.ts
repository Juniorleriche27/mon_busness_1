/**
 * Génération PDF via @react-pdf/renderer (côté serveur)
 * Template professionnel Scrivia — Page de couverture + pages contenu
 */

import { Document, Page, Text, View, StyleSheet, Font, renderToBuffer } from "@react-pdf/renderer";
import React from "react";

// ─── Palette ─────────────────────────────────────────────
const C = {
  gold:       "#c8a96e",
  goldLight:  "#e8c98a",
  dark:       "#07070f",
  darkCard:   "#0d0d1a",
  white:      "#ffffff",
  offWhite:   "#f9f7f3",
  text:       "#1a1a1a",
  muted:      "#9e9a8e",
  mutedDark:  "#6b6760",
  gray333:    "#333333",
};

// ─── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── Cover page ──
  coverPage: {
    backgroundColor: C.dark,
    padding: 0,
    position: "relative",
  },
  coverBrand: {
    position: "absolute",
    top: 36,
    left: 48,
    fontSize: 9,
    color: C.gold,
    letterSpacing: 3,
    fontFamily: "Helvetica-Bold",
  },
  coverCenter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 60,
  },
  coverDivider: {
    height: 1,
    backgroundColor: C.gold,
    width: "40%",
    marginBottom: 24,
    opacity: 0.7,
  },
  coverTitle: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    textAlign: "center",
    lineHeight: 1.25,
    marginBottom: 14,
  },
  coverService: {
    fontSize: 13,
    color: C.gold,
    textAlign: "center",
    letterSpacing: 1,
  },
  coverBottom: {
    position: "absolute",
    bottom: 60,
    left: 48,
    right: 48,
    backgroundColor: C.darkCard,
    borderRadius: 4,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coverBottomLabel: {
    fontSize: 8,
    color: C.muted,
    marginBottom: 3,
  },
  coverBottomValue: {
    fontSize: 10,
    color: C.white,
    fontFamily: "Helvetica-Bold",
  },
  coverFooter: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  coverFooterText: {
    fontSize: 7,
    color: C.mutedDark,
    letterSpacing: 1,
  },

  // ── Content page ──
  contentPage: {
    backgroundColor: C.white,
    paddingTop: 56,
    paddingBottom: 48,
    paddingHorizontal: 54,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: C.text,
  },
  pageHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 14,
    paddingBottom: 10,
    paddingHorizontal: 54,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: C.gold,
    backgroundColor: C.white,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.gold,
    marginRight: 6,
  },
  headerBrand: {
    fontSize: 8,
    color: C.gold,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 9,
    color: C.dark,
    fontFamily: "Helvetica-Bold",
  },
  headerService: {
    fontSize: 8,
    color: C.muted,
  },
  pageFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 12,
    paddingTop: 8,
    paddingHorizontal: 54,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: C.gold,
    backgroundColor: C.white,
  },
  footerLeft: {
    fontSize: 7,
    color: C.muted,
  },
  footerRight: {
    fontSize: 7,
    color: C.muted,
  },

  // ── Content typography ──
  h1: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: C.gold,
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: C.gold,
  },
  h2: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: C.dark,
    marginTop: 12,
    marginBottom: 6,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: C.gold,
  },
  h3: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: C.gray333,
    marginTop: 8,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 11,
    color: C.text,
    lineHeight: 1.65,
    marginBottom: 6,
    textAlign: "justify",
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 14,
    fontSize: 10,
    color: C.gold,
    paddingTop: 1,
  },
  bulletText: {
    flex: 1,
    fontSize: 11,
    color: C.text,
    lineHeight: 1.5,
  },
  numbered: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },
  numberedNum: {
    width: 18,
    fontSize: 11,
    color: C.gold,
    fontFamily: "Helvetica-Bold",
  },
  numberedText: {
    flex: 1,
    fontSize: 11,
    color: C.text,
    lineHeight: 1.5,
  },
  separator: {
    height: 1,
    backgroundColor: C.gold,
    marginTop: 12,
    marginBottom: 12,
    opacity: 0.5,
  },

  // ── Table ──
  table: {
    marginTop: 8,
    marginBottom: 8,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: C.gold,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableRowAlt: {
    flexDirection: "row",
    backgroundColor: C.offWhite,
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 9,
    color: C.text,
    borderRightWidth: 0.5,
    borderRightColor: "#e0e0e0",
  },
  tableCellHeader: {
    flex: 1,
    padding: 5,
    fontSize: 9,
    color: C.white,
    fontFamily: "Helvetica-Bold",
    borderRightWidth: 0.5,
    borderRightColor: "rgba(255,255,255,0.3)",
  },
});

// ─── Inline bold parser ───────────────────────────────────
function parseInlineBold(text: string): React.ReactElement[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return React.createElement(Text, { key: i, style: { fontFamily: "Helvetica-Bold" } }, part.slice(2, -2));
    }
    return React.createElement(Text, { key: i }, part);
  });
}

// ─── Table parser ────────────────────────────────────────
function parseTable(lines: string[], key: number): React.ReactElement {
  const rows = lines.filter(l => l.trim().startsWith("|") && !l.match(/^\|[\s\-|]+\|$/));
  const cells = rows.map(r =>
    r.trim().split("|").filter((_, i, a) => i > 0 && i < a.length - 1).map(c => c.trim())
  );

  return React.createElement(
    View,
    { style: styles.table, key },
    ...cells.map((cols, ri) => {
      const isHeader = ri === 0;
      const rowStyle = isHeader ? styles.tableHeaderRow : ri % 2 === 0 ? styles.tableRow : styles.tableRowAlt;
      const cellStyle = isHeader ? styles.tableCellHeader : styles.tableCell;
      return React.createElement(
        View,
        { style: rowStyle, key: ri },
        ...cols.map((col, ci) =>
          React.createElement(Text, { style: cellStyle, key: ci }, col)
        )
      );
    })
  );
}

// ─── Content parser ──────────────────────────────────────
function parseContent(content: string): React.ReactElement[] {
  const lines = content.split("\n");
  const elements: React.ReactElement[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) { i++; key++; continue; }

    // Table — collect contiguous table lines
    if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(parseTable(tableLines, key++));
      continue;
    }

    // Separator
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      elements.push(React.createElement(View, { style: styles.separator, key: key++ }));
      i++; continue;
    }

    // H1
    if (trimmed.startsWith("# ")) {
      elements.push(
        React.createElement(Text, { style: styles.h1, key: key++ }, trimmed.slice(2).replace(/\*\*/g, ""))
      );
      i++; continue;
    }

    // H2
    if (trimmed.startsWith("## ")) {
      elements.push(
        React.createElement(Text, { style: styles.h2, key: key++ }, trimmed.slice(3).replace(/\*\*/g, ""))
      );
      i++; continue;
    }

    // H3
    if (trimmed.startsWith("### ")) {
      elements.push(
        React.createElement(Text, { style: styles.h3, key: key++ }, trimmed.slice(4).replace(/\*\*/g, ""))
      );
      i++; continue;
    }

    // Bullet
    if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      const text = trimmed.slice(2);
      elements.push(
        React.createElement(View, { style: styles.bullet, key: key++ },
          React.createElement(Text, { style: styles.bulletDot }, "▸"),
          React.createElement(Text, { style: styles.bulletText }, ...parseInlineBold(text))
        )
      );
      i++; continue;
    }

    // Numbered list (1. 2. etc.)
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      elements.push(
        React.createElement(View, { style: styles.numbered, key: key++ },
          React.createElement(Text, { style: styles.numberedNum }, numberedMatch[1] + "."),
          React.createElement(Text, { style: styles.numberedText }, ...parseInlineBold(numberedMatch[2]))
        )
      );
      i++; continue;
    }

    // Paragraph (with inline bold)
    elements.push(
      React.createElement(Text, { style: styles.paragraph, key: key++ },
        ...parseInlineBold(trimmed)
      )
    );
    i++;
  }

  return elements;
}

// ─── Cover Page ──────────────────────────────────────────
function CoverPage({ title, serviceName, generatedAt }: { title: string; serviceName: string; generatedAt: string }) {
  return React.createElement(
    Page,
    { size: "A4", style: styles.coverPage },
    // Brand top-left
    React.createElement(Text, { style: styles.coverBrand }, "SCRIVIA"),
    // Center content
    React.createElement(
      View,
      { style: styles.coverCenter },
      React.createElement(View, { style: styles.coverDivider }),
      React.createElement(Text, { style: styles.coverTitle }, title),
      React.createElement(Text, { style: styles.coverService }, serviceName),
    ),
    // Bottom info card
    React.createElement(
      View,
      { style: styles.coverBottom },
      React.createElement(
        View,
        null,
        React.createElement(Text, { style: styles.coverBottomLabel }, "Généré par Scrivia IA"),
        React.createElement(Text, { style: styles.coverBottomValue }, "scrivia.app")
      ),
      React.createElement(
        View,
        { style: { alignItems: "flex-end" } },
        React.createElement(Text, { style: styles.coverBottomLabel }, "Date de génération"),
        React.createElement(Text, { style: styles.coverBottomValue }, generatedAt)
      )
    ),
    // Footer watermark
    React.createElement(
      View,
      { style: styles.coverFooter },
      React.createElement(Text, { style: styles.coverFooterText }, "scrivia.app")
    )
  );
}

// ─── Content Page ────────────────────────────────────────
function ContentPage({ content, title, serviceName }: { content: string; title: string; serviceName: string }) {
  return React.createElement(
    Page,
    { size: "A4", style: styles.contentPage },
    // Fixed header
    React.createElement(
      View,
      { style: styles.pageHeader, fixed: true },
      React.createElement(
        View,
        { style: styles.headerLeft },
        React.createElement(View, { style: styles.headerDot }),
        React.createElement(Text, { style: styles.headerBrand }, "SCRIVIA"),
        React.createElement(Text, { style: styles.headerTitle }, title),
      ),
      React.createElement(Text, { style: styles.headerService }, serviceName)
    ),
    // Content
    React.createElement(View, { style: { paddingTop: 10 } }, ...parseContent(content)),
    // Fixed footer
    React.createElement(
      View,
      { style: styles.pageFooter, fixed: true },
      React.createElement(Text, { style: styles.footerLeft }, "scrivia.app · Documents IA professionnels"),
      React.createElement(
        Text,
        {
          style: styles.footerRight,
          render: ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
            `Page ${pageNumber} / ${totalPages}`,
        }
      )
    )
  );
}

// ─── Main Document ───────────────────────────────────────
function ScriviaDocument({
  content,
  title,
  serviceName,
  generatedAt,
}: {
  content: string;
  title: string;
  serviceName: string;
  generatedAt: string;
}) {
  return React.createElement(
    Document,
    { title, author: "Scrivia" },
    React.createElement(CoverPage, { title, serviceName, generatedAt }),
    React.createElement(ContentPage, { content, title, serviceName })
  );
}

// ─── Export ──────────────────────────────────────────────
export async function generatePdf(params: {
  content:     string;
  title:       string;
  serviceName: string;
}): Promise<Buffer> {
  const generatedAt = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  const doc = React.createElement(ScriviaDocument, {
    content:     params.content,
    title:       params.title,
    serviceName: params.serviceName,
    generatedAt,
  });

  const buffer = await renderToBuffer(doc as any);
  return Buffer.from(buffer);
}
