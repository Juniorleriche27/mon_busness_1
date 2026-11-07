import io
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side


def generate_xlsx(content: str, title: str) -> io.BytesIO:
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = title[:30]

    gold_fill = PatternFill(start_color="C8A96E", end_color="C8A96E", fill_type="solid")
    dark_fill = PatternFill(start_color="07070F", end_color="07070F", fill_type="solid")
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    title_font = Font(name="Georgia", size=16, bold=True, color="C8A96E")

    # Titre en haut
    ws.merge_cells("A1:E1")
    title_cell = ws["A1"]
    title_cell.value = title
    title_cell.font = title_font
    title_cell.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 35

    current_row = 3
    for line in content.split("\n"):
        line = line.strip()
        if not line:
            continue

        if line.startswith("#"):
            current_row += 1
            cell = ws.cell(row=current_row, column=1, value=line.replace("#", "").strip())
            cell.font = Font(name="Calibri", size=13, bold=True, color="07070F")
            current_row += 1
        elif line.startswith("|") and line.endswith("|"):
            cols = [c.strip() for c in line.split("|")[1:-1]]
            if set("".join(cols)).issubset({"-", ":", " "}):
                continue  # Ligne de séparation
            for col_idx, col_val in enumerate(cols, start=1):
                cell = ws.cell(row=current_row, column=col_idx, value=col_val)
                # Détecter si c'est la première ligne d'un tableau
                if not ws.cell(row=current_row - 1, column=1).fill.start_color.rgb:
                    cell.fill = gold_fill
                    cell.font = header_font
            current_row += 1
        elif line.startswith("- "):
            ws.cell(row=current_row, column=1, value=f"• {line[2:]}")
            current_row += 1
        else:
            ws.cell(row=current_row, column=1, value=line)
            current_row += 1

    # Ajustement largeur automatique des colonnes
    for col in ws.columns:
        max_len = max(len(str(cell.value or "")) for cell in col)
        col_letter = openpyxl.utils.get_column_letter(col[0].column)
        ws.column_dimensions[col_letter].width = max(max_len + 3, 12)

    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return buffer
