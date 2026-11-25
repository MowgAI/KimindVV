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

  /* ---------- Chapitre 1 : qui je suis (données fixes) ----------
     Seulement ce qui sert : pas de religion, groupe ethnique, situation des parents, etc. */
  identity: [
    { id: "age", fr: "Quel âge as-tu ?", en: "How old are you?",
      options: ["4", "5", "6", "7", "8", "9", "10", "11", "12", "13+"].map(a => ({ id: a, fr: a + (a === "13+" ? " ans" : " ans"), en: a })) },
    { id: "birth_month", fr: "Ton anniversaire, c'est en quel mois ?", en: "Which month is your birthday?",
      options: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
        .map((m, i) => ({ id: String(i + 1), fr: m, en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][i] })) },
    { id: "school_class", fr: "En quelle classe es-tu ?", en: "Which class are you in?",
      options: [
        { id: "maternelle", fr: "Maternelle", en: "Nursery / Reception" }, { id: "cp", fr: "CP", en: "Year 1" },
        { id: "ce1", fr: "CE1", en: "Year 2" }, { id: "ce2", fr: "CE2", en: "Year 3" }, { id: "cm1", fr: "CM1", en: "Year 4" },
        { id: "cm2", fr: "CM2", en: "Year 5" }, { id: "college", fr: "6e et plus", en: "Year 6 and up" }] },
    { id: "gender", fr: "Tu es…", en: "You are…",
      options: [{ id: "girl", icon: "👧", fr: "une fille", en: "a girl" }, { id: "boy", icon: "👦", fr: "un garçon", en: "a boy" },
        { id: "undisclosed", icon: "🤐", fr: "je préfère ne pas dire", en: "I'd rather not say" }] },
    { id: "home_language", multi: true, fr: "Quelle(s) langue(s) parles-tu à la maison ?", en: "Which language(s) do you speak at home?",
      options: [{ id: "fr", icon: "🇫🇷", fr: "français", en: "French" }, { id: "en", icon: "🇬🇧", fr: "anglais", en: "English" },
        { id: "it", icon: "🇮🇹", fr: "italien", en: "Italian" }, { id: "other", icon: "🌍", fr: "une autre langue", en: "another language" }] },
  ],

  /* ---------- Chapitre 2 : ma personnalité ----------
     Traits stables (BK Sciences Co) : les cinq grands traits, les traits liés au jeu et des traits
     plus fins. Chaque phrase : « C'est comme toi ? » (0 pas du tout … 3 énormément) ; rev = phrase
     inversée. Dans la constellation, chaque trait est une étoile au nom positif (star) ; inv : l'étoile
     brille quand le trait est faible (neuroticisme → Sérénité, agressivité → Fair-play). */
  scale: [
    { v: 0, icon: "😶", fr: "pas du tout", en: "not at all" }, { v: 1, icon: "🙂", fr: "un peu", en: "a little" },
    { v: 2, icon: "😊", fr: "beaucoup", en: "a lot" }, { v: 3, icon: "🤩", fr: "énormément", en: "totally" }],
  personalityTraits: {
    openness:          { icon: "🔭", fr: "Curiosité", en: "Curiosity" },
    conscientiousness: { icon: "🗂️", fr: "Organisation", en: "Organisation" },
    extraversion:      { icon: "🎉", fr: "Sociabilité", en: "Sociability" },
    agreeableness:     { icon: "🤗", fr: "Gentillesse", en: "Kindness" },
    neuroticism:       { icon: "🧘", fr: "Sérénité", en: "Serenity", inv: true },
    emotivity:         { icon: "💗", fr: "Sensibilité", en: "Sensitivity" },
    aggressiveness:    { icon: "🤝", fr: "Fair-play", en: "Fair play", inv: true },
    discipline:        { icon: "📏", fr: "Respect des règles", en: "Following rules" },
    creativity:        { icon: "🎨", fr: "Créativité", en: "Creativity" },
    experience:        { icon: "🎲", fr: "Expérience du jeu", en: "Game experience" },
    risk_aversion:     { icon: "🛡️", fr: "Prudence", en: "Caution" },
    individualism:     { icon: "🦅", fr: "Indépendance", en: "Independence" },
    altruism:          { icon: "🎁", fr: "Générosité", en: "Generosity" },
  },
  personality: [
    { id: "p_stories", trait: "openness", fr: "J'aime inventer des histoires.", en: "I like making up stories." },
    { id: "p_learn", trait: "openness", fr: "J'aime apprendre des choses nouvelles.", en: "I like learning new things." },
    { id: "p_finish", trait: "conscientiousness", fr: "Je finis ce que je commence.", en: "I finish what I start." },
    { id: "p_careful", trait: "conscientiousness", fr: "Je fais attention à bien faire.", en: "I take care to do things well." },
    { id: "p_friends", trait: "extraversion", fr: "J'aime jouer avec plein d'amis.", en: "I like playing with lots of friends." },
    { id: "p_alone", trait: "extraversion", rev: true, fr: "Je préfère jouer seul, au calme.", en: "I prefer playing alone, quietly." },
    { id: "p_share", trait: "agreeableness", fr: "J'aime aider et partager.", en: "I like helping and sharing." },
    { id: "p_argue", trait: "agreeableness", rev: true, fr: "Je me dispute souvent.", en: "I often argue." },
    { id: "p_worry", trait: "neuroticism", fr: "Je m'inquiète souvent.", en: "I often worry." },
    { id: "p_calm", trait: "neuroticism", rev: true, fr: "Je reste calme quand ça ne va pas.", en: "I stay calm when things go wrong." },
    { id: "p_cry", trait: "emotivity", fr: "Quand je perds, j'ai envie de pleurer.", en: "When I lose, I feel like crying." },
    { id: "p_angry", trait: "aggressiveness", fr: "Quand je perds, je me fâche.", en: "When I lose, I get cross." },
    { id: "p_rules", trait: "discipline", fr: "Je respecte les règles, même quand je perds.", en: "I follow the rules, even when I'm losing." },
    { id: "p_invent", trait: "creativity", fr: "J'invente mes propres règles.", en: "I make up my own rules." },
    { id: "p_games", trait: "experience", fr: "Je joue souvent à des jeux.", en: "I often play games." },
    { id: "p_sure", trait: "risk_aversion", fr: "Je préfère être sûr plutôt que tenter ma chance.", en: "I'd rather be sure than take a chance." },
    { id: "p_solo", trait: "individualism", fr: "Je préfère gagner seul qu'en équipe.", en: "I'd rather win alone than as a team." },
    { id: "p_others", trait: "altruism", fr: "Je suis content quand les autres gagnent aussi.", en: "I'm happy when others win too." },
  ],

  /* ---------- Chapitre 3 : les défis (seulement ce qui peut changer) ----------
     Proposés un par un, si KibooM a remarqué la caractéristique : src « style » (caractéristique du
     questionnaire de style, entre −1 et 1) ou « personality » (trait entre 0 et 1) ; below / above :
     seuil. Formulations positives et un peu taquines. */
  challenges: [
    { id: "reflect_more", icon: "⚡", src: "style", trait: "reflect", below: -0.2,
      fr: "Tu réponds plus vite que ton ombre ! Tu veux essayer de réfléchir un peu avant ?",
      en: "You answer faster than your shadow! Want to try thinking a little first?" },
    { id: "persist_more", icon: "🏃", src: "style", trait: "persist", below: -0.2,
      fr: "Quand c'est raté, hop, tu files vers un autre jeu ! Et si tu tentais de persévérer ?",
      en: "When it goes wrong, whoosh, you're off to another game! What if you tried sticking at it?" },
    { id: "stay_calm", icon: "🌋", src: "personality", trait: "aggressiveness", above: 0.5,
      fr: "Quand tu perds, ça bout un peu dans ta tête… Tu veux devenir maître zen ?",
      en: "When you lose, things bubble up a bit in your head… Want to become a zen master?" },
    { id: "act_more", icon: "🐌", src: "style", trait: "act", below: -0.2,
      fr: "Toi, tu observes beaucoup… Et si tu osais te lancer plus souvent ?",
      en: "You watch a lot… What if you dared to jump in more often?" },
    { id: "try_new", icon: "🏠", src: "style", trait: "novelty", below: -0.2,
      fr: "Toujours les mêmes jeux, hein ? Prêt pour une aventure inconnue ?",
      en: "Always the same games, eh? Ready for an unknown adventure?" },
    { id: "ask_help", icon: "🙋", src: "style", trait: "help", below: -0.2,
      fr: "Tu fais tout par toi-même… Et si tu demandais un coup de main quand tu bloques ?",
      en: "You do everything all by yourself… What if you asked for a hand when you're stuck?" },
    { id: "check_progress", icon: "📈", src: "style", trait: "stats", below: -0.2,
      fr: "Tes résultats ? Même pas un coup d'œil ! Tu veux voir tes progrès de temps en temps ?",
      en: "Your results? Not even a glance! Want to check your progress now and then?" },
  ],

  /* ---------- Le portrait (sous la constellation) ----------
     Des regroupements de caractéristiques, plutôt qu'une liste d'étoiles. Chaque règle croise des
     traits de personnalité (p.…, entre 0 et 1) et, si le chapitre 3 est fait, des caractéristiques du
     style de joueur (s.…, entre −1 et 1). Conditions : [caractéristique, ">=" | "<=", seuil], toutes
     vraies (all) ; kind : force (une qualité) ou watch (un petit point à travailler, dit gentiment) ;
     prio : les plus hautes passent d'abord. Formulations positives, un peu taquines, sans adjectif
     genré (« tu es fiable », pas « tu es organisé »). */
  superpowers: {
    openness:          { fr: "tu as toujours envie de découvrir et d'apprendre", en: "you always want to discover and learn" },
    conscientiousness: { fr: "tu vas jusqu'au bout de ce que tu fais", en: "you see things through to the end" },
    extraversion:      { fr: "avec toi, on ne s'ennuie jamais à plusieurs", en: "with you around, nobody gets bored" },
    agreeableness:     { fr: "tu sais aider et partager", en: "you know how to help and share" },
    neuroticism:       { fr: "tu gardes ton calme quand ça se complique", en: "you keep calm when things get tricky" },
    emotivity:         { fr: "tu ressens les choses très fort", en: "you feel things very deeply" },
    aggressiveness:    { fr: "même quand tu perds, tu restes cool", en: "even when you lose, you stay cool" },
    discipline:        { fr: "avec toi, le jeu est juste pour tout le monde", en: "with you, the game is fair for everyone" },
    creativity:        { fr: "ta tête déborde d'idées", en: "your head is overflowing with ideas" },
    experience:        { fr: "tu connais déjà plein de jeux", en: "you already know lots of games" },
    risk_aversion:     { fr: "tu réfléchis avant de te lancer", en: "you think before you leap" },
    individualism:     { fr: "tu sais te débrouiller par toi-même", en: "you can manage on your own" },
    altruism:          { fr: "la victoire des autres te fait plaisir aussi", en: "other people's wins make you happy too" },
  },
  portrait: [
    { id: "impatient", kind: "watch", prio: 9, all: [["s.reflect", "<=", -0.25], ["s.persist", "<=", -0.25]],
      fr: "La patience, ce n'est pas encore ton fort : tu réponds à toute vitesse, mais quand c'est raté, tu ne retentes pas ta chance. Et si la deuxième fois était la bonne ?",
      en: "Patience isn't your strong point yet: you answer at top speed, but when it goes wrong, you don't try again. What if the second go was the one?" },
    { id: "boiling_but_fair", kind: "force", prio: 8, all: [["p.aggressiveness", ">=", 0.67], ["p.discipline", ">=", 0.67]],
      fr: "Quand tu perds, ça bouillonne à l'intérieur… mais tu respectes toujours les règles. Rester fair-play même fâché, c'est une vraie force.",
      en: "When you lose, things boil inside… but you always follow the rules. Staying fair even when cross is a real strength." },
    { id: "boiling_overflow", kind: "watch", prio: 9, all: [["p.aggressiveness", ">=", 0.67], ["p.discipline", "<=", 0.5]],
      fr: "Quand tu perds, la moutarde te monte vite au nez, et les règles passent parfois à la trappe… Une grande respiration avant de rejouer ?",
      en: "When you lose, you see red pretty quickly, and the rules sometimes go out the window… A big deep breath before playing again?" },
    { id: "brave_heart", kind: "force", prio: 9, all: [["p.emotivity", ">=", 0.67], ["s.persist", ">=", 0.25]],
      fr: "Les défaites te touchent beaucoup, et pourtant tu recommences quand même. C'est ça, le vrai courage !",
      en: "Losing really gets to you, and yet you keep trying. That's real courage!" },
    { id: "tender_heart", kind: "watch", prio: 7, all: [["p.emotivity", ">=", 0.67], ["p.neuroticism", ">=", 0.5]],
      fr: "Tu as un cœur tendre : quand ça ne va pas, tu t'inquiètes et tu ressens tout très fort. Souviens-toi qu'une partie perdue, ce n'est qu'un entraînement.",
      en: "You have a tender heart: when things go wrong, you worry and feel it all very deeply. Remember, a lost game is just practice." },
    { id: "zen_master", kind: "force", prio: 6, all: [["p.neuroticism", "<=", 0.34], ["p.aggressiveness", "<=", 0.34]],
      fr: "Rien ne te fait perdre ton calme : ni une défaite, ni un exercice difficile. Un vrai maître zen !",
      en: "Nothing makes you lose your cool: not a defeat, not a hard exercise. A true zen master!" },
    { id: "inventor", kind: "force", prio: 7, all: [["p.openness", ">=", 0.67], ["p.creativity", ">=", 0.67]],
      fr: "Tu as une imagination débordante : tu aimes découvrir, apprendre et inventer. Ta tête est une usine à idées !",
      en: "You have a wild imagination: you love discovering, learning and inventing. Your head is an idea factory!" },
    { id: "rule_inventor", kind: "watch", prio: 6, all: [["p.creativity", ">=", 0.67], ["p.discipline", "<=", 0.5]],
      fr: "Tu adores inventer tes propres règles : génial pour créer… mais dans un jeu, les règles sont les mêmes pour tout le monde 😉",
      en: "You love making up your own rules: brilliant for creating… but in a game, the rules are the same for everyone 😉" },
    { id: "reliable", kind: "force", prio: 6, all: [["p.conscientiousness", ">=", 0.67], ["p.discipline", ">=", 0.67]],
      fr: "On peut compter sur toi : tu finis ce que tu commences et tu respectes les règles du jeu.",
      en: "People can count on you: you finish what you start and you play by the rules." },
    { id: "starter", kind: "watch", prio: 5, all: [["p.openness", ">=", 0.67], ["p.conscientiousness", "<=", 0.34]],
      fr: "Tu adores commencer plein de nouvelles choses… les finir, un peu moins ! Et si tu allais jusqu'au bout d'un jeu avant d'en ouvrir un autre ?",
      en: "You love starting lots of new things… finishing them, a bit less! What if you saw one game through before opening another?" },
    { id: "team_player", kind: "force", prio: 6, all: [["p.extraversion", ">=", 0.67], ["p.agreeableness", ">=", 0.67]],
      fr: "Tu aimes les autres et les autres te le rendent bien : jouer à plusieurs, aider, partager… c'est tout toi.",
      en: "You like people and they like you back: playing together, helping, sharing… that's so you." },
    { id: "own_way", kind: "force", prio: 5, all: [["p.extraversion", "<=", 0.34], ["p.individualism", ">=", 0.5]],
      fr: "Tu aimes faire les choses à ta façon, au calme. C'est souvent là que tu as tes meilleures idées.",
      en: "You like doing things your own way, quietly. That's often where you get your best ideas." },
    { id: "generous_team", kind: "force", prio: 5, all: [["p.altruism", ">=", 0.67], ["p.individualism", "<=", 0.34]],
      fr: "Pour toi, une victoire est encore plus belle quand on la partage : tu as l'esprit d'équipe.",
      en: "For you, a win is even better when it's shared: you're a real team player." },
    { id: "competitor", kind: "force", prio: 5, all: [["p.individualism", ">=", 0.67], ["s.goal", ">=", 0.25]],
      fr: "Tu aimes gagner par toi-même et réussir tous les niveaux : tu as l'esprit de compétition !",
      en: "You like winning on your own and completing every level: you've got a competitive spirit!" },
    { id: "careful_thinker", kind: "force", prio: 6, all: [["p.risk_aversion", ">=", 0.67], ["s.reflect", ">=", 0.25]],
      fr: "Tu prends ton temps et tu aimes avoir tout vérifié avant d'agir : rien ne t'échappe.",
      en: "You take your time and like to check everything before acting: nothing gets past you." },
    { id: "adventurer", kind: "force", prio: 6, all: [["p.risk_aversion", "<=", 0.34], ["p.openness", ">=", 0.5]],
      fr: "Tenter ta chance et découvrir de nouveaux jeux ne te fait pas peur : tu as le goût de l'aventure.",
      en: "Taking a chance and trying new games doesn't scare you: you've got an adventurer's soul." },
    { id: "bold_but_rushed", kind: "watch", prio: 7, all: [["p.risk_aversion", "<=", 0.34], ["s.reflect", "<=", -0.25]],
      fr: "Tu fonces sans hésiter, c'est super… mais parfois, trois secondes de réflexion de plus éviteraient une erreur.",
      en: "You charge ahead without hesitating, which is great… but sometimes three more seconds of thinking would avoid a mistake." },
    { id: "never_give_up", kind: "force", prio: 7, all: [["p.conscientiousness", ">=", 0.5], ["s.persist", ">=", 0.25]],
      fr: "Tu ne lâches rien : quand c'est raté, tu recommences jusqu'à réussir.",
      en: "You never give up: when it goes wrong, you try again until you get it." },
    { id: "curious_asker", kind: "force", prio: 5, all: [["p.openness", ">=", 0.5], ["s.reason", ">=", 0.25]],
      fr: "Tu ne te contentes pas de gagner : tu veux comprendre comment ça marche. C'est comme ça qu'on devient très fort.",
      en: "Winning isn't enough for you: you want to understand how it works. That's how you get really good." },
    { id: "quiet_observer", kind: "force", prio: 5, all: [["p.extraversion", "<=", 0.5], ["s.observe", ">=", 0.25]],
      fr: "Tu observes beaucoup avant d'agir : tu remarques des choses que les autres ne voient pas.",
      en: "You watch a lot before acting: you notice things other people miss." },
    { id: "lone_wolf", kind: "watch", prio: 5, all: [["s.help", "<=", -0.25], ["p.individualism", ">=", 0.5]],
      fr: "Tu veux tout faire par toi-même… mais demander un coup de main quand on bloque, c'est aussi être malin.",
      en: "You want to do everything by yourself… but asking for a hand when you're stuck is clever too." },
    { id: "game_expert", kind: "force", prio: 4, all: [["p.experience", ">=", 0.67]],
      fr: "Tu as déjà joué à plein de jeux : tu comprends vite les règles et tu repères les astuces.",
      en: "You've played lots of games already: you pick up rules fast and spot the tricks." },
  ],

  /* ---------- Chapitre 2, suite : ce que j'aime (pour personnaliser les conseils) ----------
     Après les phrases de personnalité. multi : plusieurs réponses possibles. Ces goûts servent au
     conseil de KibooM (js/coach.js) : pauses (« écoute ta musique », « va jouer dehors »…). */
  likes: [
    { id: "hobbies", multi: true, fr: "Tes passe-temps préférés ?", en: "Your favourite hobbies?",
      options: [
        { id: "sport", icon: "⚽", fr: "le sport", en: "sport" }, { id: "music", icon: "🎵", fr: "la musique", en: "music" },
        { id: "drawing", icon: "🎨", fr: "le dessin, le bricolage", en: "drawing, crafts" }, { id: "reading", icon: "📚", fr: "la lecture, les histoires", en: "reading, stories" },
        { id: "board_games", icon: "🎲", fr: "les jeux de société", en: "board games" }, { id: "video_games", icon: "🎮", fr: "les jeux vidéo", en: "video games" },
        { id: "nature", icon: "🌳", fr: "la nature, les animaux", en: "nature, animals" }, { id: "dance", icon: "💃", fr: "la danse", en: "dancing" },
        { id: "cooking", icon: "🧁", fr: "la cuisine", en: "cooking" }, { id: "building", icon: "🧱", fr: "construire (briques…)", en: "building (bricks…)" }] },
    { id: "screen_liking", fr: "Être devant un écran, tu aimes…", en: "Being in front of a screen, you like it…",
      options: [{ id: "0", icon: "😶", fr: "pas du tout", en: "not at all" }, { id: "1", icon: "🙂", fr: "un peu", en: "a little" },
        { id: "2", icon: "😊", fr: "beaucoup", en: "a lot" }, { id: "3", icon: "🤩", fr: "énormément", en: "totally" }] },
    { id: "after_screen", multi: true, fr: "Après un long moment sur l'écran, tu te sens…", en: "After a long time on a screen, you feel…",
      options: [{ id: "fine", icon: "💪", fr: "en forme", en: "fine" }, { id: "eyes", icon: "😵‍💫", fr: "les yeux fatigués", en: "tired eyes" },
        { id: "grumpy", icon: "😤", fr: "énervé, à cran", en: "grumpy, on edge" }, { id: "move", icon: "🤸", fr: "avec l'envie de bouger", en: "like moving around" }] },
    { id: "music_taste", multi: true, fr: "Quelle musique tu aimes ?", en: "What music do you like?",
      options: [{ id: "kids", icon: "🧸", fr: "les chansons pour enfants", en: "children's songs" }, { id: "cartoons", icon: "🎬", fr: "les musiques de dessins animés et de films", en: "cartoon and film music" },
        { id: "pop", icon: "🎤", fr: "la pop", en: "pop" }, { id: "rap", icon: "🧢", fr: "le rap", en: "rap" }, { id: "rock", icon: "🎸", fr: "le rock", en: "rock" },
        { id: "classical", icon: "🎻", fr: "la musique classique", en: "classical music" }, { id: "dunno", icon: "🤷", fr: "je ne sais pas", en: "I don't know" }] },
    { id: "break_pref", multi: true, fr: "Pendant une pause, tu préfères…", en: "During a break, you'd rather…",
      options: [{ id: "move", icon: "🤸", fr: "bouger", en: "move around" }, { id: "music", icon: "🎧", fr: "écouter de la musique", en: "listen to music" },
        { id: "draw", icon: "✏️", fr: "dessiner", en: "draw" }, { id: "outside", icon: "🌞", fr: "jouer dehors", en: "play outside" },
        { id: "read", icon: "📖", fr: "lire", en: "read" }, { id: "snack", icon: "🍎", fr: "goûter", en: "have a snack" }, { id: "rest", icon: "🛋️", fr: "me reposer", en: "rest" }] },
    { id: "outdoor_with", multi: true, fr: "Dehors, tu préfères jouer…", en: "Outside, you'd rather play…",
      options: [{ id: "friends", icon: "👫", fr: "avec des amis", en: "with friends" }, { id: "family", icon: "👨‍👩‍👧", fr: "en famille", en: "with family" },
        { id: "alone", icon: "🧍", fr: "par moi-même", en: "on my own" }] },
  ],

  /* ---------- Le conseil de KibooM (js/coach.js), dit par l'avatar de l'enfant ----------
     openers : la première phrase, selon le moment (temps de jeu, échecs, humeur, soir).
     tips : les conseils de pause ; need : les goûts qui les rendent possibles (au moins un ; vide :
     pour tout le monde) ; {music} : sa musique, {avatar} : le nom de son personnage.
     reco : les recommandations d'exercices « Pour toi » ({game} : le nom du jeu). */
  coach: {
    openers: {
      time:    { fr: "Hé, ça fait {min} minutes qu'on joue ensemble ! Et si on faisait une pause ?", en: "Hey, we've been playing together for {min} minutes! How about a break?" },
      fails:   { fr: "Oups, ça ne marche pas fort en ce moment… Même les cartes ont besoin de souffler !", en: "Oops, things aren't going too well right now… Even cards need a breather!" },
      tired:   { fr: "Un peu de fatigue ? J'ai une idée pour recharger les batteries :", en: "A bit tired? I've got an idea to recharge your batteries:" },
      unhappy: { fr: "Ça ne va pas trop ? J'ai une idée pour te changer les idées :", en: "Not feeling great? I've got an idea to take your mind off things:" },
      late:    { fr: "Il se fait tard… les cartes aussi vont bientôt se coucher 😴", en: "It's getting late… the cards are off to bed soon too 😴" },
    },
    music: {
      kids: { fr: "une chanson pour enfants", en: "a children's song" }, cartoons: { fr: "une musique de dessin animé", en: "a cartoon tune" },
      pop: { fr: "un morceau de pop", en: "a pop song" }, rap: { fr: "un morceau de rap", en: "a rap track" },
      rock: { fr: "un bon rock", en: "some good rock" }, classical: { fr: "un air de musique classique", en: "a piece of classical music" },
      any: { fr: "ta musique préférée", en: "your favourite music" },
    },
    lateTip: { fr: "Un bon dodo, c'est le meilleur entraînement pour demain !", en: "A good night's sleep is the best training for tomorrow!" },
    tips: [
      { id: "music_dance", need: ["break_pref:music", "hobbies:music", "hobbies:dance"], fr: "Écoute {music} et danse dessus 💃 !", en: "Put on {music} and dance to it 💃!" },
      { id: "outside_friends", need: ["break_pref:outside", "outdoor_with:friends"], fr: "Va jouer dehors avec tes amis, les cartes t'attendront ! 🌞", en: "Go and play outside with your friends, the cards will wait for you! 🌞" },
      { id: "outside_family", need: ["outdoor_with:family"], fr: "Propose une petite balade dehors en famille 🌳", en: "Suggest a little walk outside with your family 🌳" },
      { id: "outside_air", need: ["break_pref:outside", "hobbies:nature"], fr: "Va prendre l'air dehors cinq minutes, et dis bonjour à un arbre 🌳", en: "Go and get some fresh air for five minutes, and say hello to a tree 🌳" },
      { id: "frog_jumps", need: ["break_pref:move", "hobbies:sport", "after_screen:move"], fr: "Fais 10 sauts de grenouille 🐸 et reviens !", en: "Do 10 frog jumps 🐸 and come back!" },
      { id: "run_house", need: ["break_pref:move", "hobbies:sport"], fr: "Fais le tour de la maison en courant… sans rien renverser 🏃", en: "Run round the house… without knocking anything over 🏃" },
      { id: "funny_dance", need: ["hobbies:dance"], fr: "Invente une danse rigolote et montre-la à quelqu'un 💃", en: "Make up a silly dance and show it to someone 💃" },
      { id: "draw_avatar", need: ["break_pref:draw", "hobbies:drawing"], fr: "Dessine {avatar} pour voir ! ✏️", en: "Try drawing {avatar}! ✏️" },
      { id: "read_page", need: ["break_pref:read", "hobbies:reading"], fr: "Lis quelques pages de ton livre préféré 📖", en: "Read a few pages of your favourite book 📖" },
      { id: "snack", need: ["break_pref:snack"], fr: "Va prendre un goûter (un fruit, c'est encore mieux 🍎)", en: "Go and have a snack (a piece of fruit is even better 🍎)" },
      { id: "cook", need: ["hobbies:cooking"], fr: "Aide à préparer le goûter, tu as des talents de chef 🧁", en: "Help make the snack, you've got chef skills 🧁" },
      { id: "bricks", need: ["hobbies:building"], fr: "Construis la plus haute tour possible avec tes briques 🧱", en: "Build the tallest tower you can with your bricks 🧱" },
      { id: "board_game", need: ["hobbies:board_games"], fr: "Propose un vrai jeu de société à quelqu'un 🎲", en: "Ask someone to play a real board game 🎲" },
      { id: "far_look", need: ["after_screen:eyes"], fr: "Regarde par la fenêtre, le plus loin possible : tes yeux te diront merci 👀", en: "Look out of the window, as far as you can: your eyes will thank you 👀" },
      { id: "eyes_closed", need: ["break_pref:rest", "after_screen:eyes", "after_screen:grumpy"], fr: "Ferme les yeux et respire doucement en comptant jusqu'à 20 😌", en: "Close your eyes and breathe slowly while counting to 20 😌" },
      { id: "stretch", need: [], fr: "Lève-toi et étire-toi comme un chat qui se réveille 🐈", en: "Stand up and stretch like a cat waking up 🐈" },
      { id: "water", need: [], fr: "Va boire un grand verre d'eau, ton cerveau adore ça 💧", en: "Go and drink a big glass of water, your brain loves it 💧" },
    ],
    reco: {
      reflect_more:   { fr: "Ton défi : réfléchir avant de répondre. {game} se joue sans chrono : prends ton temps !", en: "Your challenge: think before answering. {game} has no timer: take your time!" },
      persist_more:   { fr: "Ton défi : persévérer. Retente {game}, cette fois, c'est la bonne !", en: "Your challenge: stick at it. Have another go at {game}, this time's the one!" },
      stay_calm:      { fr: "Ton défi : rester zen. Commence en douceur avec {game}.", en: "Your challenge: stay zen. Start gently with {game}." },
      act_more:       { fr: "Ton défi : oser te lancer. À {game}, il faut répondre vite !", en: "Your challenge: dare to jump in. In {game}, you have to answer fast!" },
      try_new:        { fr: "Ton défi : l'aventure ! Tu n'as encore jamais joué à {game}.", en: "Your challenge: adventure! You've never played {game} yet." },
      ask_help:       { fr: "Ton défi : demander un coup de main. Dans {game}, essaie le bouton d'aide !", en: "Your challenge: ask for a hand. In {game}, try the help button!" },
      check_progress: { fr: "Ton défi : regarder tes progrès. Va voir tes statistiques !", en: "Your challenge: check your progress. Go and look at your statistics!" },
      explorer:   { fr: "Tu aimes découvrir : essaie {game}, tu n'y as jamais joué !", en: "You love discovering: try {game}, you've never played it!" },
      achiever:   { fr: "Tu aimes aller jusqu'au bout : continue {game} et vise le niveau suivant !", en: "You like seeing things through: carry on with {game} and aim for the next level!" },
      architect:  { fr: "Tu aimes comprendre : {game} est un vrai casse-tête de calcul.", en: "You like understanding: {game} is a real number puzzle." },
      spectateur: { fr: "Tu aimes observer : à {game}, tes yeux et ta mémoire vont faire des merveilles.", en: "You like watching: in {game}, your eyes and memory will work wonders." },
      noEgo:      { fr: "Fais Ego KibooM pour que KibooM te propose des jeux rien que pour toi !", en: "Do Ego KibooM so KibooM can suggest games just for you!" },
    },
  },
};
