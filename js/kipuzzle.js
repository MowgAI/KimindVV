/* Kipuzzle (inspiré des « Dalles de Béa » de KartOOn), contre Béa : une grille avec une carte
   au centre. Une carte se pose sur une case vide à côté d'une carte déjà posée, et doit
   respecter toutes ses voisines : à droite la valeur +1, à gauche −1, en haut +2, en bas −2
   (la couleur ne compte pas).
   À ton tour : choisis une carte de ta main (les cases où elle peut aller s'allument) et pose
   autant de cartes que tu peux, puis « Fin de mon tour » ; si tu ne peux rien poser, pioche
   une carte (ton tour s'arrête). Un clic sur la dernière carte posée l'annule ; « Annuler mon
   tour » reprend tout le tour. Puis Béa joue. But : poser toutes tes cartes avant Béa.
   10 niveaux : plus de cartes en main, et Béa pose de plus en plus de cartes par tour.
   Gagné : niveau suivant ; perdu : niveau précédent. Aide (💡) : un coup possible est montré.
   Chaque tour est enregistré, avec le fait d'avoir fini son tour alors qu'un coup restait. */
const Kipuzzle = (() => {
  "use strict";
  // hand : cartes en main au départ ; bea : cartes au plus que Béa pose par tour.
  const LEVELS = [
    { hand: 3, bea: 1 }, { hand: 4, bea: 1 }, { hand: 4, bea: 2 }, { hand: 5, bea: 2 },
    { hand: 5, bea: 3 }, { hand: 6, bea: 3 }, { hand: 6, bea: 4 }, { hand: 7, bea: 4 },
    { hand: 7, bea: 6 }, { hand: 8, bea: 99 },
  ];
  const COLS = 11, ROWS = 9;
  const COLOURS = ["blue", "green", "red", "yellow"];
  // Voisines : [dx, dy, écart de valeur attendu chez la voisine].
  const NEIGHBOURS = [[1, 0, 1], [-1, 0, -1], [0, -1, 2], [0, 1, -2]];
  let T = null, level = 1, round = null, score = 0, games = 0, screen = null, timer = null;
  const q = role => screen.querySelector("[data-r=" + role + "]");
  const cardCode = c => c.colour[0] + c.value;
  const key = (x, y) => x + "," + y;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  // La carte de valeur v peut-elle aller en (x, y) ?
  function fits(board, v, x, y) {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS || board[key(x, y)]) return false;
    let touches = false;
    for (const [dx, dy, d] of NEIGHBOURS) {
      const n = board[key(x + dx, y + dy)];
      if (!n) continue;
      touches = true;
      if (n.value !== v + d) return false;
    }
    return touches;
  }

  // Toutes les cases où la carte peut aller.
  function cellsFor(board, card) {
    const out = [];
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (fits(board, card.value, x, y)) out.push([x, y]);
    return out;
  }
  const anyMove = (board, hand) => hand.some(c => cellsFor(board, c).length);

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
    const deck = CardDeal.shuffle([].concat(...COLOURS.map(c => CardDeal.ofColour(c, 10, 10))));
    // La carte du centre est une valeur moyenne, pour qu'on puisse poser des deux côtés.
    const startIdx = deck.findIndex(c => c.value >= 4 && c.value <= 7);
    const start = deck.splice(startIdx, 1)[0];
    round = {
      board: { [key(5, 4)]: start },
      hand: deck.splice(0, lv.hand), bea: deck.splice(0, lv.hand), deck,
      sel: null, placed: [], turn: "me", done: false, hint: null,
      turnStart: Date.now(), helpThis: false, beaLimit: lv.bea,
    };
    round.inst = Store.startInstance({ game: "kipuzzle", level, handSize: lv.hand, beaPerTurn: lv.bea, cards: round.hand.map(cardCode), layout: "grid", chaos: 0 });
    say(anyMove(round.board, round.hand) ? T.kipuzzle.yourTurn : T.kipuzzle.mustDraw, null);
    render();
  }

  function say(text, good) {
    const m = q("msg");
    m.textContent = text;
    m.className = "cg-msg" + (good === true ? " ok" : good === false ? " ko" : "");
  }

  function cardFace(c) {
    const e = el("div", "card face pz-card");
    e.style.backgroundImage = "url(assets/cards/" + c.colour + "-" + c.value + ".webp)";
    e.setAttribute("role", "img");
    e.setAttribute("aria-label", T.colours[c.colour] + " " + c.value);
    return e;
  }

  function render() {
    q("level").value = level;
    q("score").textContent = T.kipuzzle.score(score, games);
    const mine = round.turn === "me" && !round.done;
    const valid = mine && round.sel ? cellsFor(round.board, round.sel).map(([x, y]) => key(x, y)) : [];
    const grid = q("grid");
    grid.textContent = "";
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      const k = key(x, y), c = round.board[k];
      const cell = el("button", "pz-cell");
      cell.type = "button";
      if (c) {
        cell.append(cardFace(c));
        cell.classList.add("full");
        const last = round.placed[round.placed.length - 1];
        cell.disabled = !mine || !last || last.key !== k;
        if (!cell.disabled) { cell.classList.add("undo"); cell.title = T.kipuzzle.undoLast; }
        cell.addEventListener("click", undoLast);
      } else {
        const near = NEIGHBOURS.some(([dx, dy]) => round.board[key(x + dx, y + dy)]);
        if (near) cell.classList.add("near");
        if (valid.includes(k)) cell.classList.add("valid");
        if (round.hint && round.hint.key === k) cell.classList.add("hint");
        cell.disabled = !valid.includes(k);
        cell.addEventListener("click", () => place(x, y));
      }
      grid.append(cell);
    }
    const hand = q("hand");
    hand.textContent = "";
    round.hand.forEach(c => {
      const b = el("button", "card face pz-hand-card" + (round.sel === c ? " chosen" : "") + (round.hint && round.hint.card === c ? " hint" : ""));
      b.type = "button";
      b.style.backgroundImage = "url(assets/cards/" + c.colour + "-" + c.value + ".webp)";
      b.setAttribute("aria-label", T.colours[c.colour] + " " + c.value);
      b.disabled = !mine;
      b.addEventListener("click", () => { round.sel = round.sel === c ? null : c; round.hint = null; render(); });
      hand.append(b);
    });
    q("bea-count").textContent = T.kipuzzle.beaCards(round.bea.length);
    q("deck-count").textContent = T.kipuzzle.deck(round.deck.length);
    q("end").hidden = !mine;
    q("end").disabled = !round.placed.length;
    q("draw").hidden = !mine;
    q("draw").disabled = round.placed.length > 0 || !round.deck.length;
    q("undo").hidden = !mine;
    q("undo").disabled = !round.placed.length;
    q("help").hidden = !mine;
    q("next").hidden = !round.done;
  }

  function place(x, y) {
    const c = round.sel;
    if (!c || !fits(round.board, c.value, x, y)) return;
    round.board[key(x, y)] = c;
    round.hand.splice(round.hand.indexOf(c), 1);
    round.placed.push({ card: c, key: key(x, y) });
    round.sel = null;
    round.hint = null;
    if (!round.hand.length) { endTurn(); return; }
    say(anyMove(round.board, round.hand) ? T.kipuzzle.more : T.kipuzzle.noMore, null);
    render();
  }

  function undoLast() {
    const last = round.placed.pop();
    if (!last) return;
    delete round.board[last.key];
    round.hand.push(last.card);
    say("");
    render();
  }

  function undoAll() { while (round.placed.length) undoLast(); }

  // Fin du tour de l'enfant (après avoir posé, ou en piochant), puis tour de Béa.
  function endTurn(drew) {
    round.inst.tries.push({
      turn: round.inst.tries.length + 1, placed: round.placed.length, drew: !!drew,
      missed: !drew && round.hand.length > 0 && anyMove(round.board, round.hand),
      time: Math.round((Date.now() - round.turnStart) / 100) / 10, autonomous: !round.helpThis, success: round.placed.length > 0,
    });
    round.placed = [];
    round.helpThis = false;
    round.sel = null;
    round.hint = null;
    Store.save();
    if (!round.hand.length) return finish(true);
    round.turn = "bea";
    say(T.kipuzzle.beaTurn, null);
    render();
    beaStep(0);
  }

  // Béa pose une carte toutes les 0,7 s, jusqu'à sa limite ou quand elle ne peut plus ;
  // si elle n'a rien pu poser, elle pioche.
  function beaStep(count) {
    timer = setTimeout(() => {
      const moves = [];
      round.bea.forEach(c => cellsFor(round.board, c).forEach(([x, y]) => moves.push({ c, x, y })));
      if (count < round.beaLimit && moves.length) {
        // Béa prend un coup au hasard parmi les coups possibles.
        const m = moves[Math.floor(Math.random() * moves.length)];
        round.board[key(m.x, m.y)] = m.c;
        round.bea.splice(round.bea.indexOf(m.c), 1);
        render();
        if (!round.bea.length) return finish(false);
        return beaStep(count + 1);
      }
      if (count === 0 && round.deck.length) { round.bea.push(round.deck.pop()); say(T.kipuzzle.beaDrew, null); }
      else if (count === 0) say(T.kipuzzle.beaPass, null);
      else say(T.kipuzzle.beaPlaced(count), null);
      // Plus personne ne peut jouer : celui qui a le moins de cartes gagne.
      if (!round.deck.length && !anyMove(round.board, round.hand) && !anyMove(round.board, round.bea)) return finish(round.hand.length < round.bea.length, true);
      round.turn = "me";
      round.turnStart = Date.now();
      timer = setTimeout(() => {
        say(anyMove(round.board, round.hand) ? T.kipuzzle.yourTurn : T.kipuzzle.mustDraw, null);
        render();
      }, 900);
      render();
    }, 700);
  }

  function draw() {
    if (round.deck.length) round.hand.push(round.deck.pop());
    endTurn(true);
  }

  function finish(won, blocked) {
    clearTimeout(timer);
    round.done = true;
    games++;
    round.inst.success = won;
    round.inst.end = Date.now();
    round.inst.cardsLeft = round.hand.length;
    round.inst.beaLeft = round.bea.length;
    if (won) score++;
    Store.save();
    if (won && level < LEVELS.length) { level++; say((blocked ? T.kipuzzle.blocked + " " : "") + T.kipuzzle.wonUp(level), true); }
    else if (won) say(T.kipuzzle.won, true);
    else { if (level > 1) level--; say((blocked ? T.kipuzzle.blocked + " " : "") + T.kipuzzle.lost, false); }
    render();
  }

  // Aide : un coup possible (une carte et sa case) est montré.
  function help() {
    for (const c of CardDeal.shuffle(round.hand.slice())) {
      const cells = cellsFor(round.board, c);
      if (cells.length) {
        const [x, y] = cells[0];
        round.hint = { card: c, key: key(x, y) };
        round.sel = c;
        round.helpThis = true;
        round.inst.help++;
        (round.inst.helps = round.inst.helps || []).push({ type: "show_move", colours: [cardCode(c)], try: round.inst.tries.length, time: Math.round((Date.now() - round.inst.start) / 100) / 10 });
        Store.save();
        say(T.kipuzzle.hint, null);
        render();
        return;
      }
    }
    say(T.kipuzzle.mustDraw, null);
  }

  function init() {
    screen = document.getElementById("kipuzzle-screen");
    screen.innerHTML = `
      <div class="other-head">
        <img class="other-face" src="assets/characters/bea-face.webp" alt="">
        <div><h2 class="other-title" data-r="title"></h2><p class="other-rule" data-r="rule"></p></div>
        <div class="other-ctrl">
          <button class="act ghost" type="button" data-r="menu"></button>
          <label class="level-wrap"><span data-r="lbl-level"></span><select data-r="level"></select></label>
        </div>
      </div>
      <p class="status"><span data-r="bea-count"></span> · <span data-r="deck-count"></span></p>
      <div class="table pz-zone"><div class="pz-grid" data-r="grid"></div></div>
      <div class="panel cg-panel">
        <p class="pz-hand-lbl" data-r="lbl-hand"></p>
        <div class="pz-hand" data-r="hand"></div>
        <div class="pick-row">
          <button class="act" type="button" data-r="end"></button>
          <button class="act ghost" type="button" data-r="draw"></button>
          <button class="act ghost" type="button" data-r="undo"></button>
          <button class="act ghost" type="button" data-r="help"></button>
          <button class="act big" type="button" data-r="next" hidden></button>
        </div>
        <p class="cg-msg" data-r="msg" aria-live="polite"></p>
      </div>
      <p class="status" data-r="score"></p>`;
    q("end").addEventListener("click", () => endTurn(false));
    q("draw").addEventListener("click", draw);
    q("undo").addEventListener("click", undoAll);
    q("help").addEventListener("click", help);
    q("next").addEventListener("click", newRound);
    q("level").addEventListener("change", () => { level = Number(q("level").value); newRound(); });
    q("menu").addEventListener("click", () => { location.hash = ""; });
  }

  function texts(t) {
    T = t;
    q("title").textContent = T.games.kipuzzle.name;
    q("rule").textContent = T.kipuzzle.rule;
    q("lbl-level").textContent = T.level;
    q("lbl-hand").textContent = T.kipuzzle.yourCards;
    q("menu").textContent = "☰ " + T.menu;
    q("end").textContent = T.kipuzzle.endTurn;
    q("draw").textContent = "🂠 " + T.kipuzzle.draw;
    q("undo").textContent = "↶ " + T.kipuzzle.undoAll;
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

  return { init, start, texts, leave, fits, current: () => (round && round.inst ? round.inst.id : null) };
})();
