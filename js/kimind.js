/* Moteur de Kimind : énoncés, solutions possibles et réponses aux cartes jouées.
   Utilisable dans le navigateur (window.Kimind) et sous Node (require("./js/kimind.js")). */
(function (root) {
  "use strict";

  const COLOURS = ["blue", "green", "red", "yellow"];
  const NB_CARDS = 4;
  const VMIN = 1, VMAX = 10;

  // Les 24 façons de placer les 4 couleurs sur les positions 0 à 3.
  const PERMS = (function () {
    const out = [];
    (function rec(prefix, rest) {
      if (!rest.length) { out.push(prefix); return; }
      rest.forEach((c, i) => rec(prefix.concat(c), rest.slice(0, i).concat(rest.slice(i + 1))));
    })([], COLOURS);
    return out;
  })();

  // Ordre des couleurs déduit des valeurs : groupes de couleurs de même valeur, du plus petit au plus grand.
  // ex) {yellow:3, red:3, green:7, blue:9} → [["yellow","red"],["green"],["blue"]]
  function orderFromValues(values, rng) {
    const byValue = {};
    COLOURS.forEach(c => { (byValue[values[c]] = byValue[values[c]] || []).push(c); });
    return Object.keys(byValue).map(Number).sort((a, b) => a - b)
      .map(v => rng ? shuffle(byValue[v].slice(), rng) : byValue[v]);
  }

  // Toutes les valeurs des couleurs compatibles avec la somme et l'ordre.
  function valueSolutions(sum, order) {
    const out = [];
    const groups = order.length;
    (function rec(g, min, acc, total) {
      if (g === groups) { if (total === sum) out.push(Object.assign({}, acc)); return; }
      const size = order[g].length;
      for (let v = min; v <= VMAX; v++) {
        const t = total + v * size;
        if (t > sum) break;
        order[g].forEach(c => { acc[c] = v; });
        rec(g + 1, v + 1, acc, t);
      }
      order[g].forEach(c => { delete acc[c]; });
    })(0, VMIN, {}, 0);
    return out;
  }

  // Solutions complètes : une couleur et une valeur pour chaque position.
  function allSolutions(statement) {
    const vals = valueSolutions(statement.sum, statement.order);
    const out = [];
    PERMS.forEach(perm => vals.forEach(v => out.push(perm.map(c => ({ colour: c, value: v[c] })))));
    return out;
  }

  // Réponse à une carte jouée : la couleur est-elle la bonne, et la vraie valeur est-elle
  // plus petite (less), plus grande (more) ou égale (equals) à la valeur proposée.
  function answer(solution, position, colour, value) {
    const card = solution[position];
    return {
      colour: card.colour === colour,
      value: card.value < value ? "less" : card.value > value ? "more" : "equals",
    };
  }

  function compatible(candidate, play) {
    const r = answer(candidate, play.position, play.colour, play.value);
    return r.colour === play.answer.colour && r.value === play.answer.value;
  }

  // Solutions encore possibles après les cartes jouées.
  function remaining(statement, plays) {
    return allSolutions(statement).filter(s => plays.every(p => compatible(s, p)));
  }

  // Niveaux de difficulté selon le nombre de façons de choisir les valeurs.
  const LEVELS = {
    easy:   { min: 1,  max: 3 },
    medium: { min: 4,  max: 8 },
    hard:   { min: 9,  max: Infinity },
  };

  function levelOf(nbValueSolutions) {
    return Object.keys(LEVELS).find(k => nbValueSolutions >= LEVELS[k].min && nbValueSolutions <= LEVELS[k].max);
  }

  function shuffle(a, rng) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Tire une partie au hasard du niveau demandé.
  function newGame(level, rng) {
    rng = rng || Math.random;
    for (let tries = 0; tries < 10000; tries++) {
      const values = {};
      COLOURS.forEach(c => { values[c] = VMIN + Math.floor(rng() * (VMAX - VMIN + 1)); });
      const sum = COLOURS.reduce((t, c) => t + values[c], 0);
      const order = orderFromValues(values, rng);
      const nb = valueSolutions(sum, order).length;
      if (level && levelOf(nb) !== level) continue;
      const perm = PERMS[Math.floor(rng() * PERMS.length)];
      return {
        statement: { sum, order },
        solution: perm.map(c => ({ colour: c, value: values[c] })),
        nbValueSolutions: nb,
        nbSolutions: nb * PERMS.length,
        level: levelOf(nb),
      };
    }
    throw new Error("Aucune partie trouvée pour le niveau " + level);
  }

  const Kimind = { COLOURS, NB_CARDS, VMIN, VMAX, PERMS, LEVELS, orderFromValues, valueSolutions,
    allSolutions, answer, remaining, levelOf, newGame };
  if (typeof module !== "undefined" && module.exports) module.exports = Kimind;
  else root.Kimind = Kimind;
})(this);
