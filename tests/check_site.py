"""Static checks for the FAIZ brandbook site. Run: python -P tests/check_site.py
Fails (exit 1) on: missing pages, local links/anchors that do not resolve,
missing legacy redirects, a page loading a local css/js without ?v=.
"""
import re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ['index.html', 'vape.html', 'invest-vape.html', 'invest.html', 'bakery.html', 'invest-bakery.html']
errors = []
html = {}
for p in PAGES:
    f = ROOT / p
    if not f.exists():
        errors.append(f'missing page {p}'); continue
    html[p] = f.read_text(encoding='utf-8')

def ids(src):
    return set(re.findall(r'\sid="([^"]+)"', src))

# ids generated at runtime by subnav (section-N) are not in the html: allow them
RUNTIME_ID = re.compile(r'^(logo|identity|carriers|templates|quick)-\d+$')
for p, src in html.items():
    own = ids(src)
    for href in re.findall(r'href="([^"]+)"', src):
        if href.startswith(('http', 'mailto:', 'tel:', 'data:', 'javascript:')):
            continue
        path, _, frag = href.partition('#')
        if path and not path.endswith('.html'):
            if not (ROOT / path.split('?')[0]).exists():
                errors.append(f'{p}: file link {href} not found')
            continue
        target = path or p
        if target not in html:
            errors.append(f'{p}: link to missing page {href}'); continue
        if frag and frag not in ids(html[target]) and not RUNTIME_ID.match(frag) and not (target == 'invest.html'):
            errors.append(f'{p}: anchor {href} not found')
    for ref in re.findall(r'(?:src|href)="((?:[\w-]+)\.(?:css|js)(?:\?[^"]*)?)"', src):
        if '?v=' not in ref:
            errors.append(f'{p}: local asset without version {ref}')
        elif not (ROOT / ref.split('?')[0]).exists():
            errors.append(f'{p}: asset {ref} not found')

# legacy redirects
if 'invest.html' in html and 'invest-vape.html' not in html['invest.html']:
    errors.append('invest.html does not redirect to invest-vape.html')
if 'index.html' in html:
    for a in ('logo', 'identity', 'carriers', 'templates', 'store', 'quick'):
        if a not in (ROOT / 'entry.js').read_text(encoding='utf-8'):
            errors.append(f'entry.js does not redirect legacy #{a}')
    for need in ('vape.html', 'bakery.html', 'в разработке'):
        if need not in html['index.html']:
            errors.append(f'index.html entrance lacks {need}')
# brand separation
if 'bakery.html' in html:
    b = html['bakery.html']
    if '18+' in b: errors.append('bakery.html mentions 18+')
    if 'id="pF"' in b: errors.append('bakery.html contains the vape gothic logo')

print('\n'.join(errors) if errors else 'OK: all checks passed')
sys.exit(1 if errors else 0)
