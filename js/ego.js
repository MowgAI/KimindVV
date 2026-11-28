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
  // Le chapitre 2 : les phrases de personnalité (échelle), puis « Ce que j'aime » (EGO.likes).
  const items = ch => (ch === "identity" ? EGO.identity : ch === "personality" ? EGO.personality.concat(EGO.likes) : EGO.questions);
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
  // Le portrait : les règles de regroupement (EGO.portrait) qui correspondent à l'enfant, d'après sa
  // personnalité (pers) et, s'il existe, son style de joueur (style). Renvoie le super-pouvoir (son
  // étoile la plus brillante), jusqu'à 3 forces et 2 petits points à travailler.
  function portraitOf(pers, style) {
    const val = key => {
      const [src, k] = key.split(".");
      const v = src === "p" ? pers.traits[k] : style && style.traits ? style.traits[k] : undefined;
      return v === null ? undefined : v;
    };
    const ok = c => { const v = val(c[0]); return v !== undefined && (c[1] === ">=" ? v >= c[2] : v <= c[2]); };
    const matched = EGO.portrait.filter(r => r.all.every(ok)).sort((a, b) => b.prio - a.prio);
    const level = k => { const v = pers.traits[k]; return v === null || v === undefined ? null : EGO.personalityTraits[k].inv ? 1 - v : v; };
    const bright = Object.keys(EGO.personalityTraits).filter(k => level(k) !== null).sort((a, b) => level(b) - level(a));
    return {
      superpower: bright.length && level(bright[0]) >= 0.5 ? bright[0] : null,
      also: bright.slice(1, 3).filter(k => level(k) >= 0.67),
      forces: matched.filter(r => r.kind === "force").slice(0, 3),
      watches: matched.filter(r => r.kind === "watch").slice(0, 2),
    };
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
    ({ hub, quiz, family: familyStep, character: characterStep, result, challenge, done, avatarFamily, avatarCharacter, lines, tastes, knows }[step] || hub)();
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
          <button class="act ghost ego-change-avatar" type="button" data-a="avatar">🖼️ ${avatar ? E().changeAvatar : E().chooseAvatar}</button>
          <button class="act ghost ego-change-avatar" type="button" data-a="lines">✍️ ${T.repliques.button}</button></div>
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
      }).join("")}${tastesCard()}${knowsCard()}</div>
      <p class="ego-change">🌱 ${E().mayChange}</p>`;
    on("[data-a=tastes]", () => { step = "tastes"; tastesRec = null; render(); });
    on("[data-a=knows]", () => { step = "knows"; render(); });
    on("[data-a=avatar]", () => { step = "avatarFamily"; render(); });
    on("[data-a=lines]", () => { step = "lines"; render(); });
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
    if (chapter === "personality" && !q.options) {
      title = `<span class="ego-asks">${E().likeYou}</span>${q[L]}`;
      opts = EGO.scale.map(o => ({ id: String(o.v), icon: o.icon, label: o[L] }));
      said = E().likeYou + " " + q[L];
    } else {
      title = q[L];
      opts = q.options.map(o => ({ id: o.id, icon: o.icon, label: o[L] }));
      said = q[L] + " " + opts.map(o => o.label).join(" ; ");
    }
    const kind = !q.options || q.id === "screen_liking" ? " scale" : q.options.length > 6 ? " many" : "";
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

  /* ---------- 4e espace : « Mes goûts », ouvert à tout moment, dans l'ordre qu'on veut ----------
     La première fois, les goûts viennent à la fin du chapitre 2 (enchaînement de questions) ; ici, on
     ajoute ou on change une info sans tout refaire. Chaque visite qui change quelque chose crée un
     enregistrement daté (kind « likes ») : la BK individuelle garde l'évolution (Store.likes fusionne). */
  let tastesRec = null;
  const TASTE_QS = () => EGO.likes.concat(EGO.likesExtra || []);
  function tastesCard() {
    const lk = Store.likes();
    const icons = TASTE_QS().flatMap(q => (lk[q.id] || []).map(v => ((q.options || EGO[q.list] || []).find(o => o.id === v) || {}).icon)).filter(Boolean).slice(0, 10).join(" ");
    return `<section class="ego-chapter ego-tastes">
      <div class="ego-ch-num">4</div>
      <div class="ego-ch-icon" aria-hidden="true">❤️</div>
      <h3>${T.tastes.name}</h3><p>${T.tastes.text}</p>
      <p class="ego-ch-status">${icons ? icons : "▶ " + E().toDo}</p>
      <div class="ego-ch-btns"><button class="act${icons ? " ghost" : ""}" type="button" data-a="tastes">${icons ? T.tastes.edit : T.tastes.open}</button></div>
    </section>`;
  }
  function saveTaste(q, value, isFree) {
    if (!tastesRec) {
      tastesRec = { id: "ego_" + Date.now().toString(36), player: Store.player, time: Date.now(), kind: "likes", version: "likes_v1", likes: {}, free: {} };
      list().push(tastesRec);
    }
    if (isFree) tastesRec.free[q] = value; else tastesRec.likes[q] = value;
    tastesRec.time = Date.now();
    Store.save();
  }
  // Une question de « Mes goûts » : boutons à cocher (une ou plusieurs réponses), liste (pays) ou texte
  // libre seul ; « when » : la question ne s'ouvre que si elle a du sens (l'équipe si on aime le foot…).
  function tasteQHTML(q, lk, free, L) {
    let body = "";
    if (q.type === "select") {
      const list = EGO[q.list] || [], cur = (lk[q.id] || [])[0] || "";
      body = `<select class="taste-select"><option value="">—</option>${list.map(o => `<option value="${o.id}"${o.id === cur ? " selected" : ""}>${o.icon} ${esc(o[L])}</option>`).join("")}</select>`;
    } else if (q.type !== "free") {
      body = `<div class="taste-opts">${q.options.map(o => `<button type="button" class="taste-opt" data-o="${o.id}" aria-pressed="${(lk[q.id] || []).includes(o.id)}"${o.colors ? ` style="--c1:${o.colors[0]};--c2:${o.colors[1]}"` : ""}>${o.colors ? `<i class="taste-colors"></i>` : o.icon + " "}${esc(o[L])}</button>`).join("")}</div>`;
    }
    const ph = q.type === "free" ? T.tastes.freeOnly : T.tastes.free;
    return `<section class="taste-q${q.when ? " taste-sub" : ""}" data-q="${q.id}"><h4>${q[L]}</h4>${body}
      ${q.type === "select" ? "" : `<input class="taste-free" type="text" maxlength="80" placeholder="${esc(ph)}" value="${esc(free[q.id] || "")}">`}</section>`;
  }
  function tastes() {
    const lk = Store.likes(), free = Store.likesFree(), L = lang(), keepY = window.scrollY;
    box().innerHTML = `<div class="ego-q"><h3 class="ego-question">❤️ ${T.tastes.name}</h3><p class="ego-sub">${T.tastes.intro}</p></div>
      ${TASTE_QS().filter(q => !q.when || q.when(lk)).map(q => tasteQHTML(q, lk, free, L)).join("")}
      <p class="ego-change">💾 ${T.tastes.saved}</p>
      <div class="ego-nav"><button class="act" type="button" data-a="back">✔ ${T.tastes.done}</button></div>`;
    window.scrollTo(0, keepY);
    box().querySelectorAll(".taste-q").forEach(sec => {
      const q = TASTE_QS().find(x => x.id === sec.dataset.q);
      sec.querySelectorAll(".taste-opt").forEach(b => {
        b.onclick = () => {
          const cur = (Store.likes()[q.id] || []).slice(), o = b.dataset.o, has = cur.includes(o);
          const next = q.multi ? (has ? cur.filter(x => x !== o) : cur.concat(o)) : (has ? [] : [o]);
          saveTaste(q.id, q.multi ? next : (next[0] || "skip"));
          // Aimer et ne pas aimer la même chose : la dernière réponse l'emporte.
          if (q.id === "dislikes" && !has) { const h = (Store.likes().hobbies || []).filter(x => x !== o); saveTaste("hobbies", h); }
          if (q.id === "hobbies" && !has) { const d = (Store.likes().dislikes || []).filter(x => x !== o); saveTaste("dislikes", d); }
          tastes();      // des questions peuvent s'ouvrir ou se fermer (l'équipe si on coche le foot…)
        };
      });
      const sel = sec.querySelector(".taste-select");
      if (sel) sel.onchange = () => saveTaste(q.id, sel.value ? [sel.value] : "skip");
      const input = sec.querySelector(".taste-free");
      if (input) input.addEventListener("change", () => saveTaste(q.id, input.value.trim().slice(0, 80), true));
    });
    on("[data-a=back]", () => { step = "hub"; render(); });
  }

  /* ---------- 5e espace : « Ce que ZeMowg sait de moi » (js/zemowg.js) ----------
     Tout ce qu'on sait, rassemblé à partir des 4 autres espaces et des jeux ; l'enfant confirme ou corrige. */
  function knowsCard() {
    const n = ZeMowg.count();
    return `<section class="ego-chapter ego-knows">
      <div class="ego-ch-num">5</div>
      <div class="ego-ch-icon">${ZeMowg.face()}</div>
      <h3>${T.zemowg.knowsTitle}</h3><p>${T.zemowg.knowsText}</p>
      <p class="ego-ch-status">${n ? T.zemowg.knowsCount(n) : "🌱 " + T.zemowg.knowsNone}</p>
      <div class="ego-ch-btns"><button class="act" type="button" data-a="knows">${T.zemowg.knowsGo}</button></div>
    </section>`;
  }
  function knows() {
    box().innerHTML = `<div class="zm-box"></div><div class="ego-nav"><button class="act ghost" type="button" data-a="back">← ${E().back}</button></div>`;
    on("[data-a=back]", () => { step = "hub"; render(); });
    ZeMowg.renderKnows(box().querySelector(".zm-box"), action => {
      if (action === "tastes") { step = "tastes"; tastesRec = null; render(); }
      else if (action === "avatar") { step = "avatarFamily"; render(); }
      else if (action === "personality" && last("personality")) { chapter = "personality"; current = last("personality"); step = "result"; render(); }
      else if (CHAPTERS.includes(action) && unlocked(action)) begin(action, null);
      else { step = "hub"; render(); }
    });
  }

  // « Mes répliques » : l'enfant écrit ses propres phrases (même taquines : lui peut se le permettre),
  // que son avatar dira pendant les jeux, à lui seulement, mélangées aux répliques de KibooM (js/repliques.js).
  let lineMoment = "success";
  function lines() {
    const R = T.repliques, mine = Repliques.myOwn();
    box().innerHTML = `<div class="ego-q"><h3 class="ego-question">✍️ ${R.title}</h3><p class="ego-sub">${R.intro}</p></div>
      <div class="rep-form">
        <label class="rep-lbl" for="rep-moment">${R.when}</label>
        <select id="rep-moment">${Repliques.OWN_MOMENTS.map(m => `<option value="${m}"${m === lineMoment ? " selected" : ""}>${R.moments[m]}</option>`).join("")}</select>
        <input id="rep-text" type="text" maxlength="80" placeholder="${esc(R.placeholder)}" autocomplete="off">
        <button class="act" type="button" data-a="addline">➕ ${R.add}</button>
      </div>
      <p class="ego-sub">${R.example}</p>
      ${mine.length ? Repliques.OWN_MOMENTS.filter(m => mine.some(l => l.moment === m)).map(m => `<h4 class="rep-h">${R.moments[m]}</h4><ul class="rep-list">${mine.filter(l => l.moment === m).map(l => `<li><span>« ${esc(l.text)} »</span><button class="act ghost" type="button" data-del="${l.id}" aria-label="${R.remove}">🗑️</button></li>`).join("")}</ul>`).join("") : `<p class="ego-sub">${R.empty}</p>`}
      <p class="ego-change">🔒 ${R.onlyYou}</p>
      <div class="ego-nav"><button class="act ghost" type="button" data-a="back">← ${E().back}</button></div>`;
    const input = box().querySelector("#rep-text"), sel = box().querySelector("#rep-moment");
    sel.onchange = () => { lineMoment = sel.value; };
    const add = () => { if (Repliques.addOwn(sel.value, input.value)) { lineMoment = sel.value; render(); const i = box().querySelector("#rep-text"); if (i) i.focus(); } };
    on("[data-a=addline]", add);
    input.addEventListener("keydown", ev => { if (ev.key === "Enter") add(); });
    box().querySelectorAll("[data-del]").forEach(b => { b.onclick = () => { Repliques.removeOwn(b.dataset.del); render(); }; });
    on("[data-a=back]", () => { step = "hub"; render(); });
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
      // Les goûts (« Ce que j'aime ») : les réponses après les phrases de personnalité.
      const likes = {};
      EGO.likes.forEach((q, i) => { const a = answers[EGO.personality.length + i]; if (a !== undefined) likes[q.id] = a; });
      list().push(Object.assign(base, { version: "personality_v2", answers: answers.slice(0, EGO.personality.length), likes, traits: personalityOf(answers) }));
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
      ${portraitHTML(r)}
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
    const pEl = box().querySelector(".ego-portrait");
    if (pEl) speak(pEl.textContent.replace(/[✨🌱🔮]/g, ""));
    else if (sorted.length) speak(box().querySelector(".ego-verdict").textContent);
    on("[data-a=next]", () => begin("style", loadDraft("style")));
    on("[data-a=hub]", () => { step = "hub"; render(); });
  }
  // « Ton portrait » : un petit texte composé à partir des regroupements, pas une liste d'étoiles.
  function portraitHTML(r) {
    const L = lang(), style = last("style"), pt = portraitOf(r, style), T2 = EGO.personalityTraits;
    const sp = pt.superpower;
    const parts = [];
    if (sp) parts.push(`<p class="ego-power">${E().superpower.replace("{icon}", T2[sp].icon).replace("{name}", `<b>${T2[sp][L]}</b>`).replace("{text}", EGO.superpowers[sp][L])}</p>`);
    const lines = pt.forces.map(f => f[L]);
    // Peu de regroupements trouvés : on complète avec les autres étoiles qui brillent fort.
    if (lines.length < 2) pt.also.forEach(k => lines.push(E().alsoStar.replace("{name}", T2[k][L]).replace("{text}", EGO.superpowers[k][L])));
    if (lines.length) parts.push(`<ul class="ego-portrait-list">${lines.map(t => `<li>✨ ${t}</li>`).join("")}</ul>`);
    if (pt.watches.length) parts.push(`<h4>${E().toWork}</h4><ul class="ego-portrait-list watch">${pt.watches.map(w => `<li>🌱 ${w[L]}</li>`).join("")}</ul>`);
    if (!style) parts.push(`<p class="ego-portrait-note">${E().portraitMore}</p>`);
    if (!parts.length) return "";
    return `<div class="ego-portrait"><h3>🔮 ${E().portraitTitle}</h3><p class="ego-portrait-intro">${E().portraitIntro}</p>${parts.join("")}</div>`;
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
    $("ego-menu").addEventListener("click", () => Home.back());
    // Autre joueur : autre BK individuelle ; on revient à l'accueil d'Ego, avec ses chapitres à lui.
    window.addEventListener("kiboom-player", () => { if (!$("ego-screen").hidden && T) { leave(); step = "hub"; render(); } });
  }

  return { init, texts, start, leave, traitsOf, percentsOf, personalityOf, challengesFor, portraitOf };
})();
