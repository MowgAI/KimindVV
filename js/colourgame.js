/* Jeux « une réponse par couleur » (inspirés de KartOOn) : des cartes s'affichent et, pour
   chaque couleur présente, l'enfant donne un nombre (combien de cartes dans Kimba, la somme
   des cartes dans Kiplus).
   Progression : une bonne réponse du premier coup fait monter d'un niveau ; deux erreurs
   dans le même tour font redescendre d'un niveau, et le jeu montre la bonne réponse.
   Chaque jeu a son écran (<section id="<id>-screen">), construit ici. */
function ColourGame(opts) {
  "use strict";
  // opts : id, face (image du visage), levels, deal(level) → { cards, grouped, scattered },
  // answer(cards de la couleur) → nombre attendu, digits (réponse tapée chiffre par chiffre
  // au lieu d'un choix de 1 à 10).
  const { id, levels } = opts;
  const COLOURS = ["blue", "green", "red", "yellow"];
  let T = null, level = 1, round = null, sel = 0, score = 0, rounds = 0;
  let screen = null;
  const q = role => screen.querySelector("[data-r=" + role + "]");

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  const expected = c => opts.answer(round.cards.filter(card => card.colour === c));

  function newRound() {
    const dealt = opts.deal(levels[level - 1]);
    round = {
      cards: dealt.cards,
      grouped: dealt.grouped,
      scattered: !!dealt.scattered,
      spots: null,
      colours: COLOURS.filter(c => dealt.cards.some(card => card.colour === c)),
      answers: {},
      errors: 0,
      done: false,
      checked: false,
    };
    sel = 0;
    render();
  }

  // Cartes en désordre : chacune dans une case d'une grille plus grande que nécessaire,
  // déplacée et tournée au hasard dans sa case, pour qu'aucune ne cache les autres.
  // Le nombre de colonnes dépend de la largeur de la zone (une case fait au moins 1,6 carte
  // de large) ; la disposition est gardée pour le tour, et refaite si la largeur change.
  function scatter(n, width, cardW) {
    const cols = Math.max(2, Math.min(Math.ceil(Math.sqrt(n * 2.2)), Math.floor(width / (cardW * 1.6))));
    const rows = Math.ceil(n * 1.3 / cols);
    const cells = CardDeal.shuffle(Array.from({ length: cols * rows }, (_, i) => i)).slice(0, n);
    const jitter = () => (Math.random() - 0.5) * 0.3;
    return {
      width, rows,
      spots: cells.map(i => ({
        x: ((i % cols) + 0.5 + jitter()) / cols * 100,
        y: (Math.floor(i / cols) + 0.5 + jitter()) / rows * 100,
        rot: Math.round((Math.random() - 0.5) * 50),
      })),
    };
  }

  function card(c) {
    const e = el("div", "card face");
    e.style.backgroundImage = "url(assets/cards/" + c.colour + "-" + c.value + ".webp)";
    e.setAttribute("role", "img");
    e.setAttribute("aria-label", T.colours[c.colour] + " " + c.value);
    return e;
  }

  // Une réponse est donnée : on passe à la couleur suivante encore vide.
  function nextBox() {
    const next = round.colours.findIndex((c, i) => i > sel && round.answers[c] === undefined);
    if (next >= 0) sel = next;
  }

  function render() {
    q("level").value = level;
    q("score").textContent = T.colourGames.score(score, rounds);
    const zone = q("cards");
    zone.textContent = "";
    zone.classList.toggle("grouped", round.grouped);
    zone.classList.toggle("scattered", round.scattered);
    zone.style.height = "";
    if (round.scattered) {
      // Les cartes sont posées dans une aire intérieure (une demi-carte de marge) pour ne
      // jamais dépasser du bord.
      const area = el("div", "cg-area");
      zone.append(area);
      const cardW = parseFloat(getComputedStyle(zone).getPropertyValue("--scat-w")) || 70;
      if (!round.spots || round.spots.width !== area.clientWidth) round.spots = scatter(round.cards.length, area.clientWidth, cardW);
      zone.style.height = "calc(" + round.spots.rows + " * var(--cell-h) + var(--scat-w) * 1.6)";
      round.cards.forEach((x, i) => {
        const e = card(x), s = round.spots.spots[i];
        e.style.left = s.x + "%";
        e.style.top = s.y + "%";
        e.style.transform = "translate(-50%, -50%) rotate(" + s.rot + "deg)";
        area.append(e);
      });
    } else if (round.grouped) {
      round.colours.forEach(c => {
        const row = el("div", "cg-row");
        round.cards.filter(x => x.colour === c).forEach(x => row.append(card(x)));
        zone.append(row);
      });
    } else round.cards.forEach(x => zone.append(card(x)));

    const answers = q("answers");
    answers.textContent = "";
    round.colours.forEach((c, i) => {
      const a = round.answers[c];
      const wrong = round.checked && a !== expected(c);
      const b = el("button", "cg-box c-" + c + (sel === i && !round.done ? " selected" : "") + (round.checked ? (wrong ? " ko" : " ok") : ""), a === undefined ? "?" : a);
      b.type = "button";
      b.disabled = round.done;
      b.setAttribute("aria-label", T[id].box(T.colours[c]));
      b.addEventListener("click", () => { sel = i; round.checked = false; render(); });
      answers.append(b);
    });

    const pad = q("pad");
    pad.textContent = "";
    const press = fn => () => { fn(round.colours[sel]); round.checked = false; render(); };
    if (opts.digits) {
      // Pavé de chiffres : la réponse se tape chiffre par chiffre (deux chiffres au plus).
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].forEach(d => {
        const b = el("button", "choice value", d);
        b.type = "button";
        b.disabled = round.done;
        b.addEventListener("click", press(c => {
          const cur = round.answers[c];
          round.answers[c] = cur === undefined || cur >= 10 ? d : cur * 10 + d;
          if (round.answers[c] >= 10) nextBox();
        }));
        pad.append(b);
      });
      const erase = el("button", "choice value", "⌫");
      erase.type = "button";
      erase.disabled = round.done;
      erase.setAttribute("aria-label", T.colourGames.erase);
      erase.addEventListener("click", press(c => {
        const cur = round.answers[c];
        if (cur === undefined || cur < 10) delete round.answers[c]; else round.answers[c] = Math.floor(cur / 10);
      }));
      pad.append(erase);
    } else {
      for (let v = 1; v <= Math.min(10, round.cards.length); v++) {
        const b = el("button", "choice value", v);
        b.type = "button";
        b.disabled = round.done;
        b.addEventListener("click", press(c => { round.answers[c] = v; nextBox(); }));
        pad.append(b);
      }
    }

    const complete = round.colours.every(c => round.answers[c] !== undefined);
    q("check").hidden = round.done;
    q("check").disabled = !complete;
    q("next").hidden = !round.done;
    pad.hidden = round.done;
  }

  function say(text, good) {
    const m = q("msg");
    m.textContent = text;
    m.className = "cg-msg" + (good === true ? " ok" : good === false ? " ko" : "");
  }

  function check() {
    round.checked = true;
    const good = round.colours.every(c => round.answers[c] === expected(c));
    if (good) {
      round.done = true;
      rounds++;
      score++;
      if (round.errors === 0 && level < levels.length) { level++; say(T.colourGames.bravoUp(level), true); }
      else say(T.colourGames.bravo, true);
    } else if (++round.errors >= 2) {
      round.done = true;
      rounds++;
      round.colours.forEach(c => { round.answers[c] = expected(c); });
      round.checked = false;
      if (level > 1) level--;
      say(T.colourGames.solution, false);
    } else {
      say(T[id].retry, false);
      sel = round.colours.findIndex(c => round.answers[c] !== expected(c));
    }
    render();
  }

  // Construit l'écran du jeu (une seule fois).
  function init() {
    screen = document.getElementById(id + "-screen");
    screen.innerHTML = `
      <div class="other-head">
        <img class="other-face" src="${opts.face}" alt="">
        <div><h2 class="other-title" data-r="title"></h2><p class="other-rule" data-r="rule"></p></div>
        <div class="other-ctrl">
          <button class="act ghost" type="button" data-r="menu"></button>
          <label class="level-wrap"><span data-r="lbl-level"></span><select data-r="level"></select></label>
        </div>
      </div>
      <div class="table cg-cards" data-r="cards"></div>
      <div class="panel cg-panel">
        <div class="cg-answers" data-r="answers"></div>
        <div class="choices cg-pad" data-r="pad"></div>
        <div class="pick-row">
          <button class="act big" type="button" data-r="check"></button>
          <button class="act big" type="button" data-r="next" hidden></button>
          <span class="cg-msg" data-r="msg" aria-live="polite"></span>
        </div>
      </div>
      <p class="status" data-r="score"></p>`;
    q("check").addEventListener("click", check);
    q("next").addEventListener("click", () => { say(""); newRound(); });
    q("level").addEventListener("change", () => { level = Number(q("level").value); say(""); newRound(); });
    q("menu").addEventListener("click", () => { location.hash = ""; });
  }

  // Textes de l'écran (au début et quand la langue change).
  function texts(t) {
    T = t;
    q("title").textContent = T.games[id].name;
    q("rule").textContent = T[id].rule;
    q("lbl-level").textContent = T.level;
    q("menu").textContent = "☰ " + T.menu;
    q("check").textContent = T.colourGames.check;
    q("next").textContent = T.colourGames.next;
    const s = q("level");
    s.textContent = "";
    levels.forEach((l, i) => s.append(new Option((i + 1) + " / " + levels.length, i + 1)));
    s.value = level;
    if (round) { render(); say(""); }
  }

  function start(t) {
    texts(t);
    score = 0;
    rounds = 0;
    say("");
    newRound();
  }

  return { init, start, texts };
}

/* Outils de tirage communs. */
const CardDeal = {
  shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
  // `n` couleurs prises au hasard.
  colours(n) { return CardDeal.shuffle(["blue", "green", "red", "yellow"]).slice(0, n); },
  // `n` cartes différentes de la couleur `c`, de valeur au plus `max`.
  ofColour(c, n, max) { return CardDeal.shuffle(Array.from({ length: max }, (_, i) => ({ colour: c, value: i + 1 }))).slice(0, n); },
};

/* Kimba (inspiré de « Compte avec Archi ») : combien de cartes de chaque couleur ?
   10 niveaux, de 3 cartes en 2 couleurs à 14 cartes en 4 couleurs, mélangées ; aux
   niveaux 7 à 10, les cartes sont posées en désordre. */
const Kimba = ColourGame({
  id: "kimba",
  face: "assets/characters/archi-face.webp",
  levels: [
    { cards: 3, colours: 2 }, { cards: 4, colours: 2 }, { cards: 6, colours: 2 },
    { cards: 6, colours: 3 }, { cards: 8, colours: 3 }, { cards: 9, colours: 3 },
    { cards: 8, colours: 4, scattered: true }, { cards: 10, colours: 4, scattered: true },
    { cards: 12, colours: 4, scattered: true }, { cards: 14, colours: 4, scattered: true },
  ],
  deal({ cards, colours, scattered }) {
    const cols = CardDeal.colours(colours);
    const deck = CardDeal.shuffle([].concat(...cols.map(c => CardDeal.ofColour(c, 10, 10))));
    const hand = cols.map(c => deck.find(x => x.colour === c));
    deck.filter(x => !hand.includes(x)).slice(0, cards - colours).forEach(x => hand.push(x));
    return { cards: CardDeal.shuffle(hand), grouped: false, scattered };
  },
  answer: cards => cards.length,
});

/* Kiplus (inspiré de « Ajoute avec Lili ») : la somme des cartes de chaque couleur.
   10 niveaux : de 2 petites cartes d'une couleur à 4 couleurs de 4 cartes ; les cartes
   sont rangées par couleur (une ligne par couleur), puis mélangées aux niveaux difficiles,
   et posées en désordre aux niveaux 8 à 10. */
const Kiplus = ColourGame({
  id: "kiplus",
  face: "assets/characters/lili-face.webp",
  digits: true,
  levels: [
    { colours: 1, per: 2, max: 5, mixed: false },
    { colours: 2, per: 2, max: 5, mixed: false },
    { colours: 2, per: 2, max: 10, mixed: false },
    { colours: 2, per: 3, max: 5, mixed: false },
    { colours: 3, per: 2, max: 10, mixed: false },
    { colours: 2, per: 2, max: 10, mixed: true },
    { colours: 3, per: 3, max: 10, mixed: false },
    { colours: 3, per: 3, max: 10, mixed: true, scattered: true },
    { colours: 4, per: 3, max: 10, mixed: true, scattered: true },
    { colours: 4, per: 4, max: 10, mixed: true, scattered: true },
  ],
  deal({ colours, per, max, mixed, scattered }) {
    const cards = [].concat(...CardDeal.colours(colours).map(c => CardDeal.ofColour(c, per, max)));
    return { cards: mixed ? CardDeal.shuffle(cards) : cards, grouped: !mixed, scattered };
  },
  answer: cards => cards.reduce((t, c) => t + c.value, 0),
});
