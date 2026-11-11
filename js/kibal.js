/* Kibal (inspiré de « La balance de Nath » de KartOOn) : deux zones de cartes posées en
   désordre ; il faut cliquer le plus vite possible sur la zone qui a le plus de cartes.
   Une partie = 8 questions. 10 niveaux : plus de cartes, des écarts plus petits, un temps
   limité, et un piège aux niveaux 6 à 10 (la zone qui a moins de cartes a les plus grosses
   valeurs). 7 bonnes réponses ou plus : niveau suivant ; 4 ou moins : niveau précédent.
   Chaque question est enregistrée (temps de réponse compris) pour les statistiques. */
const Kibal = (() => {
  "use strict";
  // min/max : cartes par zone ; diff : écart entre les zones [min, max] ; limit : secondes
  // (0 : pas de limite) ; trap : la zone qui a moins de cartes a les plus grosses valeurs.
  const LEVELS = [
    { min: 1, max: 5, diff: [3, 4], limit: 0 },
    { min: 1, max: 6, diff: [2, 3], limit: 0 },
    { min: 2, max: 8, diff: [2, 3], limit: 0 },
    { min: 2, max: 8, diff: [1, 2], limit: 0 },
    { min: 3, max: 10, diff: [2, 3], limit: 6 },
    { min: 3, max: 10, diff: [1, 2], limit: 6, trap: true },
    { min: 4, max: 12, diff: [2, 3], limit: 5, trap: true },
    { min: 4, max: 12, diff: [1, 1], limit: 5, trap: true },
    { min: 5, max: 14, diff: [1, 2], limit: 4, trap: true },
    { min: 6, max: 16, diff: [1, 1], limit: 4, trap: true },
  ];
  const QUESTIONS = 8;
  const COLOURS = ["blue", "green", "red", "yellow"];
  let T = null, level = 1, round = null, score = 0, games = 0, screen = null, timer = null;
  const q = role => screen.querySelector("[data-r=" + role + "]");
  const rnd = n => Math.floor(Math.random() * n);

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  // Une question : deux nombres de cartes différents, et les cartes (toutes différentes).
  function question(lv) {
    const d = lv.diff[0] + rnd(lv.diff[1] - lv.diff[0] + 1);
    const small = lv.min + rnd(Math.max(1, lv.max - d - lv.min + 1));
    const counts = Math.random() < 0.5 ? [small, small + d] : [small + d, small];
    const deck = CardDeal.shuffle([].concat(...COLOURS.map(c => CardDeal.ofColour(c, 10, 10))));
    let zones;
    if (lv.trap) {
      // Les grosses valeurs vont dans la zone qui a le moins de cartes.
      const sorted = deck.slice().sort((a, b) => b.value - a.value);
      const few = counts[0] < counts[1] ? 0 : 1;
      const big = sorted.slice(0, counts[few]);
      const rest = CardDeal.shuffle(sorted.slice(counts[few])).slice(0, counts[1 - few]);
      zones = few === 0 ? [big, rest] : [rest, big];
    } else zones = [deck.slice(0, counts[0]), deck.slice(counts[0], counts[0] + counts[1])];
    // Positions en désordre dans chaque zone : une case par carte dans une grille plus grande
    // (6 colonnes, 3 sur téléphone), déplacée et tournée au hasard dans sa case. Les deux zones
    // ont le même nombre de rangées, et leur hauteur suit ce nombre (render).
    const cols = window.innerWidth <= 560 ? 3 : 6;
    const rows = Math.max(2, Math.ceil(Math.max(...counts) * 1.3 / cols));
    const spots = zones.map(z => {
      const cells = CardDeal.shuffle(Array.from({ length: cols * rows }, (_, i) => i)).slice(0, z.length);
      return cells.map(i => ({
        x: ((i % cols) + 0.5 + (Math.random() - 0.5) * 0.25) / cols * 100,
        y: (Math.floor(i / cols) + 0.5 + (Math.random() - 0.5) * 0.25) / rows * 100,
        rot: Math.round((Math.random() - 0.5) * 50),
      }));
    });
    return { zones, spots, counts, rows, answer: counts[0] > counts[1] ? 0 : 1 };
  }

  function leave() {
    clearTimeout(timer);
    if (round && !round.done && round.inst) {
      round.inst.ragequit = true;
      round.inst.ragequitTry = round.inst.tries.length;
      round.inst.end = Date.now();
      Store.save();
    }
  }

  function newRound() {
    leave();
    const lv = LEVELS[level - 1];
    round = { n: 0, good: 0, done: false, current: null, locked: false };
    round.inst = Store.startInstance({ game: "kibal", level, questions: QUESTIONS, limit: lv.limit, trap: !!lv.trap, cards: [], layout: "scattered", chaos: 80 });
    say("");
    nextQuestion();
  }

  function nextQuestion() {
    clearTimeout(timer);
    const lv = LEVELS[level - 1];
    round.current = question(lv);
    round.current.start = Date.now();
    round.locked = false;
    render();
    if (lv.limit) timer = setTimeout(() => answer(null), lv.limit * 1000);
  }

  function say(text, good) {
    const m = q("msg");
    m.textContent = text;
    m.className = "cg-msg" + (good === true ? " ok" : good === false ? " ko" : "");
  }

  function render() {
    q("level").value = level;
    q("score").textContent = T.kibal.score(score, games);
    q("progress").textContent = round.done ? "" : T.kibal.progress(Math.min(round.n + 1, QUESTIONS), QUESTIONS, round.good);
    const lv = LEVELS[level - 1];
    q("limit").textContent = lv.limit ? T.kibal.limit(lv.limit) : "";
    [0, 1].forEach(z => {
      const zone = q("zone" + z);
      zone.textContent = "";
      zone.disabled = round.done || round.locked;
      zone.classList.remove("ok", "ko");
      if (round.done) return;
      const c = round.current;
      zone.style.setProperty("--rows", c.rows);
      const area = el("div", "bal-area");
      zone.append(area);
      c.zones[z].forEach((card, i) => {
        const e = el("div", "card face");
        e.style.backgroundImage = "url(assets/cards/" + card.colour + "-" + card.value + ".webp)";
        const s = c.spots[z][i];
        e.style.left = s.x + "%";
        e.style.top = s.y + "%";
        e.style.transform = "translate(-50%, -50%) rotate(" + s.rot + "deg)";
        area.append(e);
      });
      zone.setAttribute("aria-label", T.kibal.zone(z + 1));
      if (round.locked && z === c.answer) zone.classList.add("ok");
      else if (round.locked && z === c.chosen) zone.classList.add("ko");
    });
    q("zones").hidden = round.done;
    q("next").hidden = !round.done;
  }

  // Réponse : la zone choisie (null si le temps est écoulé).
  function answer(z) {
    if (round.locked || round.done) return;
    clearTimeout(timer);
    const c = round.current;
    const good = z === c.answer;
    c.chosen = z;
    round.locked = true;
    round.n++;
    if (good) round.good++;
    round.inst.tries.push({ balance: c.counts, choice: z, success: good, time: Math.round((Date.now() - c.start) / 100) / 10, autonomous: true });
    round.inst.feedback = good ? "appreciative" : "informative";
    Store.save();
    say(good ? T.kibal.good : z === null ? T.kibal.late : T.kibal.bad(c.counts[c.answer], c.counts[1 - c.answer]), good);
    render();
    timer = setTimeout(() => (round.n >= QUESTIONS ? finish() : (say(""), nextQuestion())), good ? 700 : 1600);
  }

  function finish() {
    round.done = true;
    games++;
    const g = round.good;
    round.inst.success = g >= 6;
    round.inst.goodAnswers = g;
    round.inst.end = Date.now();
    if (round.inst.success) score++;
    Store.save();
    if (g >= 7 && level < LEVELS.length) { level++; say(T.kibal.endUp(g, QUESTIONS, level), true); }
    else if (g <= 4 && level > 1) { level--; say(T.kibal.endDown(g, QUESTIONS), false); }
    else say(T.kibal.end(g, QUESTIONS), g >= 6);
    render();
  }

  function init() {
    screen = document.getElementById("kibal-screen");
    screen.innerHTML = `
      <div class="other-head">
        <img class="other-face" src="assets/characters/nath-face.webp" alt="">
        <div><h2 class="other-title" data-r="title"></h2><p class="other-rule" data-r="rule"></p></div>
        <div class="other-ctrl">
          <button class="act ghost" type="button" data-r="menu"></button>
          <label class="level-wrap"><span data-r="lbl-level"></span><select data-r="level"></select></label>
        </div>
      </div>
      <p class="status"><span data-r="progress"></span> <span data-r="limit"></span></p>
      <div class="bal-zones" data-r="zones">
        <button class="bal-zone table" type="button" data-r="zone0"></button>
        <button class="bal-zone table" type="button" data-r="zone1"></button>
      </div>
      <div class="panel cg-panel">
        <div class="pick-row">
          <button class="act big" type="button" data-r="next" hidden></button>
          <span class="cg-msg" data-r="msg" aria-live="polite"></span>
        </div>
      </div>
      <p class="status" data-r="score"></p>`;
    q("zone0").addEventListener("click", () => answer(0));
    q("zone1").addEventListener("click", () => answer(1));
    q("next").addEventListener("click", newRound);
    q("level").addEventListener("change", () => { level = Number(q("level").value); newRound(); });
    q("menu").addEventListener("click", () => { location.hash = ""; });
  }

  function texts(t) {
    T = t;
    q("title").textContent = T.games.kibal.name;
    q("rule").textContent = T.kibal.rule;
    q("lbl-level").textContent = T.level;
    q("menu").textContent = "☰ " + T.menu;
    q("next").textContent = T.colourGames.next;
    const s = q("level");
    s.textContent = "";
    LEVELS.forEach((l, i) => s.append(new Option((i + 1) + " / " + LEVELS.length, i + 1)));
    s.value = level;
    if (round) render();
  }

  function start(t) {
    texts(t);
    score = 0;
    games = 0;
    newRound();
  }

  return { init, start, texts, leave, current: () => (round && round.inst ? round.inst.id : null) };
})();
