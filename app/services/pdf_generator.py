import io
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle


def generate_pdf(content: str, title: str) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=50,
        leftMargin=50,
        topMargin=50,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()

    # Styles personnalisés Scrivia
    gold_color = colors.HexColor("#C8A96E")
    dark_color = colors.HexColor("#07070F")
    
    title_style = ParagraphStyle(
        'ScriviaTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=gold_color,
        alignment=1,  # Centré
        spaceAfter=20
    )
    
    h2_style = ParagraphStyle(
        'ScriviaH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=dark_color,
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'ScriviaBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#1A1A1A"),
        spaceAfter=6
    )

    story = [Paragraph(title, title_style), Spacer(1, 15)]

    lines = content.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue

        if line.startswith("# "):
            story.append(Paragraph(line[2:].strip(), title_style))
        elif line.startswith("## ") or line.startswith("### "):
            story.append(Paragraph(line.replace("#", "").strip(), h2_style))
        elif line.startswith("- ") or line.startswith("* "):
            story.append(Paragraph(f"&bull; {line[2:].strip()}", body_style))
        elif line.startswith("|") and line.endswith("|"):
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i].strip())
                i += 1
            i -= 1

            parsed_rows = [
                [Paragraph(c.strip(), body_style) for c in r.split("|")[1:-1]]
                for r in table_lines if not set(r.replace("|", "").strip()).issubset({"-", ":", " "})
            ]
            if parsed_rows:
                t = Table(parsed_rows)
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), gold_color),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                ]))
                story.append(t)
                story.append(Spacer(1, 10))
        else:
            story.append(Paragraph(line, body_style))
        i += 1

    doc.build(story)
    buffer.seek(0)
    return buffer
