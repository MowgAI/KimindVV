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
    id: "plus-moins",
    name: "Kimind ±",
    subtitle: "Variante plus et moins",
    description: "Les valeurs des cartes ne s'ajoutent plus toutes : certaines se retranchent, par exemple carte 0 + carte 1 − carte 2 + carte 3 = 25.",
    newGame: level => Kimind.newSignedGame(level),
  },
];
