"""Gera favicons (H em Grenze sobre breu) e og.jpg (nome sobre o mármore) renderizando HTML no Edge headless.
Uso: python tools/marca.py (depois de gerar_video.py, que cria assets/img/marmore.webp)"""
import os, pathlib, base64
from playwright.sync_api import sync_playwright
from PIL import Image
SITE = pathlib.Path(__file__).resolve().parent.parent
MARMORE = 'data:image/webp;base64,' + base64.b64encode((SITE / 'assets/img/marmore.webp').read_bytes()).decode()
FONTE = '<link href="https://fonts.googleapis.com/css2?family=Grenze:ital,wght@0,600;1,400&family=Atkinson+Hyperlegible+Mono:wght@500&display=block" rel="stylesheet">'
FAV = FONTE + '''<body style="margin:0"><div style="width:512px;height:512px;background:#0c0b0b;display:grid;place-items:center;position:relative">
<span style="font:600 400px/1 'Grenze';color:#ece7df;margin-top:-20px">H</span>
<i style="position:absolute;right:92px;top:96px;width:44px;height:44px;background:#e0262c;clip-path:polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%)"></i></div></body>'''
OG = FONTE + f'''<body style="margin:0"><div style="width:1200px;height:630px;background:#0c0b0b url({MARMORE}) center/cover;position:relative;display:flex;flex-direction:column;justify-content:center;padding-left:90px;box-sizing:border-box">
<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(12,11,11,.85),rgba(12,11,11,.1))"></div>
<p style="position:relative;margin:0 0 6px 6px;font:500 18px 'Atkinson Hyperlegible Mono';letter-spacing:.16em;color:#9d978e">TATUAGEM ORNAMENTAL E FREEHAND</p>
<p style="position:relative;margin:0;font:italic 400 58px/1 'Grenze';color:#d9d2c6">Laura</p>
<p style="position:relative;margin:-10px 0 0;font:600 220px/.9 'Grenze';color:#ece7df">Hagg</p>
<p style="position:relative;margin:70px 0 0 6px;font:500 18px 'Atkinson Hyperlegible Mono';letter-spacing:.06em;color:#d9d2c6">Lajeado · Porto Alegre · São Paulo · Florianópolis</p></div></body>'''
with sync_playwright() as p:
    b = p.chromium.launch(channel='msedge')
    for html, (w, h), nome in [(FAV, (512, 512), 'fav.png'), (OG, (1200, 630), 'og.png')]:
        pg = b.new_page(viewport={'width': w, 'height': h}); pg.set_content(html); pg.wait_for_timeout(1800)
        pg.screenshot(path=str(SITE / nome)); pg.close()
    b.close()
fav = Image.open(SITE / 'fav.png').convert('RGB')
for n, s in [('favicon-32.png', 32), ('favicon-64.png', 64), ('apple-touch-icon.png', 180)]: fav.resize((s, s), Image.LANCZOS).save(SITE / n)
Image.open(SITE / 'og.png').convert('RGB').save(SITE / 'og.jpg', quality=86)
os.remove(SITE / 'fav.png'); os.remove(SITE / 'og.png')
