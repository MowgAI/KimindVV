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
    $("player-btn").textContent = "👤 " + (Store.player || T.stats.noPlayer);
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
      b.addEventListener("click", () => { Store.setPlayer(name); dlg.close(); renderPlayer(); if (then) then(); });
      list.append(b);
    });
    const input = $("player-name");
    input.value = "";
    input.placeholder = T.stats.namePlaceholder;
    $("player-form").onsubmit = e => {
      e.preventDefault();
      if (!input.value.trim()) return;
      Store.setPlayer(input.value);
      dlg.close();
      renderPlayer();
      if (then) then();
    };
    dlg.showModal();
    input.focus();
  }

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
  }

  /* ---------- Export ---------- */
  const atom = s => (/^[a-z][a-zA-Z0-9_]*$/.test(String(s)) ? String(s) : "'" + String(s).replace(/'/g, "\\'") + "'");
  const COLOUR_NAMES = { blue: "blue", green: "green", red: "red", yellow: "yellow" };

  // Faits Prolog au format de la BK de Kiboom (bkKiboomGenerale.pl), plus quelques faits
  // propres à l'application : game/2, level/2, chaos_measure/2, layout/2, help_used/4,
  // instance_success/2, kijun_try/4, kijun_direction/3, kijun_colour_order/2, kimind_game/6.
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
      line("list_of_cards(" + I + ", [" + i.cards.join(", ") + "]).");
      line("layout(" + I + ", " + i.layout + ").");
      line("chaos_measure(" + I + ", " + i.chaos + ").");
      // KiJun : correct_answer donne la somme de chaque couleur (étape 2) ; les sens demandés
      // et l'ordre des couleurs attendu sont dans kijun_direction/3 et kijun_colour_order/2.
      Object.keys(COLOUR_NAMES).forEach(c => line("correct_answer(" + I + ", " + c + ", " + i.correct[c] + ")."));
      if (i.possible) Object.keys(COLOUR_NAMES).forEach(c => line("possible_answers(" + I + ", " + c + ", [" + i.possible[c].join(", ") + "])."));
      if (i.dir1) {
        line("kijun_direction(" + I + ", step1, " + (i.dir1 === "asc" ? "increasing" : "decreasing") + ").");
        line("kijun_direction(" + I + ", step3, " + (i.dir3 === "asc" ? "increasing" : "decreasing") + ").");
        line("kijun_colour_order(" + I + ", [" + i.correctOrder.join(", ") + "]).");
      }
      i.tries.forEach((t, k) => {
        // Essai d'une étape de KiJun : kijun_try(Instance, Essai, Étape, Réussi).
        if (t.step) line("kijun_try(" + I + ", try_" + k + ", step" + t.step + ", " + t.success + ").");
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
    $("stats-clear").textContent = T.stats.clear;
    if (!$("stats-screen").hidden) openStats();
  }

  function init(getContext) {
    context = getContext;
    $("player-btn").addEventListener("click", () => askPlayer());
    $("stats-player").addEventListener("change", renderStats);
    $("stats-menu").addEventListener("click", () => { location.hash = ""; });
    $("stats-export-pl").addEventListener("click", () => download("kimind-donnees.pl", prolog(), "text/plain"));
    $("stats-export-json").addEventListener("click", () => download("kimind-donnees.json", JSON.stringify(Store.data, null, 2), "application/json"));
    $("stats-clear").addEventListener("click", () => { if (confirm(T.stats.clearConfirm)) { Store.clear(); openStats(); } });
  }

  return { init, texts, openStats, ensurePlayer, askPlayer, prolog, MOODS };
})();
