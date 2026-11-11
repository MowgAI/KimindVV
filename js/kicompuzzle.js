/* Kicompuzzle (inspiré du « Bouche-trou de Ray » de KartOOn) : un calcul à trous
   « ▢ + ▢ = 10 » ; on pose des cartes de sa main dans les trous (un clic sur une carte la pose
   dans le trou libre suivant, un clic sur une carte posée la reprend) et on choisit les
   opérations entre les trous (un clic change l'opération), pour atteindre le total.
   Le calcul respecte les priorités (× avant + et −). Toute combinaison juste est acceptée.
   10 niveaux, de 2 cartes avec « + » à 4 cartes avec +, − et ×. Juste du premier coup :
   niveau suivant ; deux erreurs : la solution est montrée et le niveau redescend.
   Après une erreur, le jeu dit combien fait le calcul proposé. Aide (💡) : une carte de la
   solution est posée. Chaque calcul est enregistré pour les statistiques. */
const Kicompuzzle = (() => {
  "use strict";
  // slots : trous ; ops : opérations possibles ; hand : cartes en main ; max : plus grande valeur.
  const LEVELS = [
    { slots: 2, ops: ["+"], hand: 3, max: 5 },
    { slots: 2, ops: ["+"], hand: 4, max: 10 },
    { slots: 2, ops: ["+", "−"], hand: 4, max: 10 },
    { slots: 3, ops: ["+"], hand: 5, max: 8 },
    { slots: 3, ops: ["+", "−"], hand: 5, max: 10 },
    { slots: 2, ops: ["×"], hand: 4, max: 5 },
    { slots: 2, ops: ["+", "−", "×"], hand: 5, max: 10 },
    { slots: 3, ops: ["+", "−", "×"], hand: 5, max: 10 },
    { slots: 3, ops: ["+", "−", "×"], hand: 6, max: 10 },
    { slots: 4, ops: ["+", "−", "×"], hand: 6, max: 10 },
  ];
  const COLOURS = ["blue", "green", "red", "yellow"];
  let T = null, level = 1, round = null, score = 0, games = 0, screen = null;
  const q = role => screen.querySelector("[data-r=" + role + "]");
  const rnd = n => Math.floor(Math.random() * n);
  const cardCode = c => c.colour[0] + c.value;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  // Valeur d'un calcul, × d'abord, puis + et − de gauche à droite.
  function evaluate(values, ops) {
    const terms = [values[0]], signs = [];
    ops.forEach((op, i) => {
      if (op === "×") terms[terms.length - 1] *= values[i + 1];
      else { signs.push(op); terms.push(values[i + 1]); }
    });
    return terms.slice(1).reduce((t, v, i) => (signs[i] === "+" ? t + v : t - v), terms[0]);
  }

  // Un calcul : une solution (cartes et opérations) dont le résultat va de 1 à 50, et une main
  // qui contient ses cartes et d'autres, toutes différentes.
  function deal(lv) {
    for (;;) {
      const deck = CardDeal.shuffle([].concat(...COLOURS.map(c => CardDeal.ofColour(c, lv.max, lv.max))));
      const sol = deck.slice(0, lv.slots);
      const ops = Array.from({ length: lv.slots - 1 }, () => lv.ops[rnd(lv.ops.length)]);
      const target = evaluate(sol.map(c => c.value), ops);
      if (target < 1 || target > 50) continue;
      const hand = CardDeal.shuffle(sol.concat(deck.slice(lv.slots, lv.hand)));
      return { target, hand, solution: { cards: sol, ops } };
    }
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
    const d = deal(lv);
    round = {
      lv, target: d.target, hand: d.hand, solution: d.solution,
      slots: Array(lv.slots).fill(null), ops: Array(lv.slots - 1).fill(lv.ops[0]),
      errors: 0, done: false, tryStart: Date.now(), helpThis: false,
    };
    round.inst = Store.startInstance({
      game: "kicompuzzle", level, calcTarget: d.target, ops: lv.ops,
      cards: d.hand.map(cardCode), layout: "row", chaos: 0,
      solution: d.solution.cards.map(cardCode).map((c, i) => (i ? d.solution.ops[i - 1] : "") + c).join(""),
    });
    say("");
    render();
  }

  function say(text, good) {
    const m = q("msg");
    m.textContent = text;
    m.className = "cg-msg" + (good === true ? " ok" : good === false ? " ko" : "");
  }

  function cardEl(c, cls) {
    const b = el("button", "card face cp-card" + (cls ? " " + cls : ""));
    b.type = "button";
    b.style.backgroundImage = "url(assets/cards/" + c.colour + "-" + c.value + ".webp)";
    b.setAttribute("aria-label", T.colours[c.colour] + " " + c.value);
    b.disabled = round.done;
    return b;
  }

  function render() {
    q("level").value = level;
    q("score").textContent = T.kibal.score(score, games);
    const hand = q("hand");
    hand.textContent = "";
    round.hand.filter(c => !round.slots.includes(c)).forEach(c => {
      const b = cardEl(c);
      b.addEventListener("click", () => {
        const i = round.slots.indexOf(null);
        if (i >= 0) { round.slots[i] = c; say(""); render(); }
      });
      hand.append(b);
    });
    const calc = q("calc");
    calc.textContent = "";
    round.slots.forEach((c, i) => {
      if (i) {
        const op = round.ops[i - 1];
        const b = el("button", "cp-op" + (round.lv.ops.length > 1 ? " choose" : ""), op);
        b.type = "button";
        b.disabled = round.done || round.lv.ops.length === 1;
        b.setAttribute("aria-label", T.kicompuzzle.op(op));
        b.addEventListener("click", () => {
          const ops = round.lv.ops;
          round.ops[i - 1] = ops[(ops.indexOf(op) + 1) % ops.length];
          say("");
          render();
        });
        calc.append(b);
      }
      if (c) {
        const b = cardEl(c, "placed");
        b.addEventListener("click", () => { round.slots[i] = null; say(""); render(); });
        calc.append(b);
      } else calc.append(el("div", "cp-slot"));
    });
    calc.append(el("span", "cp-eq", "= " + round.target));
    q("check").hidden = round.done;
    q("help").hidden = round.done;
    q("next").hidden = !round.done;
    q("check").disabled = round.slots.includes(null);
  }

  function check() {
    const values = round.slots.map(c => c.value);
    const value = evaluate(values, round.ops);
    const good = value === round.target;
    const expr = round.slots.map(cardCode).map((c, i) => (i ? round.ops[i - 1] : "") + c).join("");
    round.inst.tries.push({ expr, value, success: good, time: Math.round((Date.now() - round.tryStart) / 100) / 10, autonomous: !round.helpThis });
    round.inst.feedback = good ? "appreciative" : "informative";
    round.tryStart = Date.now();
    round.helpThis = false;
    if (good) {
      round.done = true;
      games++;
      score++;
      round.inst.success = true;
      round.inst.end = Date.now();
      if (round.errors === 0 && level < LEVELS.length) { level++; say(T.colourGames.bravoUp(level), true); }
      else say(T.colourGames.bravo, true);
    } else if (++round.errors >= 2) {
      round.done = true;
      games++;
      round.inst.success = false;
      round.inst.end = Date.now();
      round.slots = round.solution.cards.slice();
      round.ops = round.solution.ops.slice();
      if (level > 1) level--;
      say(T.kicompuzzle.solution(value), false);
    } else say(T.kicompuzzle.wrong(value, round.target), false);
    Store.save();
    render();
  }

  // Aide : la première carte de la solution qui n'est pas encore à sa place y est posée (et
  // l'opération qui la précède est mise), en reprenant ce qui gênait.
  function help() {
    const sol = round.solution;
    const i = round.slots.findIndex((c, k) => c !== sol.cards[k] || (k && round.ops[k - 1] !== sol.ops[k - 1]));
    if (i < 0) return;
    const other = round.slots.indexOf(sol.cards[i]);
    if (other >= 0) round.slots[other] = null;
    round.slots[i] = sol.cards[i];
    if (i) round.ops[i - 1] = sol.ops[i - 1];
    round.helpThis = true;
    round.inst.help++;
    (round.inst.helps = round.inst.helps || []).push({ type: "place_card", colours: [cardCode(sol.cards[i])], try: round.inst.tries.length, time: Math.round((Date.now() - round.inst.start) / 100) / 10 });
    Store.save();
    say("");
    render();
  }

  function init() {
    screen = document.getElementById("kicompuzzle-screen");
    screen.innerHTML = `
      <div class="other-head">
        <img class="other-face" src="assets/characters/ray-face.webp" alt="">
        <div><h2 class="other-title" data-r="title"></h2><p class="other-rule" data-r="rule"></p></div>
        <div class="other-ctrl">
          <button class="act ghost" type="button" data-r="menu"></button>
          <label class="level-wrap"><span data-r="lbl-level"></span><select data-r="level"></select></label>
        </div>
      </div>
      <div class="table cp-zone">
        <div class="cp-hand" data-r="hand"></div>
        <div class="cp-calc" data-r="calc"></div>
      </div>
      <div class="panel cg-panel">
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
    q("title").textContent = T.games.kicompuzzle.name;
    q("rule").textContent = T.kicompuzzle.rule;
    q("lbl-level").textContent = T.level;
    q("menu").textContent = "☰ " + T.menu;
    q("check").textContent = T.colourGames.check;
    q("help").textContent = "💡 " + T.colourGames.help;
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

  return { init, start, texts, leave, evaluate, current: () => (round && round.inst ? round.inst.id : null) };
})();
