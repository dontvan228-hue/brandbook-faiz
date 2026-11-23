"""Bakery signage: facade sign 1600x700 mm and double-sided bracket sign 750x480 mm.

Writes 1:1 production layouts (mm, vector logo, «ПЕКАРНЯ» in Playfair Display
SemiBold converted to outlines) into print/bakery/sign/, plus a dimensioned
scheme for the site: img/bakery/sign-scheme.svg.

Usage: python -P print/bakery/make_signs.py <PlayfairDisplay[wght].ttf>
"""
import re, sys, pathlib
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = pathlib.Path(__file__).parent / 'sign'
OUT.mkdir(exist_ok=True)
CREAM, CHOC, LINE = '#F4DEAF', '#5C3A28', '#765545'

font = instantiateVariableFont(TTFont(sys.argv[1]), {'wght': 600})
gs, cmap, hmtx, upm = font.getGlyphSet(), font.getBestCmap(), font['hmtx'], font['head'].unitsPerEm
CAPH = font['OS/2'].sCapHeight


def text_path(s, cx, base, cap_mm, track=0.12):
    """Centred line of caps; `cap_mm` is the cap height in mm, baseline at `base`."""
    k = cap_mm / CAPH
    adv = [hmtx[cmap[ord(c)]][0] * k for c in s]
    w = sum(adv) + track * cap_mm / 0.7 * (len(s) - 1)
    x, out = cx - w / 2, []
    for c, a in zip(s, adv):
        pen = SVGPathPen(gs)
        gs[cmap[ord(c)]].draw(TransformPen(pen, (k, 0, 0, -k, x, base)))
        out.append(pen.getCommands())
        x += a + track * cap_mm / 0.7
    return ' '.join(out), w


html = (ROOT / 'bakery.html').read_text(encoding='utf-8')
sym = re.search(r'<symbol id="fl" viewBox="([^"]+)">(.*?)</symbol>', html, re.S)
vb = [float(v) for v in sym.group(1).split()]
LD = re.search(r' d="([^"]+)"', sym.group(2)).group(1)
RATIO = vb[3] / vb[2]


def logo(cx, top, width, fill):
    k = width / vb[2]
    return (f'<path fill="{fill}" fill-rule="evenodd" transform="matrix({k:.6f} 0 0 {k:.6f} '
            f'{cx - width / 2 - vb[0] * k:.3f} {top - vb[1] * k:.3f})" d="{LD}"/>')


def layout(W, H, logo_w, cap, gap, bg, ink, cap_ink):
    lh = logo_w * RATIO
    top = (H - (lh + gap + cap)) / 2
    cap_d, cap_w = text_path('ПЕКАРНЯ', W / 2, top + lh + gap + cap, cap)
    return dict(W=W, H=H, lw=logo_w, lh=lh, top=top, cap=cap, gap=gap, cap_w=cap_w,
                art=f'<rect width="{W}" height="{H}" fill="{bg}"/>{logo(W / 2, top, logo_w, ink)}<path fill="{cap_ink}" d="{cap_d}"/>')


FACADE = layout(1600, 700, 1200, 70, 50, CHOC, CREAM, CREAM)
BRACKET = layout(670, 400, 520, 40, 35, CREAM, CHOC, CHOC)   # visible cream field inside a 40 mm wooden frame

for name, L, note in (
    ('facade_1600x700', FACADE, 'Фасадная вывеска 1600 × 700 мм, масштаб 1:1. Подложка шоколад #5C3A28, логотип и «ПЕКАРНЯ» — сливочный #F4DEAF (вариант 2: «ПЕКАРНЯ» тон-в-тон с подложкой).'),
    ('bracket_670x400', BRACKET, 'Панель-кронштейн: лицевое поле 670 × 400 мм внутри деревянной рамки 40 мм (короб 750 × 480 мм), масштаб 1:1, две стороны одинаковые. Поле сливочное #F4DEAF, логотип и «ПЕКАРНЯ» — шоколад #5C3A28.'),
):
    svg = (f'<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="{L["W"]}mm" height="{L["H"]}mm" viewBox="0 0 {L["W"]} {L["H"]}">\n'
           f'  <title>ФАЙЗ — {note}</title>\n  <g id="Artwork">{L["art"]}</g>\n</svg>\n')
    (OUT / f'faiz-sign_{name}.svg').write_text(svg, encoding='utf-8')
    (OUT / f'_pdf_{name}.html').write_text(
        f'<!doctype html><html><head><meta charset="utf-8"><style>@page{{size:{L["W"]}mm {L["H"]}mm;margin:0}}html,body{{margin:0}}svg{{display:block}}</style></head><body>{svg.split("?>", 1)[1]}</body></html>',
        encoding='utf-8')

# ---- dimensioned scheme for the site (1 unit = 1 mm, both signs side by side) ----
F, B = FACADE, BRACKET
FX, FY = 300, 150             # facade origin
bx, by = 2330, 190            # bracket box origin (750 x 480 incl. frame)
TXT = 'font-family="Manrope,system-ui,sans-serif" font-size="36" font-weight="700" stroke="none"'


def dim_h(x1, x2, y, label, up=True, fill=CHOC, stroke=LINE):
    ty = y - 16 if up else y + 40
    return (f'<path d="M{x1} {y}H{x2}" stroke="{stroke}" marker-start="url(#ar)" marker-end="url(#ar)"/>'
            f'<text x="{(x1 + x2) / 2}" y="{ty}" text-anchor="middle" fill="{fill}" {TXT}>{label}</text>')


def dim_v(x, y1, y2, label, left=True):
    tx = x - 18 if left else x + 18
    anchor = 'end' if left else 'start'
    return (f'<path d="M{x} {y1}V{y2}" stroke="{LINE}" marker-start="url(#ar)" marker-end="url(#ar)"/>'
            f'<text x="{tx}" y="{(y1 + y2) / 2 + 12}" text-anchor="{anchor}" fill="{CHOC}" {TXT}>{label}</text>')


lt, lb = F['top'], F['top'] + F['lh']
ct = lb + F['gap']
inner = (f'<g transform="translate({FX} {FY})">{F["art"]}</g>'
         f'<g transform="translate({bx} {by})"><rect width="750" height="480" rx="6" fill="{CHOC}"/>'
         f'<g transform="translate(40 40)">{B["art"]}</g></g>'
         f'<path d="M{bx - 120} {by - 40}V{by + 520}M{bx - 120} {by + 150}H{bx}M{bx - 120} {by + 330}H{bx}M{bx + 160} {by}V{by - 50}M{bx + 590} {by}V{by - 50}M{bx - 120} {by - 50}H{bx + 590}" stroke="{CHOC}" stroke-width="14" fill="none" stroke-linecap="square"/>')
dims = ''.join([
    dim_h(FX, FX + 1600, FY + 760, '1600 (от 1200 до 2500)', up=False),
    dim_v(FX - 40, FY, FY + 700, '700'),
    dim_h(FX + 200, FX + 1400, FY + lt - 24, 'логотип 1200', fill=CREAM, stroke=CREAM),
    dim_v(FX + 1650, FY, FY + lt, f'{lt:.0f}', left=False),
    dim_v(FX + 1650, FY + lb, FY + lb + F['gap'], f'{F["gap"]:.0f}', left=False),
    dim_v(FX + 1650, FY + ct, FY + ct + F['cap'], f'буквы {F["cap"]:.0f}', left=False),
    dim_h(bx, bx + 750, by + 560, '750', up=False),
    dim_v(bx + 800, by, by + 480, '480', left=False),
    dim_h(bx + 40 + (670 - 520) / 2, bx + 40 + (670 + 520) / 2, by + 40 + B['top'] - 20, 'логотип 520'),
])
scheme = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3300 1020" role="img" aria-label="Схема вывесок: фасадная 1600 на 700 мм с логотипом 1200 мм, панель-кронштейн 750 на 480 мм с логотипом 520 мм">
<defs><marker id="ar" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L7 4 L0 7" fill="none" stroke="context-stroke" stroke-width="1.2"/></marker></defs>
{inner}
<g stroke-width="3" fill="none">{dims}</g>
<g font-family="Manrope,system-ui,sans-serif" font-size="42" font-weight="800" fill="{CHOC}">
<text x="{FX}" y="{FY - 40}">Фасадная вывеска · короб 50 мм</text><text x="{bx - 120}" y="{by - 90}">Кронштейн · короб 90 мм</text></g>
<text x="{FX}" y="1000" font-family="Manrope,system-ui,sans-serif" font-size="32" fill="{LINE}">Размеры в мм. Точные — после замера.</text>
</svg>'''
(ROOT / 'img/bakery/sign-scheme.svg').write_text(scheme, encoding='utf-8')
print('signs written; facade logo %.0fx%.0f mm, caption width %.0f mm; bracket logo %.0fx%.0f, caption %.0f mm'
      % (F['lw'], F['lh'], F['cap_w'], B['lw'], B['lh'], B['cap_w']))
