/**
 * Génération PDF via @react-pdf/renderer (côté serveur)
 * Reçoit le contenu texte généré par Claude et produit un Buffer PDF
 */

import { Document, Page, Text, View, StyleSheet, Font, renderToBuffer } from "@react-pdf/renderer";
import React from "react";

// ─── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 60,
    backgroundColor: "#ffffff",
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#c8a96e",
    paddingBottom: 10,
  },
  brand: {
    fontSize: 10,
    color: "#c8a96e",
    marginBottom: 4,
    letterSpacing: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#07070f",
    marginBottom: 2,
  },
  meta: {
    fontSize: 9,
    color: "#6b6760",
  },
  content: {
    flex: 1,
  },
  paragraph: {
    marginBottom: 8,
    lineHeight: 1.6,
  },
  h1: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#07070f",
    borderBottomWidth: 1,
    borderBottomColor: "#e8c98a",
    paddingBottom: 4,
  },
  h2: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginTop: 12,
    marginBottom: 6,
    color: "#1a1a1a",
  },
  h3: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginTop: 8,
    marginBottom: 4,
    color: "#333",
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bulletDot: {
    width: 12,
    fontSize: 11,
    color: "#c8a96e",
  },
  bulletText: {
    flex: 1,
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 60,
    right: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e8e8e8",
    paddingTop: 6,
  },
  footerText: {
    fontSize: 8,
    color: "#9e9a8e",
  },
  pageNumber: {
    fontSize: 8,
    color: "#9e9a8e",
  },
});

// ─── Parser markdown simplifié ───────────────────────────
function parseContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactElement[] = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) { key++; continue; }

    if (trimmed.startsWith("# ")) {
      elements.push(
        React.createElement(Text, { style: styles.h1, key: key++ }, trimmed.slice(2))
      );
    } else if (trimmed.startsWith("## ")) {
      elements.push(
        React.createElement(Text, { style: styles.h2, key: key++ }, trimmed.slice(3))
      );
    } else if (trimmed.startsWith("### ")) {
      elements.push(
        React.createElement(Text, { style: styles.h3, key: key++ }, trimmed.slice(4))
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      elements.push(
        React.createElement(View, { style: styles.bullet, key: key++ },
          React.createElement(Text, { style: styles.bulletDot }, "•"),
          React.createElement(Text, { style: styles.bulletText }, trimmed.slice(2))
        )
      );
    } else {
      elements.push(
        React.createElement(Text, { style: styles.paragraph, key: key++ }, trimmed)
      );
    }
  }

  return elements;
}

// ─── Composant Document ──────────────────────────────────
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
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.brand }, "SCRIVIA"),
        React.createElement(Text, { style: styles.title }, title),
        React.createElement(Text, { style: styles.meta }, `${serviceName} · Généré le ${generatedAt}`)
      ),
      // Content
      React.createElement(View, { style: styles.content }, ...parseContent(content)),
      // Footer
      React.createElement(
        View,
        { style: styles.footer, fixed: true },
        React.createElement(Text, { style: styles.footerText }, "scrivia.app · Documents professionnels par IA"),
        React.createElement(
          Text,
          { style: styles.pageNumber, render: ({ pageNumber, totalPages }: any) => `${pageNumber} / ${totalPages}` }
        )
      )
    )
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
