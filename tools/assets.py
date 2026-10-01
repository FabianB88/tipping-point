"""Scant assets/ en maakt assets/manifest.json plus bewerkte sprites in assets/spel.

Draai na elke nieuwe batch:  python tools/assets.py

- Zoekt PNG's in assets/spel, assets/gpt/*, en de Downloads-map (tipping-point-batch*.zip wordt uitgepakt naar assets/gpt/batchN).
- Snijdt lege randen weg en schrijft de uitgesneden versie naar assets/spel/<naam>.png met de oorspronkelijke voetpositie bewaard.
- Zet vos_ren_1..6 (en andere *_ren_N reeksen) op één spritesheet met gelijke baseline.
- Knipt fx_*.png rasters (4x2) tot frames op één sheet met vaste celmaat.
- Schrijft manifest.json: per sleutel het pad, de maat en eventuele frame-info. De game laadt alleen wat in het manifest staat.
- Raakt nooit iets aan in assets/gpt of assets/gratis.
"""
import json, os, re, sys, zipfile, glob, shutil
from PIL import Image

HIER = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HIER)
ASSETS = os.path.join(ROOT, 'assets')
GPT = os.path.join(ASSETS, 'gpt')
SPEL = os.path.join(ASSETS, 'spel')
DOWNLOADS = os.path.join(os.path.expanduser('~'), 'Downloads')
os.makedirs(GPT, exist_ok=True)
os.makedirs(SPEL, exist_ok=True)

ALPHA_DREMPEL = 8


def pak_batches_uit():
    """Zips uit Downloads (en los in assets) uitpakken naar assets/gpt/batchN."""
    kandidaten = glob.glob(os.path.join(DOWNLOADS, 'tipping-point-batch*.zip')) + glob.glob(os.path.join(ASSETS, 'tipping-point-batch*.zip'))
    for zp in kandidaten:
        m = re.search(r'batch(\d+)', os.path.basename(zp))
        if not m:
            continue
        doel = os.path.join(GPT, 'batch' + m.group(1))
        stempel = os.path.join(doel, '.bron')
        if os.path.exists(stempel) and open(stempel).read().strip() == f'{os.path.basename(zp)} {os.path.getsize(zp)}':
            continue
        os.makedirs(doel, exist_ok=True)
        with zipfile.ZipFile(zp) as z:
            for lid in z.infolist():
                if lid.is_dir() or not lid.filename.lower().endswith('.png'):
                    continue
                naam = os.path.basename(lid.filename)
                with z.open(lid) as bron, open(os.path.join(doel, naam), 'wb') as uit:
                    shutil.copyfileobj(bron, uit)
        open(stempel, 'w').write(f'{os.path.basename(zp)} {os.path.getsize(zp)}')
        print('uitgepakt', os.path.basename(zp), '->', doel)


def bronnen():
    """Alle bron-PNG's, latere batch wint van eerdere, assets/gpt los wint van batches."""
    gevonden = {}
    mappen = sorted(glob.glob(os.path.join(GPT, 'batch*')), key=lambda p: int(re.search(r'(\d+)$', p).group(1)) if re.search(r'(\d+)$', p) else 0)
    mappen.append(GPT)
    for mp in mappen:
        for p in glob.glob(os.path.join(mp, '*.png')):
            sleutel = os.path.splitext(os.path.basename(p))[0].lower()
            gevonden[sleutel] = p
    return gevonden


def bbox(im):
    a = im.split()[-1].point(lambda v: 255 if v > ALPHA_DREMPEL else 0)
    return a.getbbox()


def snij(bron, sleutel):
    """Snijdt lege randen weg; geeft (pad, info) terug. Voetpositie = onderkant van de inhoud."""
    im = Image.open(bron).convert('RGBA')
    b = bbox(im)
    if not b:
        return None
    uit = im.crop(b)
    pad = os.path.join(SPEL, sleutel + '.png')
    if not (os.path.exists(pad) and os.path.getmtime(pad) >= os.path.getmtime(bron)):
        uit.save(pad, optimize=True)
    return pad, {'w': uit.width, 'h': uit.height, 'bron': os.path.relpath(bron, ASSETS).replace('\\', '/')}


def maak_sheet(sleutel, frames_paden):
    """Zet losse frames op één rij met gelijke baseline en celmaat."""
    beelden = []
    for p in frames_paden:
        im = Image.open(p).convert('RGBA')
        b = bbox(im)
        beelden.append(im.crop(b) if b else im)
    cw = max(i.width for i in beelden)
    ch = max(i.height for i in beelden)
    sheet = Image.new('RGBA', (cw * len(beelden), ch), (0, 0, 0, 0))
    for n, im in enumerate(beelden):
        sheet.paste(im, (n * cw + (cw - im.width) // 2, ch - im.height))
    pad = os.path.join(SPEL, sleutel + '.png')
    sheet.save(pad, optimize=True)
    return pad, {'w': cw, 'h': ch, 'frames': len(beelden), 'sheet': True}


def knip_raster(bron, sleutel, kolommen=4, rijen=2):
    """fx-raster van GPT: knipt per cel, snijdt elke cel gelijk (gezamenlijke bbox) en zet ze op één rij."""
    im = Image.open(bron).convert('RGBA')
    cw, ch = im.width // kolommen, im.height // rijen
    cellen = [im.crop((k * cw, r * ch, (k + 1) * cw, (r + 1) * ch)) for r in range(rijen) for k in range(kolommen)]
    boxen = [bbox(c) for c in cellen]
    boxen = [b for b in boxen if b]
    if not boxen:
        return None
    x0 = min(b[0] for b in boxen); y0 = min(b[1] for b in boxen)
    x1 = max(b[2] for b in boxen); y1 = max(b[3] for b in boxen)
    fw, fh = x1 - x0, y1 - y0
    sheet = Image.new('RGBA', (fw * len(cellen), fh), (0, 0, 0, 0))
    for n, c in enumerate(cellen):
        sheet.paste(c.crop((x0, y0, x1, y1)), (n * fw, 0))
    pad = os.path.join(SPEL, sleutel + '.png')
    sheet.save(pad, optimize=True)
    return pad, {'w': fw, 'h': fh, 'frames': len(cellen), 'sheet': True}


def maak_herhaalbaar(bron, sleutel):
    """Parallaxlaag: naast zichzelf gespiegeld plakken zodat de naad verdwijnt."""
    im = Image.open(bron).convert('RGBA')
    # GPT laat de zijranden vervagen; die stroken eraf, anders ontstaat een donkere band op de naad
    m = int(im.width * 0.06)
    im = im.crop((m, 0, im.width - m, im.height))
    uit = Image.new('RGBA', (im.width * 2, im.height))
    uit.paste(im, (0, 0))
    uit.paste(im.transpose(Image.FLIP_LEFT_RIGHT), (im.width, 0))
    pad = os.path.join(SPEL, sleutel + '.png')
    uit.save(pad, optimize=True)
    return pad, {'w': uit.width, 'h': uit.height, 'laag': True}


TEGEL_NAMEN = [
    ['tegel_rand_links', 'tegel_grond', 'tegel_rand_rechts', 'tegel_vulling'],
    ['tegel_helling_op', 'tegel_helling_af', 'tegel_muur', 'tegel_plafond'],
    ['tegel_platform_links', 'tegel_platform', 'tegel_platform_rechts', 'tegel_haakplafond'],
]


def knip_tegelblad(bron, manifest):
    """Tegelblad van GPT (3 rijen x 4 stukken) opdelen op basis van lege banden in het alfakanaal.
    Alleen gebruikt zolang er geen losse tegel_*-bestanden zijn."""
    im = Image.open(bron).convert('RGBA')
    a = im.split()[-1]
    w, h = im.size
    px = a.load()
    rijen = [any(px[x, y] > 8 for x in range(0, w, 2)) for y in range(h)]
    banden, start = [], None
    for y, v in enumerate(rijen + [False]):
        if v and start is None:
            start = y
        if not v and start is not None:
            if y - start > 20:
                banden.append((start, y))
            start = None
    for r, (y0, y1) in enumerate(banden[:3]):
        kolommen = [any(px[x, y] > 8 for y in range(y0, y1, 2)) for x in range(w)]
        stukken, s = [], None
        for x, v in enumerate(kolommen + [False]):
            if v and s is None:
                s = x
            if not v and s is not None:
                if x - s > 20:
                    stukken.append((s, x))
                s = None
        for k, (x0, x1) in enumerate(stukken[:4]):
            naam = TEGEL_NAMEN[r][k]
            if naam in manifest:
                continue
            stuk = im.crop((x0, y0, x1, y1))
            b = bbox(stuk)
            if b:
                stuk = stuk.crop(b)
            # middenstukken: randen eraf zodat ze herhaald kunnen worden
            if naam in ('tegel_grond', 'tegel_platform', 'tegel_vulling', 'tegel_muur', 'tegel_plafond'):
                m = 14
                stuk = stuk.crop((m, 0, stuk.width - m, stuk.height)) if naam != 'tegel_muur' else stuk.crop((0, m, stuk.width, stuk.height - m))
                if naam == 'tegel_vulling':
                    stuk = stuk.crop((0, m, stuk.width, stuk.height - m))
            pad = os.path.join(SPEL, naam + '.png')
            stuk.save(pad, optimize=True)
            manifest[naam] = {'w': stuk.width, 'h': stuk.height, 'bron': os.path.relpath(bron, ASSETS).replace('\\', '/'), 'pad': os.path.relpath(pad, ASSETS).replace('\\', '/')}


UI_NAMEN = [['ui_knop', 'ui_knop_in'], ['ui_rond', 'ui_rond_in'], ['ui_paneel', 'ui_paneel_smal']]


def knip_blad(bron, manifest, namen, kolommen):
    """Algemeen blad (rijen x kolommen) opdelen op lege banden in het alfakanaal."""
    im = Image.open(bron).convert('RGBA')
    a = im.split()[-1]
    w, h = im.size
    px = a.load()
    rijen = [any(px[x, y] > 8 for x in range(0, w, 2)) for y in range(h)]
    banden, start = [], None
    for y, v in enumerate(rijen + [False]):
        if v and start is None:
            start = y
        if not v and start is not None:
            if y - start > 20:
                banden.append((start, y))
            start = None
    for r, (y0, y1) in enumerate(banden[:len(namen)]):
        kol = [any(px[x, y] > 8 for y in range(y0, y1, 2)) for x in range(w)]
        stukken, s = [], None
        for x, v in enumerate(kol + [False]):
            if v and s is None:
                s = x
            if not v and s is not None:
                if x - s > 20:
                    stukken.append((s, x))
                s = None
        for k, (x0, x1) in enumerate(stukken[:kolommen]):
            naam = namen[r][k]
            if naam in manifest:
                continue
            stuk = im.crop((x0, y0, x1, y1))
            b = bbox(stuk)
            if b:
                stuk = stuk.crop(b)
            pad = os.path.join(SPEL, naam + '.png')
            stuk.save(pad, optimize=True)
            manifest[naam] = {'w': stuk.width, 'h': stuk.height, 'bron': os.path.relpath(bron, ASSETS).replace(os.sep, '/'), 'pad': os.path.relpath(pad, ASSETS).replace(os.sep, '/')}


def main():
    pak_batches_uit()
    bron = bronnen()
    manifest = {}
    reeksen = {}
    for sleutel, p in sorted(bron.items()):
        m = re.match(r'(.+)_ren_(\d+)$', sleutel)
        if m:
            reeksen.setdefault(m.group(1) + '_ren', []).append((int(m.group(2)), p))
            continue
        try:
            if sleutel.startswith('fx_'):
                r = knip_raster(p, sleutel)
            elif re.match(r'(bos|industrie|kust|oertijd)_(lucht|ver|midden|dichtbij|voor)$', sleutel):
                r = maak_herhaalbaar(p, sleutel)
            else:
                r = snij(p, sleutel)
        except Exception as e:
            print('FOUT', sleutel, e)
            continue
        if r:
            pad, info = r
            info['pad'] = os.path.relpath(pad, ASSETS).replace('\\', '/')
            manifest[sleutel] = info
    for sleutel, lijst in reeksen.items():
        lijst.sort()
        pad, info = maak_sheet(sleutel, [p for _, p in lijst])
        info['pad'] = os.path.relpath(pad, ASSETS).replace('\\', '/')
        manifest[sleutel] = info
    if 'ui_knoppen' in bron:
        knip_blad(bron['ui_knoppen'], manifest, UI_NAMEN, 2)
    if 'ui_plekken' in bron:
        knip_blad(bron['ui_plekken'], manifest, [['ui_plek_1', 'ui_plek_2', 'ui_plek_3', 'ui_plek_4']], 4)
    for wereld in ('bos', 'industrie', 'kust', 'oertijd'):
        if wereld + '_tegels' in bron and 'tegel_grond' not in manifest:
            knip_tegelblad(bron[wereld + '_tegels'], manifest)
    for info in manifest.values():
        info['v'] = int(os.path.getmtime(os.path.join(ASSETS, info['pad'])))
    # Audio uit de gratis packs, op sleutelnaam.
    audio = {}
    for p in glob.glob(os.path.join(ASSETS, 'gratis', 'audio', '**', '*.ogg'), recursive=True):
        audio[os.path.splitext(os.path.basename(p))[0]] = os.path.relpath(p, ASSETS).replace('\\', '/')
    with open(os.path.join(ASSETS, 'manifest.json'), 'w', encoding='utf-8') as f:
        json.dump({'beelden': manifest, 'audio': audio}, f, indent=1, ensure_ascii=False)
    print(f'{len(manifest)} beelden, {len(audio)} geluiden in manifest.json')
    for s in sorted(manifest):
        print(' ', s, manifest[s].get('w'), 'x', manifest[s].get('h'), 'frames' if manifest[s].get('frames') else '')


if __name__ == '__main__':
    main()
