/* Kiduel (inspiré de « La bataille de Yavin » de KartOOn ; le personnage s'appelle Poupetta) :
   des plis à deux. Celui qui commence pose une carte ; l'autre doit fournir la couleur
   demandée s'il en a ; la plus forte carte de la couleur demandée gagne le pli, et son
   gagnant commence le pli suivant. L'enfant commence le premier pli.
   L'objectif (nombre de plis à gagner) est calculé par un solveur : c'est le nombre de plis
   que l'enfant peut gagner même contre une Poupetta parfaite (les mains sont tirées pour
   qu'il soit d'au moins 1) ; il est donc toujours atteignable.
   10 niveaux : de 3 à 8 cartes chacun ; Poupetta joue au hasard, puis malin (elle gagne le
   pli au moins cher, sinon elle donne sa plus petite carte), puis parfaitement.
   Objectif atteint : niveau suivant ; sinon : niveau précédent.
   Aide (💡) : le solveur montre la meilleure carte à jouer. Chaque pli est enregistré. */
const Kiduel = (() => {
  "use strict";
  // cards : cartes par joueur ; ai : façon de jouer de Poupetta (random, greedy, perfect).
  const LEVELS = [
    { cards: 3, ai: "random" }, { cards: 4, ai: "random" }, { cards: 4, ai: "greedy" },
    { cards: 5, ai: "greedy" }, { cards: 5, ai: "greedy" }, { cards: 6, ai: "greedy" },
    { cards: 6, ai: "perfect" }, { cards: 7, ai: "greedy" }, { cards: 7, ai: "perfect" },
    { cards: 8, ai: "perfect" },
  ];
  const COLOURS = ["blue", "green", "red", "yellow"];
  let T = null, level = 1, round = null, score = 0, games = 0, screen = null, timer = null;
  const q = role => screen.querySelector("[data-r=" + role + "]");
  const cardCode = c => c.colour[0] + c.value;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  // Cartes que l'on peut jouer : celles de la couleur demandée si on en a, sinon toutes.
  function legal(hand, lead) {
    if (!lead) return hand.slice();
    const same = hand.filter(c => c.colour === lead.colour);
    return same.length ? same : hand.slice();
  }
  // Le second joueur gagne s'il a fourni la couleur avec une carte plus forte.
  const secondWins = (lead, reply) => reply.colour === lead.colour && reply.value > lead.value;

  /* ---------- Le solveur ---------- */
  // Plis que l'enfant gagne au mieux contre une Poupetta parfaite, à partir de ses cartes
  // (me), de celles de Poupetta (opp) et de qui commence. Mémoïsé sur les cartes restantes.
  function solver(me0, opp0) {
    const memo = new Map();
    function value(meMask, oppMask, meLeads) {
      if (!meMask) return 0;
      const k = meMask + "," + oppMask + "," + meLeads;
      if (memo.has(k)) return memo.get(k);
      const me = me0.filter((_, i) => meMask & (1 << i)), opp = opp0.filter((_, i) => oppMask & (1 << i));
      const idx = (arr, c) => arr.indexOf(c);
      let best = meLeads ? -1 : 99;
      if (meLeads) {
        for (const a of me) {
          let worst = 99;
          for (const b of legal(opp, a)) {
            const iWin = !secondWins(a, b);
            const v = (iWin ? 1 : 0) + value(meMask & ~(1 << idx(me0, a)), oppMask & ~(1 << idx(opp0, b)), iWin);
            if (v < worst) worst = v;
          }
          if (worst > best) best = worst;
        }
      } else {
        for (const b of opp) {
          let top = -1;
          for (const a of legal(me, b)) {
            const iWin = secondWins(b, a);
            const v = (iWin ? 1 : 0) + value(meMask & ~(1 << idx(me0, a)), oppMask & ~(1 << idx(opp0, b)), iWin);
            if (v > top) top = v;
          }
          if (top < best) best = top;
        }
      }
      memo.set(k, best);
      return best;
    }
    return { value };
  }

  // Solveur et cartes restantes de la partie en cours (les cartes déjà jouées sont retirées).
  function evaluate(r) {
    const s = solver(r.me0, r.opp0);
    const meMask = r.me0.reduce((m, c, i) => (r.mine.includes(c) ? m | (1 << i) : m), 0);
    const oppMask = r.opp0.reduce((m, c, i) => (r.hers.includes(c) ? m | (1 << i) : m), 0);
    return { s, meMask, oppMask };
  }

  function bestForMe() {
    const r = round, { s, meMask, oppMask } = evaluate(r);
    const lead = r.trick.her;           // Poupetta a peut-être déjà joué
    let best = null, bestV = -1;
    for (const a of legal(r.mine, lead)) {
      const nm = meMask & ~(1 << r.me0.indexOf(a));
      let v;
      if (lead) {
        const iWin = secondWins(lead, a);
        v = (iWin ? 1 : 0) + s.value(nm, oppMask & ~(1 << r.opp0.indexOf(lead)), iWin);
      } else {
        v = 99;
        for (const b of legal(r.hers, a)) {
          const iWin = !secondWins(a, b);
          v = Math.min(v, (iWin ? 1 : 0) + s.value(nm, oppMask & ~(1 << r.opp0.indexOf(b)), iWin));
        }
      }
      if (v > bestV) { bestV = v; best = a; }
    }
    return best;
  }

  function herMove() {
    const r = round, lead = r.trick.me;
    const options = legal(r.hers, lead);
    const ai = LEVELS[level - 1].ai;
    if (ai === "random") return options[Math.floor(Math.random() * options.length)];
    if (ai === "greedy") {
      if (lead) {
        const winners = options.filter(c => secondWins(lead, c)).sort((a, b) => a.value - b.value);
        return winners.length ? winners[0] : options.slice().sort((a, b) => a.value - b.value)[0];
      }
      return options.slice().sort((a, b) => b.value - a.value)[0];
    }
    // Parfaite : la carte qui laisse le moins de plis à l'enfant.
    const { s, meMask, oppMask } = evaluate(r);
    let best = null, bestV = 99;
    for (const b of options) {
      const om = oppMask & ~(1 << r.opp0.indexOf(b));
      let v;
      if (lead) {
        const iWin = !secondWins(lead, b);
        v = (iWin ? 1 : 0) + s.value(meMask & ~(1 << r.me0.indexOf(lead)), om, iWin);
      } else {
        v = -1;
        for (const a of legal(r.mine, b)) {
          const iWin = secondWins(b, a);
          v = Math.max(v, (iWin ? 1 : 0) + s.value(meMask & ~(1 << r.me0.indexOf(a)), om, iWin));
        }
      }
      if (v < bestV) { bestV = v; best = b; }
    }
    return best;
  }

  /* ---------- La partie ---------- */
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
    let me0, opp0, objective;
    do {
      const deck = CardDeal.shuffle([].concat(...COLOURS.map(c => CardDeal.ofColour(c, 10, 10))));
      me0 = deck.slice(0, lv.cards);
      opp0 = deck.slice(lv.cards, 2 * lv.cards);
      objective = solver(me0, opp0).value((1 << lv.cards) - 1, (1 << lv.cards) - 1, true);
    } while (objective < 1);
    const sortHand = h => h.slice().sort((a, b) => COLOURS.indexOf(a.colour) - COLOURS.indexOf(b.colour) || a.value - b.value);
    round = {
      me0, opp0, mine: sortHand(me0), hers: opp0.slice(), objective,
      myTricks: 0, herTricks: 0, meLeads: true, trick: { me: null, her: null },
      done: false, busy: false, hint: null, trickStart: Date.now(), helpThis: false,
    };
    round.inst = Store.startInstance({
      game: "kiduel", level, objective, opponent: lv.ai,
      cards: me0.map(cardCode), opponentCards: opp0.map(cardCode), layout: "hand", chaos: 0,
    });
    say(T.kiduel.youLead, null);
    render();
  }

  function say(text, good) {
    const m = q("msg");
    m.textContent = text;
    m.className = "cg-msg" + (good === true ? " ok" : good === false ? " ko" : "");
  }

  function face(c, cls) {
    const e = el("button", "card face du-card" + (cls ? " " + cls : ""));
    e.type = "button";
    e.style.backgroundImage = "url(assets/cards/" + c.colour + "-" + c.value + ".webp)";
    e.setAttribute("aria-label", T.colours[c.colour] + " " + c.value);
    return e;
  }

  function render() {
    q("level").value = level;
    q("score").textContent = T.kipuzzle.score(score, games);
    q("objective").textContent = T.kiduel.objective(round.myTricks, round.objective, round.herTricks);
    const hers = q("hers");
    hers.textContent = "";
    round.hers.forEach(() => {
      const b = el("div", "card back du-back");
      b.innerHTML = '<span class="back-logo"><b class="bk">K</b><b class="bi">I</b><b class="bb">B</b><i class="eye"></i><i class="eye"></i></span>';
      hers.append(b);
    });
    const table = q("table");
    table.textContent = "";
    [["her", T.kiduel.poupetta], ["me", T.kiduel.you]].forEach(([who, label]) => {
      const slot = el("div", "du-slot");
      slot.append(el("div", "du-who", label));
      const c = round.trick[who];
      slot.append(c ? face(c, "played") : el("div", "du-empty"));
      table.append(slot);
    });
    const mine = q("mine");
    mine.textContent = "";
    const canPlay = !round.done && !round.busy && !round.trick.me && (round.meLeads || round.trick.her);
    const ok = legal(round.mine, round.trick.her);
    round.mine.forEach(c => {
      const b = face(c, (ok.includes(c) ? "" : "dim") + (round.hint === c ? " hint" : ""));
      b.disabled = !canPlay || !ok.includes(c);
      b.addEventListener("click", () => play(c));
      mine.append(b);
    });
    q("help").hidden = !canPlay;
    q("next").hidden = !round.done;
  }

  function play(c) {
    const r = round;
    r.mine.splice(r.mine.indexOf(c), 1);
    r.trick.me = c;
    r.hint = null;
    r.busy = true;
    render();
    if (r.meLeads) timer = setTimeout(() => { r.trick.her = herMove(); r.hers.splice(r.hers.indexOf(r.trick.her), 1); render(); endTrick(); }, 700);
    else endTrick();
  }

  // Fin du pli : on désigne le gagnant, on enregistre, puis pli suivant (ou fin de partie).
  function endTrick() {
    const r = round, lead = r.meLeads ? r.trick.me : r.trick.her, reply = r.meLeads ? r.trick.her : r.trick.me;
    const iWin = r.meLeads ? !secondWins(lead, reply) : secondWins(lead, reply);
    if (iWin) r.myTricks++; else r.herTricks++;
    r.inst.tries.push({
      trick: r.inst.tries.length + 1, leader: r.meLeads ? "me" : "opponent",
      mine: cardCode(r.trick.me), hers: cardCode(r.trick.her), success: iWin,
      time: Math.round((Date.now() - r.trickStart) / 100) / 10, autonomous: !r.helpThis,
    });
    Store.save();
    say(iWin ? T.kiduel.won : T.kiduel.lost, iWin);
    render();
    timer = setTimeout(() => {
      r.trick = { me: null, her: null };
      r.meLeads = iWin;
      r.busy = false;
      r.helpThis = false;
      r.trickStart = Date.now();
      if (!r.mine.length) return finish();
      if (r.meLeads) { say(T.kiduel.youLead, null); render(); return; }
      say(T.kiduel.herLead, null);
      render();
      timer = setTimeout(() => {
        r.trick.her = herMove();
        r.hers.splice(r.hers.indexOf(r.trick.her), 1);
        say(T.kiduel.yourReply, null);
        render();
      }, 700);
    }, 1300);
  }

  function finish() {
    const r = round;
    r.done = true;
    games++;
    const good = r.myTricks >= r.objective;
    r.inst.success = good;
    r.inst.tricks = r.myTricks;
    r.inst.end = Date.now();
    if (good) score++;
    Store.save();
    if (good && level < LEVELS.length) { level++; say(T.kiduel.goalUp(r.myTricks, r.objective, level), true); }
    else if (good) say(T.kiduel.goal(r.myTricks, r.objective), true);
    else { if (level > 1) level--; say(T.kiduel.noGoal(r.myTricks, r.objective), false); }
    render();
  }

  function help() {
    round.hint = bestForMe();
    round.helpThis = true;
    round.inst.help++;
    (round.inst.helps = round.inst.helps || []).push({ type: "best_card", colours: [cardCode(round.hint)], try: round.inst.tries.length, time: Math.round((Date.now() - round.inst.start) / 100) / 10 });
    Store.save();
    say(T.kiduel.hint, null);
    render();
  }

  function init() {
    screen = document.getElementById("kiduel-screen");
    screen.innerHTML = `
      <div class="other-head">
        <img class="other-face" src="assets/characters/poupetta-face.webp" alt="">
        <div><h2 class="other-title" data-r="title"></h2><p class="other-rule" data-r="rule"></p></div>
        <div class="other-ctrl">
          <button class="act ghost" type="button" data-r="menu"></button>
          <label class="level-wrap"><span data-r="lbl-level"></span><select data-r="level"></select></label>
        </div>
      </div>
      <p class="du-objective" data-r="objective"></p>
      <div class="table du-zone">
        <div class="du-hand du-hers" data-r="hers"></div>
        <div class="du-table" data-r="table"></div>
        <div class="du-hand" data-r="mine"></div>
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
    q("title").textContent = T.games.kiduel.name;
    q("rule").textContent = T.kiduel.rule;
    q("lbl-level").textContent = T.level;
    q("menu").textContent = "☰ " + T.menu;
    q("help").textContent = "💡 " + T.kiduel.help;
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

  return { init, start, texts, leave, solver, legal, current: () => (round && round.inst ? round.inst.id : null) };
})();
