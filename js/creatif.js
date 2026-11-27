/* Les ateliers créatifs de KibooM : il n'y a pas de bonne réponse, seulement des idées
   (docs/charte-personnalisation.md, principes 3 et 4). Contenu : lang/creatif.js (CREATIF) et
   T.creatif. Rien n'est noté « bien » ou « mal » : KibooM réagit avec curiosité.

   1. « Invente ton personnage » (#invente) : un cadavre exquis avec les dessins des cartes. On
      choisit la tête, le corps et les pieds parmi les 40 personnages (◀ ▶, ou 🎲 au hasard), puis
      l'enfant lui trouve un nom et une phrase drôle. Le personnage est rangé dans sa galerie et
      rejoint la parade (js/parade.js).
   2. « Pourquoi ensemble ? » (#intrus) : 4 cartes ; laquelle n'est pas comme les autres ?
      L'enfant choisit une carte puis une raison (sa famille, sa couleur, pair ou impair, ses
      pattes…) ; toute raison juste est une idée de plus, et il peut aussi inventer sa propre
      raison (toujours acceptée). On valorise le nombre d'idées et leur variété.
   Les créations et les idées sont gardées par joueur (Store.data.creations, Store.data.ideas) et
   exportées en Prolog (js/stats.js). */
const Creatif = (() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const COLOURS = ["blue", "green", "red", "yellow"];
  const KEYS = [].concat(...COLOURS.map(c => Array.from({ length: 10 }, (_, i) => c + "-" + (i + 1))));
  // Les trois bandes d'une carte (en proportion de la carte) : tête, corps, pieds.
  const BANDS = [[0.17, 0.36], [0.36, 0.55], [0.55, 0.685]];
  const CROP = [0.14, 0.86];
  let T = null;

  const lang = () => (document.documentElement.lang === "en" ? "en" : "fr");
  const any = list => list[Math.floor(Math.random() * list.length)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const creations = () => (Store.data.creations || (Store.data.creations = []));
  const ideasLog = () => (Store.data.ideas || (Store.data.ideas = []));
  const mine = () => creations().filter(c => c.player === Store.player);
  function charName(key) {
    const m = window.PARADE_MODES || {}, g = (m[lang()] || m.fr || {}).gentil || {};
    return g[key] ? g[key].n[0] : key;
  }
  function speak(text) { if (typeof config !== "undefined" && config.voice) Voice.speak(text, { lang: lang() }); }

  /* ---------- Le dessin d'un personnage inventé ---------- */
  // parts : [tête, corps, pieds] (clés de cartes) ; w : largeur en pixels.
  function mixHTML(parts, w, cls) {
    const cw = (CROP[1] - CROP[0]) * 145, s = w / cw, W = 145 * s, H = 220 * s;
    return `<div class="mix${cls ? " " + cls : ""}" style="width:${w}px">` + parts.map((k, i) => {
      const [y0, y1] = BANDS[i];
      return `<div class="mix-band" style="height:${((y1 - y0) * H).toFixed(1)}px;background-image:url(assets/cards/${k}.webp);background-size:${W.toFixed(1)}px ${H.toFixed(1)}px;background-position:${(-CROP[0] * W).toFixed(1)}px ${(-y0 * H).toFixed(1)}px"></div>`;
    }).join("") + `</div>`;
  }

  /* ---------- 1. Invente ton personnage ---------- */
  let parts = null, draft = { name: "", phrase: "" };

  function inventeRender() {
    const box = $("invente-body"), L = lang(), C = T.creatif;
    $("invente-title").textContent = "🧪 " + C.inventTitle;
    $("invente-menu").textContent = "☰ " + T.menu;
    if (!parts) parts = [any(KEYS), any(KEYS), any(KEYS)];
    const row = (i, label) => `<div class="inv-row"><button class="act ghost inv-arrow" type="button" data-m="${i}:-1" aria-label="${C.prev}">◀</button>
        <div class="inv-label"><b>${label}</b><span>${esc(charName(parts[i]))}</span></div>
        <button class="act ghost inv-arrow" type="button" data-m="${i}:1" aria-label="${C.next}">▶</button></div>`;
    const gallery = mine();
    box.innerHTML = `<p class="enq-lead">${C.inventIntro}</p>
      <div class="inv-wrap">
        <div class="inv-stage">${mixHTML(parts, 190, "inv-big")}</div>
        <div class="inv-controls">
          ${row(0, C.head)}${row(1, C.body)}${row(2, C.feet)}
          <p class="inv-dice"><button class="act ghost" type="button" data-a="dice">🎲 ${C.random}</button></p>
          <label class="inv-field"><span>${C.nameQuestion}</span>
            <span class="inv-input"><input id="inv-name" type="text" maxlength="20" autocomplete="off" value="${esc(draft.name)}" placeholder="${C.namePlaceholder}">
            <button class="act ghost" type="button" data-a="name-idea" title="${C.nameIdea}">🎲</button></span></label>
          <label class="inv-field"><span>${C.phraseQuestion}</span>
            <span class="inv-input"><input id="inv-phrase" type="text" maxlength="100" autocomplete="off" value="${esc(draft.phrase)}" placeholder="${C.phrasePlaceholder}">
            <button class="act ghost" type="button" data-a="phrase-idea" title="${C.phraseIdea}">💡</button></span></label>
          <p class="ego-actions"><button class="act ghost" type="button" data-a="listen">🔊 ${C.listen}</button>
            <button class="act" type="button" data-a="save">✨ ${C.save}</button></p>
          <p class="inv-msg" id="inv-msg" aria-live="polite"></p>
        </div>
      </div>
      ${gallery.length ? `<h3>🖼️ ${C.gallery}</h3><ul class="inv-gallery">${gallery.slice().reverse().map(g => `<li>
          ${mixHTML(g.parts, 110)}<b>${esc(g.name)}</b><span>${esc(g.phrase || "")}</span>
          <button class="act ghost" type="button" data-del="${g.id}" aria-label="${C.remove}">🗑️</button></li>`).join("")}</ul>
        <p class="stats-note">${C.inParade}</p>` : ""}`;
    const name = $("inv-name"), phrase = $("inv-phrase");
    name.oninput = () => { draft.name = name.value; };
    phrase.oninput = () => { draft.phrase = phrase.value; };
    box.querySelectorAll("[data-m]").forEach(b => {
      b.onclick = () => {
        const [i, d] = b.dataset.m.split(":").map(Number);
        parts[i] = KEYS[(KEYS.indexOf(parts[i]) + d + KEYS.length) % KEYS.length];
        inventeRender();
      };
    });
    box.querySelector("[data-a=dice]").onclick = () => { parts = [any(KEYS), any(KEYS), any(KEYS)]; inventeRender(); };
    box.querySelector("[data-a=name-idea]").onclick = () => { draft.name = nameIdea(); inventeRender(); };
    box.querySelector("[data-a=phrase-idea]").onclick = () => {
      const n = draft.name.trim() || nameIdea();
      draft.phrase = any(CREATIF.phrases[L]).replace("{name}", n).replace("{a}", charName(parts[0])).replace("{b}", charName(parts[1])).replace("{c}", charName(parts[2]));
      inventeRender();
    };
    box.querySelector("[data-a=listen]").onclick = () => Voice.speak(draft.phrase || draft.name || C.inventIntro, { lang: L });
    box.querySelector("[data-a=save]").onclick = () => {
      if (!draft.name.trim()) { $("inv-msg").textContent = C.needName; name.focus(); return; }
      creations().push({ id: "inv_" + Date.now().toString(36), player: Store.player, time: Date.now(), kind: "character", parts: parts.slice(), name: draft.name.trim(), phrase: draft.phrase.trim() });
      Store.save();
      const wow = any(CREATIF.wow[L]);
      draft = { name: "", phrase: "" };
      parts = null;
      inventeRender();
      $("inv-msg").textContent = "✨ " + wow + " " + C.saved;
      speak(wow);
    };
    box.querySelectorAll("[data-del]").forEach(b => {
      b.onclick = () => {
        if (!confirm(C.removeConfirm)) return;
        Store.data.creations = creations().filter(c => c.id !== b.dataset.del);
        Store.save();
        inventeRender();
      };
    });
  }
  // Un nom inventé en mélangeant les débuts et les fins des noms des trois personnages.
  function nameIdea() {
    const n = parts.map(charName).map(s => s.replace(/^(l'agent|le shérif|le docteur|la professeure|Officer|Sheriff|Doctor|Professor)\s+/i, "").replace(/[-'’\s]/g, ""));
    const half = (s, first) => (first ? s.slice(0, Math.max(2, Math.ceil(s.length / 2))) : s.slice(Math.floor(s.length / 2)));
    const pick = any([[0, 2], [0, 1], [1, 2], [2, 0]]);
    const word = half(n[pick[0]], true) + half(n[pick[1]], false).toLowerCase();
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  /* ---------- 2. Pourquoi ensemble ? ---------- */
  let round = null;
  const A = key => CREATIF.attrs[key] || {};
  const value = key => parseInt(key.split("-")[1], 10);
  // La valeur d'une carte pour une raison (null : la raison ne s'applique pas à cette carte).
  function trait(key, r) {
    const a = A(key), v = value(key);
    if (r === "family") return key.split("-")[0];
    if (r === "colour") return a.colour || null;
    if (r === "parity") return v % 2 ? "odd" : "even";
    if (r === "size") return v > 5 ? "big" : "small";
    if (r === "legs") return a.legs || 2;
    if (r === "flies") return !!a.flies;
    if (r === "head") return !!a.head;
    return null;
  }
  // La carte est-elle « pas comme les autres » pour cette raison ? Renvoie la phrase, ou null.
  function check(cards, key, r) {
    const L = lang(), R = CREATIF.reasons[r], vs = cards.map(value), v = value(key);
    if (r === "max") return v === Math.max(...vs) && vs.filter(x => x === v).length === 1 ? R.ok[L] : null;
    if (r === "min") return v === Math.min(...vs) && vs.filter(x => x === v).length === 1 ? R.ok[L] : null;
    const mineV = trait(key, r);
    if (mineV === null || mineV === false) return null;
    if (cards.some(k => k !== key && trait(k, r) === mineV)) return null;
    if ((r === "colour") && cards.some(k => k !== key && trait(k, r) === null)) { /* humains : couleur inconnue, on accepte quand même */ }
    const x = r === "family" ? CREATIF.families[mineV][L] : r === "colour" ? CREATIF.colours[mineV][L]
      : r === "parity" ? CREATIF.parities[mineV][L] : r === "size" ? CREATIF.sizes[mineV][L]
      : r === "legs" ? (CREATIF.legsText[mineV] || CREATIF.legsText[2])[L] : "";
    return R.ok[L].replace("{x}", x);
  }
  // Toutes les idées justes d'un tirage : [{ key, r }].
  const allIdeas = cards => [].concat(...cards.map(k => Object.keys(CREATIF.reasons).filter(r => check(cards, k, r)).map(r => ({ key: k, r }))));
  // Un tirage de 4 cartes où chaque carte est « l'intrus » pour au moins une raison.
  function deal() {
    let best = null;
    for (let t = 0; t < 400; t++) {
      const cards = [];
      while (cards.length < 4) { const k = any(KEYS); if (!cards.includes(k)) cards.push(k); }
      const ideas = allIdeas(cards);
      if (!cards.every(k => ideas.some(i => i.key === k))) continue;
      if (!best || (ideas.length > best.ideas.length && ideas.length <= 9)) best = { cards, ideas };
    }
    return best ? best.cards : ["blue-4", "green-3", "red-2", "yellow-9"];
  }

  function intrusRender(msg) {
    const box = $("intrus-body"), L = lang(), C = T.creatif;
    $("intrus-title").textContent = "🔍 " + C.intrusTitle;
    $("intrus-menu").textContent = "☰ " + T.menu;
    if (!round) {
      const cards = deal();
      round = { id: "idea_" + Date.now().toString(36), player: Store.player, time: Date.now(), cards, total: allIdeas(cards).length, found: [], own: [], pick: null };
    }
    const left = round.total - round.found.length;
    box.innerHTML = `<p class="enq-lead">${C.intrusIntro}</p>
      <div class="intrus-cards">${round.cards.map(k => `<button class="intrus-card${round.pick === k ? " picked" : ""}" type="button" data-k="${k}" aria-label="${esc(charName(k))}">
        <span class="card face" style="background-image:url(assets/cards/${k}.webp)"></span><span>${esc(charName(k))}</span></button>`).join("")}</div>
      ${round.pick ? `<div class="intrus-why"><h3>${C.why.replace("{name}", esc(charName(round.pick)))}</h3>
        <div class="intrus-reasons">${Object.keys(CREATIF.reasons).map(r => `<button class="act ghost" type="button" data-r="${r}">${CREATIF.reasons[r].icon} ${CREATIF.reasons[r][L]}</button>`).join("")}</div>
        <p class="inv-input"><input id="intrus-own" type="text" maxlength="80" autocomplete="off" placeholder="${C.ownPlaceholder}">
          <button class="act" type="button" data-a="own">✏️ ${C.own}</button></p></div>` : `<p class="intrus-hint">👆 ${C.pickCard}</p>`}
      <p class="inv-msg" aria-live="polite">${msg || ""}</p>
      <div class="intrus-found"><h3>💡 ${C.ideas.replace("{n}", round.found.length + round.own.length)}</h3>
        <ul>${round.found.map(f => `<li>${esc(charName(f.key))} : ${check(round.cards, f.key, f.r)}</li>`).join("")}${round.own.map(o => `<li>${esc(charName(o.key))} : « ${esc(o.text)} » ✏️</li>`).join("")}</ul>
        <p class="stats-note">${left > 0 ? C.moreHidden.replace("{n}", left) : C.allFound}</p></div>
      <p class="ego-actions"><button class="act" type="button" data-a="new">🃏 ${C.newCards}</button></p>`;
    box.querySelectorAll("[data-k]").forEach(b => { b.onclick = () => { round.pick = b.dataset.k; intrusRender(); }; });
    box.querySelectorAll("[data-r]").forEach(b => {
      b.onclick = () => {
        const ok = check(round.cards, round.pick, b.dataset.r);
        if (!ok) return intrusRender("🤔 " + any(CREATIF.notQuite[L]));
        if (round.found.some(f => f.key === round.pick && f.r === b.dataset.r)) return intrusRender("😉 " + C.already);
        round.found.push({ key: round.pick, r: b.dataset.r });
        save();
        const wow = any(CREATIF.wow[L]);
        speak(ok + " " + wow);
        intrusRender("✨ " + ok + " " + wow);
      };
    });
    const own = box.querySelector("[data-a=own]");
    if (own) own.onclick = () => {
      const t = $("intrus-own").value.trim();
      if (!t) return;
      round.own.push({ key: round.pick, text: t });
      save();
      const wow = any(CREATIF.wow[L]);
      speak(wow);
      intrusRender("✨ " + wow + " " + C.ownThanks);
    };
    box.querySelector("[data-a=new]").onclick = () => { round = null; intrusRender(); };
  }
  // Le tirage est enregistré dès la première idée, puis mis à jour.
  function save() {
    const log = ideasLog(), rec = { id: round.id, player: round.player, time: round.time, cards: round.cards, total: round.total, found: round.found, own: round.own };
    const i = log.findIndex(r => r.id === round.id);
    if (i >= 0) log[i] = rec; else log.push(rec);
    Store.save();
  }

  /* ---------- Démarrage ---------- */
  function start(which, t) { T = t; if (which === "invente") inventeRender(); else { round = null; intrusRender(); } }
  function texts(t) {
    T = t;
    if (!$("invente-screen").hidden) inventeRender();
    if (!$("intrus-screen").hidden) intrusRender();
  }
  function init() {
    $("invente-menu").addEventListener("click", () => Home.back());
    $("intrus-menu").addEventListener("click", () => Home.back());
  }

  return { init, texts, start, mixHTML, mine, check, allIdeas };
})();
