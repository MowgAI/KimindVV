"use strict";
/* Les ateliers créatifs (js/creatif.js) : il n'y a pas de bonne réponse, seulement des idées
   (charte de la personnalisation, principes 3 et 4). Contenu séparé du code.

   1. « Invente ton personnage » : un cadavre exquis avec les dessins des cartes (tête, corps,
      pieds de trois personnages), un nom et une phrase drôle ; il rejoint la parade.
   2. « Pourquoi ensemble ? » : 4 cartes, « laquelle n'est pas comme les autres ? » ; toutes les
      raisons justes sont acceptées, et les raisons inventées par l'enfant aussi.

   attrs : ce qu'on voit sur chaque carte (premier jet de Claude d'après les dessins et la BK
   générale — number_legs, character_color — à corriger). colour : couleur du personnage
   (null : on ne le dit pas) ; legs : nombre de pattes ; flies : il vole ; head : il porte quelque
   chose sur la tête (chapeau, casque, couronne…). */
window.CREATIF = {
  attrs: {
    "blue-1": { colour: "brown", legs: 2 }, "blue-2": { colour: "blue", legs: 2, flies: true }, "blue-3": { colour: "grey", legs: 2 },
    "blue-4": { colour: "brown", legs: 4 }, "blue-5": { colour: "pink", legs: 2 }, "blue-6": { colour: "orange", legs: 2 },
    "blue-7": { colour: "white", legs: 2 }, "blue-8": { colour: "brown", legs: 2 }, "blue-9": { colour: "white", legs: 2 },
    "blue-10": { colour: "white", legs: 2 },
    "green-1": { colour: "green", legs: 2 }, "green-2": { colour: "pink", legs: 2 }, "green-3": { colour: "purple", legs: 4 },
    "green-4": { colour: "green", legs: 4 }, "green-5": { colour: "grey", legs: 2, flies: true }, "green-6": { colour: "blue", legs: 2 },
    "green-7": { colour: "orange", legs: 2 }, "green-8": { colour: "red", legs: 2 }, "green-9": { colour: "blue", legs: 2 },
    "green-10": { colour: "purple", legs: 4 },
    "red-1": { colour: "green", legs: 2 }, "red-2": { colour: "orange", legs: 2 }, "red-3": { colour: "orange", legs: 2 },
    "red-4": { colour: "green", legs: 2 }, "red-5": { colour: "grey", legs: 2 }, "red-6": { colour: "yellow", legs: 2 },
    "red-7": { colour: "red", legs: 2 }, "red-8": { colour: "white", legs: 2, head: true }, "red-9": { colour: "blue", legs: 2 },
    "red-10": { colour: "yellow", legs: 1, head: true },
    "yellow-1": { colour: null, legs: 2, head: true }, "yellow-2": { colour: null, legs: 2, flies: true, head: true }, "yellow-3": { colour: null, legs: 2, head: true },
    "yellow-4": { colour: null, legs: 2, head: true }, "yellow-5": { colour: null, legs: 2 }, "yellow-6": { colour: null, legs: 2, head: true },
    "yellow-7": { colour: null, legs: 2 }, "yellow-8": { colour: null, legs: 2, head: true }, "yellow-9": { colour: null, legs: 2, head: true },
    "yellow-10": { colour: null, legs: 2 },
  },
  colours: {
    brown: { fr: "marron", en: "brown" }, blue: { fr: "bleu", en: "blue" }, grey: { fr: "gris", en: "grey" }, pink: { fr: "rose", en: "pink" },
    orange: { fr: "orange", en: "orange" }, white: { fr: "blanc", en: "white" }, green: { fr: "vert", en: "green" }, purple: { fr: "violet", en: "purple" },
    red: { fr: "rouge", en: "red" }, yellow: { fr: "jaune", en: "yellow" },
  },
  // Les raisons que l'enfant peut choisir (« ses pattes », « sa couleur »…). La phrase dite quand
  // la raison est juste pour cette carte : {x} = la valeur (famille, couleur, nombre de pattes).
  reasons: {
    family:  { icon: "👪", fr: "sa famille", en: "its family", ok: { fr: "C'est le seul {x} !", en: "It's the only {x}!" } },
    colour:  { icon: "🎨", fr: "la couleur du personnage", en: "the character's colour", ok: { fr: "C'est le seul personnage {x} !", en: "It's the only {x} character!" } },
    parity:  { icon: "🔢", fr: "pair ou impair", en: "odd or even", ok: { fr: "C'est le seul nombre {x} !", en: "It's the only {x} number!" } },
    size:    { icon: "📏", fr: "grand ou petit nombre", en: "big or small number", ok: { fr: "C'est le seul {x} !", en: "It's the only {x}!" } },
    max:     { icon: "⬆️", fr: "le plus grand nombre", en: "the biggest number", ok: { fr: "C'est le plus grand nombre !", en: "It's the biggest number!" } },
    min:     { icon: "⬇️", fr: "le plus petit nombre", en: "the smallest number", ok: { fr: "C'est le plus petit nombre !", en: "It's the smallest number!" } },
    legs:    { icon: "🦵", fr: "ses pattes", en: "its legs", ok: { fr: "C'est le seul avec {x} !", en: "It's the only one with {x}!" } },
    flies:   { icon: "🪽", fr: "il vole", en: "it flies", ok: { fr: "C'est le seul qui vole !", en: "It's the only one that flies!" } },
    head:    { icon: "🎩", fr: "sur sa tête", en: "on its head", ok: { fr: "C'est le seul qui porte quelque chose sur la tête !", en: "It's the only one wearing something on its head!" } },
  },
  families: { blue: { fr: "animal", en: "animal" }, green: { fr: "dinosaure", en: "dinosaur" }, red: { fr: "robot", en: "robot" }, yellow: { fr: "humain", en: "human" } },
  sizes: { big: { fr: "grand nombre (plus de 5)", en: "big number (more than 5)" }, small: { fr: "petit nombre (5 ou moins)", en: "small number (5 or less)" } },
  parities: { even: { fr: "pair", en: "even" }, odd: { fr: "impair", en: "odd" } },
  legsText: { 1: { fr: "une seule patte", en: "just one leg" }, 2: { fr: "deux pattes", en: "two legs" }, 4: { fr: "quatre pattes", en: "four legs" } },
  // Quand la raison choisie n'est pas juste pour cette carte : on encourage à regarder encore.
  notQuite: { fr: ["Hmm, regarde bien les autres cartes…", "Presque ! Une autre carte a la même chose.", "Pas tout à fait… cherche encore !"],
    en: ["Hmm, look carefully at the other cards…", "Nearly! Another card has the same thing.", "Not quite… keep looking!"] },
  // Réactions de KibooM à une création ou à une idée : curieuses, jamais notées.
  wow: { fr: ["Je n'y aurais jamais pensé !", "Quelle idée !", "Génial, ça !", "Ça, c'est original !", "J'adore !", "Raconte-moi encore !"],
    en: ["I'd never have thought of that!", "What an idea!", "Brilliant!", "Now that's original!", "I love it!", "Tell me more!"] },
  // Idées de phrases drôles pour un personnage inventé ({name}, {a} : la tête, {b} : le corps, {c} : les pieds).
  phrases: {
    fr: ["Je suis {name} ! J'ai la tête de {a}, le ventre de {b} et les pieds de {c}… et je danse très mal.",
      "Je suis {name} ! Ma tête vient de {a}, mais mes pieds n'en font qu'à leur tête.",
      "Je suis {name} ! Personne ne me ressemble, et c'est très bien comme ça.",
      "Je suis {name} ! Le matin, je ne sais jamais quels pieds mettre.",
      "Je suis {name} ! Moitié {a}, moitié {c}, et cent pour cent rigolo."],
    en: ["I'm {name}! I've got {a}'s head, {b}'s tummy and {c}'s feet… and I dance really badly.",
      "I'm {name}! My head comes from {a}, but my feet have a mind of their own.",
      "I'm {name}! Nobody looks like me, and that's just fine.",
      "I'm {name}! In the morning, I never know which feet to put on.",
      "I'm {name}! Half {a}, half {c}, and a hundred per cent funny."],
  },
};
