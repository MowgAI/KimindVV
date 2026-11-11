/* KiPotter (inspiré de « La baguette de Galadriel » de KartOOn) : une règle graduée avec un
   repère ; il faut trouver le nombre qui correspond au repère, parmi 3 ou 4 réponses (des
   cartes quand la règle va jusqu'à 10). Une partie = 6 questions.
   10 niveaux : règle de 0 à 10, puis 0 à 20, puis 0 à 100, avec de moins en moins de nombres
   écrits sur la règle et des réponses de plus en plus proches. 5 bonnes réponses ou plus :
   niveau suivant ; 2 ou moins : niveau précédent.
   Aide (💡) : une mauvaise réponse est retirée. Chaque question est enregistrée. */
const KiPotter = (() => {
  "use strict";
  // max : fin de la règle ; tick : écart entre deux graduations ; labels : nombres écrits
  // (« all » : tous, sinon une liste) ; multiple : le repère tombe sur un multiple de ce
  // nombre ; choices : nombre de réponses ; near : écart maximal entre les réponses et la bonne.
  const LEVELS = [
    { max: 10, tick: 1, labels: "all", multiple: 1, choices: 3, near: 4 },
    { max: 10, tick: 1, labels: [0, 5, 10], multiple: 1, choices: 3, near: 3 },
    { max: 10, tick: 1, labels: [0, 10], multiple: 1, choices: 3, near: 1 },
    { max: 20, tick: 1, labels: [0, 5, 10, 15, 20], multiple: 1, choices: 3, near: 3 },
    { max: 20, tick: 1, labels: [0, 10, 20], multiple: 1, choices: 4, near: 2 },
    { max: 20, tick: 1, labels: [0, 20], multiple: 1, choices: 4, near: 1 },
    { max: 100, tick: 10, labels: "all", multiple: 10, choices: 3, near: 20 },
    { max: 100, tick: 10, labels: [0, 50, 100], multiple: 5, choices: 4, near: 10 },
    { max: 100, tick: 10, labels: [0, 100], multiple: 1, choices: 4, near: 5 },
    { max: 100, tick: 5, labels: [0, 100], multiple: 1, choices: 4, near: 2 },
  ];
  const QUESTIONS = 6;
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

  // Une question : la valeur du repère (ni 0 ni la fin de la règle) et les réponses proposées.
  function question(lv) {
    const steps = lv.max / lv.multiple;
    const target = lv.multiple * (1 + rnd(steps - 1));
    const opts = new Set([target]);
    // Réponses proches de la bonne ; près d'un bout de la règle, on s'écarte un peu plus.
    for (let tries = 0; opts.size < lv.choices; tries++) {
      const span = Math.max(1, Math.round(lv.near / lv.multiple)) + Math.floor(tries / 20);
      const d = lv.multiple * (1 + rnd(span));
      const v = target + (Math.random() < 0.5 ? -d : d);
      if (v > 0 && v < lv.max) opts.add(v);
    }
    const choices = CardDeal.shuffle([...opts]).map(v => ({ value: v, colour: COLOURS[rnd(4)], removed: false }));
    return { target, choices, start: Date.now(), chosen: null };
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
    round = { n: 0, good: 0, done: false, current: null, locked: false, helpThis: false };
    round.inst = Store.startInstance({ game: "kipotter", level, lineMax: lv.max, lineLabels: lv.labels === "all" ? "all" : lv.labels.length, cards: [], layout: "line", chaos: 0 });
    say("");
    nextQuestion();
  }

  function nextQuestion() {
    round.current = question(LEVELS[level - 1]);
    round.locked = false;
    round.helpThis = false;
    say("");
    render();
  }

  function say(text, good) {
    const m = q("msg");
    m.textContent = text;
    m.className = "cg-msg" + (good === true ? " ok" : good === false ? " ko" : "");
  }

  // La règle : un trait, des graduations, des nombres écrits, et le repère (◆).
  function renderLine(lv, c) {
    const line = q("line");
    line.textContent = "";
    const bar = el("div", "np-bar");
    line.append(bar);
    for (let v = 0; v <= lv.max; v += lv.tick) {
      const major = v === 0 || v === lv.max || (lv.labels !== "all" && lv.labels.includes(v)) || (lv.max === 100 ? v % 10 === 0 : v % 5 === 0);
      const t = el("div", "np-tick" + (major ? " major" : ""));
      t.style.left = (v / lv.max * 100) + "%";
      line.append(t);
      if (lv.labels === "all" || lv.labels.includes(v)) {
        const lab = el("div", "np-label", v);
        lab.style.left = (v / lv.max * 100) + "%";
        line.append(lab);
      }
    }
    const marker = el("div", "np-marker" + (round.locked ? " shown" : ""), "◆");
    marker.style.left = (c.target / lv.max * 100) + "%";
    marker.setAttribute("aria-label", T.kipotter.marker);
    if (round.locked) marker.append(el("span", "np-value", c.target));
    line.append(marker);
  }

  function render() {
    const lv = LEVELS[level - 1];
    q("level").value = level;
    q("score").textContent = T.kibal.score(score, games);
    q("progress").textContent = round.done ? "" : T.kibal.progress(Math.min(round.n + 1, QUESTIONS), QUESTIONS, round.good);
    q("play").hidden = round.done;
    q("next").hidden = !round.done;
    q("help").hidden = round.done;
    if (round.done) return;
    const c = round.current;
    renderLine(lv, c);
    const zone = q("choices");
    zone.textContent = "";
    c.choices.forEach(ch => {
      if (ch.removed) return;
      // Jusqu'à 10, les réponses sont des cartes ; au-delà, des nombres.
      const b = el("button", lv.max <= 10 ? "card face np-card" : "act np-choice");
      b.type = "button";
      if (lv.max <= 10) {
        b.style.backgroundImage = "url(assets/cards/" + ch.colour + "-" + ch.value + ".webp)";
        b.setAttribute("aria-label", String(ch.value));
      } else b.textContent = ch.value;
      if (round.locked) b.classList.add(ch.value === c.target ? "ok" : ch === c.chosen ? "ko" : "dim");
      b.disabled = round.locked;
      b.addEventListener("click", () => answer(ch));
      zone.append(b);
    });
    q("help").disabled = round.locked || c.choices.filter(ch => !ch.removed).length <= 2;
  }

  function answer(ch) {
    if (round.locked) return;
    const c = round.current;
    const good = ch.value === c.target;
    c.chosen = ch;
    round.locked = true;
    round.n++;
    if (good) round.good++;
    round.inst.tries.push({ line: { max: LEVELS[level - 1].max, target: c.target }, choice: ch.value, options: c.choices.map(x => x.value), success: good, time: Math.round((Date.now() - c.start) / 100) / 10, autonomous: !round.helpThis });
    round.inst.feedback = good ? "appreciative" : "informative";
    Store.save();
    say(good ? T.kibal.good : T.kipotter.bad(c.target), good);
    render();
    timer = setTimeout(() => (round.n >= QUESTIONS ? finish() : nextQuestion()), good ? 800 : 1800);
  }

  function help() {
    const c = round.current;
    const wrong = CardDeal.shuffle(c.choices.filter(ch => !ch.removed && ch.value !== c.target));
    if (!wrong.length) return;
    wrong[0].removed = true;
    round.helpThis = true;
    round.inst.help++;
    (round.inst.helps = round.inst.helps || []).push({ type: "remove_choice", colours: [], try: round.inst.tries.length, time: Math.round((Date.now() - round.inst.start) / 100) / 10 });
    Store.save();
    render();
  }

  function finish() {
    round.done = true;
    games++;
    const g = round.good;
    round.inst.success = g >= 4;
    round.inst.goodAnswers = g;
    round.inst.end = Date.now();
    if (round.inst.success) score++;
    Store.save();
    if (g >= 5 && level < LEVELS.length) { level++; say(T.kibal.endUp(g, QUESTIONS, level), true); }
    else if (g <= 2 && level > 1) { level--; say(T.kibal.endDown(g, QUESTIONS), false); }
    else say(T.kibal.end(g, QUESTIONS), g >= 4);
    render();
  }

  function init() {
    screen = document.getElementById("kipotter-screen");
    screen.innerHTML = `
      <div class="other-head">
        <img class="other-face" src="assets/characters/galadriel-face.webp" alt="">
        <div><h2 class="other-title" data-r="title"></h2><p class="other-rule" data-r="rule"></p></div>
        <div class="other-ctrl">
          <button class="act ghost" type="button" data-r="menu"></button>
          <label class="level-wrap"><span data-r="lbl-level"></span><select data-r="level"></select></label>
        </div>
      </div>
      <p class="status" data-r="progress"></p>
      <div class="table np-zone" data-r="play">
        <div class="np-line" data-r="line"></div>
        <div class="np-choices" data-r="choices"></div>
      </div>
      <div class="panel cg-panel">
        <div class="pick-row">
          <button class="act ghost" type="button" data-r="help"></button>
          <button class="act big" type="button" data-r="next" hidden></button>
          <span class="cg-msg" data-r="msg" aria-live="polite"></span>
        </div>
      </div>
      <p class="status" data-r="score"></p>`;
    q("help").addEventListener("click", help);
    q("next").addEventListener("click", newRound);
    q("level").addEventListener("change", () => { level = Number(q("level").value); newRound(); });
    q("menu").addEventListener("click", () => { location.hash = ""; });
  }

  function texts(t) {
    T = t;
    q("title").textContent = T.games.kipotter.name;
    q("rule").textContent = T.kipotter.rule;
    q("lbl-level").textContent = T.level;
    q("menu").textContent = "☰ " + T.menu;
    q("help").textContent = "💡 " + T.kipotter.help;
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
