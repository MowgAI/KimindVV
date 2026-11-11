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

## Langues

Kimind existe en français et en anglais. Le menu 🌐 en haut de la page change la langue ; le choix est gardé dans le navigateur. À la première visite, Kimind prend la langue du navigateur (français si elle n'est pas disponible). Pour ajouter une langue : copier `lang/en.js`, traduire les textes et ajouter le fichier dans `index.html`.

## Versions

Le jeu s'ouvre sur un menu, avec une carte par choix : « Règles du jeu » (but, cartes, énoncé, déroulement d'un tour, réponse, fin), « La parade », puis les versions de Kimind. La parade fait défiler les 40 personnages des cartes, repris de Kiboo : chacun arrive en sautillant, fait son bruit et dit son nom avec une petite phrase drôle, lue à voix haute (voix de femme pour les personnages féminins de la famille des métiers, voix d'homme pour tous les autres) si l'appareil a une voix dans la langue choisie, avec la musique de sa famille. Les versions sont décrites dans `js/versions.js` ; l'adresse garde la version choisie (par exemple `#initiale`).

- **Kimind (version initiale)** : les règles ci-dessus.
- **KiMinus** (`#kiminus`, variante 1) : les valeurs s'ajoutent ou se retranchent. La carte 0 compte en +, chacune des autres en + ou en −, par exemple `carte 0 + carte 1 − carte 2 + carte 3 = 25` ; le résultat va de −29 à 40. Les signes changent à chaque partie et s'affichent entre les cartes cachées. Le reste des règles ne change pas.
- **KimMinmaxus** (`#kimminmaxus`, variante 2) : comme KiMinus, mais les signes sont cachés (seul le résultat est donné). À chaque tour, le joueur propose aussi un signe entre ses cartes ; le jeu dit si chaque signe est juste, et un signe juste reste en place. La partie est gagnée quand les 4 cartes et les 3 signes sont trouvés.
- **Kimind 5** (`#kimind5`) : 5 cartes cachées (positions 0 à 4). Une couleur a deux cartes, de valeurs différentes, et l'énoncé dit laquelle ; les trois autres couleurs ont une carte chacune. L'ordre porte sur les 5 cartes (la couleur en double y apparaît deux fois, par exemple `vert < bleu < rouge = jaune < bleu`). Une proposition doit avoir 2 cartes de la couleur en double et 1 de chaque autre, sans deux fois la même carte.

## Les autres jeux de cartes

D'autres jeux, inspirés des modules de KartOOn (NukkAI), avec les cartes de Kiboo et les personnages de KartOOn (images du dépôt Kimind, dans `assets/characters/`). Ils sont décrits dans `js/versions.js` (`GAMES`) et ont chacun leur fichier et leur écran.

- **Kimba** (`#kimba`, `js/kimba.js`, inspiré de « Compte avec Archi ») : des cartes mélangées s'affichent ; pour chaque couleur présente, on dit combien il y a de cartes de cette couleur. 10 niveaux, de 3 cartes en 2 couleurs à 14 cartes en 4 couleurs. Une bonne réponse du premier coup fait monter d'un niveau ; deux erreurs dans le même tour font redescendre d'un niveau, et le jeu montre la bonne réponse.

## Niveaux

La difficulté dépend du nombre de façons de choisir les valeurs compatibles avec la somme et l'ordre des couleurs (à multiplier par 24 pour les places des couleurs) :

- Facile : 1 à 3
- Moyen : 4 à 8
- Difficile : 9 et plus

Dans KiMinus, la somme dépend aussi de la place des couleurs : on compte les solutions complètes (couleurs et valeurs à chaque position), avec les mêmes proportions de parties par niveau que la version initiale :

- Facile : 1 à 90
- Moyen : 91 à 200
- Difficile : 201 et plus

Dans KimMinmaxus, on compte aussi les signes possibles (solutions complètes : cartes et signes) :

- Facile : 1 à 340
- Moyen : 341 à 850
- Difficile : 851 et plus

Dans Kimind 5, on compte les solutions complètes (couleurs et valeurs aux 5 positions), avec les mêmes proportions de parties par niveau :

- Facile : 1 à 600
- Moyen : 601 à 1 320
- Difficile : 1 321 et plus

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
- `lang/fr.js`, `lang/en.js` : tous les textes en français et en anglais (mêmes clés ; noms et descriptions des versions, présentation du jeu)
- `js/parade.js` : la parade des 40 personnages (voix du navigateur)
- `js/sound.js` : musiques et bruits des personnages, repris tel quel de Kiboo
- `lang/personnages.js` : ce que dit chaque personnage dans la parade (noms de Kiboo) et son genre, pour la voix
- `assets/cards/` : images des 40 cartes de Kiboo (WebP)
- `tests/kimind.test.js` : tests du moteur (`node tests/kimind.test.js`)
