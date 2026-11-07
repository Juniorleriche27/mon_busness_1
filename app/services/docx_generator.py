import io
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn


def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)


def generate_docx(content: str, title: str) -> io.BytesIO:
    doc = docx.Document()

    # Style global
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(0x1A, 0x1A, 0x1A)

    # Titre principal
    title_p = doc.add_paragraph()
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_run = title_p.add_run(title)
    title_run.font.name = 'Georgia'
    title_run.font.size = Pt(24)
    title_run.font.bold = True
    title_run.font.color.rgb = RGBColor(0xC8, 0xA9, 0x6E)  # Gold Scrivia

    doc.add_paragraph()  # Espace

    lines = content.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue

        if line.startswith("# "):
            h = doc.add_heading(line[2:].strip(), level=1)
            h.style.font.color.rgb = RGBColor(0xC8, 0xA9, 0x6E)
        elif line.startswith("## "):
            h = doc.add_heading(line[3:].strip(), level=2)
            h.style.font.color.rgb = RGBColor(0x07, 0x07, 0x0F)
        elif line.startswith("### "):
            h = doc.add_heading(line[4:].strip(), level=3)
        elif line.startswith("- ") or line.startswith("* "):
            doc.add_paragraph(line[2:].strip(), style='List Bullet')
        elif line.startswith("|") and line.endswith("|"):
            # Table Markdown
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i].strip())
                i += 1
            i -= 1  # Revenir d'un cran

            # Filtrer les séparateurs (|---|---|)
            parsed_rows = [
                [c.strip() for c in r.split("|")[1:-1]]
                for r in table_lines if not set(r.replace("|", "").strip()).issubset({"-", ":", " "})
            ]
            if parsed_rows:
                num_cols = max(len(r) for r in parsed_rows)
                table = doc.add_table(rows=len(parsed_rows), cols=num_cols)
                table.style = 'Light Shading'
                for row_idx, row_data in enumerate(parsed_rows):
                    for col_idx, cell_value in enumerate(row_data):
                        if col_idx < num_cols:
                            cell = table.cell(row_idx, col_idx)
                            cell.text = cell_value
                            if row_idx == 0:
                                set_cell_background(cell, "C8A96E")
                                for p in cell.paragraphs:
                                    for r in p.runs:
                                        r.font.bold = True
                                        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        else:
            doc.add_paragraph(line)
        i += 1

    buffer = io.BytesIO()
    doc.save(buffer)
    buffer.seek(0)
    return buffer
