# Tipping Point: overdracht aan GPT Work

Browsergame (Phaser 3.90, geen bundler). Start: `python -m http.server 5180` in de projectmap, open http://localhost:5180.

Lees in deze volgorde: `docs/PLAN.md` (ontwerp en de lat), `docs/CODEMAP.md` (bestanden en de race-lus), `docs/ARTWORK-LOG.md` (welk artwork er is).

Mappen in deze zip:
- `index.html`, `src/` (alle code), `lib/phaser.min.js`
- `assets/manifest.json` + `assets/spel/` (alle sprites die de game laadt, al bewerkt)
- `assets/gratis/` (alleen de gebruikte Kenney-particles, de gebruikte geluiden en de twee lettertypen)
- `tools/assets.py` (pipeline die nieuwe GPT-artwork verwerkt; niet nodig om te spelen)
- `docs/GPT-PROMPTS.md` (prompts voor nog te maken artwork: andere dieren, andere werelden)

Alle artwork is al van hoog niveau en mag blijven. De code mag volledig herschreven worden, zolang de structuur (manifest + assets/spel) en de bestandsnamen blijven werken.
