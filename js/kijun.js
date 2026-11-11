/* KiJun (inspiré de « Range avec Mary » de KartOOn), en trois étapes :
   1. ranger les cartes de chaque couleur dans l'ordre demandé (croissant ou décroissant) :
      un clic sur une carte la pose dans la case libre suivante de sa ligne, un clic sur une
      carte posée la retire ;
   2. additionner les cartes de chaque couleur (pavé de chiffres) ;
   3. ranger les couleurs dans l'ordre demandé, d'après leurs sommes (jamais deux sommes égales).
   10 niveaux. Une partie réussie sans erreur fait monter d'un niveau ; deux erreurs à une
   même étape montrent la solution de cette étape (on continue), et le niveau redescend à la fin.
   Aide (bouton 💡) : la prochaine carte à poser, la somme de la couleur choisie, ou la
   prochaine couleur. Chaque partie est enregistrée (js/store.js) pour les statistiques. */
const KiJun = (() => {
  "use strict";
  const COLOURS = ["blue", "green", "red", "yellow"];
  // colours : nombre de couleurs ; per : cartes par couleur ; dir : sens des étapes 1 et 3
  // (« asc », « desc », « random » : tiré au hasard, « mixed » : un sens différent pour chaque étape).
  const LEVELS = [
    { colours: 1, per: 3, dir: "asc" },
    { colours: 2, per: 2, dir: "asc" },
    { colours: 2, per: 3, dir: "asc" },
    { colours: 2, per: 3, dir: "desc" },
    { colours: 3, per: 3, dir: "asc" },
    { colours: 3, per: 3, dir: "random" },
    { colours: 3, per: 4, dir: "random" },
    { colours: 4, per: 3, dir: "random" },
    { colours: 4, per: 4, dir: "random" },
    { colours: 4, per: 4, dir: "mixed" },
  ];
  let T = null, level = 1, round = null, score = 0, games = 0, screen = null;
  const q = role => screen.querySelector("[data-r=" + role + "]");

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  const sum = cards => cards.reduce((t, c) => t + c.value, 0);
  const sorted = (cards, dir) => cards.slice().sort((a, b) => (dir === "asc" ? a.value - b.value : b.value - a.value));
  const cardCode = c => c.colour[0] + c.value;

  function card(c, cls) {
    const e = el("button", "card face" + (cls ? " " + cls : ""));
    e.type = "button";
    e.style.backgroundImage = "url(assets/cards/" + c.colour + "-" + c.value + ".webp)";
    e.setAttribute("aria-label", T.colours[c.colour] + " " + c.value);
    return e;
  }

  // Tirage : des couleurs aux sommes toutes différentes.
  function deal() {
    const lv = LEVELS[level - 1];
    for (;;) {
      const rows = {};
      CardDeal.colours(lv.colours).forEach(c => { rows[c] = CardDeal.ofColour(c, lv.per, 10); });
      const sums = Object.keys(rows).map(c => sum(rows[c]));
      if (new Set(sums).size === sums.length) return rows;
    }
  }

  function leave() {
    if (round && round.step < 4 && round.inst) {
      round.inst.ragequit = true;
      round.inst.ragequitTry = round.inst.tries.length;
      round.inst.end = Date.now();
      Store.save();
    }
  }

  function newRound() {
    leave();
    const lv = LEVELS[level - 1];
    const pick = () => (Math.random() < 0.5 ? "asc" : "desc");
    const dir1 = lv.dir === "random" || lv.dir === "mixed" ? pick() : lv.dir;
    const dir3 = lv.dir === "mixed" ? (dir1 === "asc" ? "desc" : "asc") : dir1;
    const rows = deal();
    const colours = COLOURS.filter(c => rows[c]);
    round = {
      rows, colours, dir1, dir3,
      step: 1,
      placed: {}, sums: {}, order: [],
      sel: 0,
      errors: 0, solutionShown: false, checked: false, wrong: {},
      helpThisTry: false, tryStart: Date.now(),
    };
    colours.forEach(c => { round.placed[c] = []; });
    const correctSums = {};
    colours.forEach(c => { correctSums[c] = sum(rows[c]); });
    round.inst = Store.startInstance({
      game: "kijun", level,
      cards: [].concat(...colours.map(c => rows[c])).map(cardCode),
      layout: "grouped", chaos: 0,
      dir1, dir3,
      correct: Object.assign({}, ...COLOURS.map(c => ({ [c]: correctSums[c] || 0 }))),
      correctOrder: orderOfColours(),
    });
    say("");
    render();
  }

  // Couleurs rangées d'après leurs sommes, dans le sens de l'étape 3.
  function orderOfColours() {
    return round.colours.slice().sort((a, b) => (round.dir3 === "asc" ? 1 : -1) * (sum(round.rows[a]) - sum(round.rows[b])));
  }

  function say(text, good) {
    const m = q("msg");
    m.textContent = text;
    m.className = "cg-msg" + (good === true ? " ok" : good === false ? " ko" : "");
  }

  function render() {
    q("level").value = level;
    q("score").textContent = T.kijun.score(score, games);
    const step = Math.min(round.step, 3);
    q("step").textContent = round.step > 3 ? "" : T.kijun.stepTitle(step);
    q("instr").textContent = round.step > 3 ? "" :
      step === 1 ? T.kijun.step1(T.kijun.dir[round.dir1]) : step === 2 ? T.kijun.step2 : T.kijun.step3(T.kijun.dir[round.dir3]);
    const zone = q("zone");
    zone.textContent = "";
    if (round.step === 1) renderStep1(zone);
    else if (round.step === 2) renderStep2(zone);
    else renderStep3(zone);
    const pad = q("pad");
    pad.textContent = "";
    pad.hidden = round.step !== 2;
    if (round.step === 2) renderPad(pad);
    const done = round.step > 3;
    q("help").hidden = done;
    q("check").hidden = done;
    q("next").hidden = !done;
    q("check").disabled = !complete();
  }

  function complete() {
    if (round.step === 1) return round.colours.every(c => round.placed[c].length === round.rows[c].length);
    if (round.step === 2) return round.colours.every(c => round.sums[c] !== undefined);
    if (round.step === 3) return round.order.length === round.colours.length;
    return false;
  }

  // Étape 1 : une ligne par couleur, les cartes à poser au-dessus des cases.
  function renderStep1(zone) {
    round.colours.forEach(c => {
      const line = el("div", "kj-line" + (round.checked && round.wrong[c] ? " ko" : ""));
      const pool = el("div", "kj-pool");
      round.rows[c].filter(x => !round.placed[c].includes(x)).forEach(x => {
        const b = card(x);
        b.addEventListener("click", () => { round.placed[c].push(x); round.checked = false; render(); });
        pool.append(b);
      });
      const slots = el("div", "kj-slots");
      for (let i = 0; i < round.rows[c].length; i++) {
        const x = round.placed[c][i];
        if (x) {
          const b = card(x, "placed");
          b.addEventListener("click", () => { round.placed[c].splice(i, 1); round.checked = false; render(); });
          slots.append(b);
        } else slots.append(el("div", "kj-slot c-" + c));
      }
      line.append(pool, el("span", "kj-arrow", "→"), slots);
      zone.append(line);
    });
  }

  // Étape 2 : les lignes rangées, et une case de somme par couleur.
  function renderStep2(zone) {
    round.colours.forEach((c, i) => {
      const line = el("div", "kj-line");
      const slots = el("div", "kj-slots");
      round.placed[c].forEach(x => { const b = card(x, "placed"); b.disabled = true; slots.append(b); });
      const a = round.sums[c];
      const box = el("button", "cg-box c-" + c + (round.sel === i ? " selected" : "") + (round.checked ? (round.wrong[c] ? " ko" : " ok") : ""), a === undefined ? "?" : a);
      box.type = "button";
      box.setAttribute("aria-label", T.kiplus.box(T.colours[c]));
      box.addEventListener("click", () => { round.sel = i; round.checked = false; render(); });
      line.append(slots, el("span", "kj-arrow", "="), box);
      zone.append(line);
    });
  }

  function renderPad(pad) {
    const c = round.colours[round.sel];
    const press = fn => () => { fn(); round.checked = false; render(); };
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].forEach(d => {
      const b = el("button", "choice value", d);
      b.type = "button";
      b.addEventListener("click", press(() => {
        const cur = round.sums[c];
        round.sums[c] = cur === undefined || cur >= 10 ? d : cur * 10 + d;
        if (round.sums[c] >= 10) {
          const next = round.colours.findIndex((x, i) => i > round.sel && round.sums[x] === undefined);
          if (next >= 0) round.sel = next;
        }
      }));
      pad.append(b);
    });
    const erase = el("button", "choice value", "⌫");
    erase.type = "button";
    erase.setAttribute("aria-label", T.colourGames.erase);
    erase.addEventListener("click", press(() => {
      const cur = round.sums[c];
      if (cur === undefined || cur < 10) delete round.sums[c]; else round.sums[c] = Math.floor(cur / 10);
    }));
    pad.append(erase);
  }

  // Étape 3 : les couleurs (avec leur somme) à cliquer dans l'ordre.
  function renderStep3(zone) {
    const pool = el("div", "kj-pool kj-colours");
    round.colours.filter(c => !round.order.includes(c)).forEach(c => {
      const b = el("button", "kj-colour c-" + c, T.colours[c] + " · " + sum(round.rows[c]));
      b.type = "button";
      b.disabled = round.step > 3;
      b.addEventListener("click", () => { round.order.push(c); round.checked = false; render(); });
      pool.append(b);
    });
    const slots = el("div", "kj-slots kj-colours" + (round.checked && round.wrong.order ? " ko" : ""));
    round.colours.forEach((_, i) => {
      const c = round.order[i];
      if (c) {
        const b = el("button", "kj-colour c-" + c, T.colours[c] + " · " + sum(round.rows[c]));
        b.type = "button";
        b.disabled = round.step > 3;
        b.addEventListener("click", () => { round.order.splice(i, 1); round.checked = false; render(); });
        slots.append(b);
      } else slots.append(el("div", "kj-colour-slot"));
      if (i < round.colours.length - 1) slots.append(el("span", "kj-arrow", round.dir3 === "asc" ? "<" : ">"));
    });
    zone.append(pool, slots);
  }

  // Passe à l'étape suivante (l'étape 3 est sautée s'il n'y a qu'une couleur).
  function nextStep() {
    round.step++;
    if (round.step === 3 && round.colours.length < 2) round.step++;
    round.errors = 0;
    round.checked = false;
    round.wrong = {};
    round.sel = 0;
    if (round.step > 3) finish();
  }

  function finish() {
    games++;
    const good = !round.solutionShown;
    round.inst.success = good;
    round.inst.end = Date.now();
    Store.save();
    if (good) {
      score++;
      const perfect = round.inst.tries.every(t => t.success);
      if (perfect && level < LEVELS.length) { level++; say(T.colourGames.bravoUp(level), true); }
      else say(T.colourGames.bravo, true);
    } else {
      if (level > 1) level--;
      say(T.kijun.endShown, false);
    }
  }

  // Bonne réponse de l'étape en cours, mise en place (après deux erreurs, ou pour l'aide).
  function showSolution() {
    if (round.step === 1) round.colours.forEach(c => { round.placed[c] = sorted(round.rows[c], round.dir1); });
    if (round.step === 2) round.colours.forEach(c => { round.sums[c] = sum(round.rows[c]); });
    if (round.step === 3) round.order = orderOfColours();
  }

  function check() {
    round.checked = true;
    round.wrong = {};
    let answer;
    if (round.step === 1) {
      round.colours.forEach(c => {
        const want = sorted(round.rows[c], round.dir1);
        round.wrong[c] = round.placed[c].some((x, i) => x.value !== want[i].value);
      });
      answer = Object.assign({}, ...round.colours.map(c => ({ [c]: round.placed[c].map(x => x.value) })));
    } else if (round.step === 2) {
      round.colours.forEach(c => { round.wrong[c] = round.sums[c] !== sum(round.rows[c]); });
      answer = Object.assign({}, round.sums);
    } else {
      round.wrong.order = round.order.join() !== orderOfColours().join();
      answer = round.order.slice();
    }
    const good = !Object.values(round.wrong).some(Boolean);
    round.inst.tries.push({ step: round.step, answer, time: Math.round((Date.now() - round.tryStart) / 100) / 10, autonomous: !round.helpThisTry, success: good });
    round.inst.feedback = good ? "appreciative" : "informative";
    round.tryStart = Date.now();
    round.helpThisTry = false;
    Store.save();
    if (good) {
      say(T.kijun.stepOk, true);
      nextStep();
    } else if (++round.errors >= 2) {
      showSolution();
      round.solutionShown = true;
      say(T.kijun.stepShown, false);
      nextStep();
    } else say(T.kijun.retry, false);
    render();
  }

  function help() {
    const s = round.step;
    let what;
    if (s === 1) {
      // Pose la prochaine carte de la première ligne qui n'est pas finie (et enlève ce qui est mal posé).
      const c = round.colours.find(x => round.placed[x].length < round.rows[x].length || round.placed[x].some((y, i) => y !== sorted(round.rows[x], round.dir1)[i]));
      if (!c) return;
      const want = sorted(round.rows[c], round.dir1);
      let k = 0;
      while (k < round.placed[c].length && round.placed[c][k] === want[k]) k++;
      round.placed[c] = want.slice(0, k + 1);
      what = c;
    } else if (s === 2) {
      const c = round.colours[round.sel];
      round.sums[c] = sum(round.rows[c]);
      what = c;
    } else {
      const want = orderOfColours();
      let k = 0;
      while (k < round.order.length && round.order[k] === want[k]) k++;
      round.order = want.slice(0, k + 1);
      what = want[k];
    }
    round.helpThisTry = true;
    round.inst.help++;
    (round.inst.helps = round.inst.helps || []).push({ type: "step" + s, colours: [what], try: round.inst.tries.length, time: Math.round((Date.now() - round.inst.start) / 100) / 10 });
    round.checked = false;
    Store.save();
    render();
  }

  function init() {
    screen = document.getElementById("kijun-screen");
    screen.innerHTML = `
      <div class="other-head">
        <img class="other-face" src="assets/characters/mary-face.webp" alt="">
        <div><h2 class="other-title" data-r="title"></h2><p class="other-rule" data-r="rule"></p></div>
        <div class="other-ctrl">
          <button class="act ghost" type="button" data-r="menu"></button>
          <label class="level-wrap"><span data-r="lbl-level"></span><select data-r="level"></select></label>
        </div>
      </div>
      <div class="panel kj-head"><b data-r="step"></b> <span data-r="instr"></span></div>
      <div class="table kj-zone" data-r="zone"></div>
      <div class="panel cg-panel">
        <div class="choices cg-pad" data-r="pad" hidden></div>
        <div class="pick-row">
          <button class="act ghost" type="button" data-r="help"></button>
          <button class="act big" type="button" data-r="check"></button>
          <button class="act big" type="button" data-r="next" hidden></button>
          <span class="cg-msg" data-r="msg" aria-live="polite"></span>
        </div>
      </div>
      <p class="status" data-r="score"></p>`;
    q("check").addEventListener("click", check);
    q("help").addEventListener("click", help);
    q("next").addEventListener("click", newRound);
    q("level").addEventListener("change", () => { level = Number(q("level").value); newRound(); });
    q("menu").addEventListener("click", () => { location.hash = ""; });
  }

  function texts(t) {
    T = t;
    q("title").textContent = T.games.kijun.name;
    q("rule").textContent = T.kijun.rule;
    q("lbl-level").textContent = T.level;
    q("menu").textContent = "☰ " + T.menu;
    q("check").textContent = T.colourGames.check;
    q("next").textContent = T.colourGames.next;
    q("help").textContent = "💡 " + T.colourGames.help;
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
