/* Personnalisation : le joueur, les humeurs choisies par l'enfant et la page Statistiques
   de tous les jeux, avec l'export des données en faits Prolog au format de la théorie du
   domaine (BK) de Kiboom, et en JSON. Les données sont dans js/store.js. */
const Stats = (() => {
  "use strict";
  const $ = id => document.getElementById(id);
  let T = null;
  let context = () => ({});          // jeu et exercice en cours, pour dater les humeurs

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  /* ---------- Les humeurs ---------- */
  // Chaque humeur va dans un des trois états de la BK : émotionnel, physique ou cognitif.
  const MOODS = [
    { id: "calm", emoji: "😌", kind: "emotional_state" },
    { id: "tired", emoji: "😴", kind: "physical_state" },
    { id: "focused", emoji: "🧐", kind: "cognitive_state" },
    { id: "happy", emoji: "😀", kind: "emotional_state" },
    { id: "unhappy", emoji: "😞", kind: "emotional_state" },
  ];

  function renderMood() {
    const bar = $("mood-bar");
    bar.textContent = "";
    bar.append(el("span", "mood-lbl", T.stats.moodQuestion));
    MOODS.forEach(m => {
      const b = el("button", "mood", m.emoji);
      b.type = "button";
      b.title = T.stats.moods[m.id];
      b.setAttribute("aria-label", T.stats.moods[m.id]);
      b.addEventListener("click", () => {
        Store.addState(m.id, context());
        bar.querySelectorAll(".mood").forEach(x => x.classList.remove("on"));
        b.classList.add("on");
        const said = bar.querySelector(".mood-said");
        said.textContent = T.stats.moodThanks(T.stats.moods[m.id]);
      });
      bar.append(b);
    });
    bar.append(el("span", "mood-said"));
  }

  /* ---------- Le joueur ---------- */
  function renderPlayer() {
    // L'avatar du joueur (personnage choisi dans Ego KibooM) à la place du 👤.
    const btn = $("player-btn"), av = Store.avatar;
    btn.textContent = "";
    if (av) {
      const img = el("span", "card face player-avatar");
      img.style.backgroundImage = "url(assets/cards/" + av + ".webp)";
      btn.append(img, document.createTextNode(" " + Store.player));
    } else btn.textContent = "👤 " + (Store.player || T.stats.noPlayer);
  }

  // Demande le prénom (ou pseudo) ; `then` est appelé une fois le joueur choisi.
  function askPlayer(then) {
    const dlg = $("dlg-player");
    $("player-title").textContent = T.stats.whoPlays;
    $("player-hint").textContent = T.stats.playerHint;
    $("player-ok").textContent = T.stats.ok;
    const list = $("player-list");
    list.textContent = "";
    Store.data.players.forEach(name => {
      const b = el("button", "act ghost", name);
      b.type = "button";
      b.addEventListener("click", () => { Store.setPlayer(name); dlg.close(); renderPlayer(); playerChanged(); if (then) then(); });
      list.append(b);
    });
    const input = $("player-name");
    input.value = "";
    input.placeholder = T.stats.namePlaceholder;
    $("player-form").onsubmit = e => {
      e.preventDefault();
      if (!input.value.trim()) return;
      // Nouveau joueur : nouvelle BK individuelle (vide) ; on l'emmène vers Ego KibooM pour la remplir.
      const isNew = !Store.data.players.some(p => Store.playerId(p) === Store.playerId(input.value.trim()));
      Store.setPlayer(input.value);
      dlg.close();
      renderPlayer();
      playerChanged();
      if (isNew) {
        if (typeof Home !== "undefined") Home.close();
        // Déjà sur Ego (#ego) : pas de changement d'adresse, on redessine l'écran nous-mêmes.
        if (location.hash === "#ego") window.dispatchEvent(new Event("hashchange")); else location.hash = "ego";
        return;
      }
      if (then) then();
    };
    dlg.showModal();
    input.focus();
  }

  // Le joueur a changé : les écrans qui dépendent de lui (Ego KibooM) se redessinent.
  const playerChanged = () => window.dispatchEvent(new Event("kiboom-player"));

  // Avant de jouer, il faut un joueur.
  function ensurePlayer(then) { if (Store.player) then(); else askPlayer(then); }

  /* ---------- La page Statistiques ---------- */
  const pct = (a, b) => (b ? Math.round(100 * a / b) + " %" : "—");
  const mean = xs => (xs.length ? Math.round(10 * xs.reduce((t, x) => t + x, 0) / xs.length) / 10 : null);

  function renderStats() {
    const who = $("stats-player").value || Store.player;
    const box = $("stats-body");
    box.textContent = "";
    const insts = Store.data.instances.filter(i => i.player === who);
    const games = Store.data.kimind.filter(g => g.player === who);
    const states = Store.data.states.filter(s => s.player === who);
    if (!insts.length && !games.length && !states.length) { box.append(el("p", "history-empty", T.stats.empty)); return; }

    // Jeux « une réponse par couleur » : un exercice par ligne de résumé.
    const table = el("table", "stats-table");
    const head = el("tr");
    T.stats.cols.forEach(c => head.append(el("th", "", c)));
    table.append(head);
    GAMES.forEach(g => {
      const list = insts.filter(i => i.game === g.id);
      if (!list.length) return;
      const done = list.filter(i => i.tries.length);
      const ok = done.filter(i => i.success);
      const autonomous = ok.filter(i => i.tries.every(t => t.autonomous));
      const times = [].concat(...done.map(i => i.tries.map(t => t.time)));
      const tr = el("tr");
      [T.games[g.id].name, list.length, pct(ok.length, list.length), pct(autonomous.length, list.length),
        list.reduce((t, i) => t + i.help, 0), list.filter(i => i.ragequit).length,
        mean(times) === null ? "—" : mean(times) + " s", Math.max(...list.map(i => i.level))]
        .forEach(v => tr.append(el("td", "", v)));
      table.append(tr);
    });
    // Versions de Kimind : une partie par ligne de résumé.
    VERSIONS.forEach(v => {
      const list = games.filter(g => g.version === v.id);
      if (!list.length) return;
      const won = list.filter(g => g.won);
      const tr = el("tr");
      [T.versions[v.id].name, list.length, pct(won.length, list.length), "—", "—", list.length - won.length,
        mean(won.map(g => g.duration)) === null ? "—" : mean(won.map(g => g.duration)) + " s", T.levels[list[list.length - 1].level] || "—"]
        .forEach(x => tr.append(el("td", "", x)));
      table.append(tr);
    });
    box.append(el("h3", "", T.stats.byGame), table);
    box.append(el("p", "stats-note", T.stats.note));

    // Aides : combien de fois chaque sorte a servi, et la réussite des exercices où elle a servi.
    const helped = insts.filter(i => i.helps && i.helps.length);
    if (helped.length) {
      const ul = el("ul", "stats-list");
      Object.keys(T.colourGames.helpTypes).forEach(k => {
        const with_ = helped.filter(i => i.helps.some(h => h.type === k));
        if (with_.length) ul.append(el("li", "", T.stats.helpLine(T.colourGames.helpTypes[k], with_.reduce((t, i) => t + i.helps.filter(h => h.type === k).length, 0), pct(with_.filter(i => i.success).length, with_.length))));
      });
      box.append(el("h3", "", T.stats.helps), ul);
    }

    // Humeurs : combien de fois chacune, et la dernière.
    if (states.length) {
      const p = el("p", "stats-moods");
      MOODS.forEach(m => {
        const n = states.filter(s => s.state === m.id).length;
        if (n) p.append(el("span", "stats-mood", m.emoji + " " + T.stats.moods[m.id] + " × " + n));
      });
      box.append(el("h3", "", T.stats.moodsTitle), p);
    }
  }

  function openStats() {
    const sel = $("stats-player");
    sel.textContent = "";
    Store.data.players.forEach(name => sel.append(new Option(name, name)));
    if (Store.player) sel.value = Store.player;
    renderStats();
    // Vue chercheur : les enquêtes sur Kimba (règles apprises, en Prolog).
    const research = typeof Enquete !== "undefined" ? Enquete.researcherHTML() : "";
    $("stats-research").innerHTML = research;
    $("stats-research").hidden = !research;
  }

  /* ---------- Export ---------- */
  const atom = s => (/^[a-z][a-zA-Z0-9_]*$/.test(String(s)) ? String(s) : "'" + String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'");
  const COLOUR_NAMES = { blue: "blue", green: "green", red: "red", yellow: "yellow" };

  // Faits Prolog au format de la BK de Kiboom (bkKiboomGenerale.pl), plus quelques faits
  // propres à l'application : game/2, level/2, chaos_measure/2, layout/2, help_used/4,
  // instance_success/2, kijun_try/4, kijun_direction/3, kijun_colour_order/2,
  // pyramid_target/2, pyramid_rows/2, pyramid_addition/5, memory_pairs/2, memory_show_time/2,
  // memory_flip/4, balance_question/6, balance_time_limit/2, balance_trap/1,
  // number_line_question/6, calc_target/2, calc_operations/2, calc_solution/2, calc_attempt/5,
  // tile_turn/5, tile_hand_size/2, tile_opponent_per_turn/2, tile_cards_left/3, duel_trick/6,
  // duel_objective/2, duel_opponent/2, duel_opponent_cards/2, duel_tricks_won/2, kimind_game/6.
  function prolog() {
    const d = Store.data, out = [];
    const line = s => out.push(s);
    line("% Données exportées de Kimind (" + new Date().toISOString() + ").");
    line("% Faits au format de la théorie du domaine de Kiboom ; à charger avec bkKiboomGenerale.pl.");
    line(":- style_check(-discontiguous).");
    line("");
    d.players.forEach(p => line("student(" + atom(Store.playerId(p)) + ")."));
    line("");
    d.instances.forEach(i => {
      const I = atom(i.id), S = atom(Store.playerId(i.player || "joueur"));
      line("% " + i.game + ", niveau " + i.level + ", " + new Date(i.start).toISOString());
      line("instance_student(" + I + ", " + S + ").");
      line("game(" + I + ", " + i.game + ").");
      line("level(" + I + ", " + i.level + ").");
      line("exercise_number(" + I + ", " + i.number + ").");
      line("list_of_cards(" + I + ", [" + (i.cards || []).join(", ") + "]).");
      line("layout(" + I + ", " + i.layout + ").");
      line("chaos_measure(" + I + ", " + i.chaos + ").");
      // KiJun : correct_answer donne la somme de chaque couleur (étape 2) ; les sens demandés
      // et l'ordre des couleurs attendu sont dans kijun_direction/3 et kijun_colour_order/2.
      if (i.correct) Object.keys(COLOUR_NAMES).forEach(c => line("correct_answer(" + I + ", " + c + ", " + i.correct[c] + ")."));
      if (i.possible) Object.keys(COLOUR_NAMES).forEach(c => line("possible_answers(" + I + ", " + c + ", [" + i.possible[c].join(", ") + "])."));
      // Kipharaon : nombre cible et rangées de la pyramide ; chaque addition proposée.
      if (i.target !== undefined) {
        line("pyramid_target(" + I + ", " + i.target + ").");
        line("pyramid_rows(" + I + ", " + i.rows + ").");
      }
      // KiDory : nombre de paires et temps pendant lequel les cartes sont montrées.
      if (i.questions !== undefined) {
        line("balance_time_limit(" + I + ", " + i.limit + ").");
        if (i.trap) line("balance_trap(" + I + ").");
      }
      if (i.calcTarget !== undefined) {
        line("calc_target(" + I + ", " + i.calcTarget + ").");
        line("calc_operations(" + I + ", [" + i.ops.map(atom).join(", ") + "]).");
        line("calc_solution(" + I + ", " + atom(i.solution) + ").");
      }
      if (i.handSize !== undefined) {
        line("tile_hand_size(" + I + ", " + i.handSize + ").");
        line("tile_opponent_per_turn(" + I + ", " + i.beaPerTurn + ").");
        if (i.cardsLeft !== undefined) line("tile_cards_left(" + I + ", " + i.cardsLeft + ", " + i.beaLeft + ").");
      }
      if (i.objective !== undefined) {
        line("duel_objective(" + I + ", " + i.objective + ").");
        line("duel_opponent(" + I + ", " + i.opponent + ").");
        line("duel_opponent_cards(" + I + ", [" + i.opponentCards.join(", ") + "]).");
        if (i.tricks !== undefined) line("duel_tricks_won(" + I + ", " + i.tricks + ").");
      }
      if (i.pairs !== undefined) {
        line("memory_pairs(" + I + ", " + i.pairs + ").");
        line("memory_show_time(" + I + ", " + i.showTime + ").");
      }
      if (i.dir1) {
        line("kijun_direction(" + I + ", step1, " + (i.dir1 === "asc" ? "increasing" : "decreasing") + ").");
        line("kijun_direction(" + I + ", step3, " + (i.dir3 === "asc" ? "increasing" : "decreasing") + ").");
        line("kijun_colour_order(" + I + ", [" + i.correctOrder.join(", ") + "]).");
      }
      i.tries.forEach((t, k) => {
        // Essai d'une étape de KiJun : kijun_try(Instance, Essai, Étape, Réussi).
        if (t.step) line("kijun_try(" + I + ", try_" + k + ", step" + t.step + ", " + t.success + ").");
        // Kibal : balance_question(Instance, Essai, Cartes zone 1, Cartes zone 2, Zone choisie, Réussi) ;
        // zone choisie : 1, 2, ou none si le temps est écoulé.
        if (t.balance) line("balance_question(" + I + ", try_" + k + ", " + t.balance[0] + ", " + t.balance[1] + ", " + (t.choice === null ? "none" : t.choice + 1) + ", " + t.success + ").");
        // KiPotter : number_line_question(Instance, Essai, Fin de la règle, Repère, Réponse, Réussi).
        if (t.line) line("number_line_question(" + I + ", try_" + k + ", " + t.line.max + ", " + t.line.target + ", " + t.choice + ", " + t.success + ").");
        // Kicompuzzle : calc_attempt(Instance, Essai, Calcul proposé, Valeur, Réussi).
        if (t.expr) line("calc_attempt(" + I + ", try_" + k + ", " + atom(t.expr) + ", " + t.value + ", " + t.success + ").");
        // Kipuzzle : tile_turn(Instance, Essai, Cartes posées, A pioché, A fini son tour alors qu'un coup restait).
        if (t.turn) line("tile_turn(" + I + ", try_" + k + ", " + t.placed + ", " + t.drew + ", " + t.missed + ").");
        // Kiduel : duel_trick(Instance, Essai, Qui commence, Ma carte, Sa carte, Pli gagné).
        if (t.trick) line("duel_trick(" + I + ", try_" + k + ", " + t.leader + ", " + t.mine + ", " + t.hers + ", " + t.success + ").");
        if (t.pair) line("memory_flip(" + I + ", try_" + k + ", [" + t.pair.join(", ") + "], " + t.success + ").");
        if (t.cards) line("pyramid_addition(" + I + ", try_" + k + ", [" + t.cards.join(", ") + "], " + t.sum + ", " + t.success + ").");
        if (t.step === 2 || t.answers) {
          const a = t.answers || t.answer;
          Object.keys(COLOUR_NAMES).forEach(c => line("students_answer(" + I + ", try_" + k + ", " + c + ", " + (a[c] === undefined ? 0 : a[c]) + ")."));
        }
        line("autonomous_during_try(" + I + ", try_" + k + ", " + t.autonomous + ").");
        line("response_time(" + I + ", try_" + k + ", " + t.time + ").");
      });
      // Résultat tel que le jeu le juge (pour KiJun, toutes les étapes comptent, pas seulement les sommes).
      if (!i.ragequit) line("instance_success(" + I + ", " + !!i.success + ").");
      if (i.ragequit) line("ragequit_during_try(" + I + ", try_" + (i.ragequitTry || 0) + ").");
      if (i.help) line("click_on_button_help(" + I + ").");
      (i.helps || []).forEach(h => line("help_used(" + I + ", try_" + h.try + ", " + h.type + ", [" + h.colours.join(", ") + "])."));
      if (i.feedback) line("type_of_feedback_received(" + I + ", " + i.feedback + ").");
      // Qui a choisi l'exercice : student, suggested (proposition de KibooM acceptée) ou ai (mode
      // « KibooM choisit ») ; les règles sur les choix de l'enfant ne valent que pour student.
      line("chosen_by(" + I + ", " + (i.chosenBy || "student") + ").");
      // L'aide est toujours un choix de l'enfant ; KibooM peut seulement la suggérer.
      if (i.helpSuggested) line("help_suggested(" + I + ").");
      // Chrono choisi par l'enfant pendant l'exercice (js/chrono.js) : hidden ou shown (rien : pas de chrono).
      if (i.timer && i.timer !== "none") line("timer_during_instance(" + I + ", " + i.timer + ").");
      line("");
    });
    // Humeurs : le 3e argument est le numéro d'exercice du joueur au moment du clic.
    d.states.forEach(s => {
      const m = MOODS.find(x => x.id === s.state);
      const n = d.instances.filter(i => i.player === s.player && i.start <= s.time).length;
      line(m.kind + "(" + atom(Store.playerId(s.player || "joueur")) + ", " + s.state + ", " + n + ").");
    });
    line("");
    // Parties de Kimind : kimind_game(Joueur, Version, Niveau, Tours, Gagnée, Durée en secondes).
    d.kimind.forEach(g => line("kimind_game(" + atom(Store.playerId(g.player || "joueur")) + ", " + atom(g.version) + ", " + g.level + ", " + g.rounds + ", " + g.won + ", " + g.duration + ")."));
    // Ego KibooM (BK individuelle) : un passage d'un chapitre = un profil daté. On garde tous les
    // passages : la BK individuelle se met à jour et on voit son évolution. Réponse « skip » :
    // l'enfant a préféré ne pas répondre.
    // Tous : ego_profile(Profil, Joueur, Version, Date).
    // Qui je suis : student_age/2, birth_month/2, birth_date_estimate/2, school_class/2, gender/2,
    //   home_language/2 (sur le joueur, d'après le dernier passage) ; ego_answer/3.
    // Personnalité : personality_answer(Profil, Phrase, 0..3 | skip), personality_trait(Profil, Trait, 0..1).
    // Style : ego_answer/3, ego_identifies_with(Profil, Couleur, Valeur), ego_trait(Profil, Caractéristique,
    //   −1..1), learner_type(Profil, Type, %), ego_self_assessment(Profil, agree | partly | disagree | skip),
    //   ego_goal(Profil, Défi, accepted | declined) ; avatar(Joueur, Couleur, Valeur).
    if ((d.ego || []).length) {
      line("");
      line("% Ego KibooM : BK individuelle (qui je suis, personnalité, style de joueur).");
    }
    const kindOf = r => r.kind || "style";
    (d.ego || []).forEach(r => {
      const P = atom(r.id), S = atom(Store.playerId(r.player || "joueur")), K = kindOf(r);
      line("ego_profile(" + P + ", " + S + ", " + atom(r.version) + ", " + atom(new Date(r.time).toISOString()) + ").");
      if (K === "identity") {
        Object.entries(r.answers).forEach(([q, a]) => line("ego_answer(" + P + ", " + atom(q) + ", " + (Array.isArray(a) ? "[" + a.map(atom).join(", ") + "]" : atom(a)) + ")."));
      } else if (K === "personality") {
        r.answers.forEach((a, i) => line("personality_answer(" + P + ", " + atom(EGO.personality[i].id) + ", " + (a === "skip" ? "skip" : a) + ")."));
        // Goûts (« Ce que j'aime ») : ego_like(Profil, Question, Réponse) ; une ligne par réponse cochée.
        Object.entries(r.likes || {}).forEach(([q, a]) => (Array.isArray(a) ? a : [a]).forEach(v => line("ego_like(" + P + ", " + atom(q) + ", " + atom(v) + ").")));
        Object.entries(r.traits).forEach(([k, v]) => { if (v !== null) line("personality_trait(" + P + ", " + k + ", " + v + ")."); });
        // Portrait : les règles de regroupement qui correspondent (avec le dernier style de joueur).
        const style = (d.ego || []).filter(x => x.player === r.player && kindOf(x) === "style").slice(-1)[0];
        const pt = Ego.portraitOf(r, style);
        if (pt.superpower) line("ego_superpower(" + P + ", " + pt.superpower + ").");
        pt.forces.concat(pt.watches).forEach(x => line("ego_portrait(" + P + ", " + x.id + ", " + x.kind + ")."));
      } else {
        r.answers.forEach((a, qi) => line("ego_answer(" + P + ", " + atom(EGO.questions[qi].id) + ", " + (Array.isArray(a) ? "[" + a.map(atom).join(", ") + "]" : atom(a)) + ")."));
        if (r.character) { const [c, v] = r.character.split("-"); line("ego_identifies_with(" + P + ", " + c + ", " + v + ")."); }
        Object.entries(r.traits).forEach(([k, v]) => line("ego_trait(" + P + ", " + atom(k) + ", " + (Math.round(v * 100) / 100) + ")."));
        Object.entries(r.percents).forEach(([k, v]) => line("learner_type(" + P + ", " + k + ", " + v + ")."));
        if (r.selfAssessment) line("ego_self_assessment(" + P + ", " + atom(r.selfAssessment) + ").");
        Object.entries(r.goals || {}).forEach(([g, v]) => line("ego_goal(" + P + ", " + g + ", " + v + ")."));
      }
    });
    // Conseils de KibooM (js/coach.js) : coach_advice(Joueur, N°, Moment, Conseil, Réponse, Date) ;
    // Moment : time, fails, tired, unhappy, late ; Réponse : pause, snooze ou none ; durée de la pause.
    (d.coach || []).forEach((c, n) => {
      const S = atom(Store.playerId(c.player || "joueur"));
      line("coach_advice(" + S + ", " + (n + 1) + ", " + c.trigger + ", " + atom(c.tip) + ", " + (c.response || "none") + ", " + atom(new Date(c.time).toISOString()) + ").");
      if (c.breakSeconds !== undefined) line("coach_break_seconds(" + S + ", " + (n + 1) + ", " + c.breakSeconds + ").");
    });
    // Parcours (js/parcours.js) : mode de chaque joueur (free : il choisit ; auto : KibooM choisit) et
    // aventures proposées et lancées : adventure_step(Joueur, N°, Jeu, Niveau, Raison, Origine, Date).
    Object.entries(d.modes || {}).forEach(([p, m]) => line("parcours_mode(" + atom(Store.playerId(p)) + ", " + m + ")."));
    (d.adventure || []).forEach((s, n) => line("adventure_step(" + atom(Store.playerId(s.player || "joueur")) + ", " + (n + 1) + ", " + atom(s.game) + ", " + (s.level || 0) + ", " + atom(s.why || "none") + ", " + atom(s.from || "home") + ", " + atom(new Date(s.time).toISOString()) + ")."));
    // Chrono en option (js/chrono.js) : choix actuel de chaque joueur et changements datés.
    Object.entries(d.timers || {}).forEach(([p, m]) => line("timer_choice(" + atom(Store.playerId(p)) + ", " + m + ")."));
    (d.timerLog || []).forEach(c => line("timer_change(" + atom(Store.playerId(c.player || "joueur")) + ", " + c.mode + ", " + atom(new Date(c.time).toISOString()) + ")."));
    // Kichallenge (js/kichallenge.js) : kichallenge_run(Joueur, Défi, Difficulté, Temps en secondes
    // (aides et ratés compris), Réussis sur 5, Aides, Record perso) ; un défi arrêté en route :
    // kichallenge_stopped(Joueur, Défi, Difficulté, Exercices finis) ; kichallenge_exercise(Défi, Rang, Exercice).
    (d.challenges || []).forEach(r => {
      const S = atom(Store.playerId(r.player || "joueur")), R = atom(r.id);
      if (r.completed) line("kichallenge_run(" + S + ", " + R + ", " + r.difficulty + ", " + Math.round(r.total / 1000) + ", " + r.list.filter(e => e.ok).length + ", " + r.list.reduce((t, e) => t + e.help, 0) + ", " + !!r.record + ").");
      else line("kichallenge_stopped(" + S + ", " + R + ", " + r.difficulty + ", " + r.list.filter(e => e.closed).length + ").");
      r.list.forEach((e, k) => {
        if (e.inst) line("kichallenge_exercise(" + R + ", " + (k + 1) + ", " + atom(e.inst) + ").");
        // kichallenge_step(Défi, Rang, Jeu, Niveau, Résultat (ok, missed, skipped), Secondes, Aides) : aussi pour Kimind.
        if (e.closed) line("kichallenge_step(" + R + ", " + (k + 1) + ", " + atom(e.game) + ", " + e.level + ", " + (e.ok ? "ok" : e.skipped ? "skipped" : "missed") + ", " + Math.round(e.ms / 1000) + ", " + e.help + ").");
      });
    });
    // Répliques de KibooM (js/repliques.js) : message_shown(Joueur, Exercice ou none, Moment, Réplique, Date) ;
    // child_line(Joueur, Moment, Texte) : une réplique écrite par l'enfant (ses mots, montrés à lui seul).
    (d.replies || []).forEach(r => line("message_shown(" + atom(Store.playerId(r.player || "joueur")) + ", " + (r.inst ? atom(r.inst) : "none") + ", " + r.moment + ", " + atom(r.id) + ", " + atom(new Date(r.time).toISOString()) + ")."));
    (d.lines || []).forEach(l => line("child_line(" + atom(Store.playerId(l.player || "joueur")) + ", " + l.moment + ", " + atom(l.text) + ")."));
    // Ateliers créatifs (js/creatif.js) : rien n'y est noté « bien » ou « mal ».
    // invented_character(Id, Joueur, Tête, Corps, Pieds, Nom) ; invented_character_phrase(Id, Phrase).
    // divergent_round(Id, Joueur, [Cartes], Idées cachées) ; divergent_idea(Id, Carte, Raison) ;
    // divergent_own_idea(Id, Carte, Texte) : une raison inventée par l'enfant.
    (d.creations || []).forEach(c => {
      const S = atom(Store.playerId(c.player || "joueur"));
      line("invented_character(" + atom(c.id) + ", " + S + ", " + c.parts.map(k => atom(k.replace("-", "_"))).join(", ") + ", " + atom(c.name) + ").");
      if (c.phrase) line("invented_character_phrase(" + atom(c.id) + ", " + atom(c.phrase) + ").");
    });
    (d.ideas || []).forEach(r => {
      const S = atom(Store.playerId(r.player || "joueur")), R = atom(r.id);
      line("divergent_round(" + R + ", " + S + ", [" + r.cards.map(k => atom(k.replace("-", "_"))).join(", ") + "], " + r.total + ").");
      r.found.forEach(f => line("divergent_idea(" + R + ", " + atom(f.key.replace("-", "_")) + ", " + f.r + ")."));
      r.own.forEach(o => line("divergent_own_idea(" + R + ", " + atom(o.key.replace("-", "_")) + ", " + atom(o.text) + ")."));
    });
    // Données fixes du joueur, d'après son dernier passage de « Qui je suis ».
    d.players.forEach(p => {
      const r = (d.ego || []).filter(x => x.player === p && kindOf(x) === "identity").slice(-1)[0];
      const S = atom(Store.playerId(p)), a = r ? r.answers : {}, ok = v => v !== undefined && v !== "skip";
      if (ok(a.age)) line("student_age(" + S + ", " + (a.age === "13+" ? 13 : a.age) + ").");
      if (ok(a.birth_month)) line("birth_month(" + S + ", " + a.birth_month + ").");
      if (r && r.birth) line("birth_date_estimate(" + S + ", " + atom(r.birth) + ").");
      if (ok(a.school_class)) line("school_class(" + S + ", " + atom(a.school_class) + ").");
      if (ok(a.gender)) line("gender(" + S + ", " + a.gender + ").");
      if (Array.isArray(a.home_language)) a.home_language.forEach(l => line("home_language(" + S + ", " + l + ")."));
      const av = (d.avatars || {})[p];
      if (av) { const [c, v] = av.split("-"); line("avatar(" + S + ", " + c + ", " + v + ")."); }
    });
    return out.join("\n") + "\n";
  }

  function download(name, text, type) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /* ---------- Textes et démarrage ---------- */
  function texts(t) {
    T = t;
    renderMood();
    renderPlayer();
    $("stats-title").textContent = "📊 " + T.stats.title;
    $("lbl-stats-player").textContent = T.stats.player;
    $("stats-menu").textContent = "☰ " + T.menu;
    $("stats-export-pl").textContent = "⬇ " + T.stats.exportProlog;
    $("stats-export-json").textContent = "⬇ " + T.stats.exportJson;
    $("stats-export-ilp").textContent = "⬇ " + T.enquete.exportIlp;
    $("stats-clear").textContent = T.stats.clear;
    if (!$("stats-screen").hidden) openStats();
  }

  function init(getContext) {
    context = getContext;
    $("player-btn").addEventListener("click", () => askPlayer());
    $("stats-player").addEventListener("change", renderStats);
    $("stats-menu").addEventListener("click", () => { location.hash = ""; });
    $("stats-export-pl").addEventListener("click", () => download("kimind-donnees.pl", prolog(), "text/plain"));
    $("stats-export-ilp").addEventListener("click", () => download("kimba-ilp.pl", Enquete.exportILP(), "text/plain"));
    $("stats-export-json").addEventListener("click", () => download("kimind-donnees.json", JSON.stringify(Store.data, null, 2), "application/json"));
    $("stats-clear").addEventListener("click", () => { if (confirm(T.stats.clearConfirm)) { Store.clear(); openStats(); } });
  }

  return { init, texts, openStats, ensurePlayer, askPlayer, prolog, renderPlayer, MOODS };
})();
