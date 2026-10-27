/* Kimind : état de la partie et affichage. */
(function () {
  "use strict";
  const K = window.Kimind, T = TEXTS;
  const $ = id => document.getElementById(id);

  // rounds : [[{position, colour, value, answer}]] ; found[p] : carte trouvée ;
  // draft[p] : carte proposée en cours de composition ; sel : position choisie.
  let version, game, rounds, found, draft, sel;

  function cardImage(colour, value) { return "assets/cards/" + colour + "-" + value + ".webp"; }

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function backCard() {
    const e = el("div", "card back");
    e.innerHTML = '<span class="back-logo"><b class="bk">K</b><b class="bi">I</b><b class="bb">B</b><i class="eye"></i><i class="eye"></i></span>';
    return e;
  }

  function faceCard(colour, value) {
    const e = el("div", "card face");
    e.style.backgroundImage = "url(" + cardImage(colour, value) + ")";
    e.setAttribute("role", "img");
    e.setAttribute("aria-label", T.colours[colour] + " " + value);
    return e;
  }

  // Cadre vide : de la couleur donnée, ou gris ; avec une étiquette en bas (Plus, Moins ou ?).
  function frameCard(colour, label, title) {
    const e = el("div", "card frame" + (colour ? " c-" + colour : " neutral"));
    e.append(el("span", "frame-lbl", label));
    if (title) { e.setAttribute("role", "img"); e.setAttribute("aria-label", title); e.title = title; }
    return e;
  }

  function chip(colour) { return el("span", "chip c-" + colour, T.colours[colour]); }

  const signText = sign => (sign > 0 ? "+" : "−");

  // Énoncé : la somme (ou, dans la variante ±, le calcul avec ses signes) et l'ordre des couleurs.
  function renderStatement() {
    const { sum, signs } = game.statement;
    $("lbl-sum").textContent = signs ? T.signedSum : T.sum;
    $("sum").textContent = signs
      ? signs.map((sign, p) => (p ? signText(sign) + "\u00a0" : "") + T.position.toLowerCase() + "\u00a0" + p).join(" ") + "\u00a0=\u00a0" + sum
      : sum;
    $("sum").classList.toggle("formula", !!signs);
    const order = $("order");
    order.textContent = "";
    game.statement.order.forEach((group, g) => {
      if (g) order.append(el("b", "sep", "<"));
      group.forEach((c, i) => { if (i) order.append(el("b", "sep", "=")); order.append(chip(c)); });
    });
  }

  function describe(c) {
    return T.colours[c.colour] + " " + c.value + " : " + (c.answer.colour ? T.colourOk : T.colourKo) + ", " + T.value[c.answer.value];
  }

  // Réponse du jeu pour une carte : retournée si elle est juste, sinon cadre coloré ou gris.
  function answerCard(c) {
    if (c.answer.colour && c.answer.value === "equals") return faceCard(c.colour, c.value);
    return frameCard(c.answer.colour ? c.colour : null, T.label[c.answer.value], describe(c));
  }

  // Les 4 cartes à deviner : dos de carte, ou la carte elle-même une fois trouvée.
  // Dans la variante ±, le signe de chaque carte s'affiche entre les cartes.
  function renderHidden() {
    const zone = $("hidden-cards");
    const signs = game.statement.signs;
    zone.textContent = "";
    zone.classList.toggle("signed", !!signs);
    for (let p = 0; p < K.NB_CARDS; p++) {
      if (signs && p) zone.append(el("div", "sign", signText(signs[p])));
      const slot = el("div", "slot");
      slot.append(el("div", "num", p));
      slot.append(found[p] ? faceCard(game.solution[p].colour, game.solution[p].value) : backCard());
      zone.append(slot);
    }
  }

  function renderOffer() {
    const zone = $("offer");
    zone.textContent = "";
    for (let p = 0; p < K.NB_CARDS; p++) {
      const slot = el("div", "slot" + (found[p] ? " found" : "") + (sel === p ? " selected" : ""));
      slot.append(el("div", "num", p));
      const btn = el("button", "slot-btn");
      btn.type = "button";
      btn.disabled = found[p] || won();
      btn.setAttribute("aria-label", T.position + " " + p);
      const d = found[p] ? game.solution[p] : draft[p];
      if (d.colour && d.value) btn.append(faceCard(d.colour, d.value));
      else btn.append(frameCard(d.colour, d.value || T.waiting));
      btn.addEventListener("click", () => { sel = p; render(); });
      slot.append(btn);
      zone.append(slot);
    }
  }

  function offerCards() {
    const offer = [], fixed = [];
    for (let p = 0; p < K.NB_CARDS; p++) {
      if (found[p]) fixed.push(game.solution[p]);
      else offer.push({ position: p, colour: draft[p].colour, value: draft[p].value });
    }
    return { offer, fixed };
  }

  function renderPicker() {
    const usedByFound = new Set(game.solution.filter((c, p) => found[p]).map(c => c.colour));
    const cur = sel === null ? {} : draft[sel];
    const colours = $("colours");
    colours.textContent = "";
    K.COLOURS.forEach(c => {
      const b = el("button", "choice colour c-" + c + (cur.colour === c ? " on" : ""), T.colours[c]);
      b.type = "button";
      b.disabled = sel === null || usedByFound.has(c);
      b.setAttribute("aria-pressed", cur.colour === c);
      b.addEventListener("click", () => { draft[sel].colour = c; advance(); render(); });
      colours.append(b);
    });
    const values = $("values");
    values.textContent = "";
    for (let v = K.VMIN; v <= K.VMAX; v++) {
      const b = el("button", "choice value" + (cur.value === v ? " on" : ""), v);
      b.type = "button";
      b.disabled = sel === null;
      b.setAttribute("aria-pressed", cur.value === v);
      b.addEventListener("click", () => { draft[sel].value = v; advance(); render(); });
      values.append(b);
    }
    $("hint").textContent = sel === null ? "" : T.chooseCard(sel);

    const { offer, fixed } = offerCards();
    const complete = offer.every(c => c.colour && c.value);
    const ok = K.validOffer(offer, fixed);
    $("btn-propose").textContent = T.propose;
    $("btn-propose").disabled = !ok;
    $("warn").textContent = ok ? "" : complete ? T.sameColours : T.incomplete;
    $("panel").hidden = won();
    $("offer-zone").hidden = won();
  }

  // Quand la carte choisie est complète, passe à la suivante qui ne l'est pas.
  function advance() {
    if (!draft[sel].colour || !draft[sel].value) return;
    for (let i = 1; i < K.NB_CARDS; i++) {
      const p = (sel + i) % K.NB_CARDS;
      if (!found[p] && (!draft[p].colour || !draft[p].value)) { sel = p; return; }
    }
  }

  // Historique : pour chaque tour, la proposition et la réponse du jeu, le plus récent en haut.
  // Une position trouvée à un tour précédent montre sa carte, en grisé.
  function renderHistory() {
    const list = $("history");
    list.textContent = "";
    $("history-empty").hidden = rounds.length > 0;
    rounds.slice().reverse().forEach((round, i) => {
      const li = el("li", "round");
      li.append(el("div", "round-num", T.round(rounds.length - i)));
      const offered = el("div", "mini-row"), answers = el("div", "mini-row");
      offered.append(el("span", "mini-lbl", T.proposalTitle));
      answers.append(el("span", "mini-lbl", T.answerTitle));
      for (let p = 0; p < K.NB_CARDS; p++) {
        const c = round.find(c => c.position === p);
        if (c) {
          offered.append(faceCard(c.colour, c.value));
          answers.append(answerCard(c));
        } else {
          const done = game.solution[p];
          offered.append(Object.assign(faceCard(done.colour, done.value), { className: "card face done" }));
          answers.append(Object.assign(faceCard(done.colour, done.value), { className: "card face done" }));
        }
      }
      li.append(offered, answers);
      list.append(li);
    });
  }

  function renderStatus() {
    $("rounds").textContent = T.rounds(rounds.length);
    const n = K.remaining(game.statement, [].concat(...rounds)).length;
    $("possible").textContent = T.possible(n);
    $("possible").hidden = !$("show-possible").checked;
    $("won").hidden = !won();
    $("won").textContent = T.won(rounds.length);
  }

  function render() { renderHidden(); renderOffer(); renderPicker(); renderHistory(); renderStatus(); }

  function won() { return found.every(Boolean); }

  function propose() {
    const { offer } = offerCards();
    const round = K.answerRound(game.solution, offer);
    rounds.push(round);
    round.forEach(c => { if (c.answer.colour && c.answer.value === "equals") found[c.position] = true; });
    // Nouvelle proposition à saisir : les cartes non trouvées repartent de zéro.
    draft = draft.map(() => ({ colour: null, value: null }));
    const first = found.indexOf(false);
    sel = first >= 0 ? first : null;
    render();
  }

  function newGame() {
    game = version.newGame($("level").value);
    rounds = [];
    found = [false, false, false, false];
    draft = [0, 1, 2, 3].map(() => ({ colour: null, value: null }));
    sel = 0;
    renderStatement();
    render();
  }

  // Menu : une carte par version ; l'adresse (#initiale…) garde la version choisie.
  function renderMenu() {
    const list = $("versions");
    list.textContent = "";
    VERSIONS.forEach(v => {
      const b = el("button", "version");
      b.type = "button";
      b.append(el("span", "version-name", v.name), el("span", "version-sub", v.subtitle), el("span", "version-desc", v.description), el("span", "act version-play", T.play));
      b.addEventListener("click", () => { location.hash = v.id; });
      list.append(b);
    });
  }

  function route() {
    version = VERSIONS.find(v => v.id === location.hash.slice(1));
    $("menu-screen").hidden = !!version;
    $("game-screen").hidden = !version;
    $("game-btns").hidden = !version;
    if (version) { renderRules(); newGame(); }
    window.scrollTo(0, 0);
  }

  function renderRules() {
    const lines = T.rulesBody.slice();
    if (version.id === "plus-moins") lines.splice(4, 0, T.signedRule);
    $("rules-body").textContent = "";
    lines.forEach(line => $("rules-body").append(el("li", "", line)));
  }

  function init() {
    $("menu-title").textContent = T.menuTitle;
    $("lbl-menu").textContent = T.menu;
    $("btn-menu").addEventListener("click", () => { location.hash = ""; });
    renderMenu();
    $("tagline").textContent = T.tagline;
    $("lbl-level").textContent = T.level;
    $("btn-new").textContent = T.newGame;
    $("lbl-rules").textContent = T.rules;
    $("lbl-order").textContent = T.order;
    $("lbl-hidden").textContent = T.hiddenTitle;
    $("history-empty").textContent = T.historyEmpty;
    $("lbl-offer").textContent = T.offerTitle;
    $("lbl-history").textContent = T.historyTitle;
    $("lbl-colour").textContent = T.chooseColour;
    $("lbl-value").textContent = T.chooseValue;
    $("lbl-possible").textContent = T.showPossible;
    $("rules-title").textContent = T.rules;
    $("btn-close").textContent = T.close;
    Object.keys(K.LEVELS).forEach(k => $("level").append(new Option(T.levels[k], k)));
    $("level").value = "easy";
    $("level").addEventListener("change", newGame);
    $("btn-new").addEventListener("click", newGame);
    $("btn-propose").addEventListener("click", propose);
    $("btn-rules").addEventListener("click", () => $("dlg-rules").showModal());
    $("show-possible").addEventListener("change", renderStatus);
    window.addEventListener("hashchange", route);
    route();
  }

  init();
})();
