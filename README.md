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

D'autres jeux, inspirés des modules de KartOOn (NukkAI), avec les cartes de Kiboo et les personnages de KartOOn (images du dépôt Kimind, dans `assets/characters/`). Ils sont décrits dans `js/versions.js` (`GAMES`) et ont chacun leur écran.

- **Kimba** (`#kimba`, inspiré de « Compte avec Archi ») : des cartes mélangées s'affichent ; pour chaque couleur présente, on dit combien il y a de cartes de cette couleur. 10 niveaux, de 3 cartes en 2 couleurs à 14 cartes en 4 couleurs ; aux niveaux 7 à 10, les cartes sont posées en désordre.
- **Kiplus** (`#kiplus`, inspiré de « Ajoute avec Lili ») : on additionne les cartes de chaque couleur et on tape le résultat (pavé de chiffres). 10 niveaux, de 2 petites cartes d'une couleur à 4 couleurs de 4 cartes ; les cartes sont rangées par couleur, puis mélangées, puis posées en désordre aux niveaux 8 à 10.

- **KiJun** (`#kijun`, `js/kijun.js`, inspiré de « Range avec Mary ») : en trois étapes, ranger les cartes de chaque couleur dans l'ordre demandé (clic sur les cartes dans l'ordre), additionner chaque couleur, puis ranger les couleurs d'après leurs sommes. 10 niveaux, de 1 couleur de 3 cartes à 4 couleurs de 4 cartes ; le sens (croissant ou décroissant) peut changer entre les étapes aux derniers niveaux. Une partie sans erreur fait monter d'un niveau ; deux erreurs à une étape montrent la solution de l'étape, et le niveau redescend à la fin. Aide : la prochaine carte à poser, la somme d'une couleur ou la prochaine couleur.
- **Kipharaon** (`#kipharaon`, `js/kipharaon.js`, inspiré de « La pyramide de Fonzy ») : des cartes en pyramide et un nombre cible ; on clique sur des cartes libres (sans carte en dessous) pour atteindre la cible, et elles disparaissent ; on dépasse, c'est une erreur. But : vider la pyramide. La pyramide est construite à l'envers, donc elle a toujours une solution ; si l'enfant se bloque, le jeu le dit et il peut piocher une carte bonus (aide). 10 niveaux, de 3 rangées (cible 5 ou 6) à 6 rangées (21 cartes, cible 10).
- **KiDory** (`#kidory`, `js/kidory.js`, inspiré de « Retiens avec Johnny ») : un mémory ; les cartes sont montrées quelques secondes, puis retournées ; on retourne deux cartes, et elles restent visibles si elles ont la même valeur. 10 niveaux, de 2 paires montrées 5 s à 10 paires. Aide : toutes les cartes remontrées 1,5 s.
- **Kibal** (`#kibal`, `js/kibal.js`, inspiré de « La balance de Nath ») : deux zones de cartes posées en désordre ; cliquer le plus vite possible sur celle qui a le plus de cartes. 8 questions par partie ; 10 niveaux (plus de cartes, écarts plus petits, temps limité de 6 à 4 s, et aux niveaux 6 à 10 un piège : la zone qui a moins de cartes a les plus grosses valeurs).
- **KiPotter** (`#kipotter`, `js/kipotter.js`, inspiré de « La baguette de Galadriel ») : une règle graduée avec un repère ◆ ; trouver le nombre qui correspond, parmi 3 ou 4 réponses (des cartes jusqu'à 10). 6 questions par partie ; 10 niveaux : règle de 0 à 10, puis 0 à 20, puis 0 à 100, avec de moins en moins de nombres écrits et des réponses de plus en plus proches. Aide : une mauvaise réponse est retirée.
- **Kicompuzzle** (`#kicompuzzle`, `js/kicompuzzle.js`, inspiré du « Bouche-trou de Ray ») : un calcul à trous (« ▢ + ▢ = 10 ») ; poser des cartes de sa main dans les trous et choisir les opérations (+, −, ×) pour arriver au total ; × se calcule avant + et −, toute combinaison juste est acceptée. 10 niveaux, de 2 cartes avec « + » à 4 cartes avec les trois opérations. Après une erreur, le jeu dit combien fait le calcul ; aide : une carte de la solution est posée.
- **Kipuzzle** (`#kipuzzle`, `js/kipuzzle.js`, inspiré des « Dalles de Béa »), contre Béa : une grille avec une carte au centre ; une carte se pose à côté d'une carte posée en respectant toutes ses voisines (à droite +1, à gauche −1, en haut +2, en bas −2, la couleur ne compte pas). À son tour, on pose autant de cartes qu'on peut, puis « Fin de mon tour » ; si on ne peut rien poser, on pioche. But : poser toutes ses cartes avant Béa. 10 niveaux (plus de cartes en main, Béa pose de plus en plus de cartes par tour). Aide : un coup possible est montré ; on note aussi quand l'enfant finit son tour alors qu'un coup restait.
- **Kiduel** (`#kiduel`, `js/kiduel.js`, inspiré de « La bataille de Yavin » ; le personnage s'appelle Poupetta), contre Poupetta : des plis à deux ; il faut fournir la couleur demandée si on en a, la plus forte carte de la couleur demandée gagne le pli, son gagnant commence le suivant. L'objectif est calculé par un solveur (les plis que l'on peut gagner même contre une Poupetta parfaite), donc toujours atteignable. 10 niveaux, de 3 à 8 cartes chacun ; Poupetta joue au hasard, puis malin, puis parfaitement. Aide : le solveur montre la meilleure carte.

Pour Kimba et Kiplus (`js/colourgame.js`), une bonne réponse du premier coup fait monter d'un niveau ; deux erreurs dans le même tour font redescendre d'un niveau, et le jeu montre la bonne réponse.

## Personnalisation et statistiques

Pour la personnalisation (théorie du domaine de Kiboom), l'application enregistre ce que fait l'enfant, **dans le navigateur seulement** (`js/store.js`, rien ne part sur Internet) :

- **le joueur** : un prénom ou un pseudo, demandé au premier jeu (bouton 👤 en haut pour changer de joueur) ;
- **les humeurs** : pendant les jeux, l'enfant peut cliquer sur 😌 calme, 😴 fatigué, 🧐 concentré, 😀 content ou 😞 pas content ;
- **les exercices de Kimba et Kiplus** : cartes, bonne réponse, 4 réponses possibles par couleur, essais (réponses, temps, autonomie), aides demandées, abandon, feedback reçu, disposition des cartes ;
- **l'aide** (bouton 💡 dans Kimba et Kiplus), de trois sortes à choisir pour les comparer : 4 réponses au choix pour la couleur choisie, « plus ou moins » (▲ ou ▼ sur les réponses fausses), ou une partie de la réponse (la bonne réponse d'une couleur) ;
- **les parties de Kimind** : version, niveau, nombre de tours, gagnée ou abandonnée, durée.

La carte **Statistiques** du menu (`js/stats.js`) montre, par joueur, les résultats de tous les jeux (réussite, sans aide, aides, abandons, temps moyen, niveau atteint), l'effet de chaque sorte d'aide et les humeurs. Elle exporte les données en **faits Prolog au format de la BK** (`student/1`, `instance_student/2`, `list_of_cards/2`, `correct_answer/3`, `possible_answers/3`, `students_answer/4`, `autonomous_during_try/3`, `response_time/3`, `ragequit_during_try/2`, `click_on_button_help/1`, `type_of_feedback_received/2`, `emotional_state/3`, `physical_state/3`, `cognitive_state/3`…), avec en plus `game/2`, `level/2`, `chaos_measure/2` (0 rangé, 20 mélangé, 60 + angle moyen en désordre), `layout/2`, `help_used/4`, `instance_success/2` (résultat tel que le jeu le juge), `kijun_try/4`, `kijun_direction/3`, `kijun_colour_order/2`, `pyramid_target/2`, `pyramid_rows/2`, `pyramid_addition/5`, `memory_pairs/2`, `memory_show_time/2`, `memory_flip/4`, `balance_question/6`, `balance_time_limit/2`, `balance_trap/1`, `number_line_question/6`, `calc_target/2`, `calc_operations/2`, `calc_solution/2`, `calc_attempt/5`, `tile_turn/5`, `tile_hand_size/2`, `tile_opponent_per_turn/2`, `tile_cards_left/3`, `duel_trick/6`, `duel_objective/2`, `duel_opponent/2`, `duel_opponent_cards/2`, `duel_tricks_won/2` et `kimind_game/6` ; et en JSON. Le fichier exporté se charge avec `bkKiboomGenerale.pl` dans SWI-Prolog.

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
