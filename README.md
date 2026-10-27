# Kimind

Devine les couleurs et les valeurs de 4 cartes cachées, avec les cartes de [Kiboo](https://github.com/MowgAI/Kiboo).

## Règles

- Quatre cartes sont cachées, aux positions 0, 1, 2 et 3.
- Chaque valeur est entre 1 et 10, chaque couleur est bleu, vert, rouge ou jaune.
- Les cartes ont des couleurs différentes : une carte de chaque couleur.
- On connaît la somme S des valeurs et l'ordre des couleurs, par exemple `jaune = rouge < vert < bleu`.
- À chaque coup, on choisit une carte cachée et on propose une couleur et une valeur. Le jeu répond si la couleur est la bonne, et si la vraie valeur est plus petite, plus grande ou égale.
- Une carte est trouvée quand on propose sa couleur et sa valeur. La partie est gagnée quand les 4 cartes sont trouvées.

Les règles et les réponses reprennent celles du Kimind d'origine (dépôt organizationMowgAI/Kimind).

## Niveaux

La difficulté dépend du nombre de façons de choisir les valeurs compatibles avec la somme et l'ordre des couleurs (à multiplier par 24 pour les places des couleurs) :

- Facile : 1 à 3
- Moyen : 4 à 8
- Difficile : 9 et plus

## Lancer

Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```sh
python3 -m http.server 8000
```

## Structure

- `index.html` : page du jeu
- `css/style.css` : styles (thème clair/sombre, téléphone)
- `js/kimind.js` : moteur (tirage des parties, solutions possibles, réponses) ; utilisable sous Node
- `js/game.js` : état de la partie et affichage
- `lang/fr.js` : textes en français
- `assets/cards/` : images des 40 cartes de Kiboo (WebP)
- `tests/kimind.test.js` : tests du moteur (`node tests/kimind.test.js`)
