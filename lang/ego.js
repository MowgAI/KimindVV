"use strict";
/* Ego KibooM : le contenu du questionnaire (séparé du code, js/ego.js), pour pouvoir faire
   plus tard d'autres versions (plus grands, adultes, personnes âgées, enfants autistes).
   D'après « BK Sciences Co » et les slides « Learner types » (Camille, Danlin) : quatre types
   d'apprenants (Achiever, Explorer, Architect, Spectateur), chacun étant un MÉLANGE de
   caractéristiques. Les profils sont caricaturaux : on donne des pourcentages, pas une étiquette.

   - traits : les caractéristiques, avec ce que KibooM dit à l'enfant quand elle est forte (pos)
     ou faible (neg).
   - types : pour chaque type, le poids de chaque caractéristique (+1 : typique, −1 : contraire,
     absent : sans rapport), d'après les descriptions et les règles du document.
   - questions : chaque réponse ajoute des points aux caractéristiques (t). Aucune n'est meilleure
     qu'une autre. */
window.EGO = {
  traits: {
    goal:         { fr: ["Tu aimes réussir tous les niveaux.", "Gagner, ce n'est pas le plus important pour toi."],
                    en: ["You like to complete every level.", "Winning isn't the most important thing for you."] },
    reflect:      { fr: ["Tu réfléchis avant de répondre.", "Tu aimes répondre vite."],
                    en: ["You think before you answer.", "You like to answer quickly."] },
    act:          { fr: ["Tu aimes agir et essayer plein de choses.", "Tu prends ton temps avant d'agir."],
                    en: ["You like to act and try lots of things.", "You take your time before acting."] },
    autonomy:     { fr: ["Tu aimes te débrouiller par toi-même.", "Tu aimes qu'on te guide pas à pas."],
                    en: ["You like to work things out by yourself.", "You like to be guided step by step."] },
    novelty:      { fr: ["Tu adores découvrir des choses nouvelles.", "Tu aimes retrouver ce que tu connais."],
                    en: ["You love discovering new things.", "You like finding things you already know."] },
    richness:     { fr: ["Tu aimes quand il y a plein de cartes et de couleurs.", "Tu préfères quand c'est simple et bien rangé."],
                    en: ["You like lots of cards and colours.", "You prefer things simple and tidy."] },
    flex:         { fr: ["Tu aimes changer souvent de jeu.", "Tu aimes rester sur le même jeu."],
                    en: ["You like to switch games often.", "You like to stick with the same game."] },
    reason:       { fr: ["Tu veux comprendre comment ça marche.", "Tu préfères essayer plutôt que chercher pourquoi."],
                    en: ["You want to understand how things work.", "You'd rather try than ask why."] },
    observe:      { fr: ["Tu observes beaucoup avant d'agir.", "Tu te lances sans attendre."],
                    en: ["You watch a lot before acting.", "You jump right in."] },
    sidequests:   { fr: ["Tu aimes aussi les à-côtés : dessin, musique, découvertes.", "Tu restes sur le jeu sans te disperser."],
                    en: ["You also love the extras: drawing, music, discoveries.", "You stay focused on the game."] },
    stats:        { fr: ["Tu aimes regarder tes résultats.", "Tes résultats ne t'intéressent pas beaucoup."],
                    en: ["You like looking at your results.", "Your results don't interest you much."] },
    persist:      { fr: ["Tu recommences jusqu'à réussir.", "Quand c'est raté, tu passes à autre chose."],
                    en: ["You try again until you succeed.", "When it goes wrong, you move on."] },
    help:         { fr: ["Tu aimes demander de l'aide pour comprendre.", "Tu préfères trouver sans aide."],
                    en: ["You like asking for help to understand.", "You prefer to find out without help."] },
    fb_app:       { fr: ["Tu aimes qu'on te dise « bravo ! ».", null], en: ["You like being told “well done!”.", null] },
    fb_int:       { fr: ["Tu aimes les bonus où tu peux créer.", null], en: ["You like bonuses where you can create.", null] },
    fb_inf:       { fr: ["Tu aimes les explications.", null], en: ["You like explanations.", null] },
    presentation: { fr: ["Tu fais attention à la façon dont les choses sont présentées.", null],
                    en: ["You notice how things are presented.", null] },
  },

  types: {
    achiever: {
      icon: "🎯", color: "#FF9F1C",
      // Goal-oriented, réfléchi, peu d'importance au matériel, apprenant actif ; recommence jusqu'à
      // réussir ; aide rarement ; aime le feedback appréciatif (« bravo »).
      profile: { goal: 1, reflect: 1, autonomy: 1, persist: 1, help: -1, fb_app: 1, flex: -0.5, sidequests: -0.5 },
      fr: { name: "Achiever", text: "Tu aimes te fixer un but et aller jusqu'au bout." },
      en: { name: "Achiever", text: "You like setting yourself a goal and seeing it through." },
    },
    explorer: {
      icon: "🧭", color: "#12B5A6",
      // Discovery oriented, richness seeking, actif, flexible, impulsif, peu orienté réussite ;
      // aime le feedback interactif (créer, explorer).
      profile: { novelty: 1, richness: 1, act: 1, flex: 1, goal: -1, reflect: -1, persist: -1, fb_int: 1, sidequests: 0.5 },
      fr: { name: "Explorer", text: "Tu aimes découvrir, essayer et bouger." },
      en: { name: "Explorer", text: "You like discovering, trying and moving around." },
    },
    architect: {
      icon: "🧩", color: "#4141EE",
      // Reason oriented, observateur, réfléchi, apprenant actif ; demande l'aide pour comprendre,
      // regarde ses statistiques, préfère le connu, aime le feedback informatif.
      profile: { reason: 1, observe: 1, reflect: 1, autonomy: 0.5, help: 1, stats: 1, fb_inf: 1, novelty: -1, persist: -0.5 },
      fr: { name: "Architect", text: "Tu aimes comprendre comment ça marche avant d'agir." },
      en: { name: "Architect", text: "You like understanding how things work before acting." },
    },
    spectateur: {
      icon: "🔭", color: "#E2508A",
      // Observateur passif, guidé pas à pas, peu d'actions, pensée divergente (à-côtés) ;
      // sensible à la présentation ; ne reste pas trop longtemps ; ne regarde pas ses statistiques.
      profile: { observe: 1, act: -1, autonomy: -1, sidequests: 1, presentation: 1, flex: 0.5, stats: -1, fb_int: 0.5, fb_inf: 0.5, persist: -0.5 },
      fr: { name: "Spectateur", text: "Tu aimes observer, imaginer et prendre ton temps." },
      en: { name: "Spectateur", text: "You like watching, imagining and taking your time." },
    },
  },

  questions: [
    { id: "new_game",
      fr: "Un nouveau jeu arrive. Toi, tu…", en: "A new game arrives. You…",
      options: [
        { id: "read_rules", icon: "📖", t: { reason: 1, observe: 0.5, reflect: 0.5 }, fr: "lis la règle d'abord", en: "read the rules first" },
        { id: "try_now", icon: "🚀", t: { act: 1, reflect: -1, novelty: 0.5 }, fr: "essaies tout de suite", en: "try it straight away" },
        { id: "watch", icon: "👀", t: { observe: 1, act: -1, autonomy: -0.5 }, fr: "regardes quelqu'un jouer", en: "watch someone play" },
        { id: "all_levels", icon: "🎯", t: { goal: 1, persist: 0.5 }, fr: "veux réussir tous les niveaux", en: "want to complete every level" },
      ] },
    { id: "success_feedback",
      fr: "Tu as réussi ! Tu préfères…", en: "You did it! You'd rather have…",
      options: [
        { id: "appreciative", icon: "👏", t: { fb_app: 1 }, fr: "qu'on te dise « Bravo ! »", en: "someone say “Well done!”" },
        { id: "informative", icon: "💬", t: { fb_inf: 1, reason: 0.5 }, fr: "une explication : pourquoi c'est juste", en: "an explanation of why it's right" },
        { id: "interactive", icon: "🎨", t: { fb_int: 1, sidequests: 0.5 }, fr: "un bonus pour dessiner ou créer", en: "a bonus to draw or create" },
        { id: "show", icon: "🎆", t: { presentation: 1, fb_int: 0.5 }, fr: "une jolie animation à regarder", en: "a nice animation to watch" },
      ] },
    { id: "after_fail",
      fr: "C'est raté. Toi, tu…", en: "It went wrong. You…",
      options: [
        { id: "retry", icon: "🔁", t: { persist: 1, goal: 0.5 }, fr: "recommences jusqu'à réussir", en: "try again until you succeed" },
        { id: "why", icon: "🔍", t: { reason: 1, help: 1 }, fr: "cherches pourquoi c'est raté", en: "look for why it went wrong" },
        { id: "other_game", icon: "🔀", t: { flex: 1, novelty: 0.5, persist: -1 }, fr: "passes à un autre jeu", en: "switch to another game" },
        { id: "wait_help", icon: "🤝", t: { autonomy: -1, help: 0.5 }, fr: "attends qu'on t'explique", en: "wait for someone to explain" },
      ] },
    { id: "choose_game",
      fr: "Dans le menu, tu choisis…", en: "In the menu, you choose…",
      options: [
        { id: "unfinished", icon: "🏁", t: { goal: 1, persist: 0.5 }, fr: "le jeu que tu n'as pas fini", en: "the game you haven't finished" },
        { id: "never_tried", icon: "✨", t: { novelty: 1 }, fr: "un jeu jamais essayé", en: "a game you've never tried" },
        { id: "known", icon: "🏠", t: { novelty: -1, reason: 0.3 }, fr: "un jeu que tu connais bien", en: "a game you know well" },
        { id: "look_all", icon: "🧐", t: { observe: 1, act: -0.5 }, fr: "tu regardes tous les jeux avant", en: "you look at all the games first" },
      ] },
    { id: "cards",
      fr: "Dans un jeu, tu préfères…", en: "In a game, you prefer…",
      options: [
        { id: "few_tidy", icon: "🃏", t: { richness: -1, presentation: 0.5 }, fr: "peu de cartes, bien rangées", en: "a few cards, neatly arranged" },
        { id: "lots", icon: "🌈", t: { richness: 1 }, fr: "plein de cartes et de couleurs", en: "lots of cards and colours" },
        { id: "just_enough", icon: "⚖️", t: { reason: 0.5, reflect: 0.5 }, fr: "juste ce qu'il faut pour réfléchir", en: "just enough to think" },
        { id: "pretty", icon: "🖼️", t: { presentation: 1 }, fr: "de jolies cartes bien présentées", en: "pretty, well-presented cards" },
      ] },
    { id: "before_answer",
      fr: "Avant de répondre, tu…", en: "Before answering, you…",
      options: [
        { id: "fast", icon: "⚡", t: { reflect: -1, act: 0.5 }, fr: "réponds vite", en: "answer quickly" },
        { id: "think", icon: "🤔", t: { reflect: 1 }, fr: "réfléchis longtemps", en: "think for a long time" },
        { id: "check_rule", icon: "📏", t: { reason: 1, observe: 0.5 }, fr: "vérifies que tu as compris la règle", en: "check you've understood the rules" },
        { id: "wait_hint", icon: "💡", t: { autonomy: -1, help: 0.5 }, fr: "attends un indice", en: "wait for a hint" },
      ] },
    { id: "results",
      fr: "À la fin, tes résultats : tu…", en: "At the end, your results: you…",
      options: [
        { id: "detail", icon: "📊", t: { stats: 1, reason: 0.5 }, fr: "les regardes en détail", en: "look at them in detail" },
        { id: "won", icon: "✅", t: { goal: 1 }, fr: "regardes juste si tu as gagné", en: "just check whether you won" },
        { id: "replay", icon: "▶️", t: { act: 0.5, stats: -0.5, novelty: 0.3 }, fr: "n'en as pas besoin : tu rejoues", en: "don't need them: you play again" },
        { id: "other", icon: "🎵", t: { sidequests: 1, stats: -1 }, fr: "préfères faire autre chose", en: "would rather do something else" },
      ] },
    { id: "help_button",
      fr: "Il y a un bouton d'aide. Tu…", en: "There's a help button. You…",
      options: [
        { id: "never", icon: "💪", t: { autonomy: 1, help: -1 }, fr: "ne cliques pas : tu veux trouver toi-même", en: "don't click: you want to find out yourself" },
        { id: "understand", icon: "🧠", t: { help: 1, reason: 1 }, fr: "cliques pour comprendre comment ça marche", en: "click to understand how it works" },
        { id: "curious", icon: "🖱️", t: { act: 1, novelty: 0.5 }, fr: "cliques pour voir ce qui se passe", en: "click to see what happens" },
        { id: "step_by_step", icon: "👣", t: { autonomy: -1, help: 0.5 }, fr: "aimes qu'on te montre étape par étape", en: "like being shown step by step" },
      ] },
    { id: "during",
      fr: "Quand tu joues, tu…", en: "When you play, you…",
      options: [
        { id: "same_until", icon: "🔂", t: { persist: 1, flex: -1 }, fr: "refais le même jeu jusqu'à le réussir", en: "replay the same game until you succeed" },
        { id: "switch", icon: "🔄", t: { flex: 1, novelty: 0.5 }, fr: "changes souvent de jeu", en: "often switch games" },
        { id: "trick", icon: "🗝️", t: { reason: 1 }, fr: "cherches l'astuce pour gagner à chaque fois", en: "look for the trick to win every time" },
        { id: "wander", icon: "🗺️", t: { observe: 0.5, sidequests: 0.5, act: -0.3 }, fr: "te promènes dans l'appli pour découvrir", en: "wander around the app to discover" },
      ] },
    { id: "favourite",
      fr: "Dans KibooM, ce que tu préfères, c'est…", en: "In KibooM, what you like best is…",
      options: [
        { id: "next_level", icon: "⬆️", t: { goal: 1 }, fr: "passer au niveau suivant", en: "moving up to the next level" },
        { id: "characters", icon: "🦖", t: { novelty: 1, richness: 0.5 }, fr: "découvrir de nouveaux personnages", en: "discovering new characters" },
        { id: "tricks", icon: "🔧", t: { reason: 1 }, fr: "trouver des astuces", en: "finding tricks" },
        { id: "parade", icon: "🎪", t: { sidequests: 1, presentation: 0.5 }, fr: "la parade, la musique, les images", en: "the parade, the music, the pictures" },
      ] },
  ],
};
