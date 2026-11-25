/* Ego KibooM : la BK individuelle de l'enfant, telle que KibooM la perçoit.
   Étape 1 : un questionnaire (lang/ego.js) de 10 questions en images, puis l'enfant choisit
   le personnage des cartes auquel il s'identifie le plus (d'abord la famille, puis le
   personnage). Le résultat : les pourcentages des quatre types d'apprenants (Achiever,
   Explorer, Architect, Spectateur) sur un diagramme en anneau, avec son personnage au centre,
   ce que KibooM a remarqué, et le rappel que ça peut changer.

   Calcul : chaque réponse ajoute des points à des caractéristiques (goût de la nouveauté,
   réflexion, besoin de guidage…). Chaque type est un mélange de caractéristiques
   (EGO.types[…].profile) ; on mesure à quel point l'enfant ressemble à chaque mélange, puis on
   en fait des pourcentages (qui font 100).

   Pour l'enfant seulement (pas d'écran pour les parents pour l'instant). Pas de limite de
   temps ; on peut revenir à la question d'avant, ou s'arrêter et reprendre plus tard (les
   réponses en cours sont gardées). Les résultats restent dans le navigateur (js/store.js) et
   sont exportés en faits Prolog (js/stats.js). */
const Ego = (() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const FAMILIES = ["blue", "green", "red", "yellow"];
  const DRAFT_KEY = "kiboom-ego-draft";
  let T = null, step = "intro", answers = [], family = null, character = null;

  const lang = () => (document.documentElement.lang === "en" ? "en" : "fr");
  const E = () => T.ego;
  const list = () => (Store.data.ego || (Store.data.ego = []));
  const last = () => list().filter(r => r.player === Store.player).slice(-1)[0] || null;

  // Nom d'un personnage, dans la langue (celui de la parade, lang/parade-modes.js).
  function charName(key) {
    const m = window.PARADE_MODES || {};
    const g = (m[lang()] || m.fr || {}).gentil || {};
    return g[key] ? g[key].n[0] : key;
  }
  const cardImg = key => "assets/cards/" + key + ".webp";

  /* ---------- Réponses en cours (reprendre plus tard) ---------- */
  function saveDraft() {
    try {
      const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      all[Store.player] = { answers, family, character, step };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
    } catch (e) { /* stockage indisponible */ }
  }
  function loadDraft() {
    try { return (JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}"))[Store.player] || null; } catch (e) { return null; }
  }
  function clearDraft() {
    try {
      const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      delete all[Store.player];
      localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
    } catch (e) { /* stockage indisponible */ }
  }

  /* ---------- Le calcul ---------- */
  // Caractéristiques de l'enfant, entre −1 et 1 (2 points = le maximum).
  function traitsOf(ans) {
    const t = {};
    ans.forEach((optId, qi) => {
      const opt = EGO.questions[qi].options.find(o => o.id === optId);
      if (opt) Object.entries(opt.t).forEach(([k, v]) => { t[k] = (t[k] || 0) + v; });
    });
    Object.keys(t).forEach(k => { t[k] = Math.max(-1, Math.min(1, t[k] / 2)); });
    return t;
  }
  // Ressemblance à chaque type (entre −1 et 1), puis pourcentages entiers qui font 100.
  function percentsOf(t) {
    const ids = Object.keys(EGO.types);
    const sim = ids.map(id => {
      const p = EGO.types[id].profile;
      let s = 0, w = 0;
      Object.entries(p).forEach(([k, v]) => { s += v * (t[k] || 0); w += Math.abs(v); });
      return s / w;
    });
    const ex = sim.map(s => Math.exp(4 * s)), sum = ex.reduce((a, b) => a + b, 0);
    const raw = ex.map(e => (100 * e) / sum), out = raw.map(Math.floor);
    let rest = 100 - out.reduce((a, b) => a + b, 0);
    raw.map((r, i) => [r - out[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (rest > 0) { out[i]++; rest--; } });
    const res = {};
    ids.forEach((id, i) => { res[id] = out[i]; });
    return res;
  }

  /* ---------- L'affichage ---------- */
  function speak(text) {
    if (typeof config !== "undefined" && config.voice) Voice.speak(text, { lang: lang() });
  }
  const box = () => $("ego-body");
  function head() {
    $("ego-title").textContent = "🪞 " + E().title;
    $("ego-menu").textContent = "☰ " + T.menu;
  }

  function render() {
    if (!T) return;
    head();
    ({ intro, question, family: familyStep, character: characterStep, result })[step]();
    window.scrollTo(0, 0);
  }

  function intro() {
    const r = last(), d = loadDraft();
    box().innerHTML = `<div class="ego-intro">
      <div class="ego-mirror" aria-hidden="true">🪞</div>
      <p class="ego-lead">${E().intro}</p>
      <ul class="ego-points">${E().points.map(p => `<li>${p}</li>`).join("")}</ul>
      <div class="ego-actions">
        ${d && d.answers && d.answers.length ? `<button class="act" type="button" data-a="resume">▶ ${E().resume}</button>` : ""}
        <button class="act${d && d.answers && d.answers.length ? " ghost" : ""}" type="button" data-a="start">${r ? E().redo : E().start}</button>
        ${r ? `<button class="act ghost" type="button" data-a="see">${E().see}</button>` : ""}
      </div>
    </div>`;
    const on = (a, f) => { const b = box().querySelector(`[data-a=${a}]`); if (b) b.onclick = f; };
    on("start", () => { answers = []; family = null; character = null; step = "question"; saveDraft(); render(); });
    on("resume", () => { answers = d.answers || []; family = d.family; character = d.character; step = d.step && d.step !== "intro" ? d.step : "question"; render(); });
    on("see", () => { step = "result"; render(); });
  }

  function progress(n) {
    const total = EGO.questions.length + 1;
    return `<div class="ego-progress"><span>${E().stepOf.replace("{n}", n).replace("{total}", total)}</span>
      <div class="ego-bar"><i style="width:${Math.round((100 * (n - 1)) / total)}%"></i></div></div>`;
  }

  function nav(backAllowed) {
    return `<div class="ego-nav">
      ${backAllowed ? `<button class="act ghost" type="button" data-a="back">← ${E().back}</button>` : ""}
      <button class="act ghost" type="button" data-a="pause">⏸ ${E().pause}</button>
    </div>`;
  }
  function wireNav(onBack) {
    const b = box().querySelector("[data-a=back]");
    if (b) b.onclick = onBack;
    box().querySelector("[data-a=pause]").onclick = () => { saveDraft(); location.hash = ""; };
  }

  function question() {
    const qi = answers.length;
    if (qi >= EGO.questions.length) { step = "family"; return familyStep(); }
    const q = EGO.questions[qi], L = lang();
    box().innerHTML = `${progress(qi + 1)}
      <div class="ego-q">
        <h3 class="ego-question">${q[L]}</h3>
        <button class="act ghost ego-listen" type="button" data-a="listen" aria-label="${E().listen}">🔊</button>
      </div>
      <div class="ego-options">${q.options.map(o => `<button class="ego-opt" type="button" data-o="${o.id}">
        <span class="ego-opt-icon" aria-hidden="true">${o.icon}</span><span>${o[L]}</span></button>`).join("")}</div>
      ${nav(qi > 0)}`;
    const said = q[L] + " " + q.options.map(o => o[L]).join(" ; ");
    box().querySelector("[data-a=listen]").onclick = () => Voice.speak(said, { lang: L });
    speak(said);
    box().querySelectorAll("[data-o]").forEach(b => {
      b.onclick = () => {
        b.classList.add("picked");
        answers.push(b.dataset.o);
        saveDraft();
        setTimeout(render, 220);
      };
    });
    wireNav(() => { answers.pop(); saveDraft(); render(); });
  }

  function familyStep() {
    box().innerHTML = `${progress(EGO.questions.length + 1)}
      <div class="ego-q"><h3 class="ego-question">${E().whoFamily}</h3></div>
      <div class="ego-families">${FAMILIES.map(f => `<button class="ego-fam fam-${f}" type="button" data-f="${f}">
        <span class="card face ego-fam-card" style="background-image:url(${cardImg(f + "-10")})"></span>
        <span>${E().families[f]}</span></button>`).join("")}</div>
      ${nav(true)}`;
    speak(E().whoFamily);
    box().querySelectorAll("[data-f]").forEach(b => {
      b.onclick = () => { family = b.dataset.f; step = "character"; saveDraft(); render(); };
    });
    wireNav(() => { answers.pop(); step = "question"; saveDraft(); render(); });
  }

  function characterStep() {
    const keys = Array.from({ length: 10 }, (_, i) => family + "-" + (i + 1));
    box().innerHTML = `${progress(EGO.questions.length + 1)}
      <div class="ego-q"><h3 class="ego-question">${E().whoCharacter}</h3></div>
      <div class="ego-chars">${keys.map(k => `<button class="ego-char" type="button" data-k="${k}">
        <span class="card face ego-char-card" style="background-image:url(${cardImg(k)})"></span>
        <span class="ego-char-name">${charName(k)}</span></button>`).join("")}</div>
      ${nav(true)}`;
    speak(E().whoCharacter);
    box().querySelectorAll("[data-k]").forEach(b => {
      b.onclick = () => { character = b.dataset.k; finish(); };
    });
    wireNav(() => { family = null; step = "family"; saveDraft(); render(); });
  }

  // Fin du questionnaire : on calcule et on garde le résultat (une ligne par passage :
  // la BK individuelle se met à jour, l'historique reste).
  function finish() {
    const traits = traitsOf(answers);
    list().push({
      id: "ego_" + Date.now().toString(36),
      player: Store.player, time: Date.now(), version: "questionnaire_v1",
      answers: answers.slice(), character, traits, percents: percentsOf(traits),
    });
    Store.save();
    clearDraft();
    step = "result";
    render();
  }

  // Anneau en SVG : un arc par type, proportionnel au pourcentage, dessiné en douceur.
  function donut(percents) {
    const R = 80, C = 2 * Math.PI * R;
    let start = 0;
    const arcs = Object.keys(EGO.types).map(id => {
      const p = percents[id] / 100, len = Math.max(0, p * C - (p > 0.02 ? 3 : 0));
      const arc = `<circle class="ego-arc" r="${R}" cx="100" cy="100" stroke="${EGO.types[id].color}"
        style="--len:${len.toFixed(1)};--c:${C.toFixed(1)};stroke-dashoffset:${(-start * C).toFixed(1)}"></circle>`;
      start += p;
      return arc;
    }).join("");
    return `<svg class="ego-donut" viewBox="0 0 200 200" role="img" aria-label="${E().chartLabel}">
      <circle r="${R}" cx="100" cy="100" class="ego-track"></circle>${arcs}</svg>`;
  }

  function result() {
    const r = last();
    if (!r) { step = "intro"; return intro(); }
    const L = lang(), types = EGO.types;
    const order = Object.keys(types).sort((a, b) => r.percents[b] - r.percents[a]);
    const top = order[0];
    // Ce que KibooM a remarqué : les trois caractéristiques les plus marquées.
    const noticed = Object.entries(r.traits)
      .map(([k, v]) => ({ k, v, text: EGO.traits[k] && EGO.traits[k][L][v >= 0 ? 0 : 1] }))
      .filter(x => x.text && Math.abs(x.v) >= 0.25)
      .sort((a, b) => Math.abs(b.v) - Math.abs(a.v)).slice(0, 3);
    const who = r.character ? charName(r.character) : "";
    box().innerHTML = `<div class="ego-result">
      <div class="ego-chart">
        ${donut(r.percents)}
        <div class="ego-center">
          ${r.character ? `<span class="card face ego-avatar" style="background-image:url(${cardImg(r.character)})" role="img" aria-label="${who}"></span>` : `<span class="ego-big">${types[top].icon}</span>`}
        </div>
      </div>
      <div class="ego-side">
        <p class="ego-verdict">${E().verdict.replace("{name}", Store.player || "").replace("{type}", `<b style="color:${types[top].color}">${types[top].icon} ${types[top][L].name}</b>`).replace("{p}", r.percents[top])}</p>
        <ul class="ego-legend">${order.map(id => `<li>
          <span class="ego-leg-icon" style="background:${types[id].color}">${types[id].icon}</span>
          <span class="ego-leg-txt"><b>${types[id][L].name}</b> <span>${types[id][L].text}</span></span>
          <span class="ego-leg-bar"><i style="width:${r.percents[id]}%;background:${types[id].color}"></i></span>
          <b class="ego-leg-p">${r.percents[id]} %</b></li>`).join("")}</ul>
        <p class="ego-change">🌱 ${E().mayChange}</p>
      </div>
    </div>
    ${noticed.length ? `<div class="ego-noticed"><h3>${E().noticed}</h3><ul>${noticed.map(x => `<li>${x.text}</li>`).join("")}</ul></div>` : ""}
    ${who ? `<p class="ego-who">${E().yourCharacter.replace("{who}", `<b>${who}</b>`)}</p>` : ""}
    <div class="ego-actions">
      <button class="act" type="button" data-a="redo">🔁 ${E().redo}</button>
      <button class="act ghost" type="button" data-a="home">☰ ${T.menu}</button>
    </div>`;
    speak(box().querySelector(".ego-verdict").textContent + " " + E().mayChange);
    box().querySelector("[data-a=redo]").onclick = () => { answers = []; family = null; character = null; step = "question"; saveDraft(); render(); };
    box().querySelector("[data-a=home]").onclick = () => { location.hash = ""; };
  }

  /* ---------- Ouvrir, fermer, langue ---------- */
  function start(texts) {
    T = texts;
    step = "intro";
    render();
  }
  function leave() { if (typeof Voice !== "undefined") Voice.stop(); }
  function texts(t) {
    T = t;
    if (!$("ego-screen").hidden) render();
  }
  function init() {
    $("ego-menu").addEventListener("click", () => { location.hash = ""; });
  }

  return { init, texts, start, leave, traitsOf, percentsOf };
})();
