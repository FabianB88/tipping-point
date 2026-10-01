// Bot-invoer. Gebruikt dezelfde controller als de speler; alleen de invoer komt hiervandaan.
// Drie lagen: looprichting uit het circuit, generiek vooruitkijken (gaten, muren, lage plafonds, obstakels, vijanden,
// platforms omhoog bij een klim) en de cues uit de baandata.
window.TP = window.TP || {};

TP.Bot = class {
  constructor(scene, vaardigheid) {
    this.scene = scene;
    this.s = vaardigheid;                           // 0.6 .. 0.95
    this.route = vaardigheid > 0.88 ? 'expert' : vaardigheid > 0.72 ? 'gevaar' : 'veilig';
    this.acties = [];
    this.gedaan = new Set();
    this.tijd = 0;
    this.muurWacht = 0;
    this.herkies = 0;
    this.d = 1;
  }

  // nieuw = een extra druk op de knop plannen naast een lopende actie (dubbele sprong, wall-jump)
  plan(a, vast, vertraging, nieuw) {
    const start = this.tijd + (vertraging || 0);
    if (!nieuw) {
      const bestaand = this.acties.find(q => q.a === a && q.tot > this.tijd);
      if (bestaand) { bestaand.tot = Math.max(bestaand.tot, start + (vast || 0.2)); return; }
    }
    this.acties.push({ tijd: start, a, tot: start + (vast || 0.2), gestart: false });
  }

  actief(a) { return this.acties.some(q => q.a === a && q.tijd <= this.tijd && q.tot > this.tijd); }

  lees(r) {
    const dt = TP.STAP; this.tijd += dt;
    const inp = TP.LegeInvoer();
    const baan = this.scene.baan;
    const been = r.been || baan.beenOp(r.x, r.y);
    const d = this.d = baan.richtingOp(r.x, r.y, r);
    inp.x = d;
    if (r.t.verdoofd > 0) return inp;

    // vastgelopen: even loslaten en laag doorgaan
    if (r.vooruit > (this.beste || 0) + 5) { this.beste = r.vooruit; this.stilSinds = this.tijd; }
    if (this.tijd - (this.stilSinds || 0) > 2.5) { this.omweg = this.tijd + 0.9; this.stilSinds = this.tijd; this.acties.length = 0; }
    if (this.omweg && this.tijd < this.omweg) { inp.x = r.opGrond ? d : 0; inp.slide = r.opGrond; return inp; }

    this.herkies -= dt;
    if (this.herkies <= 0) {
      this.herkies = 6 + Math.random() * 6;
      const k = Math.random();
      this.route = this.s > 0.88 ? (k < 0.8 ? 'expert' : 'gevaar') : this.s > 0.72 ? (k < 0.7 ? 'gevaar' : k < 0.85 ? 'expert' : 'veilig') : (k < 0.7 ? 'veilig' : 'gevaar');
    }

    // cues van de baan (in de looprichting, en op dezelfde hoogte als de cue dat vraagt)
    const kijk = 30 + Math.abs(r.vx) * dt * 2;
    for (const q of baan.cuesTussen(this.route, r.x, r.x + d * kijk)) {
      if (q.richting !== d) continue;
      if (q.y !== undefined && Math.abs(q.y - r.y) > 140) continue;
      const sleutel = q.x + q.a + (q.y || '');
      if (this.gedaan.has(sleutel)) continue;
      this.gedaan.add(sleutel);
      if (Math.random() > this.s) continue;
      const fout = (1 - this.s) * 0.12 * Math.random();
      if (q.a === 'dubbel') { this.plan('spring', 0.25, fout); this.plan('spring', q.vast || 0.3, fout + 0.3); }
      else if (q.a === 'muur') { this.muurWacht = 0.4; }
      else this.plan(q.a, q.vast, fout);
    }
    if (this.gedaan.size > 300) this.gedaan.clear();

    const L = 140 + Math.abs(r.vx) * 0.38;
    const vx = r.x + d * L;
    const lo = Math.min(r.x + d * 40, vx), hi = Math.max(r.x + d * 40, vx);

    if (been && (been.type === 'klim' || been.type === 'daal')) this.klimOfDaal(r, been, inp, d);

    if (r.opGrond && !r.haak) {
      // gat
      const g = baan.grondOnder(vx, r.y, 320, 80, false);
      if (!g && Math.random() < this.s + 0.05 && !(been && been.type === 'daal')) this.plan('spring', 0.3);
      // muur of blok vooruit
      const blok = baan.blokkenIn(lo, r.y - r.hoogte + 12, hi, r.y - 14).find(k => k.y < r.y - 30);
      if (blok) {
        const hoogte = r.y - blok.y;
        const onderkant = blok.y + blok.h;
        if (onderkant < r.y - 10 && onderkant >= r.y - TP.RENNER.hoogte - 20) { if (!this.actief('spring')) this.plan('slide', 0.5); }
        else if (hoogte <= 300) this.plan('spring', 0.3);
        else if (hoogte <= 520 && this.s > 0.65) { this.plan('spring', 0.25); this.plan('spring', 0.3, 0.3); }
        else if (onderkant < r.y - 12 && !this.actief('spring')) this.plan('slide', 0.4);
      }
      // laag plafond vooruit
      const laag = baan.blokkenIn(lo, r.y - TP.RENNER.hoogte - 4, hi, r.y - TP.RENNER.hoogte * 0.5 - 10).find(k => k.y + k.h > r.y - TP.RENNER.hoogte && k.y + k.h < r.y - 20);
      if (laag && !this.actief('spring')) this.plan('slide', 0.35);
      // obstakels en vijanden
      for (const o of baan.objecten) {
        if (!o.levend || (o.type !== 'obstakel' && o.type !== 'vijand' && o.type !== 'val')) continue;
        if (o.zweeft) continue;
        const a = (o.x - r.x) * d;
        if (a < 40 || a > L + 60) continue;
        if (Math.abs(o.y - r.y) > 120) continue;
        if (Math.random() < this.s + 0.03) this.plan('spring', o.type === 'vijand' ? 0.22 : 0.3);
      }
    }
    // wall-jump, maar alleen als de bovenkant van de muur in bereik is; anders loslaten en eronderdoor
    if (r.aanMuur && !r.opGrond) {
      this.muurWacht -= dt;
      const muur = baan.blokkenIn(r.x + r.aanMuur * 40, r.y - r.hoogte, r.x + r.aanMuur * 60, r.y)[0];
      const top = muur ? r.y - muur.y : 0;
      if (muur && top > 520 && !(been && been.type === 'klim')) { this.stuurX = 0; this.acties = this.acties.filter(a => a.a !== 'spring'); }
      else if (this.muurWacht <= 0 && Math.random() < this.s) { this.muurSpring = true; this.muurWacht = 0.25; }
    }
    // haak grijpen bij een val met iets in bereik (goede bots)
    if (!r.opGrond && !r.haak && r.vy > 200 && this.s > 0.8 && Math.random() < 0.03) {
      if (baan.ankerVoor(r.x, r.handY(), d, TP.FYS.haakBereik * 0.8)) this.plan('haak', 0.5);
    }
    // item, kracht, schot
    if (r.item && Math.random() < 0.01) {
      const voor = this.scene.renners.some(a => a !== r && !a.dood && a.vooruit > r.vooruit && a.vooruit - r.vooruit < 1100);
      if (voor || r.item === 'peper' || r.item === 'schild') inp.item = true;
    }
    if (r.t.dashAfkoel <= 0 && Math.random() < 0.004 && r.opGrond) inp.kracht = true;
    if (Math.random() < 0.003) inp.schiet = true;

    // stil aan de haak hangen is nooit de bedoeling: loslaten en springen
    if (r.haak && Math.abs(r.vx) < 80) this.hangTijd = (this.hangTijd || 0) + dt; else this.hangTijd = 0;
    if (this.hangTijd > 0.4) { this.acties = this.acties.filter(a => a.a !== 'haak'); this.hangTijd = 0; this.plan('spring', 0.3, 0, true); }

    // acties uitvoeren
    const nu = this.tijd;
    this.acties = this.acties.filter(a => a.tot > nu);
    for (const a of this.acties) {
      if (a.tijd > nu) continue;
      if (a.a === 'spring') { if (!a.gestart) { inp.spring = true; a.gestart = true; } inp.springVast = true; }
      if (a.a === 'slide') inp.slide = true;
      if (a.a === 'haak') inp.haak = true;
    }
    if (this.muurSpring) { this.muurSpring = false; this.plan('spring', 0.22, 0, true); }
    if (inp.springVast || !r.opGrond) inp.slide = inp.slide && r.opGrond && !inp.springVast;
    if (this.stuurX !== undefined) { inp.x = this.stuurX; this.stuurX = undefined; }
    return inp;
  }

  // Klimmen: naar het dichtstbijzijnde bereikbare platform boven je lopen en springen. Expert neemt de schacht (wall-jumps).
  // Dalen: gewoon doorlopen in de looprichting; de platforms vangen je op.
  klimOfDaal(r, been, inp, d) {
    const baan = this.scene.baan;
    if (been.type === 'daal') return;
    // de schacht alleen vanaf de vloer; wie al op de platforms zit, klimt verder via de platforms
    // de wall-jump-schacht is voor spelers; bots nemen de platforms (de schacht-AI is nog te wisselvallig)
    const schacht = false && this.route === 'expert' && this.s > 0.85 && (r.y > been.yMax - 150 || (been.schacht && r.x > been.schacht[0] + 20));
    if (schacht && been.schacht) {
      // eerst onder de binnenmuur door tot in de schacht, dan rechts tegen de buitenmuur drukken; de wall-jumps doen de rest
      this.stuurX = 1;
      const inSchacht = r.x > been.schacht[0] + 20;
      if (!inSchacht) { this.acties = this.acties.filter(a => a.a !== 'spring'); if (r.opGrond) this.plan('slide', 0.2); return; }
      if (r.opGrond && !this.actief('spring')) this.plan('spring', 0.3);
      if (r.aanMuur && !r.opGrond) { this.muurWacht -= TP.STAP; if (this.muurWacht <= 0) { this.muurSpring = true; this.muurWacht = 0.22; } }
      return;
    }
    // vaste waypoints per niveau (uit de baandata): ga staan, spring dubbel, stuur in de lucht naar het volgende niveau
    if (been.niveaus) {
      let niveau = 0;
      for (let i = 0; i < been.niveaus.length; i++) if (r.y <= been.niveaus[i].y + 12) niveau = i;
      const volgende = been.niveaus[Math.min(niveau + 1, been.niveaus.length - 1)];
      if (niveau >= been.niveaus.length - 1) {
        // boven: de kant op van het volgende been (bij ons altijd naar links de bovenbaan op)
        const benen = baan.benen, volgendBeen = benen[(benen.indexOf(been) + 1) % benen.length];
        this.stuurX = volgendBeen.type === 'links' ? -1 : 1;
        return;
      }
      const wp = r.opGrond ? been.niveaus[niveau].x : volgende.x;
      const dx = wp - r.x;
      this.stuurX = Math.abs(dx) < 30 ? (Math.abs(r.vx) > 150 ? -Math.sign(r.vx) : 0) : Math.sign(dx);
      if (r.opGrond && Math.abs(dx) < 70 && Math.abs(r.vx) < 350 && !this.actief('spring')) { this.plan('spring', 0.3); this.plan('spring', 0.3, 0.28, true); }
      if (!r.opGrond && r.vy > 0 && r.sprongen > 0 && r.y > volgende.y + 60 && Math.random() < 0.5) this.plan('spring', 0.3, 0, true);
      return;
    }
    // volgende platform boven je
    let doel = null, bestDy = Infinity;
    for (const s of baan.grond) {
      if (!s.oneWay || s.x1 < been.x1 || s.x2 > been.x2) continue;   // alleen de platforms van de klim zelf
      const dy = r.y - s.y1;
      if (dy < 120 || dy > 460) continue;
      if (dy < bestDy) { bestDy = dy; doel = s; }
    }
    if (!doel) return;
    const midden = (doel.x1 + doel.x2) / 2;
    // mik op het stuk van het doelplatform dat boven je eigen platform hangt (de overlap), en sta stil voor je springt
    const huidig = r.opGrond ? r.grondSeg : null;
    const doelX = huidig ? Phaser.Math.Clamp(midden, huidig.x1 + 50, huidig.x2 - 50) : midden;
    const afstand = doelX - r.x;
    this.stuurX = Math.abs(afstand) < 40 ? (Math.abs(r.vx) > 200 ? -Math.sign(r.vx) : 0) : Math.sign(afstand);
    const dichtst = Phaser.Math.Clamp(r.x, doel.x1, doel.x2);
    const gat = Math.abs(dichtst - r.x);
    if (r.opGrond && Math.abs(afstand) < 120 && Math.abs(r.vx) < 500 && !this.actief('spring')) { this.plan('spring', 0.3); if (bestDy > 260 || gat > 60) this.plan('spring', 0.3, 0.3, true); }
    if (!r.opGrond && r.vy > 0 && r.sprongen > 0 && r.y - doel.y1 > 100 && gat < 200 && Math.random() < 0.4) this.plan('spring', 0.3);
  }
};
