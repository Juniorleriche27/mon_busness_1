import io
import re
from datetime import datetime
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Palette Scrivia Prestige
HEX_OBSIDIAN = "07070F"
HEX_GOLD = "C8A96E"
HEX_WARM_BRONZE = "A07840"
HEX_IVORY = "FAF8F4"
HEX_BORDER = "E8DFD0"
HEX_TEXT = "1A1A1A"
HEX_MUTED = "64748B"


def _clean_markdown_text(text: str) -> str:
    """Nettoie le balisage gras/italique Markdown pour affichage propre dans Excel."""
    text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
    text = re.sub(r'\*(.+?)\*', r'\1', text)
    text = re.sub(r'`(.+?)`', r'\1', text)
    return text.strip()


def _format_cell_value(val: str):
    """
    Détecte et convertit les nombres ou devises si possible pour un rendu professionnel.
    """
    clean_val = val.strip()
    
    # Détection FCFA ou EUR
    is_currency = bool(re.search(r'(FCFA|EUR|USD|\$|€)', clean_val, re.IGNORECASE))
    
    # Nettoyage pour tester si c'est un nombre
    num_str = re.sub(r'[^\d,\.-]', '', clean_val).replace(',', '.')
    try:
        if num_str and not clean_val.startswith("+") and len(num_str) > 0:
            if "." in num_str:
                num = float(num_str)
            else:
                num = int(num_str)
            
            # Si c'était explicitement une devise ou un nombre pur
            if clean_val == num_str or is_currency:
                return num, "#,##0" if isinstance(num, int) else "#,##0.00", "right"
    except ValueError:
        pass

    # Détection pourcentage
    if clean_val.endswith("%"):
        try:
            p_val = float(clean_val[:-1].replace(',', '.')) / 100.0
            return p_val, "0.0%", "right"
        except ValueError:
            pass

    return clean_val, None, "left"


def generate_xlsx(content: str, title: str, metadata: dict = None) -> io.BytesIO:
    """
    Génère un classeur Excel (.xlsx) haute résolution selon les standards de modélisation Scrivia Prestige.
    """
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = title[:30].replace("/", "-").replace("\\", "-")
    ws.views.sheetView[0].showGridLines = True

    # Définition des styles réutilisables
    obsidian_fill = PatternFill(start_color=HEX_OBSIDIAN, end_color=HEX_OBSIDIAN, fill_type="solid")
    gold_fill = PatternFill(start_color=HEX_GOLD, end_color=HEX_GOLD, fill_type="solid")
    ivory_fill = PatternFill(start_color=HEX_IVORY, end_color=HEX_IVORY, fill_type="solid")
    white_fill = PatternFill(start_color="FFFFFF", end_color="FFFFFF", fill_type="solid")

    thin_border_side = Side(border_style="thin", color=HEX_BORDER)
    gold_border_side = Side(border_style="medium", color=HEX_GOLD)
    cell_border = Border(top=thin_border_side, bottom=thin_border_side, left=thin_border_side, right=thin_border_side)
    header_border = Border(top=thin_border_side, bottom=gold_border_side, left=thin_border_side, right=thin_border_side)

    font_badge = Font(name="Calibri", size=9, bold=True, color=HEX_WARM_BRONZE)
    font_title = Font(name="Georgia", size=15, bold=True, color=HEX_OBSIDIAN)
    font_meta = Font(name="Calibri", size=9, italic=True, color=HEX_MUTED)
    font_h1 = Font(name="Georgia", size=12, bold=True, color=HEX_WARM_BRONZE)
    font_h2 = Font(name="Georgia", size=11, bold=True, color=HEX_OBSIDIAN)
    font_table_header = Font(name="Calibri", size=10, bold=True, color=HEX_GOLD)
    font_cell = Font(name="Calibri", size=10, color=HEX_TEXT)

    # --- 1. En-tête officiel Scrivia ---
    ws.merge_cells("A1:G1")
    b_cell = ws["A1"]
    b_cell.value = "• SCRIVIA INTELLIGENCE — ÉDITION OFFICIELLE CERTIFIÉE"
    b_cell.font = font_badge
    b_cell.alignment = Alignment(horizontal="left", vertical="center")
    ws.row_dimensions[1].height = 18

    ws.merge_cells("A2:G2")
    t_cell = ws["A2"]
    t_cell.value = title.upper()
    t_cell.font = font_title
    t_cell.alignment = Alignment(horizontal="left", vertical="center")
    ws.row_dimensions[2].height = 28

    now_str = datetime.now().strftime("%d/%m/%Y à %H:%M")
    doc_id = (metadata or {}).get("doc_id", "SCR-" + datetime.now().strftime("%Y%m%d%H%M"))
    ws.merge_cells("A3:G3")
    m_cell = ws["A3"]
    m_cell.value = f"Réf: {doc_id}  |  Généré le: {now_str}  |  Statut: Certifié conforme  |  Scrivia AI"
    m_cell.font = font_meta
    m_cell.alignment = Alignment(horizontal="left", vertical="center")
    ws.row_dimensions[3].height = 18

    current_row = 5
    lines = content.split("\n")
    i = 0
    total_lines = len(lines)

    in_table = False
    table_row_count = 0

    while i < total_lines:
        line = lines[i].strip()
        if not line:
            if in_table:
                in_table = False
                table_row_count = 0
                current_row += 1
            i += 1
            continue

        # Ignorer titre H1 redondant
        if line.startswith("# ") and line[2:].strip().lower() == title.lower():
            i += 1
            continue

        if line.startswith("# "):
            in_table = False
            table_row_count = 0
            current_row += 1
            cell = ws.cell(row=current_row, column=1, value=_clean_markdown_text(line[2:].strip()))
            cell.font = font_h1
            ws.row_dimensions[current_row].height = 22
            current_row += 1
            i += 1
            continue

        if line.startswith("## "):
            in_table = False
            table_row_count = 0
            current_row += 1
            cell = ws.cell(row=current_row, column=1, value=_clean_markdown_text(line[3:].strip()))
            cell.font = font_h2
            ws.row_dimensions[current_row].height = 20
            current_row += 1
            i += 1
            continue

        if line.startswith("### "):
            in_table = False
            table_row_count = 0
            cell = ws.cell(row=current_row, column=1, value=_clean_markdown_text(line[4:].strip()))
            cell.font = Font(name="Calibri", size=10.5, bold=True, color=HEX_OBSIDIAN)
            current_row += 1
            i += 1
            continue

        # Ligne de tableau Markdown
        if line.startswith("|") and line.endswith("|"):
            cols = [c.strip() for c in line.split("|")[1:-1]]
            # Ignorer séparateur |---|---|
            if all(set(c).issubset({'-', ':', ' '}) for c in cols if c):
                i += 1
                continue

            is_header = not in_table
            in_table = True
            table_row_count += 1

            ws.row_dimensions[current_row].height = 24 if is_header else 20

            for col_idx, raw_col_val in enumerate(cols, start=1):
                clean_txt = _clean_markdown_text(raw_col_val)
                cell = ws.cell(row=current_row, column=col_idx)

                if is_header:
                    cell.value = clean_txt
                    cell.font = font_table_header
                    cell.fill = obsidian_fill
                    cell.alignment = Alignment(horizontal="center" if len(clean_txt) < 12 else "left", vertical="center", wrap_text=True)
                    cell.border = header_border
                else:
                    val, num_fmt, align = _format_cell_value(clean_txt)
                    cell.value = val
                    cell.font = font_cell
                    cell.fill = ivory_fill if (table_row_count % 2 == 1) else white_fill
                    cell.alignment = Alignment(horizontal=align, vertical="center")
                    cell.border = cell_border
                    if num_fmt:
                        cell.number_format = num_fmt

            current_row += 1
            i += 1
            continue

        # Puces
        if line.startswith("- ") or line.startswith("* "):
            in_table = False
            cell = ws.cell(row=current_row, column=1, value=f"• {_clean_markdown_text(line[2:])}")
            cell.font = font_cell
            cell.alignment = Alignment(horizontal="left", vertical="center")
            current_row += 1
            i += 1
            continue

        # Ligne normale
        in_table = False
        cell = ws.cell(row=current_row, column=1, value=_clean_markdown_text(line))
        cell.font = font_cell
        cell.alignment = Alignment(horizontal="left", vertical="center")
        current_row += 1
        i += 1

    # Ajustement dynamique et généreux de la largeur des colonnes
    for col in ws.columns:
        max_len = 0
        col_letter = get_column_letter(col[0].column)
        for cell in col:
            # Ne pas calculer sur les lignes de bannières fusionnées
            if cell.row in (1, 2, 3):
                continue
            if cell.value is not None:
                max_len = max(max_len, len(str(cell.value)))
        ws.column_dimensions[col_letter].width = min(max(max_len + 4, 14), 55)

    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return buffer
