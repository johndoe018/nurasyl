"""Regenerate the one-page assignment report. Optional dependency: reportlab."""
import re
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

ROOT = Path(__file__).resolve().parent.parent
FONT_ROOT = Path('/usr/share/fonts/truetype/dejavu')
pdfmetrics.registerFont(TTFont('DejaVu', str(FONT_ROOT / 'DejaVuSans.ttf')))
pdfmetrics.registerFont(TTFont('DejaVuBold', str(FONT_ROOT / 'DejaVuSans-Bold.ttf')))
pdfmetrics.registerFontFamily('DejaVu', normal='DejaVu', bold='DejaVuBold')
body = ParagraphStyle('body', fontName='DejaVu', fontSize=8.65, leading=12.5, textColor=colors.HexColor('#263440'), spaceAfter=9, alignment=TA_LEFT)
title = ParagraphStyle('title', parent=body, fontName='DejaVuBold', fontSize=17, leading=22, textColor=colors.HexColor('#0f1419'), spaceAfter=12)
subtitle = ParagraphStyle('subtitle', parent=body, fontSize=9, textColor=colors.HexColor('#1675b3'), spaceAfter=19)

def markup(text):
    return re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', escape(text))

def footer(canvas, document):
    if document.page > 1:
        raise RuntimeError('The assignment report must fit on one page.')
    canvas.setStrokeColor(colors.HexColor('#dbe3e8'))
    canvas.line(42, 40, A4[0] - 42, 40)
    canvas.setFont('DejaVu', 7)
    canvas.setFillColor(colors.HexColor('#697782'))
    canvas.drawString(42, 27, 'AXIOM  /  AI FOR DIFFERENTIATED LEARNING')
    canvas.drawRightString(A4[0] - 42, 27, 'Nurasyl Nurbay  ·  1 / 1')

blocks = (ROOT / 'public/report.md').read_text().strip().split('\n\n')
story = [Paragraph(escape(blocks[0].removeprefix('# ')), title), Paragraph(markup(blocks[1]), subtitle)]
story.extend(Paragraph(markup(block), body) for block in blocks[2:])
document = SimpleDocTemplate(str(ROOT / 'public/report.pdf'), pagesize=A4, leftMargin=42, rightMargin=42, topMargin=38, bottomMargin=55, title='Axiom — AI for Differentiated Geometry Learning', author='Nurasyl Nurbay (AI-assisted development)')
document.build(story, onFirstPage=footer, onLaterPages=footer)
print('Generated public/report.pdf (one page).')
