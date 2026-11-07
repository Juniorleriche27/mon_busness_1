import io
import re
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas

# Palette Scrivia Prestige
COLOR_OBSIDIAN = colors.HexColor("#07070F")
COLOR_GOLD = colors.HexColor("#C8A96E")
COLOR_WARM_BRONZE = colors.HexColor("#A07840")
COLOR_IVORY = colors.HexColor("#FAF8F4")
COLOR_CARD_BG = colors.HexColor("#FDFCF9")
COLOR_BORDER = colors.HexColor("#E8DFD0")
COLOR_TEXT = colors.HexColor("#1A1A1A")
COLOR_MUTED = colors.HexColor("#64748B")


class NumberedCanvas(canvas.Canvas):
    """
    Canvas personnalisé à deux passes pour numéroter dynamiquement les pages (Page X sur Y)
    et ajouter un en-tête et un pied de page prestigieux Scrivia.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count: int):
        self.saveState()
        page_width, page_height = letter
        margin = 46

        # En-tête (à partir de la page 2)
        if self._pageNumber > 1:
            self.setStrokeColor(COLOR_BORDER)
            self.setLineWidth(0.6)
            self.line(margin, page_height - 40, page_width - margin, page_height - 40)

            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(COLOR_WARM_BRONZE)
            self.drawString(margin, page_height - 34, "SCRIVIA")

            self.setFont("Helvetica", 8)
            self.setFillColor(COLOR_MUTED)
            self.drawString(margin + 44, page_height - 34, "— Document Professionnel Certifié")

            self.setFont("Helvetica", 7.5)
            self.drawRightString(page_width - margin, page_height - 34, "scrivia.com")

        # Pied de page (sur toutes les pages)
        self.setStrokeColor(COLOR_BORDER)
        self.setLineWidth(0.6)
        self.line(margin, 42, page_width - margin, 42)

        # Pied gauche
        self.setFont("Helvetica", 7.5)
        self.setFillColor(COLOR_MUTED)
        self.drawString(margin, 30, "Document certifié conforme • Rédigé via Scrivia Intelligence Artificielle")

        # Pied droit : Numérotation élégante
        page_str = f"Page {self._pageNumber} sur {page_count}"
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(COLOR_WARM_BRONZE)
        self.drawRightString(page_width - margin, 30, page_str)

        self.restoreState()


def _format_markdown_inline(text: str) -> str:
    """
    Échappe les caractères XML et transforme la syntaxe Markdown en balises ReportLab supportées.
    """
    if not text:
        return ""
    
    # 1. Échappement XML
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    # 2. Markdown gras **text** ou __text__
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'__(.+?)__', r'<b>\1</b>', text)

    # 3. Markdown italique *text* ou _text_
    text = re.sub(r'\*(.+?)\*', r'<i>\1</i>', text)
    text = re.sub(r'_(.+?)_', r'<i>\1</i>', text)

    # 4. Code inline `code`
    text = re.sub(r'`(.+?)`', r'<font name="Courier" color="#A07840">\1</font>', text)

    return text


def generate_pdf(content: str, title: str, metadata: dict = None) -> io.BytesIO:
    """
    Génère un document PDF haute résolution au design Scrivia Prestige.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=46,
        leftMargin=46,
        topMargin=52,
        bottomMargin=52
    )

    styles = getSampleStyleSheet()

    # --- Typographie Scrivia ---
    title_style = ParagraphStyle(
        'ScriviaTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=COLOR_OBSIDIAN,
        spaceBefore=0,
        spaceAfter=12
    )

    badge_style = ParagraphStyle(
        'ScriviaBadge',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=COLOR_WARM_BRONZE,
        alignment=TA_LEFT,
        spaceAfter=6
    )

    h1_style = ParagraphStyle(
        'ScriviaH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=COLOR_WARM_BRONZE,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'ScriviaH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=COLOR_OBSIDIAN,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'ScriviaBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=COLOR_TEXT,
        alignment=TA_JUSTIFY,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'ScriviaBullet',
        parent=body_style,
        leftIndent=14,
        firstLineIndent=-10,
        alignment=TA_LEFT,
        spaceAfter=4
    )

    quote_style = ParagraphStyle(
        'ScriviaQuote',
        parent=body_style,
        fontName='Helvetica-Oblique',
        textColor=COLOR_MUTED,
        leftIndent=12,
        spaceBefore=6,
        spaceAfter=6
    )

    table_cell_style = ParagraphStyle(
        'ScriviaTableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=COLOR_TEXT
    )

    table_header_style = ParagraphStyle(
        'ScriviaTableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=COLOR_GOLD
    )

    meta_key_style = ParagraphStyle(
        'ScriviaMetaKey',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=COLOR_WARM_BRONZE
    )

    meta_val_style = ParagraphStyle(
        'ScriviaMetaVal',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=COLOR_OBSIDIAN
    )

    story = []

    # --- 1. En-tête / Badge officiel Scrivia ---
    story.append(Paragraph("• SCRIVIA INTELLIGENCE — ÉDITION OFFICIELLE CERTIFIÉE", badge_style))
    story.append(Paragraph(title, title_style))
    
    # Ligne décorative dorée
    story.append(HRFlowable(
        width="100%",
        thickness=1.5,
        color=COLOR_GOLD,
        spaceBefore=2,
        spaceAfter=10
    ))

    # --- 2. Cartouche de métadonnées exécutives ---
    now_str = datetime.now().strftime("%d/%m/%Y à %H:%M")
    doc_id = (metadata or {}).get("doc_id", "SCR-" + datetime.now().strftime("%Y%m%d%H%M"))
    lang_str = (metadata or {}).get("language", "Français (Standard OHADA / International)").upper()

    meta_data = [
        [
            Paragraph("RÉFÉRENCE OFFICIELLE", meta_key_style),
            Paragraph(f"<b>{doc_id}</b>", meta_val_style),
            Paragraph("DATE DE DÉLIVRANCE", meta_key_style),
            Paragraph(now_str, meta_val_style),
        ],
        [
            Paragraph("CONFORMITÉ & CADRE", meta_key_style),
            Paragraph(lang_str, meta_val_style),
            Paragraph("AUTHENTICITÉ", meta_key_style),
            Paragraph("Document généré & vérifié", meta_val_style),
        ]
    ]

    meta_table = Table(meta_data, colWidths=[120, 140, 120, 140])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), COLOR_IVORY),
        ('BOX', (0, 0), (-1, -1), 0.8, COLOR_BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.4, COLOR_BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))

    story.append(meta_table)
    story.append(Spacer(1, 14))

    # --- 3. Parsing et structuration du contenu Markdown ---
    lines = content.split('\n')
    i = 0
    total_lines = len(lines)

    while i < total_lines:
        raw_line = lines[i]
        line = raw_line.strip()

        if not line:
            i += 1
            continue

        # Sauter le premier titre Markdown s'il est identique au titre principal déjà imprimé
        if line.startswith("# ") and line[2:].strip().lower() == title.lower():
            i += 1
            continue

        # Titres de niveau 1
        if line.startswith("# "):
            text = _format_markdown_inline(line[2:].strip())
            story.append(Paragraph(text, h1_style))
            story.append(HRFlowable(width="100%", thickness=0.5, color=COLOR_BORDER, spaceBefore=1, spaceAfter=6))
            i += 1
            continue

        # Titres de niveau 2
        if line.startswith("## "):
            text = _format_markdown_inline(line[3:].strip())
            story.append(Paragraph(text, h2_style))
            i += 1
            continue

        # Titres de niveau 3 ou 4
        if line.startswith("### ") or line.startswith("#### "):
            clean_t = re.sub(r'^#+\s*', '', line)
            text = _format_markdown_inline(clean_t)
            story.append(Paragraph(f"<b>{text}</b>", body_style))
            i += 1
            continue

        # Citation / Callout block
        if line.startswith("> "):
            quote_text = _format_markdown_inline(line[2:].strip())
            # Créer un bloc stylisé
            q_table = Table([[Paragraph(quote_text, quote_style)]], colWidths=[520])
            q_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), COLOR_CARD_BG),
                ('LINEBEFORE', (0, 0), (0, -1), 2.5, COLOR_GOLD),
                ('BOX', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('LEFTPADDING', (0, 0), (-1, -1), 10),
                ('RIGHTPADDING', (0, 0), (-1, -1), 10),
            ]))
            story.append(q_table)
            story.append(Spacer(1, 6))
            i += 1
            continue

        # Puces
        if line.startswith("- ") or line.startswith("* ") or re.match(r'^\d+\.\s', line):
            if re.match(r'^\d+\.\s', line):
                bullet_prefix = re.match(r'^(\d+\.)\s', line).group(1)
                item_content = re.sub(r'^\d+\.\s', '', line)
                formatted = f"<font color='#A07840'><b>{bullet_prefix}</b></font> {_format_markdown_inline(item_content)}"
            else:
                item_content = line[2:].strip()
                formatted = f"<font color='#C8A96E'>&bull;</font> {_format_markdown_inline(item_content)}"
            story.append(Paragraph(formatted, bullet_style))
            i += 1
            continue

        # Tableaux Markdown
        if line.startswith("|") and line.endswith("|"):
            table_lines = []
            while i < total_lines and lines[i].strip().startswith("|") and lines[i].strip().endswith("|"):
                table_lines.append(lines[i].strip())
                i += 1

            # Filtrer les séparateurs (|---|---|)
            raw_rows = []
            for r in table_lines:
                cells = [c.strip() for c in r.split("|")[1:-1]]
                # Ignorer la ligne de tirets de séparation markdown
                if not all(set(c).issubset({'-', ':', ' '}) for c in cells if c):
                    raw_rows.append(cells)

            if raw_rows:
                num_cols = max(len(r) for r in raw_rows)
                # Normaliser la longueur des lignes
                normalized_rows = [r + [""] * (num_cols - len(r)) for r in raw_rows]

                table_content = []
                for row_idx, r in enumerate(normalized_rows):
                    row_cells = []
                    for c in r:
                        style_to_use = table_header_style if row_idx == 0 else table_cell_style
                        row_cells.append(Paragraph(_format_markdown_inline(c), style_to_use))
                    table_content.append(row_cells)

                # Calcul largeur de colonnes adaptée
                usable_width = 520
                col_width = usable_width / num_cols
                col_widths = [col_width] * num_cols

                t = Table(table_content, colWidths=col_widths)
                t_styles = [
                    ('BACKGROUND', (0, 0), (-1, 0), COLOR_OBSIDIAN),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('TOPPADDING', (0, 0), (-1, -1), 5),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
                    ('LEFTPADDING', (0, 0), (-1, -1), 6),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
                    ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
                    ('LINEBELOW', (0, 0), (-1, 0), 1.2, COLOR_GOLD),
                ]

                # Lignes zébrées pour les données
                for row_idx in range(1, len(table_content)):
                    bg = COLOR_IVORY if row_idx % 2 == 1 else colors.white
                    t_styles.append(('BACKGROUND', (0, row_idx), (-1, row_idx), bg))

                t.setStyle(TableStyle(t_styles))
                story.append(KeepTogether([t, Spacer(1, 8)]))
            continue

        # Paragraphe standard
        text = _format_markdown_inline(line)
        story.append(Paragraph(text, body_style))
        i += 1

    # Construction avec le canvas numéroté
    doc.build(story, canvasmaker=NumberedCanvas)
    buffer.seek(0)
    return buffer
