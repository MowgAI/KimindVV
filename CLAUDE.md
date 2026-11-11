# Kimind (KimindVV)

Jeu web (HTML/CSS/JS sans framework) : deviner les couleurs et les valeurs de 4 cartes cachées, avec les cartes de Kiboo (MowgAI/Kiboo). Le Kimind d'origine (Prolog, raisonneur symbolique explicable) est dans organizationMowgAI/Kimind. Voir README.md pour les règles et les versions.

- Toujours répondre en français. Avancer pas à pas : l'auteur veut valider avant les changements importants.
- Versions dans le menu : `js/versions.js` ; moteur : `js/kimind.js` ; affichage : `js/game.js` ; textes : `lang/fr.js`.
- Tests du moteur : `node tests/kimind.test.js`.

## Les autres jeux de cartes (inspirés des modules de KartOOn)

Un jeu à la fois, en attendant l'avis de l'auteur. Noms choisis par l'auteur :

1. Compte avec Archi → **Kimba** (fait)
2. Ajoute avec Lili → **Kiplus** (fait)
3. Range avec Mary → **KiJun** (fait, `js/kijun.js`)
4. La pyramide de Fonzy → **Kipharaon** (fait, `js/kipharaon.js`)
5. Retiens avec Johnny (mémory) → **KiDory**
6. La balance de Nath → **Kibal**
7. La baguette de Galadriel (règle graduée) → **KiPotter**
8. Le bouche-trou de Ray (calcul à compléter) → **Kicompuzzle**
9. Les dalles de Béa → **Kipuzzle**
10. Joue avec Flo → pas fait (c'est déjà Kiboo)
11. La bataille (le personnage s'appelle Poupetta, plus Yavin) → **Kiduel**

Images des personnages : dépôt organizationMowgAI/Kimind (`img/characters`, `img/bubbles`), converties dans `assets/characters/`. Jeux « une réponse par couleur » : `js/colourgame.js`.

## Personnalisation

La théorie du domaine de l'auteur (bkKiboomGenerale.pl, Prolog) décrit élèves, états, exercices (instances), cartes, personnages et comportements, pour l'ILP. Les données de l'application sont gardées dans le navigateur (`js/store.js`) et exportées en faits au format de cette BK (`js/stats.js`, page Statistiques). Travailler d'abord sur Kimba.

## À rappeler à l'auteur au début de la prochaine session

- Ajouter des indices, par exemple pour la version la plus difficile (KimMinmaxus, niveau Difficile).
- Chercher d'autres variantes de Kimind.
