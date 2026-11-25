/* L'enquête de KibooM : une analyse des traces de Kimba, quand l'enfant a assez joué (au moins
   15 exercices, dont au moins 4 ratés et 4 réussis). Elle reprend la chaîne des travaux sur Kimba :
   traces → apprentissage de règles → explications avec la BK individuelle → résultats.

   1. Les traces, avec la BK classique : pour chaque exercice de Kimba, des propriétés (littéraux)
      découpées comme dans bkKiboomGenerale.pl : quantity_of_cards (very_few ≤ 5, few < 8,
      average < 12, many), level_type, chaos_type, number_of_colours, contains_family (couleur =
      famille), contains_families (deux familles ensemble), six_nine_presented,
      four_legged_presented (has_character + number_legs), crowded_colour ; et l'état du moment :
      mood_before, late_in_session, after_failure, evening.
   2. L'apprentissage (léger, dans le navigateur) : exemples positifs has_failed(I, Joueur) (exercices
      ratés ou abandonnés), négatifs (réussis). On essaie toutes les clauses d'un à trois littéraux,
      notées comme une règle d'ILP (positifs et négatifs couverts, précision lissée de Laplace,
      couverture minimale), puis on garde un petit ensemble par couverture séquentielle.
   3. Les explications : pour chaque règle, la piste (fonctionnelle, psychologique, diagnostic)
      choisie et classée d'après Ego KibooM : type de joueur, personnalité, peurs, humeur.
   4. L'écran : « Indice n° 1… » ; et une vue chercheur dans les statistiques (règles en Prolog),
      avec un export des exemples et des littéraux pour un apprentissage ILP hors de l'appli.
   Textes : lang/ego.js (EGO.enquete) et T.enquete. */
const Enquete = (() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const GAME = "kimba";
  const MIN = { total: 15, pos: 4, neg: 4 };
  const FOUR_LEGGED = ["b4", "g3", "g4", "g10"];    // chien, dino3, dino4, dino10 (BK : number_legs = 4)
  const COLOUR = { b: "blue", g: "green", r: "red", y: "yellow" };
  let T = null;

  const lang = () => (document.documentElement.lang === "en" ? "en" : "fr");
  const saved = () => (Store.data.enquiries || (Store.data.enquiries = []));
  const lastEgo = (player, kind) => (Store.data.ego || []).filter(r => r.player === player && (r.kind || "style") === kind).slice(-1)[0] || null;

  /* ---------- 1. Les traces : exemples et littéraux ---------- */
  // Exercices de Kimba d'un joueur avec au moins un essai (réussis, ratés ou abandonnés en cours de
  // route). Un exercice quitté sans aucun essai (l'enfant est juste passé par l'écran) ne compte pas.
  function examples(player) {
    return Store.data.instances.filter(i => i.player === player && i.game === GAME && (i.tries || []).length);
  }
  const failed = i => !!i.ragequit || !i.success;

  // Les littéraux vrais pour un exercice (clés « prédicat:valeur »).
  function literals(inst, player) {
    const L = new Set(), cards = inst.cards || [], n = cards.length;
    L.add("quantity_of_cards:" + (n <= 5 ? "very_few" : n < 8 ? "few" : n < 12 ? "average" : "many"));
    L.add("level_type:" + (inst.level <= 3 ? "easy" : inst.level <= 6 ? "medium" : "hard"));
    L.add("chaos_type:" + (inst.chaos > 60 ? "high" : "low"));
    const cols = [...new Set(cards.map(c => COLOUR[c[0]]))].sort();
    L.add("number_of_colours:" + cols.length);
    cols.forEach(c => L.add("contains_family:" + c));
    for (let a = 0; a < cols.length; a++) for (let b = a + 1; b < cols.length; b++) L.add("contains_families:" + cols[a] + "-" + cols[b]);
    if (cards.some(c => /^.(6|9)$/.test(c))) L.add("six_nine_presented");
    if (cards.some(c => FOUR_LEGGED.includes(c))) L.add("four_legged_presented");
    const count = {};
    cards.forEach(c => { count[c[0]] = (count[c[0]] || 0) + 1; });
    if (Object.values(count).some(k => k >= 4)) L.add("crowded_colour");
    // L'état du moment : humeur dite dans le quart d'heure avant, partie longue, échec juste avant, soir.
    const mood = Store.data.states.filter(s => s.player === player && s.time <= inst.start && inst.start - s.time < 15 * 60000).slice(-1)[0];
    if (mood && (mood.state === "tired" || mood.state === "unhappy")) L.add("mood_before:" + mood.state);
    const all = Store.data.instances.filter(i => i.player === player).sort((a, b) => a.start - b.start);
    const k = all.indexOf(inst);
    let start = inst.start;
    for (let j = k - 1; j >= 0 && start - (all[j].end || all[j].start) < 10 * 60000; j--) start = all[j].start;
    if (inst.start - start > 20 * 60000) L.add("late_in_session");
    const prev = all.slice(0, k).reverse().find(i => i.game === GAME && (i.tries || []).length);
    if (prev && failed(prev)) L.add("after_failure");
    if (new Date(inst.start).getHours() >= 19) L.add("evening");
    return L;
  }

  function status(player) {
    const ex = examples(player), pos = ex.filter(failed).length;
    return { total: ex.length, pos, neg: ex.length - pos, ready: ex.length >= MIN.total && pos >= MIN.pos && ex.length - pos >= MIN.neg };
  }

  /* ---------- 2. L'apprentissage des règles ---------- */
  // Deux littéraux du même prédicat à valeur unique ne vont pas ensemble (beaucoup ET peu de cartes).
  const pred = l => l.split(":")[0];
  const SINGLE = ["quantity_of_cards", "level_type", "chaos_type", "number_of_colours", "mood_before"];
  function compatible(ls) {
    const p = ls.map(pred);
    if (SINGLE.some(s => p.filter(x => x === s).length > 1)) return false;
    if (p.filter(x => x === "contains_family" || x === "contains_families").length > 1) return false;
    return true;
  }

  function learn(player) {
    const ex = examples(player).map(i => ({ i, lits: literals(i, player), pos: failed(i) }));
    const P = ex.filter(e => e.pos).length, N = ex.length - P;
    const base = P / Math.max(1, ex.length);
    const freq = {};
    ex.forEach(e => e.lits.forEach(l => { freq[l] = (freq[l] || 0) + 1; }));
    const lits = Object.keys(freq).filter(l => freq[l] >= 2 && freq[l] < ex.length);   // ni rares, ni toujours vrais
    const clauses = [];
    for (let a = 0; a < lits.length; a++) {
      clauses.push([lits[a]]);
      for (let b = a + 1; b < lits.length; b++) {
        if (compatible([lits[a], lits[b]])) clauses.push([lits[a], lits[b]]);
        for (let c = b + 1; c < lits.length; c++) if (compatible([lits[a], lits[b], lits[c]])) clauses.push([lits[a], lits[b], lits[c]]);
      }
    }
    const covers = (cl, e) => cl.every(l => e.lits.has(l));
    let remaining = ex.filter(e => e.pos);
    const rules = [];
    while (rules.length < 4 && remaining.length >= 3) {
      let best = null;
      for (const cl of clauses) {
        const p = remaining.filter(e => covers(cl, e)).length;
        if (p < 3) continue;                                            // au moins 3 nouvelles erreurs expliquées
        const pAll = ex.filter(e => e.pos && covers(cl, e)).length, n = ex.filter(e => !e.pos && covers(cl, e)).length;
        if (pAll < (cl.length === 3 ? 4 : 3)) continue;                // règle longue : plus de preuves
        const acc = (pAll + 1) / (pAll + n + 2);                       // précision lissée (Laplace)
        if (acc < Math.max(0.6, base + 0.1)) continue;               // nettement mieux que le hasard
        const score = acc + 0.02 * p - 0.06 * (cl.length - 1);         // préférer couvrir plus, et plus court
        if (!best || score > best.score) best = { lits: cl, p: pAll, n, acc: Math.round(acc * 100) / 100, score };
      }
      if (!best) break;
      rules.push(best);
      remaining = remaining.filter(e => !covers(best.lits, e));
    }
    return { total: ex.length, pos: P, neg: N, rules };
  }

  /* ---------- 3. Les explications, avec la BK individuelle ---------- */
  function profile(player) {
    const style = lastEgo(player, "style"), pers = lastEgo(player, "personality");
    const type = style && style.percents ? Object.keys(style.percents).sort((a, b) => style.percents[b] - style.percents[a])[0] : null;
    const fears = pers && pers.likes && Array.isArray(pers.likes.fears) ? pers.likes.fears.filter(f => f !== "none") : [];
    const tr = pers ? pers.traits : {};
    return { type, fears, emotivity: tr.emotivity || 0, neuroticism: tr.neuroticism || 0 };
  }
  // Pour une règle : les pistes possibles (une par littéral), avec leur priorité selon le profil ;
  // on garde la plus forte.
  function explainRule(rule, pr) {
    const cands = rule.lits.map(l => {
      const [p, v] = l.split(":");
      let key = null, x = null, y = null, bonus = 0;
      if (p === "quantity_of_cards") {
        if (v === "few" || v === "very_few") { key = pr.type === "explorer" ? "few_cards_explorer" : "few_cards"; if (pr.type === "explorer") bonus = 1.5; }
        else { key = "many_cards"; if (pr.type === "architect") bonus = 1; }
      } else if (p === "chaos_type" && v === "high") { key = "disorder"; if (pr.type === "spectateur") bonus = 1.5; if (pr.type === "architect") bonus = 1; }
      else if (p === "contains_family") {
        x = v;
        if (pr.fears.includes(v)) { key = "fear"; bonus = 3; } else { key = "family"; if (pr.type === "achiever") bonus = 1.5; }
      } else if (p === "contains_families") {
        [x, y] = v.split("-");
        const feared = [x, y].find(f => pr.fears.includes(f));
        if (feared) { key = "fear"; x = feared; bonus = 3; } else { key = "pair"; if (pr.type === "achiever") bonus = 1.5; }
      } else if (p === "six_nine_presented") key = "six_nine";
      else if (p === "four_legged_presented") key = "four_legged";
      else if (p === "crowded_colour") { key = "crowded"; if (pr.type === "architect") bonus = 1; }
      else if (p === "number_of_colours" && v !== "2") { key = "colours"; if (pr.type === "spectateur" || pr.type === "explorer") bonus = 1; }
      else if (p === "mood_before") { key = v; bonus = 1 + (pr.neuroticism >= 0.67 ? 1 : 0); }
      else if (p === "late_in_session") { key = "late"; if (pr.neuroticism >= 0.67) bonus = 1; }
      else if (p === "after_failure") { key = pr.emotivity >= 0.67 ? "after_failure_emo" : "after_failure"; if (pr.emotivity >= 0.67) bonus = 1.5; }
      else if (p === "evening") key = "evening";
      else if (p === "level_type" && v === "hard") key = "level";
      return key ? { key, x, y, bonus } : null;
    }).filter(Boolean);
    return cands.sort((a, b) => b.bonus - a.bonus)[0] || null;
  }

  // Lance l'enquête et la garde (Store.data.enquiries).
  function run(player) {
    const res = learn(player), pr = profile(player);
    res.rules.forEach(r => { r.explain = explainRule(r, pr); });
    // La piste la plus probable d'abord : priorité donnée par le profil, puis précision de la règle.
    res.rules.sort((a, b) => ((b.explain ? b.explain.bonus : 0) - (a.explain ? a.explain.bonus : 0)) || (b.acc - a.acc));
    const rec = { id: "enq_" + Date.now().toString(36), player, time: Date.now(), game: GAME, total: res.total, pos: res.pos, neg: res.neg,
      profile: pr, rules: res.rules.map(r => ({ lits: r.lits, p: r.p, n: r.n, acc: r.acc, explain: r.explain })) };
    saved().push(rec);
    Store.save();
    return rec;
  }

  /* ---------- Les phrases ---------- */
  function litText(l) {
    const L = lang(), E = EGO.enquete, [p, v] = l.split(":");
    if (p === "contains_family") return E.lit.contains_family[L].replace("{x}", E.families[v][L]);
    if (p === "contains_families") { const [a, b] = v.split("-"); return E.lit.contains_families[L].replace("{x}", E.families[a][L]).replace("{y}", E.families[b][L]); }
    return (E.lit[l] || E.lit[p] || { [L]: l })[L];
  }
  function ruleText(r) {
    const parts = r.lits.map(litText);
    const when = parts.length > 1 ? parts.slice(0, -1).join(", ") + T.enquete.and + parts[parts.length - 1] : parts[0];
    return T.enquete.rule.replace("{when}", when).replace("{p}", r.p).replace("{t}", r.p + r.n);
  }
  function explainText(x) {
    if (!x) return "";
    const L = lang(), E = EGO.enquete;
    return E.explain[x.key][L].replace("{x}", x.x ? E.families[x.x][L] : "").replace("{y}", x.y ? E.families[x.y][L] : "").replace("{c}", x.x ? E.colourNames[x.x][L] : "");
  }
  // En Prolog : has_failed(I, joueur) :- quantity_of_cards(I, many), six_nine_presented(I).
  function prologLit(l) {
    const [p, v] = l.split(":");
    if (v === undefined) return p + "(I)";
    if (p === "contains_families") { const [a, b] = v.split("-"); return p + "(I, " + a + ", " + b + ")"; }
    return p + "(I, " + v + ")";
  }
  const atom = s => (/^[a-z][a-zA-Z0-9_]*$/.test(s) ? s : "'" + String(s).replace(/'/g, "\\'") + "'");
  const prologRule = (r, player) => "has_failed(I, " + atom(Store.playerId(player)) + ") :- " + r.lits.map(prologLit).join(", ") + ".";

  /* ---------- L'écran de l'enquête (#enquete) ---------- */
  function render() {
    const player = Store.player, st = status(player), box = $("enquete-body");
    $("enquete-title").textContent = "🔍 " + T.enquete.title;
    $("enquete-menu").textContent = "☰ " + T.menu;
    if (!st.ready) {
      box.innerHTML = `<p class="enq-lead">${T.enquete.notYet.replace("{n}", Math.max(0, MIN.total - st.total)).replace("{pos}", st.pos).replace("{neg}", st.neg)}</p>
        <p class="ego-actions"><button class="act" type="button" data-go="kimba">${T.enquete.play}</button></p>`;
      box.querySelector("[data-go]").onclick = () => { location.hash = "kimba"; };
      return;
    }
    // Nouvelle enquête seulement s'il y a de nouveaux exercices ; sinon, la dernière.
    const prev = saved().filter(e => e.player === player && e.game === GAME).slice(-1)[0];
    const rec = prev && prev.total === st.total ? prev : run(player), av = Store.avatar;
    const items = rec.rules.map((r, k) => `<li class="enq-clue">
        <h3>🔍 ${T.enquete.clue.replace("{n}", k + 1)}${k === 0 && r.explain && r.explain.bonus > 0 ? ` <span class="enq-best">${T.enquete.best}</span>` : ""}</h3>
        <p>${ruleText(r)}</p>
        ${r.explain ? `<p class="enq-why">💡 ${explainText(r.explain)}</p>` : ""}
      </li>`).join("");
    const needBreak = rec.rules.some(r => r.explain && ["tired", "unhappy", "late"].includes(r.explain.key));
    box.innerHTML = `<div class="enq-head">${av ? `<span class="card face enq-avatar" style="background-image:url(assets/cards/${av}.webp)"></span>` : `<span class="enq-loupe">🕵️</span>`}
        <p class="enq-lead">${T.enquete.intro.replace("{n}", rec.total).replace("{pos}", rec.pos)}</p></div>
      ${items ? `<ol class="enq-clues">${items}</ol>` : `<p class="enq-none">🌟 ${T.enquete.none}</p>`}
      <p class="ego-change">🌱 ${T.enquete.mayChange}</p>
      <p class="ego-actions">
        ${needBreak ? `<button class="act" type="button" data-a="break">🌈 ${T.enquete.takeBreak}</button>` : ""}
        <button class="act${needBreak ? " ghost" : ""}" type="button" data-go="kimba">${T.enquete.play}</button>
        <button class="act ghost" type="button" data-a="menu">☰ ${T.menu}</button></p>`;
    box.querySelector("[data-go]").onclick = () => { location.hash = "kimba"; };
    box.querySelector("[data-a=menu]").onclick = () => { location.hash = ""; };
    const br = box.querySelector("[data-a=break]");
    if (br) br.onclick = () => Coach.advise("tired");
    if (typeof config !== "undefined" && config.voice) Voice.speak(box.textContent.replace(/[🔍💡🌱🌟🌈☰]/g, ""), { lang: lang() });
  }

  // Une invitation dans l'écran de Kimba, quand l'enquête est possible et qu'il y a du nouveau
  // (première fois, ou au moins 5 exercices de plus depuis la dernière enquête).
  function offer(game, el) {
    if (!el || !T) return;
    el.textContent = "";
    if (game !== GAME || !Store.player) return;
    const st = status(Store.player), last = saved().filter(e => e.player === Store.player && e.game === GAME).slice(-1)[0];
    if (!st.ready || (last && st.total < last.total + 5)) return;
    el.innerHTML = `<div class="enq-offer"><span>🕵️</span><p>${T.enquete.offer}</p><button class="act" type="button">${T.enquete.see}</button></div>`;
    el.querySelector("button").onclick = () => { location.hash = "enquete"; };
  }
  const available = () => !!Store.player && (status(Store.player).ready || saved().some(e => e.player === Store.player));

  /* ---------- Vue chercheur et export ---------- */
  // Les enquêtes de tous les joueurs, avec les règles en Prolog et leurs chiffres.
  function researcherHTML() {
    const all = saved();
    if (!all.length) return "";
    return `<h3>🔬 ${T.enquete.researcher}</h3><p class="stats-note">${T.enquete.researcherNote}</p>` + all.slice().reverse().map(e =>
      `<details class="enq-research"><summary>${e.player} · ${new Date(e.time).toLocaleString()} · ${e.total} ex. (${e.pos} +, ${e.neg} −)${e.profile && e.profile.type ? " · " + e.profile.type : ""}</summary>
        <pre>${e.rules.length ? e.rules.map(r => `${prologRule(r, e.player)}\n%   p = ${r.p}, n = ${r.n}, précision lissée = ${r.acc}${r.explain ? ", piste : " + r.explain.key + (r.explain.bonus ? " (priorité profil " + r.explain.bonus + ")" : "") : ""}`).join("\n") : "% aucune règle"}</pre></details>`).join("");
  }
  // Fichier Prolog pour un apprentissage ILP hors de l'appli : exemples positifs et négatifs
  // (has_failed/2), et les littéraux de chaque exercice, pour tous les joueurs.
  function exportILP() {
    const out = [];
    const line = s => out.push(s);
    line(":- encoding(utf8).");
    line("% KibooM : exemples et littéraux pour un apprentissage ILP sur Kimba (" + new Date().toISOString() + ").");
    line("% Exemples : pos(has_failed(Exercice, Joueur)) pour un exercice raté ou abandonné, neg(...) pour un exercice réussi.");
    line("% Littéraux (découpages de bkKiboomGenerale.pl) : quantity_of_cards/2, level_type/2, chaos_type/2, number_of_colours/2,");
    line("% contains_family/2, contains_families/3, six_nine_presented/1, four_legged_presented/1, crowded_colour/1,");
    line("% mood_before/2, late_in_session/1, after_failure/1, evening/1. Les cartes : list_of_cards/2 (voir l'export des statistiques).");
    line(":- style_check(-discontiguous).");
    line(":- discontiguous pos/1, neg/1.");
    Store.data.players.forEach(p => {
      examples(p).forEach(i => {
        const I = atom(i.id), S = atom(Store.playerId(p));
        line("");
        line((failed(i) ? "pos" : "neg") + "(has_failed(" + I + ", " + S + ")).");
        line("list_of_cards(" + I + ", [" + (i.cards || []).join(", ") + "]).");
        literals(i, p).forEach(l => line(prologLit(l).replace("(I", "(" + I) + "."));
      });
    });
    return out.join("\n") + "\n";
  }

  /* ---------- Démarrage ---------- */
  function texts(t) { T = t; if ($("enquete-screen") && !$("enquete-screen").hidden) render(); }
  function start(t) { T = t; render(); }
  function init() { $("enquete-menu").addEventListener("click", () => { location.hash = ""; }); }

  return { init, texts, start, offer, available, status, learn, literals, run, researcherHTML, exportILP, prologRule };
})();
