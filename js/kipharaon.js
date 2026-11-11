/* Kipharaon (inspiré de « La pyramide de Fonzy » de KartOOn) : des cartes en pyramide et un
   nombre cible. On clique sur des cartes libres (sans carte en dessous) pour les additionner ;
   quand la somme fait le nombre cible, elles disparaissent ; si elle le dépasse, c'est une
   erreur et la sélection s'efface. But : vider la pyramide.
   La pyramide est construite à l'envers (on retire des groupes de cartes libres dont la somme
   fait la cible), donc elle a toujours une solution ; si l'enfant se bloque en prenant
   d'autres groupes, il peut piocher une carte bonus qui complète une carte libre (aide).
   Quand plus aucune addition n'est possible, le jeu le dit et propose la carte bonus.
   10 niveaux, de 3 rangées (6 cartes, cible 5 ou 6) à 6 rangées (21 cartes, cible 10).
   Pyramide vidée sans carte bonus et avec au plus une erreur : niveau suivant ; trois erreurs
   ou plus, ou trois cartes bonus ou plus : niveau précédent (se bloquer n'est pas une faute).
   Chaque partie est enregistrée (js/store.js) pour les statistiques. */
const Kipharaon = (() => {
  "use strict";
  // rows : rangées ; targets : cibles possibles ; group : cartes au plus par addition.
  const LEVELS = [
    { rows: 3, targets: [5, 6], group: 2 },
    { rows: 3, targets: [7, 8], group: 2 },
    { rows: 3, targets: [9, 10], group: 2 },
    { rows: 4, targets: [6, 7, 8], group: 2 },
    { rows: 4, targets: [9, 10], group: 2 },
    { rows: 4, targets: [8, 9, 10], group: 3 },
    { rows: 5, targets: [7, 8, 9], group: 2 },
    { rows: 5, targets: [9, 10], group: 3 },
    { rows: 5, targets: [10], group: 3 },
    { rows: 6, targets: [10], group: 3 },
  ];
  const COLOURS = ["blue", "green", "red", "yellow"];
  let T = null, level = 1, round = null, score = 0, games = 0, screen = null;
  const q = role => screen.querySelector("[data-r=" + role + "]");
  const rnd = n => Math.floor(Math.random() * n);

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  const cardCode = c => c.colour[0] + c.value;

  // Positions : « r-i » (rangée r à partir du haut, i-ième carte). Une carte est libre quand
  // les deux cartes en dessous d'elle (r+1, i) et (r+1, i+1) ne sont plus là.
  const below = (r, i) => [(r + 1) + "-" + i, (r + 1) + "-" + (i + 1)];
  function isFree(cards, rows, key) {
    const [r, i] = key.split("-").map(Number);
    return r === rows - 1 || below(r, i).every(k => !cards[k]);
  }

  // `k` valeurs de 1 à 10 dont la somme fait `target`.
  function split(target, k) {
    for (;;) {
      const vals = [];
      let left = target;
      for (let j = 0; j < k - 1; j++) { const v = 1 + rnd(Math.min(10, left - (k - 1 - j)) ); vals.push(v); left -= v; }
      if (left >= 1 && left <= 10) return vals.concat(left);
    }
  }

  // Construction à l'envers : tant qu'il reste des positions, on prend un groupe de positions
  // libres et on leur donne des valeurs dont la somme fait la cible. Les couleurs sont tirées
  // pour que les cartes soient toutes différentes (on recommence si c'est impossible).
  function build(lv, target) {
    for (let attempt = 0; attempt < 200; attempt++) {
      const present = {};
      for (let r = 0; r < lv.rows; r++) for (let i = 0; i <= r; i++) present[r + "-" + i] = true;
      const values = {};
      while (Object.keys(present).length) {
        const free = Object.keys(present).filter(k => isFree(present, lv.rows, k));
        const k = 1 + rnd(Math.min(lv.group, free.length));
        // Une carte seule doit valoir la cible : on préfère des groupes de 2 ou plus.
        const size = k === 1 && free.length > 1 && Math.random() < 0.7 ? 2 : k;
        const group = CardDeal.shuffle(free).slice(0, size);
        split(target, size).forEach((v, j) => { values[group[j]] = v; });
        group.forEach(g => { delete present[g]; });
      }
      const used = new Set(), cards = {};
      let ok = true;
      Object.keys(values).forEach(key => {
        const colour = CardDeal.shuffle(COLOURS.slice()).find(c => !used.has(c + values[key]));
        if (!colour) { ok = false; return; }
        used.add(colour + values[key]);
        cards[key] = { colour, value: values[key], key };
      });
      if (ok) return { cards, used };
    }
    return null;
  }

  function leave() {
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
    let built = null, target;
    while (!built) { target = lv.targets[rnd(lv.targets.length)]; built = build(lv, target); }
    round = {
      rows: lv.rows, target, cards: built.cards, used: built.used,
      bonus: [], selected: [], errors: 0, bonusCount: 0, done: false,
      tryStart: Date.now(),
    };
    round.inst = Store.startInstance({
      game: "kipharaon", level, target,
      cards: Object.values(round.cards).map(cardCode),
      layout: "pyramid", chaos: 0, rows: lv.rows,
    });
    say(canReach() ? "" : T.kipharaon.stuck, null);
    render();
  }

  function say(text, good) {
    const m = q("msg");
    m.textContent = text;
    m.className = "cg-msg" + (good === true ? " ok" : good === false ? " ko" : "");
  }

  const selSum = () => round.selected.reduce((t, c) => t + c.value, 0);
  const freeCards = () => Object.values(round.cards).filter(c => isFree(round.cards, round.rows, c.key)).concat(round.bonus);

  function cardButton(c, free) {
    const b = el("button", "card face pyr-card" + (free ? " free" : "") + (round.selected.includes(c) ? " chosen" : ""));
    b.type = "button";
    b.disabled = !free || round.done;
    b.style.backgroundImage = "url(assets/cards/" + c.colour + "-" + c.value + ".webp)";
    b.setAttribute("aria-label", T.colours[c.colour] + " " + c.value);
    b.addEventListener("click", () => pick(c));
    return b;
  }

  function render() {
    q("level").value = level;
    q("score").textContent = T.kipharaon.score(score, games);
    q("target").textContent = round.target;
    const pyr = q("pyramid");
    pyr.textContent = "";
    for (let r = 0; r < round.rows; r++) {
      const row = el("div", "pyr-row");
      for (let i = 0; i <= r; i++) {
        const c = round.cards[r + "-" + i];
        row.append(c ? cardButton(c, isFree(round.cards, round.rows, c.key)) : el("div", "pyr-gap"));
      }
      pyr.append(row);
    }
    const bonus = q("bonus");
    bonus.textContent = "";
    round.bonus.forEach(c => bonus.append(cardButton(c, true)));
    q("sum").textContent = round.selected.length ? T.kipharaon.sum(round.selected.map(c => c.value).join(" + "), selSum(), round.target) : "";
    q("draw").hidden = round.done;
    q("clear").hidden = round.done || !round.selected.length;
    q("next").hidden = !round.done;
    q("left").textContent = round.done ? "" : T.kipharaon.left(Object.keys(round.cards).length);
  }

  function pick(c) {
    if (round.done) return;
    const i = round.selected.indexOf(c);
    if (i >= 0) round.selected.splice(i, 1); else round.selected.push(c);
    const s = selSum();
    if (s === round.target) addition(true);
    else if (s > round.target) addition(false);
    else { say(""); render(); }
  }

  // Une addition proposée (juste quand la somme fait la cible, fausse quand elle dépasse).
  function addition(good) {
    round.inst.tries.push({
      cards: round.selected.map(cardCode), sum: selSum(),
      time: Math.round((Date.now() - round.tryStart) / 100) / 10,
      autonomous: !round.selected.some(c => c.bonus), success: good,
    });
    round.tryStart = Date.now();
    if (good) {
      round.selected.forEach(c => {
        if (c.bonus) round.bonus.splice(round.bonus.indexOf(c), 1);
        else delete round.cards[c.key];
      });
      round.selected = [];
      say(T.kipharaon.good, true);
      if (!Object.keys(round.cards).length) finish();
      else if (!canReach()) say(T.kipharaon.stuck, null);
    } else {
      round.errors++;
      round.selected = [];
      say(T.kipharaon.tooMuch(round.target), false);
    }
    round.inst.feedback = good ? "appreciative" : "informative";
    Store.save();
    render();
  }

  // Carte bonus : elle complète une carte libre (cible − valeur), d'une couleur encore libre.
  function draw() {
    const free = CardDeal.shuffle(freeCards().filter(c => !c.bonus && c.value < round.target));
    for (const f of free) {
      const v = round.target - f.value;
      const colour = CardDeal.shuffle(COLOURS.slice()).find(c => !round.used.has(c + v));
      if (!colour) continue;
      round.used.add(colour + v);
      const c = { colour, value: v, key: "bonus" + round.bonusCount, bonus: true };
      round.bonus.push(c);
      round.bonusCount++;
      round.inst.help++;
      (round.inst.helps = round.inst.helps || []).push({ type: "bonus_card", colours: [cardCode(c)], try: round.inst.tries.length, time: Math.round((Date.now() - round.inst.start) / 100) / 10 });
      Store.save();
      say(T.kipharaon.drawn(v) + (canReach() ? "" : " " + T.kipharaon.stuck), null);
      render();
      return;
    }
    say(T.kipharaon.noDraw, null);
  }

  // Existe-t-il encore des cartes libres (et bonus) dont la somme fait la cible ?
  function canReach() {
    const vals = freeCards().map(c => c.value);
    const rec = (start, s) => s === round.target || (s < round.target && vals.some((v, j) => j >= start && rec(j + 1, s + v)));
    return rec(0, 0);
  }

  function finish() {
    round.done = true;
    games++;
    score++;
    round.inst.success = true;
    round.inst.end = Date.now();
    round.inst.bonusCards = round.bonusCount;
    round.inst.errors = round.errors;
    if (round.bonusCount === 0 && round.errors <= 1 && level < LEVELS.length) { level++; say(T.kipharaon.doneUp(level), true); }
    else if ((round.errors >= 3 || round.bonusCount >= 3) && level > 1) { level--; say(T.kipharaon.doneEasier, true); }
    else say(T.kipharaon.done, true);
  }

  function init() {
    screen = document.getElementById("kipharaon-screen");
    screen.innerHTML = `
      <div class="other-head">
        <img class="other-face" src="assets/characters/fonzy-face.webp" alt="">
        <div><h2 class="other-title" data-r="title"></h2><p class="other-rule" data-r="rule"></p></div>
        <div class="other-ctrl">
          <button class="act ghost" type="button" data-r="menu"></button>
          <label class="level-wrap"><span data-r="lbl-level"></span><select data-r="level"></select></label>
        </div>
      </div>
      <div class="table pyr-zone">
        <div class="pyr" data-r="pyramid"></div>
        <div class="pyr-side">
          <div class="pyr-target-lbl" data-r="lbl-target"></div>
          <div class="pyr-target" data-r="target"></div>
          <div class="pyr-bonus" data-r="bonus"></div>
        </div>
      </div>
      <div class="panel cg-panel">
        <p class="pyr-sum" data-r="sum" aria-live="polite"></p>
        <div class="pick-row">
          <button class="act ghost" type="button" data-r="draw"></button>
          <button class="act ghost" type="button" data-r="clear" hidden></button>
          <button class="act big" type="button" data-r="next" hidden></button>
          <span class="cg-msg" data-r="msg" aria-live="polite"></span>
        </div>
        <p class="status" data-r="left"></p>
      </div>
      <p class="status" data-r="score"></p>`;
    q("draw").addEventListener("click", draw);
    q("clear").addEventListener("click", () => { round.selected = []; say(""); render(); });
    q("next").addEventListener("click", newRound);
    q("level").addEventListener("change", () => { level = Number(q("level").value); newRound(); });
    q("menu").addEventListener("click", () => { location.hash = ""; });
  }

  function texts(t) {
    T = t;
    q("title").textContent = T.games.kipharaon.name;
    q("rule").textContent = T.kipharaon.rule;
    q("lbl-level").textContent = T.level;
    q("lbl-target").textContent = T.kipharaon.target;
    q("menu").textContent = "☰ " + T.menu;
    q("draw").textContent = "🎁 " + T.kipharaon.draw;
    q("clear").textContent = T.kipharaon.clear;
    q("next").textContent = T.colourGames.next;
    const s = q("level");
    s.textContent = "";
    LEVELS.forEach((l, i) => s.append(new Option((i + 1) + " / " + LEVELS.length, i + 1)));
    s.value = level;
    if (round) { render(); say(""); }
  }

  function start(t) {
    texts(t);
    score = 0;
    games = 0;
    newRound();
  }

  return { init, start, texts, leave, current: () => (round && round.inst ? round.inst.id : null) };
})();
