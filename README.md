# Kimind

Devine les couleurs et les valeurs de 4 cartes cachées, avec les cartes de [Kiboo](https://github.com/MowgAI/Kiboo).

## Règles

- Quatre cartes sont cachées, aux positions 0, 1, 2 et 3.
- Chaque valeur est entre 1 et 10, chaque couleur est bleu, vert, rouge ou jaune.
- Les cartes ont des couleurs différentes : une carte de chaque couleur.
- On connaît la somme S des valeurs et l'ordre des couleurs, par exemple `jaune = rouge < vert < bleu`.
- À chaque tour, on propose une carte pour chaque position encore cachée, avec 4 couleurs différentes.
- Pour chaque position, le jeu répond : la carte se retourne si elle est juste ; sinon le cadre est de la couleur proposée si elle est bonne, gris sinon, avec « Plus », « Moins » ou « Égal » pour la valeur.
- Les cartes trouvées restent en place ; les autres sont à proposer de nouveau (la proposition repart de zéro à chaque tour). L'historique, à droite de l'écran, montre chaque proposition et la réponse du jeu.
- La partie est gagnée quand les 4 cartes sont trouvées ; le score est le nombre de tours.

Les règles et les réponses reprennent celles du Kimind d'origine (dépôt organizationMowgAI/Kimind).

## Versions

Le jeu s'ouvre sur un menu qui propose les versions de Kimind. Les versions sont décrites dans `js/versions.js` ; l'adresse garde la version choisie (par exemple `#initiale`).

- **Kimind (version initiale)** : les règles ci-dessus.
- **Kimind ±** (`#plus-moins`) : les valeurs ne s'ajoutent plus toutes. La carte 0 compte en +, chacune des autres en + ou en − (au moins un −), par exemple `carte 0 + carte 1 − carte 2 + carte 3 = 25` ; le résultat va de −29 à 40. Les signes s'affichent entre les cartes cachées. Le reste des règles ne change pas.

## Niveaux

La difficulté dépend du nombre de façons de choisir les valeurs compatibles avec la somme et l'ordre des couleurs (à multiplier par 24 pour les places des couleurs) :

- Facile : 1 à 3
- Moyen : 4 à 8
- Difficile : 9 et plus

Dans Kimind ±, la somme dépend aussi de la place des couleurs : on compte les solutions complètes (couleurs et valeurs à chaque position), avec les mêmes proportions de parties par niveau que la version initiale :

- Facile : 1 à 90
- Moyen : 91 à 200
- Difficile : 201 et plus

## Lancer

Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```sh
python3 -m http.server 8000
```

## Structure

- `index.html` : page du jeu
- `css/style.css` : styles (thème clair/sombre, téléphone)
- `js/versions.js` : versions proposées dans le menu
- `js/kimind.js` : moteur (tirage des parties, solutions possibles, réponses aux tours) ; utilisable sous Node
- `js/game.js` : menu, état de la partie et affichage
- `lang/fr.js` : textes en français
- `assets/cards/` : images des 40 cartes de Kiboo (WebP)
- `tests/kimind.test.js` : tests du moteur (`node tests/kimind.test.js`)
