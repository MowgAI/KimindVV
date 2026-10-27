/* Versions de Kimind proposées dans le menu. Pour ajouter une variante : une entrée ici,
   ses textes dans lang/fr.js, et ses règles dans js/kimind.js ou un fichier à elle. */
const VERSIONS = [
  {
    id: "initiale",
    name: "Kimind",
    subtitle: "Version initiale",
    description: "Propose les 4 cartes à chaque tour. Le jeu répond pour chaque position : bonne couleur ou pas, valeur plus grande, plus petite ou égale.",
    newGame: level => Kimind.newGame(level),
  },
  {
    id: "kiminus",
    name: "KiMinus",
    subtitle: "Variante 1 : des plus et des moins",
    description: "Les valeurs des cartes s'ajoutent ou se retranchent, par exemple carte 0 + carte 1 − carte 2 + carte 3 = 25. Les signes sont donnés.",
    signs: "shown",
    newGame: level => Kimind.newSignedGame(level),
  },
  {
    id: "kiminus-2",
    name: "KiMinus 2",
    subtitle: "Variante 2 : les signes sont cachés",
    description: "Comme KiMinus, mais les signes sont cachés : propose aussi un + ou un − entre tes cartes. Le jeu dit si chaque signe est juste.",
    signs: "hidden",
    newGame: level => Kimind.newHiddenSignsGame(level),
  },
];
