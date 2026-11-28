"use strict";
/* Les répliques de KibooM : ce que l'avatar dit pendant les jeux, en plus du message du jeu
   (le message du jeu garde l'information : « Tu passes au niveau 4 », « Le repère est sur 7 »).
   PREMIER JET de Claude, à corriger et compléter par l'auteure : on peut ajouter des phrases dans
   n'importe quelle liste sans toucher au code (js/repliques.js choisit).
   Chaque phrase : [français, anglais]. Pas d'adjectif genré.

   Moments : success (réussi), fast (réussi vite), effort (réussi après beaucoup d'essais),
   streak (trois réussites de suite), fail (raté), ragequit (abandon), levelUp, levelDown,
   help (aide demandée), record (meilleur temps), start (arrivée dans un jeu).
   - general : pour tout le monde, parfois selon l'âge (young : jusqu'à 7 ans, mid : 8 à 10, old : 11 et plus ;
     all : tous les âges) ;
   - hobbies : selon les passe-temps d'Ego (« Ce que j'aime ») ;
   - types : selon le type de joueur d'Ego ;
   - sensitive : pour un enfant sensible (émotivité ou inquiétude élevées) : plus doux ;
   - evening : le soir (à partir de 19 h).
   Les phrases écrites par l'enfant lui-même (Ego, « Mes répliques ») s'ajoutent aux nôtres, pour lui seulement. */
window.REPLIQUES = {
  general: {
    success: {
      young: [["Bravo ! 🎉", "Well done! 🎉"], ["Youpi, c'est gagné !", "Hooray, you did it!"], ["Trop bien ! ⭐", "Super! ⭐"]],
      mid: [["Et hop, dans la poche !", "And there it is, in the bag!"], ["Joli coup !", "Nice move!"], ["Ça, c'est fait ! ✔️", "Done and dusted! ✔️"]],
      old: [["Propre. Très propre.", "Clean. Very clean."], ["Facile… enfin, pour toi 😏", "Easy… well, for you 😏"], ["Mission accomplie, agent KibooM.", "Mission accomplished, agent KibooM."]],
    },
    fast: { all: [["Rapide comme l'éclair ⚡", "Quick as lightning ⚡"], ["Wouah, déjà fini ?!", "Whoa, done already?!"], ["Même pas eu le temps de cligner des yeux !", "I didn't even have time to blink!"]] },
    effort: { all: [["Tu n'as rien lâché, et ça paye ! 💪", "You never gave up, and it paid off! 💪"], ["Ça résistait, mais tu as gagné !", "It put up a fight, but you won!"], ["Ça, c'est de la persévérance !", "Now that's what I call sticking at it!"]] },
    streak: { all: [["Trois de suite, tu es en feu ! 🔥", "Three in a row, you're on fire! 🔥"], ["Encore une ! Qui va t'arrêter ?", "Another one! Who's going to stop you?"], ["Série en cours… ne t'arrête pas !", "Streak in progress… don't stop now!"]] },
    fail: {
      young: [["Oups ! On réessaie ?", "Oops! Shall we try again?"], ["Presque ! 🤏", "Almost! 🤏"], ["Pas grave, on recommence !", "Never mind, let's go again!"]],
      mid: [["Raté… pour le moment !", "Missed… for now!"], ["Ah, ces cartes sont coquines !", "Ah, these cards are cheeky!"], ["Le cerveau chauffe, c'est bon signe 🧠", "Your brain is warming up, that's a good sign 🧠"]],
      old: [["Bien tenté. Les cartes ont gagné cette manche.", "Nice try. The cards won this round."], ["Erreur, ou génie incompris ? 🤔", "A mistake, or misunderstood genius? 🤔"], ["Même les grands génies se trompent… souvent.", "Even great geniuses get it wrong… often."]],
    },
    ragequit: { all: [["On fera mieux une autre fois 🙂", "We'll do better another time 🙂"], ["Pas de souci, on passe à autre chose.", "No problem, let's move on."], ["Celui-là, on le garde pour plus tard !", "We'll save that one for later!"]] },
    levelUp: {
      young: [["Niveau suivant ! 🚀", "Next level! 🚀"], ["Tu grandis à toute vitesse !", "You're growing so fast!"], ["Hop, une marche de plus !", "Hop, one more step up!"]],
      mid: [["Niveau supérieur débloqué ! 🔓", "Next level unlocked! 🔓"], ["Ça monte, ça monte !", "Up and up you go!"], ["Tu grimpes comme un écureuil 🐿️", "You're climbing like a squirrel 🐿️"]],
      old: [["Le niveau du dessus t'attendait.", "The next level was waiting for you."], ["On monte d'un cran. Tranquille.", "Up a notch. No big deal."], ["Level up, comme on dit.", "Level up, as they say."]],
    },
    levelDown: { all: [["On souffle un peu, c'est malin.", "Taking a breather, that's smart."], ["Un pas en arrière pour mieux sauter !", "One step back to jump further!"], ["Petit détour, et on repart.", "A little detour, and off we go again."]] },
    help: { all: [["Demander de l'aide, c'est malin 💡", "Asking for help is smart 💡"], ["Un coup de pouce, et c'est reparti !", "A little boost, and off we go!"], ["Les meilleurs détectives ont des indices aussi 🔍", "The best detectives use clues too 🔍"]] },
    record: { all: [["Nouveau record ! 🏆", "New record! 🏆"], ["Tu as battu… toi-même ! 🥇", "You beat… yourself! 🥇"], ["Record pulvérisé !", "Record smashed!"]] },
    start: {
      young: [["Coucou ! On joue ? 👋", "Hello! Shall we play? 👋"], ["On y va ? 🎈", "Off we go? 🎈"], ["Les cartes ont hâte de jouer avec toi !", "The cards can't wait to play with you!"]],
      mid: [["Allez, on s'échauffe les neurones !", "Come on, let's warm up those brain cells!"], ["C'est parti pour une partie !", "Here we go, game on!"], ["Les cartes t'attendaient !", "The cards were waiting for you!"]],
      old: [["Re-bonjour. Cerveau en marche ?", "Hello again. Brain switched on?"], ["Les cartes sont mélangées, à toi de jouer.", "The cards are shuffled, your move."], ["On commence quand tu veux.", "We start whenever you like."]],
    },
  },

  hobbies: {
    sport: {
      success: [["Buuut ! ⚽", "Goooal! ⚽"], ["Le ballon est au fond des filets !", "The ball is in the back of the net!"], ["Belle passe décisive !", "What an assist!"]],
      fast: [["En pleine lucarne ! 🥅", "Top corner! 🥅"], ["Contre-attaque éclair !", "Lightning counter-attack!"]],
      fail: [["Le gardien l'a arrêtée… tu retentes le penalty ?", "The goalkeeper saved it… take the penalty again?"], ["Sur le poteau ! Encore un essai.", "Off the post! One more go."], ["Hors-jeu ! L'arbitre dit : on recommence.", "Offside! The referee says: go again."]],
      levelUp: [["Tu montes en première division ! 🏟️", "You're promoted to the top league! 🏟️"], ["Sélection en équipe nationale !", "Called up to the national team!"]],
      record: [["Ballon d'or du jour ! 🏆", "Golden ball of the day! 🏆"], ["Record du stade battu !", "Stadium record broken!"]],
      streak: [["Coup du chapeau ! 🎩", "Hat-trick! 🎩"], ["Le public chante ton nom !", "The crowd is chanting your name!"]],
    },
    music: {
      success: [["Pas une fausse note ! 🎵", "Not a single wrong note! 🎵"], ["Quelle mélodie !", "What a melody!"], ["Bis ! Bis !", "Encore! Encore!"]],
      fast: [["Un solo à toute allure ! 🎸", "A lightning-fast solo! 🎸"], ["Tempo presto !", "Tempo presto!"]],
      fail: [["Une petite fausse note… on rejoue le morceau ?", "A little wrong note… play the piece again?"], ["Le métronome dit : on recommence 🎼", "The metronome says: from the top 🎼"], ["Même les rock stars répètent !", "Even rock stars rehearse!"]],
      levelUp: [["Tu passes à la partition suivante ! 🎼", "On to the next score! 🎼"], ["Le public en redemande !", "The audience wants more!"]],
      record: [["Disque d'or ! 💿", "Gold record! 💿"], ["Le tube de l'été !", "The hit of the summer!"]],
      streak: [["Tu enchaînes les tubes ! 🎤", "Hit after hit! 🎤"], ["Le concert continue !", "The concert goes on!"]],
    },
    drawing: {
      success: [["Un vrai chef-d'œuvre ! 🎨", "A real masterpiece! 🎨"], ["Coup de pinceau parfait !", "Perfect brushstroke!"], ["Ça mérite d'être encadré !", "That deserves a frame!"]],
      fast: [["Croquis express ! ✏️", "Express sketch! ✏️"], ["Dessiné en un éclair !", "Drawn in a flash!"]],
      fail: [["Un petit coup de gomme et on recommence ✏️", "A quick rub-out and start again ✏️"], ["Les artistes font plein de brouillons !", "Artists make lots of rough drafts!"], ["Ce n'est pas raté, c'est un brouillon.", "It's not wrong, it's a rough draft."]],
      levelUp: [["Nouvelle toile, plus grande ! 🖼️", "A new canvas, a bigger one! 🖼️"], ["Exposition dans la salle suivante du musée !", "Exhibition in the next room of the museum!"]],
      record: [["Ton œuvre entre au musée ! 🏛️", "Your work goes into the museum! 🏛️"], ["Un record digne des grands peintres !", "A record worthy of the great painters!"]],
      streak: [["Une vraie galerie de chefs-d'œuvre !", "A whole gallery of masterpieces!"], ["Tu peins sans t'arrêter ! 🖌️", "You keep on painting! 🖌️"]],
    },
    reading: {
      success: [["Et ils vécurent heureux ! 📚", "And they lived happily ever after! 📚"], ["Chapitre réussi !", "Chapter complete!"], ["Digne d'un héros de roman !", "Worthy of a hero in a novel!"]],
      fast: [["Lu en un clin d'œil ! 📖", "Read in the blink of an eye! 📖"], ["Tu tournes les pages à toute vitesse !", "You're turning the pages at top speed!"]],
      fail: [["Rebondissement ! L'histoire continue…", "Plot twist! The story goes on…"], ["Ce chapitre est un peu tordu, on le relit ?", "This chapter is a bit tricky, shall we read it again?"], ["Même les héros ratent au chapitre 2 !", "Even heroes fail in chapter 2!"]],
      levelUp: [["Chapitre suivant ! 📖", "Next chapter! 📖"], ["Tome 2 débloqué !", "Volume 2 unlocked!"]],
      record: [["Ton histoire entre dans la légende ! 📜", "Your story becomes a legend! 📜"], ["Un record digne d'un conte !", "A record worthy of a fairy tale!"]],
      streak: [["Tu dévores les chapitres !", "You're devouring the chapters!"], ["Quelle saga ! 📚", "What a saga! 📚"]],
    },
    board_games: {
      success: [["Échec et mat ! ♟️", "Checkmate! ♟️"], ["Tu avances de trois cases ! 🎲", "Move forward three squares! 🎲"], ["Bien joué, à toi le tour suivant !", "Well played, your turn again!"]],
      fast: [["Double six ! 🎲", "Double six! 🎲"], ["Coup de maître express !", "Express master move!"]],
      fail: [["Passe ton tour… mais pas longtemps !", "Miss a turn… but not for long!"], ["Retour à la case départ, mais tu connais le chemin !", "Back to start, but you know the way!"], ["Les dés n'étaient pas d'accord cette fois 🎲", "The dice didn't agree this time 🎲"]],
      levelUp: [["Tu passes au plateau suivant !", "On to the next board!"], ["Nouvelle partie, nouveau défi ♟️", "New game, new challenge ♟️"]],
      record: [["Grand maître du jour ! 👑", "Grandmaster of the day! 👑"], ["Record de la partie !", "Game record!"]],
      streak: [["Tu remportes toutes les manches !", "You're winning every round!"], ["Quelle stratégie ! ♟️", "What a strategy! ♟️"]],
    },
    video_games: {
      success: [["Niveau terminé ! 🎮", "Level complete! 🎮"], ["+100 points d'expérience !", "+100 XP!"], ["Succès débloqué ! 🏅", "Achievement unlocked! 🏅"]],
      fast: [["Speedrun ! ⚡", "Speedrun! ⚡"], ["Combo parfait !", "Perfect combo!"]],
      fail: [["Game over… Continue ? 🕹️", "Game over… Continue? 🕹️"], ["Il te reste plein de vies !", "You've still got loads of lives!"], ["Le boss était coriace, on retente ?", "That boss was tough, try again?"]],
      levelUp: [["Level up ! 🆙", "Level up! 🆙"], ["Nouveau monde débloqué !", "New world unlocked!"]],
      record: [["High score ! 🏆", "High score! 🏆"], ["Nouveau meilleur score !", "New best score!"]],
      streak: [["Combo x3 ! 💥", "Combo x3! 💥"], ["Tu es en mode turbo !", "You're in turbo mode!"]],
    },
    nature: {
      success: [["Bravo, même les oiseaux applaudissent ! 🐦", "Well done, even the birds are clapping! 🐦"], ["Joli comme une fleur 🌸", "Pretty as a flower 🌸"], ["Tu as l'œil du lynx !", "You've got the eyes of a lynx!"]],
      fast: [["Rapide comme un guépard ! 🐆", "Fast as a cheetah! 🐆"], ["Plus vif qu'un écureuil !", "Quicker than a squirrel!"]],
      fail: [["Patience, comme la tortue 🐢", "Patience, like the tortoise 🐢"], ["Même le hibou réfléchit deux fois 🦉", "Even the owl thinks twice 🦉"], ["Une petite pluie, puis le soleil revient 🌦️", "A little rain, then the sun comes back 🌦️"]],
      levelUp: [["Tu grimpes à la branche suivante ! 🌳", "You're climbing to the next branch! 🌳"], ["La graine est devenue un arbre !", "The seed has become a tree!"]],
      record: [["Un record digne d'un aigle royal ! 🦅", "A record worthy of a golden eagle! 🦅"], ["La forêt entière t'applaudit !", "The whole forest is clapping for you!"]],
      streak: [["Tu fleuris à chaque essai ! 🌼", "You blossom with every try! 🌼"], ["Une vraie migration de réussites ! 🦢", "A real migration of wins! 🦢"]],
    },
    dance: {
      success: [["Quel pas de danse ! 💃", "What a dance move! 💃"], ["Parfaitement en rythme !", "Perfectly in time!"], ["Une pirouette réussie !", "A perfect pirouette!"]],
      fast: [["Danse express ! 🕺", "Express dance! 🕺"], ["Tu danses plus vite que la musique !", "You dance faster than the music!"]],
      fail: [["Un faux pas, et on reprend la choré !", "A missed step, back to the routine!"], ["On recommence depuis le début de la musique 🎶", "From the start of the music again 🎶"], ["Même les grands danseurs trébuchent !", "Even great dancers trip up!"]],
      levelUp: [["Nouvelle chorégraphie débloquée ! 💃", "New routine unlocked! 💃"], ["Tu montes sur la grande scène !", "You're going up on the big stage!"]],
      record: [["Standing ovation ! 👏", "Standing ovation! 👏"], ["Record sur la piste de danse !", "Dance-floor record!"]],
      streak: [["Tu enchaînes les figures !", "Move after move!"], ["La piste est à toi ! 🪩", "The dance floor is yours! 🪩"]],
    },
    cooking: {
      success: [["Recette réussie ! 🧁", "Recipe nailed! 🧁"], ["Miam, c'est parfait !", "Yum, that's perfect!"], ["Trois étoiles au guide KibooM ! ⭐", "Three stars in the KibooM guide! ⭐"]],
      fast: [["Cuit à point en un éclair !", "Cooked to perfection in a flash!"], ["Service express ! 🍳", "Express service! 🍳"]],
      fail: [["Le gâteau n'a pas levé… on recommence la recette ?", "The cake didn't rise… try the recipe again?"], ["Une pincée de patience, et on réessaie 🧂", "A pinch of patience, and try again 🧂"], ["Même les grands chefs ratent des crêpes !", "Even top chefs mess up pancakes!"]],
      levelUp: [["Tu passes à la recette suivante ! 📖", "On to the next recipe! 📖"], ["Du gâteau au grand menu !", "From a cake to a full menu!"]],
      record: [["Toque d'or ! 🧑‍🍳", "Golden chef's hat! 🧑‍🍳"], ["Record de la cuisine !", "Kitchen record!"]],
      streak: [["Tu enchaînes les plats !", "Dish after dish!"], ["La cuisine sent bon la réussite 🍰", "The kitchen smells of success 🍰"]],
    },
    building: {
      success: [["Brique posée ! 🧱", "Brick laid! 🧱"], ["Construction solide !", "Solid construction!"], ["Tour terminée !", "Tower finished!"]],
      fast: [["Construit en un éclair ! ⚡", "Built in a flash! ⚡"], ["Chantier express !", "Express building site!"]],
      fail: [["La tour est tombée ? On la reconstruit !", "The tower fell? Let's build it again!"], ["Une brique de travers, on corrige 🧱", "One brick out of place, let's fix it 🧱"], ["Les plus beaux châteaux ont été reconstruits !", "The finest castles were rebuilt!"]],
      levelUp: [["Étage suivant ! 🏗️", "Next floor! 🏗️"], ["Tu passes au gratte-ciel !", "On to the skyscraper!"]],
      record: [["La plus haute tour du monde ! 🏙️", "The tallest tower in the world! 🏙️"], ["Record de construction !", "Building record!"]],
      streak: [["Tu empiles les réussites !", "You're stacking up the wins!"], ["Un vrai château de réussites ! 🏰", "A whole castle of wins! 🏰"]],
    },
  },

  types: {
    achiever: {
      success: [["Objectif atteint ! 🎯", "Target reached! 🎯"], ["Un de plus au tableau !", "One more on the board!"]],
      fail: [["Presque ! Le prochain est pour toi.", "Almost! The next one's yours."], ["Tu vas l'avoir, celui-là !", "You'll get this one!"]],
      levelUp: [["Défi suivant : à toi de jouer !", "Next challenge: your move!"], ["Toujours plus haut ! 🎯", "Higher and higher! 🎯"]],
    },
    explorer: {
      success: [["Trésor trouvé ! 🗺️", "Treasure found! 🗺️"], ["Nouvelle découverte !", "A new discovery!"]],
      fail: [["Ce chemin était un cul-de-sac, on en essaie un autre !", "That path was a dead end, let's try another!"], ["Les explorateurs se perdent… puis trouvent !", "Explorers get lost… then find the way!"]],
      levelUp: [["Nouvelle terre à explorer ! 🧭", "New land to explore! 🧭"], ["Une porte secrète s'ouvre…", "A secret door opens…"]],
    },
    architect: {
      success: [["Plan parfaitement exécuté ! 📐", "Plan perfectly carried out! 📐"], ["Tout est bien en place.", "Everything is in its place."]],
      fail: [["Petite erreur dans les plans, on corrige 📐", "A small error in the plans, let's fix it 📐"], ["On revoit la construction, pièce par pièce.", "Let's check the build, piece by piece."]],
      levelUp: [["Nouveau chantier, plus ambitieux ! 🏗️", "A new, bigger project! 🏗️"], ["Le plan suivant est prêt.", "The next plan is ready."]],
    },
    spectateur: {
      success: [["Et le héros de l'histoire, c'est toi ! 🎬", "And the hero of the story is you! 🎬"], ["Quel épisode !", "What an episode!"]],
      fail: [["Suspense… la suite au prochain essai !", "Suspense… to be continued on the next try!"], ["Rebondissement ! 🎬", "Plot twist! 🎬"]],
      levelUp: [["Épisode suivant ! 📺", "Next episode! 📺"], ["La saison 2 commence !", "Season 2 begins!"]],
    },
  },

  sensitive: {
    fail: [["Ce n'est pas grave du tout. On y va doucement 🌷", "That's not a problem at all. We'll take it gently 🌷"], ["Tu as le droit de te tromper : c'est comme ça qu'on apprend.", "You're allowed to make mistakes: that's how we learn."], ["Respire… et on réessaie quand tu veux 😌", "Breathe… and try again whenever you like 😌"]],
    ragequit: [["Tu as bien fait de faire une pause 🌷", "Taking a break was a good idea 🌷"], ["On reviendra dessus quand tu en auras envie.", "We'll come back to it when you feel like it."]],
    levelDown: [["On prend le temps, c'est très bien comme ça.", "Taking our time is just fine."], ["Pas à pas, c'est la bonne façon 🐾", "Step by step is the right way 🐾"]],
  },

  /* Répliques avec ce que l'enfant nous a dit dans « Mes goûts » : {player} (son joueur ou sa joueuse),
     {team} (son équipe), {artist} (son artiste), {country} (le pays qu'il adore). Utilisées seulement s'il l'a dit. */
  personal: {
    player: {
      success: [["Une frappe digne de {player} !", "A strike worthy of {player}!"], ["{player} applaudirait !", "{player} would be clapping!"]],
      fast: [["Plus rapide que {player} sur un contre !", "Faster than {player} on a counter-attack!"]],
      record: [["Même {player} n'a jamais fait ça !", "Even {player} has never done that!"]],
      levelUp: [["{player} t'attend au niveau du dessus !", "{player} is waiting for you on the next level!"]],
    },
    team: {
      success: [["Allez {team} ! ⚽", "Come on {team}! ⚽"]],
      streak: [["{team} enchaîne les victoires !", "{team} keep on winning!"]],
      levelUp: [["{team} monte au classement !", "{team} climb the table!"]],
      record: [["Les supporters de {team} chantent ton nom !", "The {team} fans are singing your name!"]],
    },
    artist: {
      success: [["Ça mérite une chanson de {artist} 🎤", "That deserves a song by {artist} 🎤"]],
      record: [["{artist} va écrire une chanson sur ton record !", "{artist} is going to write a song about your record!"]],
    },
    country: {
      start: [["Prochaine escale : {country} ✈️ ! Mais d'abord, un petit exercice.", "Next stop: {country} ✈️! But first, a little exercise."]],
      levelUp: [["Encore un niveau, et direction {country} ✈️ !", "One more level, and off to {country} ✈️!"]],
    },
  },

  evening: {
    start: [["Bonsoir ! Une petite partie avant de dormir ? 🌙", "Good evening! A little game before bed? 🌙"], ["Les étoiles sont là, et les cartes aussi ✨", "The stars are out, and so are the cards ✨"]],
    success: [["Même le soir, ton cerveau brille ! 🌙", "Even in the evening, your brain shines! 🌙"], ["Bravo, la lune est fière de toi 🌛", "Well done, the moon is proud of you 🌛"]],
  },
};
