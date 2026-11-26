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

## Ego KibooM (BK individuelle)

Rubrique Personnalisation et menu (#ego) : `js/ego.js`, contenu séparé dans `lang/ego.js` (pour d'autres publics plus tard : plus grands, adultes, personnes âgées, enfants autistes). D'après « BK Sciences Co » et les slides « Learner types ». Pour l'enfant seulement (pas d'écran parents pour l'instant). Liée au joueur (pseudo unique : un pseudo au même identifiant reprend le joueur existant) : chaque enregistrement de data.ego porte le joueur, ainsi que les réponses en cours et l'avatar ; un nouveau joueur a donc une BK vide et arrive directement sur Ego KibooM (« Bienvenue ! ») ; changer de joueur redessine Ego (événement kiboom-player). Trois chapitres dans l'ordre (chacun se débloque après le précédent), chaque question avec « Je préfère ne pas répondre » (skip), pause et reprise :
1. Qui je suis : âge, mois d'anniversaire (date de naissance estimée), classe, genre (dont « je préfère ne pas dire »), langues. Ne pas demander religion, groupe ethnique, situation des parents.
2. Ma personnalité : 18 phrases, échelle à 4 smileys ; 13 traits (5 grands traits, traits liés au jeu, traits fins) ; résultat « Ta constellation » (étoiles aux noms positifs), avec « Ton portrait » : super-pouvoir (étoile la plus brillante), jusqu'à 3 forces et 2 petits défis, choisis par des règles de regroupement qui croisent personnalité et style de joueur (EGO.portrait, EGO.superpowers ; Ego.portraitOf). Règles écrites à l'avance (pas d'IA en ligne dans l'appli), formulations positives, taquines, sans adjectif genré.
3. Mon style de joueur (plusieurs réponses possibles par question, qui se partagent le poids d'une réponse) : 4 types (Achiever, Explorer, Architect, Spectateur ; garder ces noms, ne pas dire « champion »), chacun un mélange de caractéristiques (EGO.types[…].profile) ; puis le personnage auquel l'enfant s'identifie, qui devient son avatar (Store.avatar, par joueur, affiché dans l'en-tête ; bouton « Changer d'avatar » sur l'accueil d'Ego, à tout moment) ; anneau des pourcentages ; « Ça te ressemble ? » ; défis un par un, seulement sur ce qui peut changer, formulations positives et taquines (EGO.challenges, à affiner).
Export : ego_profile/4, ego_answer/3, student_age/2, birth_month/2, birth_date_estimate/2, school_class/2, gender/2, home_language/2, personality_answer/3, personality_trait/3, ego_identifies_with/3, ego_trait/3, learner_type/3, ego_self_assessment/2, ego_goal/3, avatar/3, ego_superpower/2, ego_portrait/3. Ensuite : adapter le choix des exercices aux défis acceptés ; petits jeux d'observation (règles (1)–(12) du document) ; mise à jour avec les traces des jeux.

## Le conseil de KibooM (recommandations personnalisées)

`js/coach.js`, textes dans `lang/ego.js` (EGO.coach) et T.coach. Le chapitre 2 d'Ego se termine par « Ce que j'aime » (EGO.likes : passe-temps, goût pour l'écran, ressenti après l'écran, musique, pause préférée, dehors avec qui ; enregistré dans r.likes). Pendant le jeu, l'avatar propose une pause : après un temps de jeu continu (15 min jusqu'à 6 ans, 20 jusqu'à 8, 25 au-delà, 5 de moins si l'écran fatigue, énerve ou donne envie de bouger ; minimum 10), après 4 essais ratés d'affilée ou un abandon, à l'humeur fatigué ou pas content, le soir (20 h–6 h). Conseil tiré des goûts (musique, dehors avec des amis, dessiner son personnage, bouger…). Réponses : « D'accord, je fais une pause » (minuteur 5 min facultatif) ou « Encore un peu ! » (2 fois au plus) ; pas deux conseils à moins de 8 min. « Pour toi » (accueil et menu) : exercice recommandé d'après les défis acceptés (un différent chaque jour), sinon le type de joueur. Export : ego_like/3, coach_advice/6, coach_break_seconds/3. Prochaine étape : le décalage entre les réponses aux questionnaires et le comportement dans l'appli.

## L'enquête de KibooM (analyse des traces de Kimba)

`js/enquete.js`, textes dans `lang/ego.js` (EGO.enquete) et T.enquete ; écran #enquete. D'après la présentation « Kimba, séminaire chez NukkAI » (traces → règles → explications avec la BK individuelle → recommandation ; le simulateur de traces ne sert plus). Déclenchée à partir de 15 exercices de Kimba avec au moins un essai (dont 4 ratés et 4 réussis) : invitation dans l'écran de Kimba (nouvelle enquête tous les 5 exercices de plus), carte dans le menu Personnalisation. Apprenant léger dans le navigateur (choix de l'auteur : pas d'IakkuN/NukLear dans l'appli) : littéraux découpés comme dans bkKiboomGenerale.pl (quantity_of_cards, level_type, chaos_type, number_of_colours, contains_family, contains_families, six_nine_presented, four_legged_presented, crowded_colour, mood_before, late_in_session, after_failure, evening), exemples has_failed/2, clauses d'un à trois littéraux, précision lissée de Laplace ≥ max(0,6 ; taux d'erreur + 0,1), couverture séquentielle (4 règles au plus). Explication choisie d'après Ego (peurs : question « fears » à la fin du chapitre 2, type de joueur, émotivité, neuroticisme). Vue chercheur et bouton « Exporter pour l'ILP (Kimba) » (kimba-ilp.pl : pos/neg et littéraux) dans les Statistiques. Kimba enregistre aussi l'écart (gap) et les couleurs ratées (wrong) de chaque essai. À faire ensuite : la recommandation (exercices ciblés générés, puis défi) et la récompense (carte débloquée dans la collection partagée avec Kiboo).

## Parcours adaptatif (en préparation, ne pas coder avant validation de l'auteure)

Ne pas proposer les jeux et niveaux dans l'ordre : challenger, brûler des étapes, passer à des jeux plus exigeants. Mais on ne peut pas classer les jeux sur une seule échelle : ils ne travaillent pas les mêmes compétences (KiDory facile pour les petits, difficile pour les adultes ; l'inverse pour le calcul). D'abord donner une sémantique aux exercices : `docs/semantique-exercices.md` (premier jet à corriger par l'auteure) : 5 compétences (mémoire, calcul, logique, stratégie, rapidité) 3 conditions (chrono, beaucoup à regarder, adversaire) et le ton (rigolo ↔ sérieux, indépendant de la difficulté ; les jeux rigolos révèlent des talents cachés chez les enfants atypiques), valeurs simples, source de chaque valeur ; souple pour que des spécialistes l'affinent, sans snobisme. Kiboo : récompense et voie à part entière pour les « non scolaires ». Ensuite : profil de compétences de l'enfant en miroir, tolérance aux conditions (attention aux enfants autistes, dans les deux sens), parcours « Continuer mon aventure ».

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
