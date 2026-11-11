/* Kimba (inspiré de « Compte avec Archi » de KartOOn) : des cartes mélangées s'affichent ;
   pour chaque couleur présente, l'enfant dit combien il y a de cartes de cette couleur.
   10 niveaux (de 3 cartes en 2 couleurs à 14 cartes en 4 couleurs). Une bonne réponse du
   premier coup fait monter d'un niveau ; deux erreurs dans le même tour font redescendre
   d'un niveau, et le jeu montre la bonne réponse. */
const Kimba = (() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const COLOURS = ["blue", "green", "red", "yellow"];
  // Niveau → nombre de cartes et nombre de couleurs.
  const LEVELS = [
    { cards: 3, colours: 2 }, { cards: 4, colours: 2 }, { cards: 6, colours: 2 },
    { cards: 6, colours: 3 }, { cards: 8, colours: 3 }, { cards: 9, colours: 3 },
    { cards: 8, colours: 4 }, { cards: 10, colours: 4 }, { cards: 12, colours: 4 },
    { cards: 14, colours: 4 },
  ];
  let T = null, level = 1, round = null, sel = 0, score = 0, rounds = 0;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // Un tour : des cartes toutes différentes, au moins une de chaque couleur choisie.
  function newRound() {
    const { cards, colours } = LEVELS[level - 1];
    const cols = shuffle(COLOURS.slice()).slice(0, colours);
    const deck = shuffle([].concat(...cols.map(c => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => ({ colour: c, value: v })))));
    const hand = cols.map(c => deck.find(card => card.colour === c));
    deck.filter(card => !hand.includes(card)).slice(0, cards - colours).forEach(card => hand.push(card));
    round = {
      cards: shuffle(hand),
      colours: COLOURS.filter(c => cols.includes(c)),
      answers: {},
      errors: 0,
      done: false,
    };
    sel = 0;
    render();
  }

  const count = c => round.cards.filter(card => card.colour === c).length;

  function render() {
    $("kimba-level").value = level;
    $("kimba-score").textContent = T.kimba.score(score, rounds);
    const zone = $("kimba-cards");
    zone.textContent = "";
    round.cards.forEach(card => {
      const e = el("div", "card face");
      e.style.backgroundImage = "url(assets/cards/" + card.colour + "-" + card.value + ".webp)";
      e.setAttribute("role", "img");
      e.setAttribute("aria-label", T.colours[card.colour] + " " + card.value);
      zone.append(e);
    });
    const answers = $("kimba-answers");
    answers.textContent = "";
    round.colours.forEach((c, i) => {
      const a = round.answers[c];
      const wrong = round.checked && a !== count(c);
      const b = el("button", "kimba-box c-" + c + (sel === i && !round.done ? " selected" : "") + (round.checked ? (wrong ? " ko" : " ok") : ""), a === undefined ? "?" : a);
      b.type = "button";
      b.disabled = round.done;
      b.setAttribute("aria-label", T.kimba.howMany(T.colours[c]));
      b.addEventListener("click", () => { sel = i; round.checked = false; render(); });
      answers.append(b);
    });
    const pad = $("kimba-pad");
    pad.textContent = "";
    const max = LEVELS[level - 1].cards;
    for (let v = 1; v <= Math.min(10, max); v++) {
      const b = el("button", "choice value", v);
      b.type = "button";
      b.disabled = round.done;
      b.addEventListener("click", () => {
        round.answers[round.colours[sel]] = v;
        round.checked = false;
        const next = round.colours.findIndex((c, i) => i > sel && round.answers[c] === undefined);
        if (next >= 0) sel = next;
        render();
      });
      pad.append(b);
    }
    const complete = round.colours.every(c => round.answers[c] !== undefined);
    $("kimba-check").textContent = T.kimba.check;
    $("kimba-check").hidden = round.done;
    $("kimba-check").disabled = !complete;
    $("kimba-next").textContent = T.kimba.next;
    $("kimba-next").hidden = !round.done;
    $("kimba-pad").hidden = round.done;
  }

  function say(text, good) {
    const m = $("kimba-msg");
    m.textContent = text;
    m.className = "kimba-msg" + (good === true ? " ok" : good === false ? " ko" : "");
  }

  function check() {
    round.checked = true;
    const good = round.colours.every(c => round.answers[c] === count(c));
    if (good) {
      round.done = true;
      rounds++;
      score++;
      if (round.errors === 0 && level < LEVELS.length) { level++; say(T.kimba.bravoUp(level), true); }
      else say(T.kimba.bravo, true);
    } else if (++round.errors >= 2) {
      round.done = true;
      rounds++;
      round.colours.forEach(c => { round.answers[c] = count(c); });
      round.checked = false;
      if (level > 1) level--;
      say(T.kimba.solution, false);
    } else {
      say(T.kimba.retry, false);
      sel = round.colours.findIndex(c => round.answers[c] !== count(c));
    }
    render();
  }

  // Textes de l'écran (au début et quand la langue change).
  function texts(t) {
    T = t;
    $("kimba-title").textContent = T.kimba.name;
    $("kimba-rule").textContent = T.kimba.rule;
    $("lbl-kimba-level").textContent = T.level;
    $("kimba-menu").textContent = "☰ " + T.menu;
    const sel = $("kimba-level");
    sel.textContent = "";
    LEVELS.forEach((l, i) => sel.append(new Option((i + 1) + " / " + LEVELS.length, i + 1)));
    sel.value = level;
    if (round) { render(); if ($("kimba-msg").textContent) say(""); }
  }

  function start(t) {
    texts(t);
    score = 0;
    rounds = 0;
    say("");
    newRound();
  }

  function init() {
    $("kimba-check").addEventListener("click", check);
    $("kimba-next").addEventListener("click", () => { say(""); newRound(); });
    $("kimba-level").addEventListener("change", () => { level = Number($("kimba-level").value); say(""); newRound(); });
    $("kimba-menu").addEventListener("click", () => { location.hash = ""; });
  }

  return { init, start, texts, LEVELS };
})();
