/* Versions de Kimind proposées dans le menu. Pour ajouter une variante : une entrée ici,
   son nom et sa description dans lang/fr.js et lang/en.js (versions), et ses règles
   dans js/kimind.js ou un fichier à elle. */
const VERSIONS = [
  {
    id: "initiale",
    newGame: level => Kimind.newGame(level),
  },
  {
    id: "kiminus",
    signs: "shown",
    newGame: level => Kimind.newSignedGame(level),
  },
  {
    id: "kimminmaxus",
    signs: "hidden",
    newGame: level => Kimind.newHiddenSignsGame(level),
  },
];
