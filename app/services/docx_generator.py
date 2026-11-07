import io
import re
from datetime import datetime
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml

# Couleurs de la charte Scrivia Prestige
HEX_OBSIDIAN = "07070F"
HEX_GOLD = "C8A96E"
HEX_WARM_BRONZE = "A07840"
HEX_IVORY = "FAF8F4"
HEX_BORDER = "E8DFD0"
HEX_TEXT = "1A1A1A"
HEX_MUTED = "64748B"

RGB_OBSIDIAN = RGBColor(0x07, 0x07, 0x0F)
RGB_GOLD = RGBColor(0xC8, 0xA9, 0x6E)
RGB_WARM_BRONZE = RGBColor(0xA0, 0x78, 0x40)
RGB_TEXT = RGBColor(0x1A, 0x1A, 0x1A)
RGB_MUTED = RGBColor(0x64, 0x74, 0x8B)


def set_cell_background(cell, fill_hex: str):
    """Applique une couleur d'arrière-plan hexadécimale à une cellule Word."""
    shading_xml = f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>'
    cell._tc.get_or_add_tcPr().append(parse_xml(shading_xml))


def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
    """Définit le rembourrage interne (padding) en dxa d'une cellule."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for margin_name, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{margin_name}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)


def add_xml_field(run, field_name: str):
    """Ajoute un champ dynamique Word (ex: PAGE ou NUMPAGES)."""
    fldChar1 = parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls('w'))
    instrText = parse_xml(r'<w:instrText %s xml:space="preserve"> %s </w:instrText>' % (nsdecls('w'), field_name))
    fldChar2 = parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls('w'))
    fldChar3 = parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls('w'))
    run._r.append(fldChar1)
    run._r.append(instrText)
    run._r.append(fldChar2)
    run._r.append(fldChar3)


def parse_markdown_runs_into_paragraph(paragraph, text: str, base_color: RGBColor = RGB_TEXT):
    """
    Découpe une chaîne contenant du gras (**...**) ou de l'italique (*...*)
    et insère les runs typographiés de façon fluide dans le paragraphe Word.
    """
    # Tokenizer pour **gras**, *italique*, et `code`
    tokens = re.split(r'(\*\*.*?\*\*|\*.*?\*|`.*?`)', text)
    for token in tokens:
        if not token:
            continue
        if token.startswith("**") and token.endswith("**") and len(token) >= 4:
            run = paragraph.add_run(token[2:-2])
            run.bold = True
            run.font.color.rgb = base_color
        elif token.startswith("*") and token.endswith("*") and len(token) >= 2:
            run = paragraph.add_run(token[1:-1])
            run.italic = True
            run.font.color.rgb = base_color
        elif token.startswith("`") and token.endswith("`") and len(token) >= 2:
            run = paragraph.add_run(token[1:-1])
            run.font.name = "Consolas"
            run.font.color.rgb = RGB_WARM_BRONZE
        else:
            run = paragraph.add_run(token)
            run.font.color.rgb = base_color


def generate_docx(content: str, title: str, metadata: dict = None) -> io.BytesIO:
    """
    Génère un document Word (.docx) haute résolution avec mise en page exécutive Scrivia Prestige.
    """
    doc = docx.Document()

    # --- Marges de page (1 pouce / 2.54 cm standard international) ---
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

        # En-tête
        header = section.header
        header_p = header.paragraphs[0]
        header_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        h_run = header_p.add_run("SCRIVIA — Document Professionnel Certifié")
        h_run.font.name = "Calibri"
        h_run.font.size = Pt(8.5)
        h_run.font.color.rgb = RGB_MUTED

        # Pied de page avec pagination dynamique (Page X sur Y)
        footer = section.footer
        footer_p = footer.paragraphs[0]
        footer_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        f_left = footer_p.add_run("Confidentiel • Rédigé via Scrivia Intelligence Artificielle            Page ")
        f_left.font.name = "Calibri"
        f_left.font.size = Pt(8.5)
        f_left.font.color.rgb = RGB_MUTED

        page_run = footer_p.add_run()
        page_run.font.name = "Calibri"
        page_run.font.size = Pt(8.5)
        page_run.font.bold = True
        page_run.font.color.rgb = RGB_WARM_BRONZE
        add_xml_field(page_run, "PAGE")

        mid_run = footer_p.add_run(" sur ")
        mid_run.font.name = "Calibri"
        mid_run.font.size = Pt(8.5)
        mid_run.font.color.rgb = RGB_MUTED

        total_run = footer_p.add_run()
        total_run.font.name = "Calibri"
        total_run.font.size = Pt(8.5)
        total_run.font.bold = True
        total_run.font.color.rgb = RGB_WARM_BRONZE
        add_xml_field(total_run, "NUMPAGES")

    # Style par défaut
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(10.5)
    normal_style.paragraph_format.line_spacing = 1.2
    normal_style.paragraph_format.space_after = Pt(6)

    # --- 1. Badge d'authenticité Scrivia ---
    badge_p = doc.add_paragraph()
    badge_p.paragraph_format.space_after = Pt(4)
    b_run = badge_p.add_run("• SCRIVIA INTELLIGENCE — ÉDITION OFFICIELLE CERTIFIÉE")
    b_run.font.name = "Calibri"
    b_run.font.size = Pt(8.5)
    b_run.font.bold = True
    b_run.font.color.rgb = RGB_WARM_BRONZE

    # --- 2. Titre principal ---
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_after = Pt(12)
    t_run = title_p.add_run(title)
    t_run.font.name = 'Georgia'
    t_run.font.size = Pt(22)
    t_run.font.bold = True
    t_run.font.color.rgb = RGB_OBSIDIAN

    # --- 3. Cartouche de métadonnées exécutives ---
    now_str = datetime.now().strftime("%d/%m/%Y à %H:%M")
    doc_id = (metadata or {}).get("doc_id", "SCR-" + datetime.now().strftime("%Y%m%d%H%M"))
    lang_str = (metadata or {}).get("language", "Français (Standard OHADA / International)").title()

    meta_table = doc.add_table(rows=2, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False

    meta_rows_content = [
        [("RÉFÉRENCE OFFICIELLE :", f" {doc_id}"), ("DATE D'ÉMISSION :", f" {now_str}")],
        [("CONFORMITÉ :", f" {lang_str}"), ("STATUT :", " Certifié conforme & Prêt à l'usage")]
    ]

    for row_idx, row_data in enumerate(meta_rows_content):
        for col_idx, (k, v) in enumerate(row_data):
            cell = meta_table.cell(row_idx, col_idx)
            cell.width = Inches(3.25)
            set_cell_background(cell, HEX_IVORY)
            set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(2)
            k_run = p.add_run(k)
            k_run.font.name = 'Calibri'
            k_run.font.size = Pt(8.5)
            k_run.font.bold = True
            k_run.font.color.rgb = RGB_WARM_BRONZE

            v_run = p.add_run(v)
            v_run.font.name = 'Calibri'
            v_run.font.size = Pt(8.5)
            v_run.font.color.rgb = RGB_OBSIDIAN

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # --- 4. Traitement des lignes de contenu Markdown ---
    lines = content.split('\n')
    i = 0
    total_lines = len(lines)

    while i < total_lines:
        raw_line = lines[i]
        line = raw_line.strip()

        if not line:
            i += 1
            continue

        # Ignorer le titre h1 s'il répète le titre principal
        if line.startswith("# ") and line[2:].strip().lower() == title.lower():
            i += 1
            continue

        if line.startswith("# "):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(6)
            run = p.add_run(line[2:].strip())
            run.font.name = 'Georgia'
            run.font.size = Pt(14)
            run.font.bold = True
            run.font.color.rgb = RGB_WARM_BRONZE
            i += 1
            continue

        if line.startswith("## "):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(4)
            run = p.add_run(line[3:].strip())
            run.font.name = 'Georgia'
            run.font.size = Pt(12)
            run.font.bold = True
            run.font.color.rgb = RGB_OBSIDIAN
            i += 1
            continue

        if line.startswith("### ") or line.startswith("#### "):
            clean_t = re.sub(r'^#+\s*', '', line)
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(2)
            run = p.add_run(clean_t)
            run.font.name = 'Calibri'
            run.font.size = Pt(11)
            run.font.bold = True
            run.font.color.rgb = RGB_TEXT
            i += 1
            continue

        if line.startswith("> "):
            # Encadré callout
            q_table = doc.add_table(rows=1, cols=1)
            q_table.alignment = WD_TABLE_ALIGNMENT.CENTER
            cell = q_table.cell(0, 0)
            cell.width = Inches(6.5)
            set_cell_background(cell, HEX_IVORY)
            set_cell_margins(cell, top=100, bottom=100, left=150, right=150)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            parse_markdown_runs_into_paragraph(p, line[2:].strip(), base_color=RGB_MUTED)
            p.runs[0].font.italic = True if p.runs else False
            doc.add_paragraph().paragraph_format.space_after = Pt(4)
            i += 1
            continue

        if line.startswith("- ") or line.startswith("* "):
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_after = Pt(3)
            parse_markdown_runs_into_paragraph(p, line[2:].strip())
            i += 1
            continue

        if re.match(r'^\d+\.\s', line):
            p = doc.add_paragraph(style='List Number')
            p.paragraph_format.space_after = Pt(3)
            item_text = re.sub(r'^\d+\.\s', '', line)
            parse_markdown_runs_into_paragraph(p, item_text)
            i += 1
            continue

        if line.startswith("|") and line.endswith("|"):
            table_lines = []
            while i < total_lines and lines[i].strip().startswith("|") and lines[i].strip().endswith("|"):
                table_lines.append(lines[i].strip())
                i += 1

            raw_rows = []
            for r in table_lines:
                cells = [c.strip() for c in r.split("|")[1:-1]]
                if not all(set(c).issubset({'-', ':', ' '}) for c in cells if c):
                    raw_rows.append(cells)

            if raw_rows:
                num_cols = max(len(r) for r in raw_rows)
                normalized_rows = [r + [""] * (num_cols - len(r)) for r in raw_rows]

                table = doc.add_table(rows=len(normalized_rows), cols=num_cols)
                table.alignment = WD_TABLE_ALIGNMENT.CENTER
                table.style = 'Table Grid'

                col_w = Inches(6.5 / num_cols)

                for row_idx, row_data in enumerate(normalized_rows):
                    for col_idx, cell_value in enumerate(row_data):
                        cell = table.cell(row_idx, col_idx)
                        cell.width = col_w
                        set_cell_margins(cell, top=80, bottom=80, left=100, right=100)

                        p = cell.paragraphs[0]
                        p.paragraph_format.space_after = Pt(2)

                        if row_idx == 0:
                            set_cell_background(cell, HEX_OBSIDIAN)
                            run = p.add_run(cell_value)
                            run.font.name = 'Calibri'
                            run.font.size = Pt(9.5)
                            run.font.bold = True
                            run.font.color.rgb = RGB_GOLD
                        else:
                            bg = HEX_IVORY if row_idx % 2 == 1 else "FFFFFF"
                            set_cell_background(cell, bg)
                            parse_markdown_runs_into_paragraph(p, cell_value)
                            for r in p.runs:
                                r.font.name = 'Calibri'
                                r.font.size = Pt(9)

                doc.add_paragraph().paragraph_format.space_after = Pt(6)
            continue

        # Paragraphe régulier
        p = doc.add_paragraph()
        parse_markdown_runs_into_paragraph(p, line)
        i += 1

    buffer = io.BytesIO()
    doc.save(buffer)
    buffer.seek(0)
    return buffer
