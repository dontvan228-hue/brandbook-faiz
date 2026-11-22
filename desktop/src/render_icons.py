"""Draw the desktop icons for both brands as 256x256 SVG pages (Chrome renders them to PNG),
then pack PNGs into multi-size .ico files.

Usage:
  python -P render_icons.py pages <out_dir>   -> writes <out_dir>/<brand>/<icon>.html
  python -P render_icons.py ico   <out_dir>   -> packs <out_dir>/<brand>/<icon>.png into .ico
"""
import sys, pathlib

MODE, OUT = sys.argv[1], pathlib.Path(sys.argv[2])
SRC = pathlib.Path(__file__).parent
ICONS = ['computer', 'bin_empty', 'bin_full', 'folder', 'saby_business', 'saby_retail', 'doc_xls', 'doc_doc', 'doc_pdf']

if MODE == 'ico':
    from PIL import Image
    for brand in ('vape', 'bakery'):
        for name in ICONS:
            png = OUT / brand / f'{name}.png'
            im = Image.open(png).convert('RGBA')
            im.save(OUT / brand / f'{name}.ico', sizes=[(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (24, 24), (16, 16)])
    print('ico written'); sys.exit()

vF = (SRC / 'vape-F.path.txt').read_text(encoding='utf-8')
bF = (SRC / 'bakery-F.path.txt').read_text(encoding='utf-8')
FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&family=Manrope:wght@800&display=block">'

B = {
  'vape': dict(edge=' stroke="url(#gold)" stroke-width="5"', body='#1f4d37', body2='#2c5c45', front='#123726', ink='url(#gold)', line='#c8b48c', paper='#f3ebd6', font='Roboto Condensed',
      defs='<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3cf"/><stop offset=".45" stop-color="#b8955c"/><stop offset=".7" stop-color="#f6e7bf"/><stop offset="1" stop-color="#8a6b3c"/></linearGradient>',
      F=lambda cx, cy, h: f'<g transform="translate({cx} {cy}) scale({h/391.25*1.02}) translate(-216 -239.6)"><path d="{vF}" fill="url(#gold)"/></g>'),
  'bakery': dict(edge=' stroke="#5c3a28" stroke-width="4"', body='#a0beda', body2='#8fb0cf', front='#f4deaf', ink='#5c3a28', line='#5c3a28', paper='#fbf4e6', font='Manrope',
      defs='',
      F=lambda cx, cy, h: f'<g transform="translate({cx} {cy}) scale({h/224}) translate(-371.4 -314.5)"><path fill-rule="evenodd" d="{bF}" fill="#5c3a28"/></g>'),
}

def icon(brand, name):
    b = B[brand]; F = b['F']; ink = b['ink']
    shadow = '<ellipse cx="128" cy="236" rx="92" ry="8" fill="#000" opacity=".18"/>'
    if name == 'folder':
        return f'''{shadow}<path d="M20 64 q0-12 12-12 h62 l18 20 h112 q12 0 12 12 v120 q0 12-12 12 H32 q-12 0-12-12 Z" fill="{b["body2"]}"/>
<path d="M14 92 q0-10 10-10 h208 q10 0 10 10 l-8 118 q-1 10-11 10 H33 q-10 0-11-10 Z" fill="{b["front"] if brand=="bakery" else b["body"]}"{b["edge"]}/>
<path d="M14 92 q0-10 10-10 h208 q10 0 10 10" fill="none" stroke="{b["line"]}" stroke-opacity=".5" stroke-width="3"/>{F(128,152,74)}'''
    if name == 'computer':
        return f'''{shadow}<rect x="22" y="34" width="212" height="148" rx="14" fill="{b["body2"]}"{b["edge"]}/><rect x="34" y="46" width="188" height="120" rx="6" fill="{b["front"] if brand=="bakery" else "#06190f"}"/>
<path d="M104 182 h48 l8 34 h-64 Z" fill="{b["body2"]}"/><rect x="78" y="214" width="100" height="10" rx="5" fill="{b["body2"]}"/>{F(128,106,82)}'''
    if name in ('bin_empty', 'bin_full'):
        papers = '' if name == 'bin_empty' else f'<path d="M84 70 l30-40 l28 22 l-14 22 Z" fill="{b["paper"]}" stroke="{b["line"]}" stroke-opacity=".4"/><path d="M128 68 l40-34 l18 30 Z" fill="{b["paper"]}" stroke="{b["line"]}" stroke-opacity=".4"/>'
        return f'''{shadow}{papers}<path d="M58 76 h140 l-14 146 q-1 10-11 10 H83 q-10 0-11-10 Z" fill="{b["body"]}"{b["edge"]}/>
<rect x="48" y="62" width="160" height="18" rx="9" fill="{b["body2"]}"{b["edge"]}/><rect x="108" y="50" width="40" height="14" rx="6" fill="{b["body2"]}"/>
<path d="M94 100 v108 M128 100 v108 M162 100 v108" stroke="{b["line"]}" stroke-opacity=".25" stroke-width="6" stroke-linecap="round"/>{F(128,150,70)}'''
    if name.startswith('saby'):
        word = 'Бизнес' if name.endswith('business') else 'Ретейл'
        return f'''{shadow}<rect x="20" y="20" width="216" height="216" rx="48" fill="{b["body"] if brand=="vape" else b["front"]}"/>
<rect x="20" y="20" width="216" height="216" rx="48" fill="none" stroke="{b["line"]}" stroke-opacity=".55" stroke-width="4"/>{F(128,98,92)}
<text x="128" y="196" text-anchor="middle" font-family="{b["font"]}" font-weight="800" font-size="40" fill="{ink}">{word}</text>'''
    if name.startswith('doc_'):
        tag = {'doc_xls': 'XLS', 'doc_doc': 'DOC', 'doc_pdf': 'PDF'}[name]
        return f'''{shadow}<path d="M48 18 h112 l52 52 v150 q0 12-12 12 H48 q-12 0-12-12 V30 q0-12 12-12 Z" fill="{b["paper"]}" stroke="{b["line"]}" stroke-opacity=".35" stroke-width="3"/>
<path d="M160 18 v40 q0 12 12 12 h40" fill="{b["front"] if brand=="bakery" else "#e3d6b4"}"/>{F(124,92,58)}
<rect x="28" y="150" width="152" height="62" rx="12" fill="{b["body"] if brand=="vape" else "#5c3a28"}"/>
<text x="104" y="194" text-anchor="middle" font-family="{b["font"]}" font-weight="800" font-size="40" fill="{ink if brand=="vape" else "#f4deaf"}" letter-spacing="2">{tag}</text>'''
    raise ValueError(name)

for brand in ('vape', 'bakery'):
    d = OUT / brand; d.mkdir(parents=True, exist_ok=True)
    for name in ICONS:
        html = f'<!doctype html><html><head><meta charset="utf-8">{FONTS}<style>html,body{{margin:0;background:transparent}}svg{{display:block}}</style></head><body><svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><defs>{B[brand]["defs"]}</defs>{icon(brand, name)}</svg></body></html>'
        (d / f'{name}.html').write_text(html, encoding='utf-8')
print('icon pages written')
