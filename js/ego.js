/* Ego KibooM : la BK individuelle de l'enfant, telle que KibooM la perçoit.
   Trois chapitres, à faire dans l'ordre (chacun se débloque quand le précédent est fini, et
   peut être refait) ; contenu dans lang/ego.js :
   1. Qui je suis : données fixes (âge, mois d'anniversaire, classe, genre, langues).
   2. Ma personnalité : traits stables (cinq grands traits, traits liés au jeu, traits fins) ;
      résultat : « Ta constellation », une étoile au nom positif par trait.
   3. Mon style de joueur : 10 questions, puis le personnage auquel l'enfant s'identifie (il
      devient son avatar) ; résultat : les pourcentages des quatre types d'apprenants (Achiever,
      Explorer, Architect, Spectateur) en anneau ; « Ça te ressemble ? » ; puis les défis, un par
      un, seulement sur ce qui peut changer.
   Chaque question a un bouton « Je préfère ne pas répondre ». Pas de limite de temps ; retour
   à la question d'avant ; pause et reprise plus tard (réponses en cours gardées).
   Pour l'enfant seulement. Les résultats sont liés au joueur, restent dans le navigateur
   (js/store.js, data.ego : un enregistrement par passage, kind identity / personality / style)
   et sont exportés en faits Prolog (js/stats.js). */
const Ego = (() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const FAMILIES = ["blue", "green", "red", "yellow"];
  const CHAPTERS = ["identity", "personality", "style"];
  const ICONS = { identity: "🪪", personality: "✨", style: "🎮" };
  const DRAFT_KEY = "kiboom-ego-draft";
  const SKIP = "skip";
  let T = null, step = "hub", chapter = null, answers = [], family = null, current = null, challengeIdx = 0;

  const lang = () => (document.documentElement.lang === "en" ? "en" : "fr");
  const E = () => T.ego;
  const list = () => (Store.data.ego || (Store.data.ego = []));
  const kindOf = r => r.kind || "style";
  const last = kind => list().filter(r => r.player === Store.player && kindOf(r) === kind).slice(-1)[0] || null;
  const items = ch => (ch === "identity" ? EGO.identity : ch === "personality" ? EGO.personality : EGO.questions);
  const unlocked = ch => CHAPTERS.indexOf(ch) === 0 || !!last(CHAPTERS[CHAPTERS.indexOf(ch) - 1]);

  // Nom d'un personnage, dans la langue (celui de la parade, lang/parade-modes.js).
  function charName(key) {
    const m = window.PARADE_MODES || {};
    const g = (m[lang()] || m.fr || {}).gentil || {};
    return g[key] ? g[key].n[0] : key;
  }
  const cardImg = key => "assets/cards/" + key + ".webp";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  /* ---------- Réponses en cours (reprendre plus tard) ---------- */
  function drafts() { try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}"); } catch (e) { return {}; } }
  function saveDraft() {
    try {
      const all = drafts();
      all[Store.player] = all[Store.player] || {};
      all[Store.player][chapter] = { answers, family, step };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
    } catch (e) { /* stockage indisponible */ }
  }
  const loadDraft = ch => ((drafts()[Store.player] || {})[ch]) || null;
  function clearDraft(ch) {
    try {
      const all = drafts();
      if (all[Store.player]) delete all[Store.player][ch];
      localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
    } catch (e) { /* stockage indisponible */ }
  }

  /* ---------- Les calculs ---------- */
  // Style : caractéristiques de l'enfant, entre −1 et 1 (2 points = le maximum).
  function traitsOf(ans) {
    const t = {};
    // Plusieurs réponses à une question : elles se partagent le poids d'une réponse.
    ans.forEach((a, qi) => {
      const ids = Array.isArray(a) ? a : [a];
      ids.forEach(optId => {
        const opt = EGO.questions[qi].options.find(o => o.id === optId);
        if (opt) Object.entries(opt.t).forEach(([k, v]) => { t[k] = (t[k] || 0) + v / ids.length; });
      });
    });
    Object.keys(t).forEach(k => { t[k] = Math.max(-1, Math.min(1, t[k] / 2)); });
    return t;
  }
  // Style : ressemblance à chaque type (mélange de caractéristiques), puis pourcentages entiers (100).
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
  // Personnalité : chaque trait entre 0 et 1 (moyenne de ses phrases ; null si aucune réponse).
  function personalityOf(ans) {
    const acc = {};
    EGO.personality.forEach((it, i) => {
      const a = ans[i];
      if (a === undefined || a === SKIP || a === null) return;
      const v = it.rev ? 3 - Number(a) : Number(a);
      (acc[it.trait] = acc[it.trait] || []).push(v / 3);
    });
    const out = {};
    Object.keys(EGO.personalityTraits).forEach(k => {
      out[k] = acc[k] ? Math.round((100 * acc[k].reduce((x, y) => x + y, 0)) / acc[k].length) / 100 : null;
    });
    return out;
  }
  // Défis : ceux que KibooM a remarqués (style et personnalité du joueur).
  function challengesFor(style) {
    const pers = last("personality");
    return EGO.challenges.filter(c => {
      const v = c.src === "personality" ? (pers ? pers.traits[c.trait] : null) : style.traits[c.trait];
      if (v === null || v === undefined) return false;
      return c.below !== undefined ? v < c.below : v > c.above;
    });
  }

  /* ---------- L'affichage commun ---------- */
  function speak(text) {
    if (typeof config !== "undefined" && config.voice) Voice.speak(text, { lang: lang() });
  }
  const box = () => $("ego-body");
  const on = (sel, f) => { const b = box().querySelector(sel); if (b) b.onclick = f; };

  function render() {
    if (!T) return;
    $("ego-title").textContent = "🪞 " + E().title;
    $("ego-menu").textContent = "☰ " + T.menu;
    ({ hub, quiz, family: familyStep, character: characterStep, result, challenge, done, avatarFamily, avatarCharacter }[step] || hub)();
    window.scrollTo(0, 0);
  }

  function progress(n, total) {
    return `<div class="ego-progress"><span>${E().stepOf.replace("{n}", n).replace("{total}", total)}</span>
      <div class="ego-bar"><i style="width:${Math.round((100 * (n - 1)) / total)}%"></i></div></div>`;
  }
  // Pied de question : passer (ne pas répondre), retour, pause.
  function foot(back, skip) {
    return `<div class="ego-nav">
      ${back ? `<button class="act ghost" type="button" data-a="back">← ${E().back}</button>` : ""}
      ${skip ? `<button class="act ghost ego-skip" type="button" data-a="skip">🙊 ${E().skip}</button>` : ""}
      <button class="act ghost" type="button" data-a="pause">⏸ ${E().pause}</button>
    </div>`;
  }
  function wireFoot(onBack, onSkip) {
    on("[data-a=back]", onBack);
    on("[data-a=skip]", onSkip);
    on("[data-a=pause]", () => { saveDraft(); step = "hub"; render(); });
  }

  /* ---------- L'accueil d'Ego : les trois chapitres ---------- */
  function hub() {
    const avatar = Store.avatar;
    box().innerHTML = `<div class="ego-hub-head">
        ${avatar ? `<span class="card face ego-hub-avatar" style="background-image:url(${cardImg(avatar)})" role="img" aria-label="${esc(charName(avatar))}"></span>` : `<span class="ego-mirror" aria-hidden="true">🪞</span>`}
        <div><p class="ego-lead">${CHAPTERS.some(c => last(c)) ? "" : E().welcome.replace("{name}", esc(Store.player || "")) + " "}${E().intro}</p><p class="ego-sub">${E().hubHint}</p>
          <button class="act ghost ego-change-avatar" type="button" data-a="avatar">🖼️ ${avatar ? E().changeAvatar : E().chooseAvatar}</button></div>
      </div>
      <div class="ego-chapters">${CHAPTERS.map((ch, i) => {
        const r = last(ch), open = unlocked(ch), d = loadDraft(ch), C = E().chapters[ch];
        const status = r ? `✅ ${E().done}` : open ? (d && d.answers && d.answers.length ? `⏸ ${E().inProgress}` : `▶ ${E().toDo}`) : `🔒 ${E().locked}`;
        return `<section class="ego-chapter${open ? "" : " locked"}">
          <div class="ego-ch-num">${i + 1}</div>
          <div class="ego-ch-icon" aria-hidden="true">${ICONS[ch]}</div>
          <h3>${C.name}</h3><p>${C.text}</p>
          <p class="ego-ch-status">${status}</p>
          ${r ? `<p class="ego-ch-sum">${summary(ch, r)}</p>` : ""}
          <div class="ego-ch-btns">
            ${open && d && d.answers && d.answers.length ? `<button class="act" type="button" data-resume="${ch}">▶ ${E().resume}</button>` : ""}
            ${open ? `<button class="act${(d && d.answers && d.answers.length) || r ? " ghost" : ""}" type="button" data-start="${ch}">${r ? E().redo : E().start}</button>` : ""}
            ${r && ch !== "identity" ? `<button class="act ghost" type="button" data-see="${ch}">${E().see}</button>` : ""}
          </div>
        </section>`;
      }).join("")}</div>
      <p class="ego-change">🌱 ${E().mayChange}</p>`;
    on("[data-a=avatar]", () => { step = "avatarFamily"; render(); });
    box().querySelectorAll("[data-start]").forEach(b => { b.onclick = () => begin(b.dataset.start, null); });
    box().querySelectorAll("[data-resume]").forEach(b => { b.onclick = () => begin(b.dataset.resume, loadDraft(b.dataset.resume)); });
    box().querySelectorAll("[data-see]").forEach(b => { b.onclick = () => { chapter = b.dataset.see; current = last(chapter); step = "result"; render(); }; });
  }
  // Résumé d'un chapitre fait, sur sa carte.
  function summary(ch, r) {
    const L = lang();
    if (ch === "identity") {
      const age = r.answers.age && r.answers.age !== SKIP ? E().ageShort.replace("{n}", r.answers.age) : "";
      const cls = EGO.identity[2].options.find(o => o.id === r.answers.school_class);
      return [Store.player, age, cls ? cls[L] : ""].filter(Boolean).map(esc).join(" · ");
    }
    if (ch === "personality") {
      const top = Object.entries(r.traits).filter(([, v]) => v !== null)
        .map(([k, v]) => [k, EGO.personalityTraits[k].inv ? 1 - v : v]).sort((a, b) => b[1] - a[1]).slice(0, 3);
      return top.map(([k]) => EGO.personalityTraits[k].icon + " " + EGO.personalityTraits[k][L]).join(" · ");
    }
    const topType = Object.keys(r.percents).sort((a, b) => r.percents[b] - r.percents[a])[0];
    return EGO.types[topType].icon + " " + EGO.types[topType][L].name + " " + r.percents[topType] + " %";
  }

  function begin(ch, draft) {
    chapter = ch;
    answers = draft && draft.answers ? draft.answers : (ch === "identity" ? {} : []);
    family = draft ? draft.family : null;
    step = draft && draft.step && draft.step !== "hub" ? draft.step : "quiz";
    saveDraft();
    render();
  }

  /* ---------- Les questions ---------- */
  // answers : objet (qui je suis : id de question → réponse) ou liste (personnalité, style).
  const answeredCount = () => (chapter === "identity" ? Object.keys(answers).length : answers.length);
  function quiz() {
    const all = items(chapter), qi = answeredCount();
    if (qi >= all.length) return chapter === "style" ? (step = "family", familyStep()) : finish();
    const L = lang(), total = all.length + (chapter === "style" ? 1 : 0), q = all[qi];
    // Plusieurs réponses possibles : les questions du style de joueur, et celles marquées multi.
    const multi = !!q.multi || chapter === "style";
    let title, opts, said;
    if (chapter === "personality") {
      title = `<span class="ego-asks">${E().likeYou}</span>${q[L]}`;
      opts = EGO.scale.map(o => ({ id: String(o.v), icon: o.icon, label: o[L] }));
      said = E().likeYou + " " + q[L];
    } else {
      title = q[L];
      opts = q.options.map(o => ({ id: o.id, icon: o.icon, label: o[L] }));
      said = q[L] + " " + opts.map(o => o.label).join(" ; ");
    }
    const kind = chapter === "personality" ? " scale" : q.options && q.options.length > 6 ? " many" : "";
    box().innerHTML = `${progress(qi + 1, total)}
      <div class="ego-q"><h3 class="ego-question">${title}</h3>
        <button class="act ghost ego-listen" type="button" data-a="listen" aria-label="${E().listen}">🔊</button></div>
      <div class="ego-options${kind}">${opts.map(o => `<button class="ego-opt" type="button" data-o="${o.id}" aria-pressed="false">
        ${o.icon ? `<span class="ego-opt-icon" aria-hidden="true">${o.icon}</span>` : ""}<span>${o.label}</span></button>`).join("")}</div>
      ${multi ? `<p class="ego-multi"><span>${E().several}</span> <button class="act" type="button" data-a="ok" disabled>${E().ok}</button></p>` : ""}
      ${foot(qi > 0, true)}`;
    on("[data-a=listen]", () => Voice.speak(said, { lang: L }));
    speak(said);
    const answer = v => {
      if (chapter === "identity") answers[q.id] = v; else answers.push(v);
      saveDraft();
      setTimeout(render, 220);
    };
    box().querySelectorAll("[data-o]").forEach(b => {
      b.onclick = () => {
        if (multi) {
          b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true");
          b.classList.toggle("picked", b.getAttribute("aria-pressed") === "true");
          box().querySelector("[data-a=ok]").disabled = !box().querySelector("[data-o][aria-pressed=true]");
          return;
        }
        b.classList.add("picked");
        answer(b.dataset.o);
      };
    });
    on("[data-a=ok]", () => answer(Array.from(box().querySelectorAll("[data-o][aria-pressed=true]")).map(b => b.dataset.o)));
    wireFoot(() => {
      if (chapter === "identity") delete answers[all[qi - 1].id]; else answers.pop();
      saveDraft(); render();
    }, () => answer(SKIP));
  }

  function familyStep() {
    const total = EGO.questions.length + 1;
    box().innerHTML = `${progress(total, total)}
      <div class="ego-q"><h3 class="ego-question">${E().whoFamily}</h3></div>
      <div class="ego-families">${FAMILIES.map(f => `<button class="ego-fam" type="button" data-f="${f}">
        <span class="card face ego-fam-card" style="background-image:url(${cardImg(f + "-10")})"></span>
        <span>${E().families[f]}</span></button>`).join("")}</div>
      ${foot(true, true)}`;
    speak(E().whoFamily);
    box().querySelectorAll("[data-f]").forEach(b => { b.onclick = () => { family = b.dataset.f; step = "character"; saveDraft(); render(); }; });
    wireFoot(() => { answers.pop(); step = "quiz"; saveDraft(); render(); }, () => { family = null; finish(null); });
  }

  function characterStep() {
    const total = EGO.questions.length + 1;
    const keys = Array.from({ length: 10 }, (_, i) => family + "-" + (i + 1));
    box().innerHTML = `${progress(total, total)}
      <div class="ego-q"><h3 class="ego-question">${E().whoCharacter}</h3></div>
      <div class="ego-chars">${keys.map(k => `<button class="ego-char" type="button" data-k="${k}">
        <span class="card face ego-char-card" style="background-image:url(${cardImg(k)})"></span>
        <span class="ego-char-name">${esc(charName(k))}</span></button>`).join("")}</div>
      ${foot(true, true)}`;
    speak(E().whoCharacter);
    box().querySelectorAll("[data-k]").forEach(b => { b.onclick = () => finish(b.dataset.k); });
    wireFoot(() => { family = null; step = "family"; saveDraft(); render(); }, () => finish(null));
  }

  // Changer d'avatar à tout moment, depuis l'accueil d'Ego (sans refaire le questionnaire) :
  // d'abord la famille, puis le personnage.
  function avatarFamily() {
    box().innerHTML = `<div class="ego-q"><h3 class="ego-question">${E().avatarFamily}</h3></div>
      <div class="ego-families">${FAMILIES.map(f => `<button class="ego-fam" type="button" data-f="${f}">
        <span class="card face ego-fam-card" style="background-image:url(${cardImg(f + "-10")})"></span>
        <span>${E().families[f]}</span></button>`).join("")}</div>
      <div class="ego-nav"><button class="act ghost" type="button" data-a="back">← ${E().back}</button></div>`;
    speak(E().avatarFamily);
    box().querySelectorAll("[data-f]").forEach(b => { b.onclick = () => { family = b.dataset.f; step = "avatarCharacter"; render(); }; });
    on("[data-a=back]", () => { step = "hub"; render(); });
  }
  function avatarCharacter() {
    const keys = Array.from({ length: 10 }, (_, i) => family + "-" + (i + 1)), now = Store.avatar;
    box().innerHTML = `<div class="ego-q"><h3 class="ego-question">${E().avatarCharacter}</h3></div>
      <div class="ego-chars">${keys.map(k => `<button class="ego-char${k === now ? " current" : ""}" type="button" data-k="${k}">
        <span class="card face ego-char-card" style="background-image:url(${cardImg(k)})"></span>
        <span class="ego-char-name">${esc(charName(k))}</span></button>`).join("")}</div>
      <div class="ego-nav"><button class="act ghost" type="button" data-a="back">← ${E().back}</button></div>`;
    speak(E().avatarCharacter);
    box().querySelectorAll("[data-k]").forEach(b => {
      b.onclick = () => { Store.setAvatar(b.dataset.k); Stats.renderPlayer(); step = "hub"; render(); };
    });
    on("[data-a=back]", () => { step = "avatarFamily"; render(); });
  }

  // Fin d'un chapitre : on calcule et on garde le résultat (un enregistrement par passage : la BK
  // individuelle se met à jour, l'historique reste).
  function finish(character) {
    const base = { id: "ego_" + Date.now().toString(36), player: Store.player, time: Date.now(), kind: chapter };
    if (chapter === "identity") {
      const a = answers, age = parseInt(a.age, 10), month = parseInt(a.birth_month, 10);
      const rec = Object.assign(base, { version: "identity_v1", answers: Object.assign({}, a) });
      // Date de naissance approximative (année et mois), pour que l'âge se mette à jour tout seul.
      if (age && month) {
        const now = new Date(), had = now.getMonth() + 1 >= month;
        rec.birth = (now.getFullYear() - age - (had ? 0 : 1)) + "-" + String(month).padStart(2, "0");
      }
      list().push(rec);
    } else if (chapter === "personality") {
      list().push(Object.assign(base, { version: "personality_v1", answers: answers.slice(), traits: personalityOf(answers) }));
    } else {
      const traits = traitsOf(answers);
      list().push(Object.assign(base, { version: "questionnaire_v1", answers: answers.slice(), character: character || null, traits, percents: percentsOf(traits) }));
      if (character) { Store.setAvatar(character); Stats.renderPlayer(); }
    }
    Store.save();
    clearDraft(chapter);
    current = last(chapter);
    step = chapter === "identity" ? "done" : "result";
    render();
  }

  /* ---------- Les résultats ---------- */
  function result() {
    if (!current) { step = "hub"; return hub(); }
    if (chapter === "personality") return constellation(current);
    return styleResult(current);
  }

  // Ta constellation : une étoile par trait, qui brille plus ou moins (nom toujours positif).
  function constellation(r) {
    const L = lang(), keys = Object.keys(EGO.personalityTraits);
    // Positions des étoiles (ciel de 400 × 260), reliées comme une constellation.
    const POS = [[40, 70], [95, 30], [150, 75], [205, 35], [260, 80], [320, 40], [370, 95],
      [60, 170], [120, 215], [185, 165], [245, 220], [300, 170], [355, 215]];
    const level = k => { const v = r.traits[k]; return v === null ? null : EGO.personalityTraits[k].inv ? 1 - v : v; };
    const stars = keys.map((k, i) => {
      const v = level(k), [x, y] = POS[i];
      const rr = v === null ? 4 : 5 + 9 * v, op = v === null ? 0.25 : 0.35 + 0.65 * v;
      return `<g class="ego-star" style="--d:${(i * 0.17).toFixed(2)}s">
        <circle cx="${x}" cy="${y}" r="${(rr * 2.4).toFixed(1)}" fill="url(#ego-glow)" opacity="${op.toFixed(2)}"></circle>
        <path d="${starPath(x, y, rr)}" fill="#FFE066" opacity="${op.toFixed(2)}"></path></g>`;
    }).join("");
    const lines = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [2, 9], [4, 11]]
      .map(([a, b]) => `<line x1="${POS[a][0]}" y1="${POS[a][1]}" x2="${POS[b][0]}" y2="${POS[b][1]}"></line>`).join("");
    const sorted = keys.filter(k => level(k) !== null).sort((a, b) => level(b) - level(a));
    box().innerHTML = `<div class="ego-sky-wrap">
        <h3 class="ego-sky-title">✨ ${E().constellation}</h3>
        <svg class="ego-sky" viewBox="0 0 400 260" role="img" aria-label="${E().constellation}">
          <defs><radialGradient id="ego-glow"><stop offset="0" stop-color="#FFE98A" stop-opacity="0.55"></stop><stop offset="1" stop-color="#FFE98A" stop-opacity="0"></stop></radialGradient></defs>
          <g class="ego-sky-lines">${lines}</g>${stars}</svg>
      </div>
      <ul class="ego-stars">${keys.map(k => {
        const v = level(k), t = EGO.personalityTraits[k];
        return `<li class="${v === null ? "unknown" : ""}"><span class="ego-star-icon">${t.icon}</span><b>${t[L]}</b>
          <span class="ego-star-meter" aria-label="${v === null ? E().unknown : Math.round(v * 100) + " %"}">${v === null ? "?" : "★".repeat(1 + Math.round(v * 4)) + "☆".repeat(4 - Math.round(v * 4))}</span></li>`;
      }).join("")}</ul>
      ${sorted.length ? `<p class="ego-verdict small">${E().brightest.replace("{a}", `<b>${EGO.personalityTraits[sorted[0]][L]}</b>`).replace("{b}", `<b>${EGO.personalityTraits[sorted[1] || sorted[0]][L]}</b>`)}</p>` : ""}
      <p class="ego-change">🌱 ${E().mayChange}</p>
      <div class="ego-actions">
        ${unlocked("style") ? `<button class="act" type="button" data-a="next">${E().nextChapter} ${ICONS.style}</button>` : ""}
        <button class="act ghost" type="button" data-a="hub">🪞 ${E().backHub}</button>
      </div>`;
    if (sorted.length) speak(box().querySelector(".ego-verdict").textContent);
    on("[data-a=next]", () => begin("style", loadDraft("style")));
    on("[data-a=hub]", () => { step = "hub"; render(); });
  }
  function starPath(x, y, r) {
    let d = "";
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI / 5) * i - Math.PI / 2, rad = i % 2 ? r * 0.45 : r;
      d += (i ? "L" : "M") + (x + rad * Math.cos(a)).toFixed(1) + " " + (y + rad * Math.sin(a)).toFixed(1);
    }
    return d + "Z";
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

  function styleResult(r) {
    const L = lang(), types = EGO.types;
    const order = Object.keys(types).sort((a, b) => r.percents[b] - r.percents[a]);
    const top = order[0];
    // Ce que KibooM a remarqué : les trois caractéristiques les plus marquées.
    const noticed = Object.entries(r.traits)
      .map(([k, v]) => ({ k, v, text: EGO.traits[k] && EGO.traits[k][L][v >= 0 ? 0 : 1] }))
      .filter(x => x.text && Math.abs(x.v) >= 0.25)
      .sort((a, b) => Math.abs(b.v) - Math.abs(a.v)).slice(0, 3);
    const who = r.character ? charName(r.character) : "";
    const asked = r === last("style") && !r.selfAssessment;
    box().innerHTML = `<div class="ego-result">
      <div class="ego-chart">
        ${donut(r.percents)}
        <div class="ego-center">
          ${r.character ? `<span class="card face ego-avatar" style="background-image:url(${cardImg(r.character)})" role="img" aria-label="${esc(who)}"></span>` : `<span class="ego-big">${types[top].icon}</span>`}
        </div>
      </div>
      <div class="ego-side">
        <p class="ego-verdict">${E().verdict.replace("{type}", `<b style="color:${types[top].color}">${types[top].icon} ${types[top][L].name}</b>`).replace("{p}", r.percents[top])}</p>
        <ul class="ego-legend">${order.map(id => `<li>
          <span class="ego-leg-icon" style="background:${types[id].color}">${types[id].icon}</span>
          <span class="ego-leg-txt"><b>${types[id][L].name}</b> <span>${types[id][L].text}</span></span>
          <span class="ego-leg-bar"><i style="width:${r.percents[id]}%;background:${types[id].color}"></i></span>
          <b class="ego-leg-p">${r.percents[id]} %</b></li>`).join("")}</ul>
        <p class="ego-change">🌱 ${E().mayChange}</p>
      </div>
    </div>
    ${noticed.length ? `<div class="ego-noticed"><h3>${E().noticed}</h3><ul>${noticed.map(x => `<li>${x.text}</li>`).join("")}</ul></div>` : ""}
    ${who ? `<p class="ego-who">${E().yourCharacter.replace("{who}", `<b>${esc(who)}</b>`)}</p>` : ""}
    ${asked ? `<div class="ego-self"><h3>${E().selfQuestion}</h3><div class="ego-self-btns">
        ${["agree", "partly", "disagree", SKIP].map(v => `<button class="act ${v === SKIP ? "ghost" : ""}" type="button" data-self="${v}">${E().self[v]}</button>`).join("")}
      </div></div>` : `<div class="ego-actions">
        <button class="act" type="button" data-a="redo">🔁 ${E().redo}</button>
        <button class="act ghost" type="button" data-a="hub">🪞 ${E().backHub}</button>
      </div>`}`;
    speak(box().querySelector(".ego-verdict").textContent + " " + E().mayChange + (asked ? " " + E().selfQuestion : ""));
    box().querySelectorAll("[data-self]").forEach(b => {
      b.onclick = () => {
        r.selfAssessment = b.dataset.self;
        r.goals = {};
        Store.save();
        challengeIdx = 0;
        step = challengesFor(r).length ? "challenge" : "done";
        render();
      };
    });
    on("[data-a=redo]", () => begin("style", null));
    on("[data-a=hub]", () => { step = "hub"; render(); });
  }

  // Les défis, un par un.
  function challenge() {
    const r = current, all = challengesFor(r), c = all[challengeIdx];
    if (!c) { step = "done"; return done(); }
    const L = lang();
    box().innerHTML = `<div class="ego-challenge">
      <p class="ego-ch-count">${E().challengeOf.replace("{n}", challengeIdx + 1).replace("{total}", all.length)}</p>
      <div class="ego-ch-big" aria-hidden="true">${c.icon}</div>
      <p class="ego-ch-text">${c[L]}</p>
      <div class="ego-actions">
        <button class="act" type="button" data-g="accepted">💪 ${E().accept}</button>
        <button class="act ghost" type="button" data-g="declined">🙂 ${E().decline}</button>
      </div></div>`;
    speak(c[L]);
    box().querySelectorAll("[data-g]").forEach(b => {
      b.onclick = () => { r.goals[c.id] = b.dataset.g; Store.save(); challengeIdx++; render(); };
    });
  }

  // Fin : merci ; on propose le chapitre suivant, ou de revenir à l'accueil d'Ego.
  function done() {
    const next = CHAPTERS[CHAPTERS.indexOf(chapter) + 1];
    const goals = chapter === "style" && current && current.goals ? Object.keys(current.goals).filter(k => current.goals[k] === "accepted") : [];
    box().innerHTML = `<div class="ego-intro">
      <div class="ego-mirror" aria-hidden="true">${chapter === "identity" ? "🪪" : "🌟"}</div>
      <p class="ego-lead">${E().thanks[chapter]}</p>
      ${goals.length ? `<div class="ego-noticed"><h3>${E().yourGoals}</h3><ul>${goals.map(g => { const c = EGO.challenges.find(x => x.id === g); return `<li>${c.icon} ${E().goalNames[g]}</li>`; }).join("")}</ul></div>` : ""}
      <div class="ego-actions">
        ${next ? `<button class="act" type="button" data-a="next">${E().nextChapter} ${ICONS[next]}</button>` : ""}
        <button class="act ghost" type="button" data-a="hub">🪞 ${E().backHub}</button>
      </div></div>`;
    speak(E().thanks[chapter]);
    on("[data-a=next]", () => begin(next, loadDraft(next)));
    on("[data-a=hub]", () => { step = "hub"; render(); });
  }

  /* ---------- Ouvrir, fermer, langue ---------- */
  function start(texts) { T = texts; step = "hub"; render(); }
  function leave() { if (typeof Voice !== "undefined") Voice.stop(); }
  function texts(t) { T = t; if (!$("ego-screen").hidden) render(); }
  function init() {
    $("ego-menu").addEventListener("click", () => { location.hash = ""; });
    // Autre joueur : autre BK individuelle ; on revient à l'accueil d'Ego, avec ses chapitres à lui.
    window.addEventListener("kiboom-player", () => { if (!$("ego-screen").hidden && T) { leave(); step = "hub"; render(); } });
  }

  return { init, texts, start, leave, traitsOf, percentsOf, personalityOf, challengesFor };
})();
