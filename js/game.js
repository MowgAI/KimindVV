/* Kimind : état de la partie et affichage. */
(function () {
  "use strict";
  const K = window.Kimind, T = TEXTS;
  const $ = id => document.getElementById(id);

  let game, plays, found, sel;

  function cardImage(colour, value) { return "assets/cards/" + colour + "-" + value + ".webp"; }

  function backCard() {
    const el = document.createElement("div");
    el.className = "card back";
    el.innerHTML = '<span class="back-logo"><b class="bk">K</b><b class="bi">I</b><b class="bb">B</b><i class="eye"></i><i class="eye"></i></span>';
    return el;
  }

  function faceCard(colour, value) {
    const el = document.createElement("div");
    el.className = "card face";
    el.style.backgroundImage = "url(" + cardImage(colour, value) + ")";
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", T.colours[colour] + " " + value);
    return el;
  }

  function chip(colour) {
    const el = document.createElement("span");
    el.className = "chip c-" + colour;
    el.textContent = T.colours[colour];
    return el;
  }

  function renderStatement() {
    $("sum").textContent = game.statement.sum;
    const order = $("order");
    order.textContent = "";
    game.statement.order.forEach((group, g) => {
      if (g) order.append(sep("<"));
      group.forEach((c, i) => { if (i) order.append(sep("=")); order.append(chip(c)); });
    });
    function sep(s) { const e = document.createElement("b"); e.className = "sep"; e.textContent = s; return e; }
  }

  function renderSlots() {
    const slots = $("slots");
    slots.textContent = "";
    for (let p = 0; p < K.NB_CARDS; p++) {
      const slot = document.createElement("div");
      slot.className = "slot" + (found[p] ? " found" : "") + (sel.position === p ? " selected" : "");
      const num = document.createElement("div");
      num.className = "num";
      num.textContent = p;
      slot.append(num);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slot-btn";
      btn.disabled = found[p] || won();
      btn.setAttribute("aria-label", T.position + " " + p);
      btn.append(found[p] ? faceCard(game.solution[p].colour, game.solution[p].value) : backCard());
      btn.addEventListener("click", () => { sel.position = p; render(); });
      slot.append(btn);
      if (found[p]) { const f = document.createElement("div"); f.className = "found-lbl"; f.textContent = T.found; slot.append(f); }

      const hist = document.createElement("ol");
      hist.className = "history";
      plays.filter(pl => pl.position === p).forEach(pl => {
        const li = document.createElement("li");
        li.className = "c-" + pl.colour;
        const v = pl.answer.value;
        li.innerHTML = '<span class="dot"></span><b>' + pl.value + '</b>' +
          '<span class="mark ' + (pl.answer.colour ? "ok" : "ko") + '" title="' + (pl.answer.colour ? T.colourOk : T.colourKo) + '">' + (pl.answer.colour ? "✓" : "✗") + "</span>" +
          '<span class="mark v-' + v + '" title="' + T.value[v] + '">' + (v === "less" ? "▼" : v === "more" ? "▲" : "=") + "</span>";
        li.title = T.colours[pl.colour] + " " + pl.value + " : " + (pl.answer.colour ? T.colourOk : T.colourKo) + ", " + T.value[v];
        hist.append(li);
      });
      slot.append(hist);
      slots.append(slot);
    }
  }

  function renderPicker() {
    const colours = $("colours");
    colours.textContent = "";
    K.COLOURS.forEach(c => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choice colour c-" + c + (sel.colour === c ? " on" : "");
      b.textContent = T.colours[c];
      b.setAttribute("aria-pressed", sel.colour === c);
      b.addEventListener("click", () => { sel.colour = c; render(); });
      colours.append(b);
    });
    const values = $("values");
    values.textContent = "";
    for (let v = K.VMIN; v <= K.VMAX; v++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choice value" + (sel.value === v ? " on" : "");
      b.textContent = v;
      b.setAttribute("aria-pressed", sel.value === v);
      b.addEventListener("click", () => { sel.value = v; render(); });
      values.append(b);
    }
    $("hint").textContent = sel.position === null ? T.choosePosition : T.position + " " + sel.position;
    const play = $("btn-play");
    play.textContent = T.play;
    play.disabled = sel.position === null || !sel.colour || !sel.value;
    $("panel").hidden = won();
  }

  function renderStatus() {
    $("played").textContent = T.played(plays.length);
    const n = K.remaining(game.statement, plays).length;
    $("possible").textContent = T.possible(n);
    $("possible").hidden = !$("show-possible").checked;
    $("won").hidden = !won();
    $("won").textContent = T.won(plays.length);
  }

  function render() { renderSlots(); renderPicker(); renderStatus(); }

  function won() { return found.every(Boolean); }

  function play() {
    const p = sel.position;
    const a = K.answer(game.solution, p, sel.colour, sel.value);
    plays.push({ position: p, colour: sel.colour, value: sel.value, answer: a });
    if (a.colour && a.value === "equals") {
      found[p] = true;
      const next = found.indexOf(false, p + 1);
      sel.position = next >= 0 ? next : found.indexOf(false) >= 0 ? found.indexOf(false) : null;
      sel.colour = null;
    }
    sel.value = null;
    render();
  }

  function newGame() {
    game = K.newGame($("level").value);
    plays = [];
    found = [false, false, false, false];
    sel = { position: 0, colour: null, value: null };
    renderStatement();
    render();
  }

  function init() {
    $("tagline").textContent = T.tagline;
    $("lbl-level").textContent = T.level;
    $("btn-new").textContent = T.newGame;
    $("lbl-rules").textContent = T.rules;
    $("lbl-sum").textContent = T.sum;
    $("lbl-order").textContent = T.order;
    $("lbl-colour").textContent = T.chooseColour;
    $("lbl-value").textContent = T.chooseValue;
    $("lbl-possible").textContent = T.showPossible;
    $("rules-title").textContent = T.rules;
    $("btn-close").textContent = T.close;
    T.rulesBody.forEach(line => { const li = document.createElement("li"); li.textContent = line; $("rules-body").append(li); });
    Object.keys(K.LEVELS).forEach(k => $("level").append(new Option(T.levels[k], k)));
    $("level").value = "easy";
    $("level").addEventListener("change", newGame);
    $("btn-new").addEventListener("click", newGame);
    $("btn-play").addEventListener("click", play);
    $("btn-rules").addEventListener("click", () => $("dlg-rules").showModal());
    $("show-possible").addEventListener("change", renderStatus);
    newGame();
  }

  init();
})();
