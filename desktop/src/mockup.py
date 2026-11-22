"""Preview of a shop desktop: the still wallpaper with the FAIZ icons laid out like Windows does (left column).
Usage: python -P mockup.py <layers dir> <icons dir> <out dir>"""
import sys, pathlib
from PIL import Image, ImageDraw, ImageFont
L, I, O = (pathlib.Path(a) for a in sys.argv[1:4])
font = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf', 15)
ITEMS = [('computer', 'Этот компьютер'), ('bin_full', 'Корзина'), ('saby_business', 'Saby Бизнес'), ('saby_retail', 'Saby Ретейл'),
         ('folder', 'Отчёты'), ('folder', 'Документы'), ('doc_xls', 'Выручка ноябрь.xlsx'), ('doc_doc', 'Договор аренды.docx'), ('doc_pdf', 'Накладная 1147.pdf')]
for brand in ('vape', 'bakery'):
    im = Image.open(L / brand / 'wallpaper.png').convert('RGBA')
    d = ImageDraw.Draw(im)
    for k, (icon, label) in enumerate(ITEMS):
        col, row = divmod(k, 7)
        x, y = 20 + col * 110, 16 + row * 112
        ic = Image.open(I / brand / f'{icon}.png').convert('RGBA').resize((64, 64), Image.LANCZOS)
        im.alpha_composite(ic, (x + 18, y))
        w = d.textlength(label, font=font)
        lines = [label] if w <= 104 else [label[:len(label)//2], label[len(label)//2:]]
        for j, t in enumerate(lines):
            tw = d.textlength(t, font=font)
            d.text((x + 50 - tw / 2 + 1, y + 70 + j * 18 + 1), t, font=font, fill=(0, 0, 0, 160))
            d.text((x + 50 - tw / 2, y + 70 + j * 18), t, font=font, fill=(255, 255, 255, 255))
    im.convert('RGB').save(O / f'desktop-preview-{brand}.jpg', quality=90)
print('previews written')
