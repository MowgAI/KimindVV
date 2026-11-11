# KibooM (dépôt KimindVV)

**KibooM** (orthographe de l'auteur) est l'appli « pour apprendre les maths en s'amusant, qui s'adapte à l'utilisateur » ; page de lancement `js/home.js` (style présentation NukkAI, rubriques Play Kiboo, Kimind, Les KiJeux, Amusement, Personnalisation) ; **Kimind** est l'un d'eux. Jeu web (HTML/CSS/JS sans framework), avec les cartes de Kiboo (MowgAI/Kiboo). Kimind : deviner les couleurs et les valeurs de 4 cartes cachées. Le Kimind d'origine (Prolog, raisonneur symbolique explicable) est dans organizationMowgAI/Kimind. Voir README.md pour les règles et les versions.

- Toujours répondre en français. Avancer pas à pas : l'auteur veut valider avant les changements importants.
- Versions dans le menu : `js/versions.js` ; moteur : `js/kimind.js` ; affichage : `js/game.js` ; textes : `lang/fr.js`.
- Tests du moteur : `node tests/kimind.test.js`.
- À chaque changement de JS ou de CSS : augmenter le numéro `?v=` dans `index.html` (sinon le navigateur garde les anciens fichiers en cache).

## Les autres jeux de cartes (inspirés des modules de KartOOn)

Tous les jeux de la liste sont faits ; les règles détaillées (niveaux, progression, aides) ont été choisies par Claude et restent à valider par l'auteur. Noms choisis par l'auteur :

1. Compte avec Archi → **Kimba** (fait)
2. Ajoute avec Lili → **Kiplus** (fait)
3. Range avec Mary → **KiJun** (fait, `js/kijun.js`)
4. La pyramide de Fonzy → **Kipharaon** (fait, `js/kipharaon.js`)
5. Retiens avec Johnny (mémory) → **KiDory** (fait, `js/kidory.js`)
6. La balance de Nath → **Kibal** (fait, `js/kibal.js`)
7. La baguette de Galadriel (règle graduée) → **KiPotter** (fait, `js/kipotter.js`)
8. Le bouche-trou de Ray (calcul à compléter) → **Kicompuzzle** (fait, `js/kicompuzzle.js`)
9. Les dalles de Béa → **Kipuzzle** (fait, `js/kipuzzle.js`)
10. Joue avec Flo → pas fait (c'est déjà Kiboo)
11. La bataille (le personnage s'appelle Poupetta, plus Yavin) → **Kiduel** (fait, `js/kiduel.js`)

Images des personnages : dépôt organizationMowgAI/Kimind (`img/characters`, `img/bubbles`), converties dans `assets/characters/`. Jeux « une réponse par couleur » : `js/colourgame.js`.

## Personnalisation

La théorie du domaine de l'auteur (bkKiboomGenerale.pl, Prolog) décrit élèves, états, exercices (instances), cartes, personnages et comportements, pour l'ILP. Les données de l'application sont gardées dans le navigateur (`js/store.js`) et exportées en faits au format de cette BK (`js/stats.js`, page Statistiques). Travailler d'abord sur Kimba.

## Parade : modes Gentil, Bébé, Drôle, Méchant

`lang/parade-modes.js` : noms et phrases tirés au hasard, par mode (méchant « pour rire », adapté aux enfants, voix plus grave ; bébé voix aiguë). Les 40 personnages sont écrits en français et en anglais (jeux de mots adaptés). La musique suit le mode et change de tonalité à chaque personnage (js/sound.js, MODE_MUSIC). Mêmes textes dans Kiboo (MowgAI/kiboo, lang/parade-modes.js, sans le mode gentil) : les changer dans les deux dépôts. Pour modifier Kiboo, toujours repartir de la dernière version de sa branche main (une nouvelle branche par changement), jamais d'une ancienne branche. Dans Kiboo, un nom donné par le joueur à sa carte remplace le nom tiré au hasard, dans tous les modes. En anglais, voix de femme pour les filles (genderEn) et voix au hasard pour les robots.

## Récompenses partagées avec Kiboo (règle donnée par Kiboo, à appliquer quand l'auteur dira quand donner une récompense)

Même site (mowgai.github.io), donc même localStorage que Kiboo :
- Clé `kiboo.rewards.v1` : JSON `{ "progress": 0..3, "collection": [ids] }`. id d'une carte = couleur × 10 + (valeur − 1), couleurs 0 bleu, 1 vert, 2 rouge, 3 jaune (3 bleu = 2, 10 jaune = 39). `progress` appartient à Kiboo (bonnes réponses vers le prochain cadeau, 3 = cadeau prêt) : ne jamais y toucher depuis KibooM. Pour donner une carte : relire la clé, AJOUTER l'id à `collection` s'il n'y est pas (ne jamais écraser ni retirer), puis réécrire la clé.
- Clé `kiboo.names.v1` : JSON `{ "blue-3": "Minou", ... }` (couleur en anglais + "-" + valeur), noms donnés par le joueur, 20 caractères max. Ne jamais changer automatiquement un nom choisi par le joueur ; sans nom, utiliser le nom d'origine de la langue. La parade devra utiliser ces noms.
- Lire ces clés dans un try/catch (stockage parfois indisponible).
- Comptes (plus tard) : réutiliser le projet Supabase de Kiboo (même compte pour les deux jeux) ; ne pas modifier ses tables sans en parler.

## À rappeler à l'auteur au début de la prochaine session

- Ajouter des indices, par exemple pour la version la plus difficile (KimMinmaxus, niveau Difficile).
- Chercher d'autres variantes de Kimind.
- Récompenses, comme dans Kiboo : par exemple, Play Kiboo bloqué au départ, et des parties de Kiboo débloquées par des succès dans les exercices. À faire seulement quand l'auteur le demande.
- Pour la personnalisation, une récompense : quand l'enfant a gagné une carte, il peut lui donner un nom. Ce nom reste en local, pour ce joueur seulement, et la parade et la présentation des personnages l'utilisent. À faire avec la personnalisation et les récompenses.
