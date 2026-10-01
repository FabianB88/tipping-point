// Geluid: Kenney-bestanden (CC0) uit assets/gratis/audio via het manifest, plus gesynthetiseerd vuurgeruis.
window.TP = window.TP || {};

TP.GELUIDEN = {
  sprong: ['phaseJump1'], dubbelesprong: ['phaseJump3'], land: ['footstep_grass_000', 'footstep_grass_001', 'footstep_grass_002'],
  landHard: ['impactPlank_medium_000', 'impactPlank_medium_002'], slide: ['scratch_002'], muursprong: ['impactPlank_medium_003'],
  muur: ['footstep_wood_001'], haak: ['pluck_001'], haakLos: ['phaserUp2'], klap: ['impactMetal_light_001', 'error_005'],
  stamp: ['impactGeneric_light_003'], boost: ['powerUp4'], krat: ['drop_002'], rakelings: ['twoTone1'], dash: ['phaserUp4'],
  schiet: ['laser4'], item: ['powerUp7'], schildBreekt: ['impactGlass_light_002'], kop: ['impactGeneric_light_000'],
  dood: ['lowDown'], uit: ['lowThreeTone'], winst: ['jingles_SAX00'], verlies: ['jingles_NES09'], klik: ['click_001'],
  bevestig: ['confirmation_001'], fout: ['error_002'], tel: ['tone1'], start: ['threeTone1'], tussentijd: ['select_001'],
  bevroren: ['glass_002'], traag: ['minimize_003'],
  nodig() { return [...new Set(Object.values(this).flat().filter(v => typeof v === 'string'))]; }
};

TP.Geluid = class {
  constructor(scene) {
    this.scene = scene;
    this.laatst = {};
    this.vuur = null;
  }
  speel(naam, opties) {
    const lijst = TP.GELUIDEN[naam];
    if (!lijst) return;
    const nu = this.scene.time.now;
    if (this.laatst[naam] && nu - this.laatst[naam] < 60) return;   // niet stapelen
    this.laatst[naam] = nu;
    const sleutel = 'snd_' + Phaser.Utils.Array.GetRandom(lijst);
    if (!this.scene.cache.audio.exists(sleutel)) return;
    const o = Object.assign({ volume: 0.5 }, opties || {});
    o.rate = (o.rate || 1) * (0.94 + Math.random() * 0.12);
    this.scene.sound.play(sleutel, o);
  }
  // Vuurgeruis: gefilterde ruis, volume stuurbaar met nabijheid van het front.
  startVuur() {
    const sm = this.scene.sound;
    if (!sm.context || this.vuur) return;
    const ctx = sm.context;
    const n = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
    const bron = ctx.createBufferSource(); bron.buffer = buf; bron.loop = true;
    const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 900;
    const gain = ctx.createGain(); gain.gain.value = 0;
    bron.connect(filter); filter.connect(gain); gain.connect(sm.destination || ctx.destination);
    bron.start();
    this.vuur = { bron, gain, filter };
  }
  vuurVolume(v) { if (this.vuur) this.vuur.gain.gain.setTargetAtTime(Math.max(0, Math.min(0.6, v)), this.scene.sound.context.currentTime, 0.15); }
  stopVuur() { if (this.vuur) { try { this.vuur.bron.stop(); } catch (e) {} this.vuur = null; } }
};
