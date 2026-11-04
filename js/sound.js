"use strict";
/* Repris tel quel de Kiboo (MowgAI/Kiboo, js/sound.js) pour la parade de Kimind, qui
   utilise les musiques des familles et le bruit de chaque personnage.
   =====================================================================
   MUSIQUES ET BRUITAGES, façon jeu vidéo rétro (Web Audio, rien à
   télécharger, tout est composé ici).
   - Plusieurs musiques en boucle, tirées au hasard pour ne pas se lasser :
     trois pour l'accueil, deux plus calmes pour la partie (réglage
     « Musique »), et une par famille pour les présentations et la parade :
     animaux (comptine sautillante parsemée de cris d'animaux), dinosaures
     (marche lourde avec des rugissements), robots (arpèges futuristes et
     bips), métiers (petite fanfare).
   - Un bruit par personnage quand il se présente (miaou, ouaf, rugissement,
     bips, sirène…), voir CHARACTER.
   - Des bruitages de jeu (réglage « Bruitages ») : carte posée, pli gagné
     ou perdu, résultat, bonne ou mauvaise réponse, cadeau, distribution.
   Les navigateurs n'autorisent le son qu'après un premier clic ou une
   touche : tout démarre à ce moment-là. La musique baisse quand la voix
   parle.
   ===================================================================== */
const Sound = (() => {
  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx = null, master, musicGain, sfxGain, noiseBuf;
  let want = null;                    // musique demandée : null, "intro", "game" ou "fam0"…"fam3"
  let loop = null;                    // musique en cours : { timer, track }

  // Le son ne peut démarrer qu'après un geste du joueur.
  function unlock() {
    if (!AC) return;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 1; master.connect(ctx.destination);
      musicGain = ctx.createGain(); musicGain.gain.value = 0; musicGain.connect(master);
      sfxGain = ctx.createGain(); sfxGain.gain.value = 0.32; sfxGain.connect(master);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === "suspended") ctx.resume();
    if (want && !loop) startLoop();
  }
  for (const ev of ["pointerdown", "keydown"]) window.addEventListener(ev, unlock, { capture: true });

  const hz = midi => 440 * Math.pow(2, (midi - 69) / 12);
  const pick = list => list[Math.floor(Math.random() * list.length)];

  /* ---------- Briques de son ---------- */
  // Une note : oscillateur avec enveloppe ; glissando vers `to`, vibrato (vib = [vitesse, ampleur]), filtre.
  function tone(out, { f, t, d, type = "square", v = 0.3, to = null, mid = null, vib = null, lp = null, bp = null, q = 1 }) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (mid) { o.frequency.linearRampToValueAtTime(mid, t + d * 0.4); if (to) o.frequency.linearRampToValueAtTime(to, t + d); }
    else if (to) o.frequency.exponentialRampToValueAtTime(to, t + d);
    if (vib) {
      const l = ctx.createOscillator(), lg = ctx.createGain();
      l.frequency.value = vib[0]; lg.gain.value = vib[1];
      l.connect(lg).connect(o.frequency);
      l.start(t); l.stop(t + d + 0.02);
    }
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + Math.min(0.02, d / 4));
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    let node = o;
    if (lp || bp) {
      const flt = ctx.createBiquadFilter();
      flt.type = lp ? "lowpass" : "bandpass";
      flt.frequency.value = lp || bp; flt.Q.value = q;
      node = node.connect(flt);
    }
    node.connect(g).connect(out);
    o.start(t);
    o.stop(t + d + 0.02);
  }
  // Un souffle de bruit blanc filtré (glissé de `f` vers `to`).
  function noise(out, { t, d, v = 0.2, hp = null, lp = null, bp = null, f = null, to = null, q = 1 }) {
    const s = ctx.createBufferSource(), flt = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf;
    flt.type = hp ? "highpass" : lp ? "lowpass" : "bandpass";
    flt.frequency.setValueAtTime(f || hp || lp || bp || 1000, t);
    if (to) flt.frequency.exponentialRampToValueAtTime(to, t + d);
    flt.Q.value = q;
    g.gain.setValueAtTime(v, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    s.connect(flt).connect(g).connect(out);
    s.start(t);
    s.stop(t + d + 0.02);
  }

  /* ---------- Les bruits (cris d'animaux, robots, métiers, jeu) ----------
     Chaque bruit : (t, out) → joue à l'instant t sur la sortie out. */
  const S = {
    // Animaux
    squeak: (t, o) => { tone(o, { f: 2200, to: 3200, t, d: 0.08, type: "sine", v: 0.25 }); tone(o, { f: 2400, to: 3400, t: t + 0.12, d: 0.08, type: "sine", v: 0.25 }); },
    chirp: (t, o) => [0, 0.09, 0.18].forEach(x => tone(o, { f: 3000, to: 4600, t: t + x, d: 0.06, type: "sine", v: 0.2 })),
    meow: (t, o) => tone(o, { f: 430, mid: 820, to: 400, t, d: 0.7, type: "sawtooth", v: 0.35, bp: 1300, q: 2 }),
    woof: (t, o) => [0, 0.22].forEach(x => { noise(o, { t: t + x, d: 0.1, v: 0.35, lp: 900 }); tone(o, { f: 260, to: 140, t: t + x, d: 0.13, type: "sawtooth", v: 0.3, lp: 1200 }); }),
    oink: (t, o) => [0, 0.3].forEach(x => tone(o, { f: 190, to: 150, t: t + x, d: 0.24, type: "square", v: 0.25, vib: [32, 45], lp: 900 })),
    yip: (t, o) => { tone(o, { f: 900, to: 1500, t, d: 0.1, type: "sine", v: 0.3 }); tone(o, { f: 1000, to: 1700, t: t + 0.15, d: 0.12, type: "sine", v: 0.3 }); },
    purr: (t, o) => tone(o, { f: 85, t, d: 0.8, type: "sawtooth", v: 0.4, vib: [24, 12], lp: 380 }),
    growl: (t, o) => { tone(o, { f: 110, to: 80, t, d: 0.7, type: "sawtooth", v: 0.4, vib: [18, 10], lp: 500 }); noise(o, { t, d: 0.6, v: 0.15, lp: 400 }); },
    munch: (t, o) => [0, 0.14, 0.28].forEach(x => noise(o, { t: t + x, d: 0.07, v: 0.3, bp: 1600, q: 2 })),
    boing: (t, o) => tone(o, { f: 160, to: 640, t, d: 0.35, type: "sine", v: 0.35, vib: [14, 30] }),
    // Dinosaures (plus le dino est fort, plus il rugit grave et longtemps)
    roar: (t, o, size = 5) => {
      const k = 1 - size / 14;
      noise(o, { t, d: 0.5 + size * 0.06, v: 0.35, f: 700 * k + 200, to: 160, bp: 600, q: 0.7 });
      tone(o, { f: 160 * k + 50, to: 45, t, d: 0.5 + size * 0.06, type: "sawtooth", v: 0.3, vib: [11, 8], lp: 600 });
    },
    screech: (t, o) => tone(o, { f: 1900, to: 1100, t, d: 0.45, type: "sawtooth", v: 0.25, bp: 2200, q: 3, vib: [20, 60] }),
    stomp: (t, o) => { tone(o, { f: 90, to: 38, t, d: 0.3, type: "sine", v: 0.6 }); noise(o, { t, d: 0.12, v: 0.2, lp: 300 }); },
    // Robots
    bleeps: (t, o, seed = 3) => [0, 1, 2, 3, 4].forEach(i => tone(o, { f: hz(76 + ((seed * 7 + i * 5) % 12) * 2), t: t + i * 0.07, d: 0.06, type: "square", v: 0.15 })),
    ratchet: (t, o) => { for (let i = 0; i < 7; i++) noise(o, { t: t + i * 0.05, d: 0.02, v: 0.3, hp: 3000 }); },
    rollbeep: (t, o) => tone(o, { f: 600, to: 1200, t, d: 0.25, type: "square", v: 0.12, vib: [20, 80] }),
    bulb: (t, o) => { tone(o, { f: 1760, t, d: 0.7, type: "sine", v: 0.25 }); tone(o, { f: 2637, t, d: 0.5, type: "sine", v: 0.1 }); },
    shutter: (t, o) => { noise(o, { t, d: 0.02, v: 0.4, hp: 2000 }); noise(o, { t: t + 0.07, d: 0.04, v: 0.35, hp: 1500 }); },
    servo: (t, o) => [0, 0.25].forEach(x => tone(o, { f: 300, to: 520, t: t + x, d: 0.2, type: "sawtooth", v: 0.12, lp: 1200 })),
    clank: (t, o) => [0, 0.12].forEach(x => { tone(o, { f: 420, t: t + x, d: 0.2, type: "square", v: 0.12 }); tone(o, { f: 610, t: t + x, d: 0.15, type: "square", v: 0.08 }); }),
    spacey: (t, o) => tone(o, { f: 300, to: 1800, t, d: 0.9, type: "sine", v: 0.2, vib: [6, 40] }),
    scan: (t, o) => [0, 0.18, 0.36].forEach(x => tone(o, { f: 1200, to: 2400, t: t + x, d: 0.14, type: "triangle", v: 0.18 })),
    fanfareBot: (t, o) => [72, 76, 79, 84].forEach((n, i) => tone(o, { f: hz(n), t: t + i * 0.09, d: 0.16, type: "sawtooth", v: 0.12, lp: 2500 })),
    // Métiers
    whistle: (t, o) => tone(o, { f: 2600, t, d: 0.45, type: "sine", v: 0.22, vib: [28, 140] }),
    refwhistle: (t, o) => [[0, 0.12], [0.18, 0.12], [0.36, 0.45]].forEach(([x, d]) => tone(o, { f: 2900, t: t + x, d, type: "sine", v: 0.2, vib: [30, 150] })),
    sparkle: (t, o) => [88, 91, 96, 100, 103].forEach((n, i) => tone(o, { f: hz(n), t: t + i * 0.06, d: 0.2, type: "sine", v: 0.13 })),
    hooves: (t, o) => [0, 0.14, 0.32, 0.46, 0.64, 0.78].forEach((x, i) => tone(o, { f: i % 2 ? 700 : 900, t: t + x, d: 0.05, type: "sine", v: 0.28 })),
    forest: (t, o) => { tone(o, { f: 2000, mid: 2600, to: 1900, t, d: 0.3, type: "sine", v: 0.15 }); tone(o, { f: 2200, mid: 2900, to: 2100, t: t + 0.4, d: 0.3, type: "sine", v: 0.15 }); },
    hmm: (t, o) => tone(o, { f: 180, mid: 210, to: 160, t, d: 0.6, type: "triangle", v: 0.35 }),
    heartbeat: (t, o) => [0, 0.16, 0.7, 0.86].forEach(x => tone(o, { f: 70, to: 45, t: t + x, d: 0.14, type: "sine", v: 0.55 })),
    siren: (t, o) => [0, 0.32, 0.64, 0.96].forEach((x, i) => tone(o, { f: i % 2 ? 680 : 960, t: t + x, d: 0.3, type: "sawtooth", v: 0.1, lp: 2000 })),
    rocket: (t, o) => { noise(o, { t, d: 1.1, v: 0.3, f: 200, to: 3000, bp: 400, q: 0.8 }); tone(o, { f: 80, to: 400, t, d: 1.1, type: "sawtooth", v: 0.1, lp: 800 }); },
    bubbles: (t, o) => [0, 0.08, 0.15, 0.24, 0.3, 0.4].forEach(x => tone(o, { f: 400 + Math.random() * 500, to: 1400, t: t + x, d: 0.06, type: "sine", v: 0.18 })),
    // Jeu
    card: (t, o) => { noise(o, { t, d: 0.05, v: 0.25, hp: 2500 }); tone(o, { f: 660, t, d: 0.05, type: "square", v: 0.06 }); },
    deal: (t, o) => noise(o, { t, d: 0.03, v: 0.12, hp: 4000 }),
    trickWin: (t, o) => [72, 76, 79].forEach((n, i) => tone(o, { f: hz(n), t: t + i * 0.07, d: 0.12, v: 0.18 })),
    trickLose: (t, o) => tone(o, { f: hz(60), t, d: 0.22, type: "triangle", v: 0.35, to: hz(55) }),
    ok: (t, o) => { tone(o, { f: hz(76), t, d: 0.1, v: 0.2 }); tone(o, { f: hz(84), t: t + 0.09, d: 0.22, v: 0.2 }); },
    ko: (t, o) => { tone(o, { f: hz(64), t, d: 0.14, type: "triangle", v: 0.35 }); tone(o, { f: hz(60), t: t + 0.13, d: 0.25, type: "triangle", v: 0.35 }); },
    gift: (t, o) => [79, 84, 88, 91, 96].forEach((n, i) => tone(o, { f: hz(n), t: t + i * 0.06, d: 0.18, v: 0.15 })),
    win: (t, o) => [[72, 0], [76, 0.12], [79, 0.24], [84, 0.36], [79, 0.5], [84, 0.62]].forEach(([n, d], i) =>
      tone(o, { f: hz(n), t: t + d, d: i === 5 ? 0.5 : 0.13, v: 0.2 })),
    tie: (t, o) => { tone(o, { f: hz(72), t, d: 0.18, v: 0.18 }); tone(o, { f: hz(72), t: t + 0.22, d: 0.3, v: 0.18 }); },
    lose: (t, o) => [[67, 0], [66, 0.22], [65, 0.44]].forEach(([n, d], i) =>
      tone(o, { f: hz(n), t: t + d, d: i === 2 ? 0.6 : 0.2, type: "triangle", v: 0.35, to: i === 2 ? hz(60) : null })),
    click: (t, o) => tone(o, { f: 880, t, d: 0.04, v: 0.08 }),
  };

  // Le bruit de chaque personnage : [bruit, paramètre éventuel]. Clé : couleur-valeur.
  const CHARACTER = {
    "blue-1": ["squeak"], "blue-2": ["chirp"], "blue-3": ["meow"], "blue-4": ["woof"], "blue-5": ["oink"],
    "blue-6": ["yip"], "blue-7": ["purr"], "blue-8": ["growl"], "blue-9": ["munch"], "blue-10": ["boing"],
    "green-1": ["chirp"], "green-2": ["roar", 2], "green-3": ["roar", 4], "green-4": ["roar", 5], "green-5": ["screech"],
    "green-6": ["roar", 3], "green-7": ["roar", 6], "green-8": ["roar", 8], "green-9": ["roar", 9], "green-10": ["roar", 12],
    "red-1": ["ratchet"], "red-2": ["rollbeep"], "red-3": ["bleeps", 3], "red-4": ["bulb"], "red-5": ["shutter"],
    "red-6": ["servo"], "red-7": ["clank"], "red-8": ["spacey"], "red-9": ["scan"], "red-10": ["fanfareBot"],
    "yellow-1": ["whistle"], "yellow-2": ["sparkle"], "yellow-3": ["hooves"], "yellow-4": ["forest"], "yellow-5": ["refwhistle"],
    "yellow-6": ["hmm"], "yellow-7": ["heartbeat"], "yellow-8": ["siren"], "yellow-9": ["rocket"], "yellow-10": ["bubbles"],
  };

  /* ---------- Les musiques ----------
     Une piste : tempo (croches par minute = tempo × 2), mélodie en croches
     (0 = silence), basse en noires, batterie (une lettre par croche : k
     grosse caisse, s caisse claire, h charleston, x grosse caisse + charleston,
     . rien), timbres, et `sprinkle` : un bruit tiré au hasard toutes les
     `every` mesures (cris d'animaux, rugissements, bips). */
  const TRACKS = {
    intro: [
      { name: "Kiboo", tempo: 140, vol: 0.16, mv: 0.18, drums: ".h.h.h.h",
        melody: [72, 76, 79, 76, 72, 76, 79, 84, 81, 79, 76, 72, 74, 76, 72, 0, 77, 81, 84, 81, 77, 81, 84, 86, 83, 79, 74, 79, 83, 86, 83, 79,
          84, 0, 79, 0, 76, 79, 84, 88, 86, 84, 81, 76, 81, 84, 81, 0, 77, 81, 84, 81, 79, 83, 86, 83, 84, 0, 79, 0, 72, 0, 0, 0],
        bass: [48, 55, 48, 55, 45, 52, 45, 52, 41, 48, 41, 48, 43, 50, 43, 50, 48, 55, 48, 55, 45, 52, 45, 52, 41, 48, 43, 50, 48, 55, 48, 0] },
      { name: "Hop", tempo: 152, vol: 0.15, mv: 0.17, drums: "khshkhsh",
        melody: [67, 71, 74, 71, 72, 76, 79, 76, 74, 78, 81, 78, 79, 0, 74, 0, 72, 76, 79, 76, 74, 71, 67, 71, 69, 72, 74, 78, 79, 0, 0, 0,
          79, 0, 76, 0, 74, 76, 79, 83, 81, 79, 78, 76, 74, 0, 78, 0, 76, 74, 72, 71, 69, 71, 72, 74, 79, 74, 71, 74, 67, 0, 0, 0],
        bass: [43, 50, 43, 50, 48, 55, 50, 57, 48, 55, 43, 50, 50, 57, 43, 50, 43, 50, 48, 55, 50, 57, 50, 57, 48, 55, 50, 57, 43, 50, 43, 0] },
      { name: "Aventure", tempo: 132, vol: 0.15, mv: 0.17, drums: "k.h.s.h.",
        melody: [69, 72, 76, 72, 74, 72, 71, 67, 69, 0, 76, 0, 81, 79, 76, 74, 72, 74, 76, 79, 77, 76, 74, 72, 71, 72, 74, 71, 69, 0, 0, 0,
          76, 0, 81, 0, 79, 77, 76, 74, 72, 0, 77, 0, 76, 74, 72, 71, 72, 74, 76, 77, 79, 77, 76, 74, 76, 72, 71, 68, 69, 0, 0, 0],
        bass: [45, 52, 45, 52, 41, 48, 41, 48, 43, 50, 43, 50, 45, 52, 45, 52, 45, 52, 45, 52, 41, 48, 41, 48, 43, 50, 40, 47, 45, 52, 45, 0] },
    ],
    game: [
      { name: "Calme", tempo: 96, vol: 0.07, mv: 0.14, mWave: "triangle", drums: "h...h...",
        melody: [65, 69, 72, 0, 70, 69, 67, 0, 65, 67, 69, 72, 74, 0, 72, 0, 70, 72, 74, 77, 76, 74, 72, 70, 69, 67, 65, 0, 0, 0, 0, 0],
        bass: [41, 48, 41, 48, 46, 53, 46, 53, 48, 55, 48, 55, 41, 48, 41, 0] },
      { name: "Réflexion", tempo: 104, vol: 0.07, mv: 0.14, mWave: "triangle", drums: "k.h...h.",
        melody: [62, 65, 69, 72, 71, 69, 67, 65, 64, 67, 71, 74, 72, 0, 69, 0, 62, 64, 65, 67, 69, 71, 72, 74, 72, 69, 65, 62, 0, 0, 0, 0],
        bass: [38, 45, 38, 45, 43, 50, 43, 50, 45, 52, 45, 52, 38, 45, 38, 0] },
    ],
    // Une musique par famille (0 animaux, 1 dinosaures, 2 robots, 3 métiers).
    fam0: [{ name: "Ferme", tempo: 128, vol: 0.14, mv: 0.2, mWave: "triangle", staccato: 0.45, drums: "k.h.k.h.", every: 2,
      sprinkle: ["meow", "woof", "chirp", "oink", "squeak", "boing"],
      melody: [72, 72, 79, 79, 81, 81, 79, 0, 77, 77, 76, 76, 74, 74, 72, 0, 79, 79, 77, 77, 76, 76, 74, 0, 79, 79, 77, 77, 76, 76, 74, 0],
      bass: [48, 55, 48, 55, 41, 48, 43, 50, 48, 55, 43, 50, 48, 55, 43, 50] }],
    fam1: [{ name: "Dinos", tempo: 92, vol: 0.18, mv: 0.16, mWave: "square", drums: "k.s.k.s.", heavy: true, every: 4,
      sprinkle: ["roar", "stomp", "screech"],
      melody: [52, 0, 55, 0, 57, 0, 55, 52, 50, 0, 52, 0, 47, 0, 0, 0, 52, 55, 57, 59, 60, 59, 57, 55, 52, 0, 47, 0, 52, 0, 0, 0],
      bass: [28, 28, 35, 35, 24, 24, 31, 31, 26, 26, 33, 33, 28, 35, 28, 0] }],
    fam2: [{ name: "Robots", tempo: 136, vol: 0.13, mv: 0.12, mWave: "sawtooth", mLp: 2200, bWave: "sawtooth", drums: "xhshxhsh", every: 2,
      sprinkle: ["bleeps", "scan", "rollbeep", "servo"],
      melody: [69, 72, 76, 81, 76, 72, 69, 72, 65, 69, 72, 77, 72, 69, 65, 69, 67, 71, 74, 79, 74, 71, 67, 71, 69, 72, 76, 81, 84, 81, 76, 72],
      bass: [45, 57, 45, 57, 41, 53, 41, 53, 43, 55, 43, 55, 45, 57, 45, 57] }],
    fam3: [{ name: "Fanfare", tempo: 120, vol: 0.15, mv: 0.18, drums: "k.s.k.s.", every: 4,
      sprinkle: ["whistle", "sparkle", "hooves"],
      melody: [62, 66, 69, 66, 74, 0, 69, 0, 71, 69, 67, 66, 64, 0, 0, 0, 67, 71, 74, 71, 76, 74, 71, 67, 69, 66, 64, 66, 62, 0, 0, 0],
      bass: [38, 45, 38, 45, 43, 50, 45, 52, 43, 50, 43, 50, 45, 52, 38, 0] }],
  };

  function drum(out, c, t, heavy) {
    if (c === "k" || c === "x") tone(out, { f: heavy ? 110 : 150, to: 40, t, d: heavy ? 0.3 : 0.15, type: "sine", v: heavy ? 0.9 : 0.6 });
    if (c === "s") noise(out, { t, d: 0.12, v: 0.22, bp: 1800, q: 0.8 });
    if (c === "h" || c === "x") noise(out, { t, d: 0.04, v: 0.08, hp: 6000 });
  }

  function startLoop() {
    const tr = pick(TRACKS[want] || TRACKS.intro);
    const eighth = 60 / tr.tempo / 2;
    let step = 0, next = ctx.currentTime + 0.1;
    musicGain.gain.cancelScheduledValues(ctx.currentTime);
    musicGain.gain.setTargetAtTime(tr.vol, ctx.currentTime, 0.3);
    // On planifie un peu d'avance, toutes les 100 ms.
    const timer = setInterval(() => {
      while (next < ctx.currentTime + 0.4) {
        const m = tr.melody[step % tr.melody.length];
        if (m) tone(musicGain, { f: hz(m), t: next, d: eighth * (tr.staccato || 0.9), type: tr.mWave || "square", v: tr.mv, lp: tr.mLp || null });
        if (step % 2 === 0) {
          const b = tr.bass[(step / 2) % tr.bass.length];
          if (b) tone(musicGain, { f: hz(b), t: next, d: eighth * 1.8, type: tr.bWave || "triangle", v: 0.5, lp: tr.bWave ? 900 : null });
        }
        if (tr.drums) drum(musicGain, tr.drums[step % 8], next, tr.heavy);
        // Un cri d'animal, un rugissement ou des bips de temps en temps.
        if (tr.sprinkle && step % (8 * tr.every) === 4) {
          const name = pick(tr.sprinkle);
          S[name](next, musicGain, 4 + Math.floor(Math.random() * 8));
        }
        step++;
        next += eighth;
      }
    }, 100);
    loop = { timer, track: tr };
  }
  function stopLoop() {
    if (!loop) return;
    clearInterval(loop.timer);
    loop = null;
    if (ctx) musicGain.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
  }

  // style : "intro", "game", "fam0"…"fam3", ou null (silence). Une piste est tirée au hasard à chaque départ.
  function music(style) {
    if (want === style) return;
    want = style;
    stopLoop();
    if (style && ctx && ctx.state === "running") startLoop();
  }

  // La voix parle : la musique baisse, puis remonte.
  function duck(on) {
    if (!ctx || !loop) return;
    musicGain.gain.setTargetAtTime(on ? loop.track.vol * 0.3 : loop.track.vol, ctx.currentTime, 0.1);
  }

  // Un bruitage de jeu (réglage « Bruitages »), éventuellement décalé de `delay` secondes.
  function sfx(name, delay = 0) {
    if (!config.sfx || !ctx || ctx.state !== "running" || !S[name]) return;
    S[name](ctx.currentTime + 0.01 + delay, sfxGain);
  }
  // Le bruit d'un personnage (présentations et parade).
  function character(s, v) {
    if (!ctx || ctx.state !== "running") return;
    const [name, arg] = CHARACTER[COLORS[s] + "-" + v] || ["click"];
    S[name](ctx.currentTime + 0.01, sfxGain, arg);
  }

  return { music, sfx, character, duck, unlock };
})();
