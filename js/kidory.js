/* KiDory (inspiré de « Retiens avec Johnny » de KartOOn) : un mémory. Les cartes sont d'abord
   montrées quelques secondes (« Retiens ! »), puis retournées. On retourne deux cartes : si
   elles ont la même valeur, elles restent visibles ; sinon elles se retournent (erreur).
   But : retrouver toutes les paires.
   10 niveaux, de 2 paires montrées 5 s à 10 paires. Au plus une erreur pour deux paires :
   niveau suivant ; plus de deux erreurs par paire : niveau précédent.
   Aide (👀) : toutes les cartes sont remontrées 1,5 s. Chaque partie est enregistrée
   (js/store.js) pour les statistiques. */
const KiDory = (() => {
  "use strict";
  // pairs : nombre de paires ; show : secondes pendant lesquelles les cartes sont montrées.
  const LEVELS = [
    { pairs: 2, show: 5 }, { pairs: 3, show: 5 }, { pairs: 4, show: 6 }, { pairs: 4, show: 4 },
    { pairs: 5, show: 6 }, { pairs: 6, show: 6 }, { pairs: 6, show: 4 }, { pairs: 8, show: 8 },
    { pairs: 8, show: 5 }, { pairs: 10, show: 6 },
  ];
  const COLOURS = ["blue", "green", "red", "yellow"];
  let T = null, level = 1, round = null, score = 0, games = 0, screen = null, timer = null;
  const q = role => screen.querySelector("[data-r=" + role + "]");

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  const cardCode = c => c.colour[0] + c.value;

  // Des paires de cartes de même valeur et de couleurs différentes, toutes les valeurs différentes.
  function deal(pairs) {
    const values = CardDeal.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, pairs);
    const cards = [];
    values.forEach(v => CardDeal.shuffle(COLOURS.slice()).slice(0, 2).forEach(c => cards.push({ colour: c, value: v })));
    return CardDeal.shuffle(cards).map((c, i) => Object.assign(c, { id: i }));
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
    round = {
      cards: deal(lv.pairs), pairs: lv.pairs, show: lv.show,
      found: new Set(), open: [], errors: 0, phase: "show", done: false, peek: false,
      tryStart: 0, helpThisTry: false,
    };
    round.inst = Store.startInstance({
      game: "kidory", level, pairs: lv.pairs, showTime: lv.show,
      cards: round.cards.map(cardCode), layout: "grid", chaos: 0,
    });
    say(T.kidory.memorize(lv.show), null);
    render();
    // Phase « Retiens ! » : les cartes sont visibles, puis se retournent.
    let left = lv.show;
    const tick = () => {
      left--;
      if (left > 0) { say(T.kidory.memorize(left), null); timer = setTimeout(tick, 1000); return; }
      round.phase = "play";
      round.tryStart = Date.now();
      say(T.kidory.play, null);
      render();
    };
    timer = setTimeout(tick, 1000);
  }

  function say(text, good) {
    const m = q("msg");
    m.textContent = text;
    m.className = "cg-msg" + (good === true ? " ok" : good === false ? " ko" : "");
  }

  function render() {
    q("level").value = level;
    q("score").textContent = T.kidory.score(score, games);
    const grid = q("grid");
    grid.textContent = "";
    grid.style.setProperty("--cols", Math.ceil(Math.sqrt(round.cards.length * 1.6)));
    round.cards.forEach(c => {
      const visible = round.phase === "show" || round.peek || round.found.has(c.id) || round.open.includes(c);
      const b = el("button", "card mem-card " + (visible ? "face" : "back") + (round.found.has(c.id) ? " found" : ""));
      b.type = "button";
      if (visible) {
        b.style.backgroundImage = "url(assets/cards/" + c.colour + "-" + c.value + ".webp)";
        b.setAttribute("aria-label", T.colours[c.colour] + " " + c.value);
      } else {
        b.innerHTML = '<span class="back-logo"><b class="bk">K</b><b class="bi">I</b><b class="bb">B</b><i class="eye"></i><i class="eye"></i></span>';
        b.setAttribute("aria-label", T.kidory.hidden);
      }
      b.disabled = round.phase !== "play" || visible || round.open.length >= 2;
      b.addEventListener("click", () => flip(c));
      grid.append(b);
    });
    q("help").hidden = round.done || round.phase !== "play";
    q("help").disabled = round.peek || round.open.length >= 2;
    q("next").hidden = !round.done;
    q("left").textContent = round.done ? "" : T.kidory.left(round.pairs - round.found.size / 2, round.errors);
  }

  function flip(c) {
    round.open.push(c);
    if (round.open.length < 2) { render(); return; }
    const [a, b] = round.open;
    const good = a.value === b.value;
    round.inst.tries.push({
      pair: [cardCode(a), cardCode(b)], success: good,
      time: Math.round((Date.now() - round.tryStart) / 100) / 10, autonomous: !round.helpThisTry,
    });
    round.tryStart = Date.now();
    round.helpThisTry = false;
    round.inst.feedback = good ? "appreciative" : "informative";
    if (good) {
      round.found.add(a.id);
      round.found.add(b.id);
      round.open = [];
      say(T.kidory.pair, true);
      if (round.found.size === round.cards.length) finish();
      Store.save();
      render();
    } else {
      round.errors++;
      say(T.kidory.miss, false);
      Store.save();
      render();
      timer = setTimeout(() => { round.open = []; render(); }, 1100);
    }
  }

  function finish() {
    round.done = true;
    games++;
    score++;
    round.inst.success = true;
    round.inst.errors = round.errors;
    round.inst.end = Date.now();
    if (round.errors <= Math.floor(round.pairs / 2) && level < LEVELS.length) { level++; say(T.kidory.doneUp(round.errors, level), true); }
    else if (round.errors > 2 * round.pairs && level > 1) { level--; say(T.kidory.doneEasier(round.errors), true); }
    else say(T.kidory.done(round.errors), true);
  }

  // Aide : toutes les cartes sont remontrées un instant.
  function help() {
    round.peek = true;
    round.helpThisTry = true;
    round.inst.help++;
    (round.inst.helps = round.inst.helps || []).push({ type: "peek", colours: [], try: round.inst.tries.length, time: Math.round((Date.now() - round.inst.start) / 100) / 10 });
    Store.save();
    render();
    timer = setTimeout(() => { round.peek = false; render(); }, 1500);
  }

  function init() {
    screen = document.getElementById("kidory-screen");
    screen.innerHTML = `
      <div class="other-head">
        <img class="other-face" src="assets/characters/johnny-face.webp" alt="">
        <div><h2 class="other-title" data-r="title"></h2><p class="other-rule" data-r="rule"></p></div>
        <div class="other-ctrl">
          <button class="act ghost" type="button" data-r="menu"></button>
          <label class="level-wrap"><span data-r="lbl-level"></span><select data-r="level"></select></label>
        </div>
      </div>
      <div class="table mem-grid" data-r="grid"></div>
      <div class="panel cg-panel">
        <div class="pick-row">
          <button class="act ghost" type="button" data-r="help"></button>
          <button class="act big" type="button" data-r="next" hidden></button>
          <span class="cg-msg" data-r="msg" aria-live="polite"></span>
        </div>
        <p class="status" data-r="left"></p>
      </div>
      <p class="status" data-r="score"></p>`;
    q("help").addEventListener("click", help);
    q("next").addEventListener("click", newRound);
    q("level").addEventListener("change", () => { level = Number(q("level").value); newRound(); });
    q("menu").addEventListener("click", () => { location.hash = ""; });
  }

  function texts(t) {
    T = t;
    q("title").textContent = T.games.kidory.name;
    q("rule").textContent = T.kidory.rule;
    q("lbl-level").textContent = T.level;
    q("menu").textContent = "☰ " + T.menu;
    q("help").textContent = "👀 " + T.kidory.help;
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
