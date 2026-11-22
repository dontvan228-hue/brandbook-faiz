"""Generate the HTML pages for every wallpaper layer of both brands.
Chrome then screenshots each page into a PNG (see build.ps1).

Layers (square ones are S x S, transparent):
  bg.png        1920x1080 background
  ring_outer    thin outer ring of small words       (rotates slowly)
  ring_main     main ring of large words              (rotates)
  ring_inner    inner ring of Cyrillic words          (rotates the other way)
  core          halo + disc + Ф                       (static; bakery Ф breathes in the app)
  wallpaper     1920x1080 still composite: set as the Windows wallpaper under the live layer

Usage: python -P render_layers.py <out_dir>
"""
import sys, pathlib

OUT = pathlib.Path(sys.argv[1]); OUT.mkdir(parents=True, exist_ok=True)
SRC = pathlib.Path(__file__).parent
S = 1200
EN = 'Faiz · Quality · Trust · Comfort · Atmosphere · Style · Choice · '
RU = 'ФАЙЗ · КАЧЕСТВО · ДОВЕРИЕ · КОМФОРТ · АТМОСФЕРА · ВЫБОР · '
FONTS = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;500&'
         'family=UnifrakturMaguntia&family=Playfair+Display:ital,wght@1,500&family=Manrope:wght@500;700&display=block">')

vF = (SRC / 'vape-F.path.txt').read_text(encoding='utf-8')
bF = (SRC / 'bakery-F.path.txt').read_text(encoding='utf-8')

RINGS = '''<path id="rA" d="M0,-430 a430,430 0 1,1 0,860 a430,430 0 1,1 0,-860"/>
<path id="rB" d="M0,-300 a300,300 0 1,1 0,600 a300,300 0 1,1 0,-600"/>
<path id="rC" d="M0,-478 a478,478 0 1,1 0,956 a478,478 0 1,1 0,-956"/>'''

BRANDS = {
  'vape': dict(
    bg='background:radial-gradient(ellipse at 50% 48%,#123726 0%,#071a12 42%,#02110c 75%)',
    defs='''<linearGradient id="gGoldWide" gradientUnits="userSpaceOnUse" x1="60" y1="40" x2="860" y2="440"><stop offset="0" stop-color="#fff3cf"/><stop offset=".2" stop-color="#c9a76a"/><stop offset=".36" stop-color="#7d6136"/><stop offset=".5" stop-color="#f7e9c2"/><stop offset=".68" stop-color="#b08d55"/><stop offset=".84" stop-color="#6e5430"/><stop offset="1" stop-color="#e9d39c"/></linearGradient>
<linearGradient id="gGoldRing" gradientUnits="userSpaceOnUse" x1="-450" y1="-450" x2="450" y2="450"><stop offset="0" stop-color="#fff3cf"/><stop offset=".35" stop-color="#b8955c"/><stop offset=".55" stop-color="#f6e7bf"/><stop offset=".8" stop-color="#8a6b3c"/><stop offset="1" stop-color="#e9d39c"/></linearGradient>
<radialGradient id="gDisc"><stop offset="0" stop-color="#1d4a35"/><stop offset=".75" stop-color="#0d2b1e"/><stop offset="1" stop-color="#06190f"/></radialGradient>
<radialGradient id="gHalo"><stop offset="0" stop-color="#e8cf98" stop-opacity=".28"/><stop offset="1" stop-color="#e8cf98" stop-opacity="0"/></radialGradient>''',
    outer=f'<text font-family="Roboto Condensed" font-size="13" fill="rgba(200,180,140,.6)"><textPath href="#rC" textLength="2990" lengthAdjust="spacing">{EN*3}</textPath></text>',
    main=f'<text font-family="UnifrakturMaguntia" font-size="46" fill="url(#gGoldRing)"><textPath href="#rA" textLength="2690" lengthAdjust="spacing">{EN}</textPath></text>',
    inner=f'<text font-family="Roboto Condensed" font-weight="500" font-size="22" fill="rgba(243,235,214,.8)"><textPath href="#rB" textLength="1870" lengthAdjust="spacing">{RU}</textPath></text>',
    core=f'''<circle r="480" fill="url(#gHalo)"/><circle r="212" fill="url(#gDisc)"/>
<circle r="212" fill="none" stroke="rgba(200,180,140,.55)" stroke-width="1.5"/><circle r="198" fill="none" stroke="rgba(200,180,140,.25)" stroke-width="1" stroke-dasharray="2 6"/>
<g transform="scale(.78) translate(-216.25 -239.6)"><path d="{vF}" fill="url(#gGoldWide)"/></g>'''),
  'bakery': dict(
    bg='background:linear-gradient(120deg,#a0beda 0%,#b5cce2 30%,#dcdcd0 58%,#efe0bd 80%,#f4deaf 100%)',
    defs='<radialGradient id="bkDisc"><stop offset="0" stop-color="#fbf4e6"/><stop offset=".75" stop-color="#f4deaf"/><stop offset="1" stop-color="#ecd3a0"/></radialGradient>',
    outer=f'<text font-family="Manrope" font-weight="500" font-size="13" fill="rgba(92,58,40,.45)"><textPath href="#rC" textLength="2990" lengthAdjust="spacing">{EN*3}</textPath></text>',
    main=f'<text font-family="Playfair Display" font-style="italic" font-weight="500" font-size="48" fill="#5c3a28"><textPath href="#rA" textLength="2690" lengthAdjust="spacing">{EN}</textPath></text>',
    inner=f'<text font-family="Manrope" font-weight="700" font-size="21" fill="rgba(92,58,40,.78)"><textPath href="#rB" textLength="1870" lengthAdjust="spacing">{RU}</textPath></text>',
    core=f'''<circle r="212" fill="url(#bkDisc)"/><circle r="212" fill="none" stroke="rgba(92,58,40,.45)" stroke-width="1.5"/>
<circle r="198" fill="none" stroke="rgba(92,58,40,.22)" stroke-width="1" stroke-dasharray="2 6"/>
<g transform="scale(.9) translate(-371.4 -314.5)"><path fill-rule="evenodd" d="{bF}" fill="#5c3a28"/></g>'''),
}

PAGE = '<!doctype html><html><head><meta charset="utf-8">' + FONTS + '<style>html,body{{margin:0;background:transparent;overflow:hidden}}{css}</style></head><body>{body}</body></html>'

def square(svg_inner, defs):
    return PAGE.format(css='svg{display:block}', body=f'<svg xmlns="http://www.w3.org/2000/svg" width="{S}" height="{S}" viewBox="-500 -500 1000 1000"><defs>{RINGS}{defs}</defs>{svg_inner}</svg>')

for name, b in BRANDS.items():
    d = OUT / name; d.mkdir(exist_ok=True)
    (d / 'bg.html').write_text(PAGE.format(css=f'body{{width:1920px;height:1080px;{b["bg"]}}}', body=''), encoding='utf-8')
    for layer in ('outer', 'main', 'inner', 'core'):
        (d / f'ring_{layer}.html' if layer != 'core' else d / 'core.html').write_text(square(b[layer], b['defs']), encoding='utf-8')
    seal = 0.80 * 1080
    allsvg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-500 -500 1000 1000" style="position:absolute;left:{(1920-seal)/2}px;top:{(1080-seal)/2}px;width:{seal}px;height:{seal}px"><defs>{RINGS}{b["defs"]}</defs>{b["outer"]}{b["main"]}{b["inner"]}{b["core"]}</svg>'
    (d / 'wallpaper.html').write_text(PAGE.format(css=f'body{{width:1920px;height:1080px;position:relative;{b["bg"]}}}', body=allsvg), encoding='utf-8')
print('pages written to', OUT)
