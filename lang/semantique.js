"use strict";
/* Sémantique des exercices (docs/semantique-exercices.md), en données : ce que chaque jeu demande.
   PREMIER JET de Claude, à corriger par l'auteure (source de chaque valeur : « claude »).
   Ce n'est PAS un classement : le parcours (js/parcours.js) compare ces demandes à ce que l'enfant
   montre, lui, dans chaque jeu (comparé à lui-même, jamais à une norme : charte de la personnalisation).

   skills : poids de chaque compétence au premier et au dernier niveau [niveau 1, dernier niveau],
     de 0 (pas du tout) à 3 (beaucoup) : memory, calc, logic, strategy, speed.
   chrono : niveau à partir duquel il y a un temps limité (absent : jamais).
   look : niveau à partir duquel il y a beaucoup à regarder.
   opponent : un adversaire. ton : fun (rigolo), mid (entre les deux), serious (sérieux, collé à l'école).
   levels : nombre de niveaux (Kimind : facile, moyen, difficile). */
window.SEMANTIQUE = {
  source: "claude",
  games: {
    kimba:       { levels: 10, ton: "serious", look: 7, skills: { calc: [1, 2], speed: [0, 1] } },
    kiplus:      { levels: 10, ton: "serious", look: 8, skills: { calc: [2, 3], memory: [0, 1] } },
    kijun:       { levels: 10, ton: "serious", look: 8, skills: { calc: [2, 3], logic: [1, 2], memory: [1, 1] } },
    kipharaon:   { levels: 10, ton: "mid", look: 7, skills: { calc: [2, 2], logic: [1, 2], strategy: [1, 2] } },
    kidory:      { levels: 10, ton: "fun", look: 8, skills: { memory: [3, 3], strategy: [1, 1] } },
    kibal:       { levels: 10, ton: "fun", chrono: 5, look: 7, skills: { speed: [3, 3], calc: [1, 1], logic: [0, 2] } },
    kipotter:    { levels: 10, ton: "serious", skills: { calc: [1, 3], logic: [1, 1] } },
    kicompuzzle: { levels: 10, ton: "mid", skills: { calc: [2, 3], logic: [2, 3], strategy: [1, 1] } },
    kipuzzle:    { levels: 10, ton: "fun", opponent: true, skills: { logic: [2, 3], strategy: [2, 3], calc: [1, 1], memory: [1, 1] } },
    kiduel:      { levels: 10, ton: "fun", opponent: true, skills: { strategy: [2, 3], memory: [1, 2], logic: [2, 2], calc: [1, 1] } },
    initiale:    { levels: 3, ton: "mid", kimind: true, skills: { logic: [3, 3], calc: [2, 2], memory: [1, 1], strategy: [1, 1] } },
    kiminus:     { levels: 3, ton: "serious", kimind: true, skills: { logic: [3, 3], calc: [3, 3], memory: [1, 1], strategy: [1, 1] } },
    kimminmaxus: { levels: 3, ton: "mid", kimind: true, skills: { logic: [3, 3], calc: [3, 3], memory: [2, 2], strategy: [2, 2] } },
    kimind5:     { levels: 3, ton: "mid", kimind: true, skills: { logic: [3, 3], calc: [2, 2], memory: [2, 2], strategy: [1, 1] } },
  },
  /* Les jeux du défi Kichallenge (js/kichallenge.js), À TRIER PAR L'AUTEURE : pour chaque jeu, les niveaux
     proposés à chaque difficulté du défi, [du niveau, au niveau]. null : le jeu n'est pas proposé à
     cette difficulté (par exemple Kimba et Kiplus, pas marrants quand il y a trop de cartes).
     Un jeu absent de la liste n'est jamais dans le défi (Kipuzzle et Kiduel : parties entières avec adversaire).
     S'il y a moins de 5 jeux pour une difficulté, un jeu revient, jamais deux fois de suite. */
  challenge: {
    //             Facile    Moyen     Difficile  Ultime
    kimba:       { easy: [1, 3], medium: [4, 5], hard: null,   ultimate: null },
    kiplus:      { easy: [1, 3], medium: [4, 5], hard: null,   ultimate: null },
    kijun:       { easy: [1, 3], medium: [4, 6], hard: [7, 9], ultimate: [10, 10] },
    kipharaon:   { easy: [1, 3], medium: [4, 6], hard: [7, 9], ultimate: [10, 10] },
    kidory:      { easy: [1, 3], medium: [4, 6], hard: [7, 9], ultimate: [10, 10] },
    kibal:       { easy: [1, 3], medium: [4, 6], hard: [7, 9], ultimate: [10, 10] },
    kipotter:    { easy: [1, 3], medium: [4, 6], hard: [7, 9], ultimate: [10, 10] },
    kicompuzzle: { easy: [1, 3], medium: [4, 6], hard: [7, 9], ultimate: [10, 10] },
  },
  // Kiboo : une autre application (récompense, et voie à part entière pour les « non scolaires »).
  kiboo: { ton: "fun", opponent: true, skills: { strategy: [3, 3], memory: [2, 2], logic: [2, 2], calc: [1, 1] } },
};
