/* ZeMowg, le représentant de la personnalisation (KibooM reste le nom de l'ensemble de jeux de maths).
   - Section 5 d'Ego, « Ce que ZeMowg sait de moi » : tout ce qu'on sait de l'enfant, rassemblé à partir
     des 4 autres espaces d'Ego et des traces des jeux, mis à jour à chaque visite. Chaque information dit
     d'où elle vient (💬 tu me l'as dit, 👀 je l'ai remarqué en jouant, 🔮 tu me l'as confirmé) et
     pourquoi ; l'enfant confirme, corrige ou demande d'oublier.
   - « ZeMowg devine… » : des hypothèses tirées du jeu (règles écrites à l'avance, pas d'IA en ligne),
     auxquelles l'enfant répond (C'est vrai ! · Un peu · Pas du tout). Aussi sur la page de lancement.
   - Les surprises : ce que l'enfant a dit et ce qu'il fait ne collent pas, dit avec le sourire.
   Charte : comparé à lui-même, formulations positives, « pour le moment », tout reste sur l'appareil.
   Export : zemowg_guess/4, zemowg_feedback/4. */
const ZeMowg = (() => {
  "use strict";
  let T = null, homeShown = null;
  const lang = () => (document.documentElement.lang === "en" ? "en" : "fr");
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const Z = () => T.zemowg;
  const guesses = () => Store.data.guesses || (Store.data.guesses = []);
  const feedback = () => Store.data.zemowgFeedback || (Store.data.zemowgFeedback = []);
  const lastEgo = kind => (Store.data.ego || []).filter(r => r.player === Store.player && (r.kind || "style") === kind).slice(-1)[0] || null;
  const gameName = id => (T.games[id] ? T.games[id].name : T.versions[id] ? T.versions[id].name : id);

  // La page de ZeMowg et ses images viennent du dépôt MowgAI/ZeMowg (source unique), recopié tel quel
  // dans le dossier zemowg/ (on corrige là-bas, puis on recopie ici). ZeMowg est la déclinaison chocolat
  // de Vac, le chien de Socrate, créé par l'artiste Xavier (« L'Émotif de Xavier ») : toujours le citer.
  const page = () => "zemowg/index.html?lang=" + lang();
  const IMG = "zemowg/zemowg.webp";
  // Le visage de ZeMowg (la bulle 🔮 si l'image ne se charge pas).
  const face = (cls = "") => `<span class="zm-face ${cls}" aria-hidden="true"><img src="${IMG}" alt="" onerror="this.replaceWith('🔮')"></span>`;
  const aboutLink = () => `<a class="zm-about" href="${page()}" target="_blank" rel="noopener">${Z().about} ↗</a>`;
  // Ouvrir la page de ZeMowg (bouton « ZeMowg » de la page de lancement et du menu).
  function open() { window.open(page(), "_blank", "noopener"); }

  /* ---------- Ce que l'enfant a fait ---------- */
  function ctx() {
    const p = Store.player;
    const inst = Store.data.instances.filter(i => i.player === p && (i.end || i.ragequit) && (i.tries || []).length);
    const by = {};
    inst.forEach(i => (by[i.game] = by[i.game] || []).push(i));
    const st = (...ids) => {
      const l = ids.flatMap(id => by[id] || []), ok = l.filter(i => i.success).length;
      return { n: l.length, ok, rate: l.length ? ok / l.length : 0, list: l };
    };
    return {
      inst, by, st,
      kimind: Store.data.kimind.filter(k => k.player === p),
      creations: (Store.data.creations || []).filter(c => c.player === p).length,
      ideas: (Store.data.ideas || []).filter(c => c.player === p).length,
      challenges: (Store.data.challenges || []).filter(r => r.player === p && r.completed),
      persist: inst.filter(i => i.success && i.tries.length >= 4).length,
      evening: inst.filter(i => new Date(i.start).getHours() >= 19).length,
      e: typeof Parcours !== "undefined" ? Parcours.ego() : {},
      likes: Store.likes(), free: Store.likesFree(), avatar: Store.avatar,
    };
  }

  /* ---------- ZeMowg devine… ---------- */
  const RULES = {
    memory: c => c.st("kidory").n >= 4 && c.st("kidory").rate >= 0.6,
    speed: c => c.st("kibal").n >= 4 && c.st("kibal").rate >= 0.6,
    calc: c => { const s = c.st("kiplus", "kicompuzzle", "kipharaon", "kijun"); return s.n >= 6 && s.rate >= 0.6; },
    logic: c => c.kimind.length >= 3,
    duel: c => c.st("kiduel", "kipuzzle").n >= 3,
    create: c => c.creations >= 2 || c.ideas >= 5,
    challenge: c => c.challenges.length >= 2,
    persist: c => c.persist >= 2,
    evening: c => c.inst.length >= 8 && c.evening / c.inst.length >= 0.6,
    auto: () => typeof Parcours !== "undefined" && Parcours.mode() === "auto",
    timer: () => typeof Chrono !== "undefined" && Chrono.mode() === "shown",
    blue: c => !!c.avatar && c.avatar.startsWith("blue"),
    green: c => !!c.avatar && c.avatar.startsWith("green"),
    red: c => !!c.avatar && c.avatar.startsWith("red"),
    yellow: c => !!c.avatar && c.avatar.startsWith("yellow"),
  };
  const answered = () => new Map(guesses().filter(g => g.player === Store.player).map(g => [g.id, g.answer]));
  function pending() {
    const c = ctx(), a = answered();
    return Object.keys(RULES).filter(id => !a.has(id) && EGO.zemowg.guesses[id] && RULES[id](c));
  }
  function answer(id, ans) {
    guesses().push({ player: Store.player, id, answer: ans, time: Date.now() });
    Store.save();
  }
  const guessText = id => { const g = EGO.zemowg.guesses[id]; return g.icon + " " + g[lang()]; };
  const guessButtons = id => `<span class="zm-btns"><button class="act" type="button" data-g="${id}" data-ans="yes">${Z().yes}</button>
    <button class="act ghost" type="button" data-g="${id}" data-ans="bit">${Z().bit}</button>
    <button class="act ghost" type="button" data-g="${id}" data-ans="no">${Z().no}</button></span>`;

  // Sur la page de lancement : une hypothèse à la fois (la même pendant la visite), s'il y en a une.
  function guessCardHTML() {
    if (!T || !Store.player) return "";
    const p = pending();
    if (!p.length) return "";
    if (!homeShown || !p.includes(homeShown)) homeShown = p[Math.floor(Math.random() * p.length)];
    return `<div class="zm-card" data-zm-home>${face()}<div><p class="zm-title">${Z().guessTitle}</p><p>${esc(guessText(homeShown))}</p>${guessButtons(homeShown)}<p class="zm-credit">${aboutLink()}</p></div></div>`;
  }
  function wire(root, rerender) {
    root.querySelectorAll("[data-g]").forEach(b => {
      b.onclick = () => {
        answer(b.dataset.g, b.dataset.ans);
        const box = b.closest(".zm-card, .zm-guess");
        if (box) box.innerHTML = `${face()}<p class="zm-thanks">${Z().thanks[b.dataset.ans]}</p>`;
        homeShown = null;
        if (rerender) setTimeout(rerender, 1400);
      };
    });
  }

  /* ---------- Ce que ZeMowg sait de moi ---------- */
  const optLabel = (q, id) => { const o = (q.options || []).find(x => x.id === id); return o ? (o.icon ? o.icon + " " : "") + o[lang()] : id; };
  const countryLabel = id => { const c = EGO.countries.find(x => x.id === id); return c ? c.icon + " " + c[lang()] : id; };

  function planets() {
    const L = lang(), c = ctx(), out = [];
    const fact = (id, text, src, extra = {}) => Object.assign({ id, text, src }, extra);

    // 🪪 Qui je suis (chapitre 1) et pays (Mes goûts)
    const idr = lastEgo("identity"), who = [];
    if (idr) EGO.identity.forEach(q => {
      const a = idr.answers[q.id];
      if (a === undefined || a === "skip" || (Array.isArray(a) && !a.length)) return;
      const v = Array.isArray(a) ? a.map(x => optLabel(q, x)).join(", ") : q.options ? optLabel(q, a) : a;
      who.push(fact("id_" + q.id, (Z().idLabels[q.id] || q[L]) + " " + v, "told", { fix: "identity" }));
    });
    ["country_live", "country_love"].forEach(k => { if ((c.likes[k] || [])[0]) who.push(fact(k, Z().idLabels[k] + " " + countryLabel(c.likes[k][0]), "told", { fix: "tastes" })); });
    out.push({ id: "identity", icon: "🪪", facts: who });

    // ✨ Ma personnalité (chapitre 2)
    const pers = lastEgo("personality"), me = [];
    if (pers) {
      const pt = Ego.portraitOf(pers, lastEgo("style")), PT = EGO.personalityTraits;
      if (pt.superpower) me.push(fact("superpower", Z().superpower + " " + PT[pt.superpower].icon + " " + PT[pt.superpower][L] + " : " + EGO.superpowers[pt.superpower][L], "told", { fix: "personality" }));
      pt.forces.forEach(f => me.push(fact("force_" + f.id, "✨ " + f[L], "told", { fix: "personality" })));
    }
    out.push({ id: "personality", icon: "✨", facts: me });

    // 🎮 Mon style de joueur (chapitre 3)
    const style = lastEgo("style"), sty = [];
    if (style && style.percents) {
      const top = Object.keys(style.percents).sort((a, b) => style.percents[b] - style.percents[a]);
      sty.push(fact("type", Z().type + " " + EGO.types[top[0]].icon + " " + EGO.types[top[0]][L].name + " (" + style.percents[top[0]] + " %) : " + EGO.types[top[0]][L].text, "told", { fix: "style" }));
      Object.keys(style.goals || {}).filter(g => style.goals[g] === "accepted").forEach(g => sty.push(fact("goal_" + g, "🎯 " + Z().goal + " " + (T.ego.goalNames[g] || g), "told", { fix: "style" })));
    }
    if (c.avatar) sty.push(fact("avatar", Z().avatar, "told", { fix: "avatar", card: c.avatar }));
    out.push({ id: "style", icon: "🎮", facts: sty });

    // ❤️ Mes goûts (espace 4)
    const tq = EGO.likes.concat(EGO.likesExtra || []), goo = [];
    tq.forEach(q => {
      if (q.type === "select" || q.id === "screen_liking" || q.id === "after_screen" || q.id === "fears") return;
      const v = (c.likes[q.id] || []).filter(x => x !== "dunno" && x !== "none");
      const f = c.free[q.id];
      if (!v.length && !f) return;
      const txt = v.map(x => optLabel(q, x)).concat(f ? ["« " + f + " »"] : []).join(", ");
      goo.push(fact("like_" + q.id, (Z().likeLabels[q.id] || q[L]) + " " + txt, "told", { fix: "tastes" }));
    });
    // « Ceci ou cela ? » et « Mon univers » (js/gouts.js)
    const tot = Gouts.summary();
    if (tot.length) goo.push(fact("tot", Z().totFact + " " + tot.map(x => x.text).join(", "), "told", { fix: "tot" }));
    if (Gouts.univers().items.length) goo.push(fact("univers", Z().universFact, "told", { fix: "univers", html: Gouts.universLine() }));
    out.push({ id: "tastes", icon: "❤️", facts: goo });

    // 👀 Ce que j'ai remarqué en jouant (traces des jeux), comparé à lui-même seulement.
    const seen = [];
    const fav = Object.keys(c.by).filter(g => c.by[g].length >= 3).sort((a, b) => c.by[b].length - c.by[a].length).slice(0, 3);
    if (fav.length) seen.push(fact("fav_games", Z().favGames + " " + fav.map(gameName).join(", "), "seen", { why: fav.map(g => Z().playedN(gameName(g), c.by[g].length)).join(" ; ") }));
    Object.keys(c.by).forEach(g => {
      const s = c.st(g);
      if (s.n >= 4 && s.rate >= 0.7) seen.push(fact("good_" + g, Z().goodAt(gameName(g)), "seen", { why: Z().okN(s.ok, s.n) }));
      if (s.n >= 8) {
        const first = s.list.slice(0, 5).filter(i => i.success).length, lastOk = s.list.slice(-5).filter(i => i.success).length;
        if (lastOk > first) seen.push(fact("progress_" + g, Z().progress(gameName(g)), "seen", { why: Z().progressWhy(first, lastOk) }));
      }
    });
    if (c.kimind.filter(k => k.won).length >= 2) seen.push(fact("kimind", Z().kimindWon(c.kimind.filter(k => k.won).length), "seen", { why: Z().kimindWhy }));
    if (c.challenges.length) {
      const best = {};
      c.challenges.forEach(r => { best[r.difficulty] = Math.min(best[r.difficulty] || Infinity, r.total); });
      const d = ["kimind", "ultimate", "hard", "medium", "easy"].find(x => best[x]);
      seen.push(fact("record", Z().record(Chrono.fmt(best[d]), T.kichallenge.diffs[d]), "seen", { why: Z().runsN(c.challenges.length) }));
    }
    if (c.creations) seen.push(fact("creations", Z().creations(c.creations), "seen", { why: Z().creationsWhy }));
    if (c.ideas >= 3) seen.push(fact("ideas", Z().ideas(c.ideas), "seen", { why: Z().ideasWhy }));
    if (c.persist >= 2) seen.push(fact("persist", Z().persist(c.persist), "seen", { why: Z().persistWhy }));
    out.push({ id: "seen", icon: "👀", facts: seen });

    // 🔮 Ce que tu m'as confirmé (« ZeMowg devine… »)
    const conf = guesses().filter(g => g.player === Store.player && g.answer !== "no" && EGO.zemowg.guesses[g.id])
      .map(g => fact("guess_" + g.id, guessText(g.id) + " → " + Z().answers[g.answer], "guess"));
    out.push({ id: "confirmed", icon: "🔮", facts: conf });

    // Ce que l'enfant a demandé d'oublier n'apparaît plus.
    const forgot = new Set(feedback().filter(f => f.player === Store.player && f.answer === "forget").map(f => f.fact));
    out.forEach(p => { p.facts = p.facts.filter(f => !forgot.has(f.id)); });
    return out;
  }

  // Les surprises : ce que l'enfant a dit et ce qu'il fait ne collent pas.
  function surprises() {
    const c = ctx(), S = EGO.zemowg.surprises, L = lang(), out = [];
    const pers = lastEgo("personality"), tr = (pers && pers.traits) || {}, style = lastEgo("style");
    if (style && c.e.reflect >= 0.4 && c.st("kibal").n >= 4 && c.st("kibal").rate >= 0.7) out.push(S.fast_thinker[L]);
    if (pers && (tr.openness !== null && tr.openness !== undefined && tr.openness <= 0.4) && c.creations >= 3) out.push(S.creative[L].replace("{n}", c.creations));
    if (style && c.e.type && c.e.type !== "achiever" && c.e.goal <= 0 && c.challenges.length >= 3) out.push(S.challenger[L].replace("{n}", c.challenges.length));
    if (pers && tr.conscientiousness !== null && tr.conscientiousness !== undefined && tr.conscientiousness <= 0.4 && c.persist >= 3) out.push(S.persistent[L].replace("{n}", c.persist));
    return out;
  }

  // La page (section 5 d'Ego). go(action) : ouvrir le chapitre ou l'espace à corriger.
  function renderKnows(box, go) {
    const ps = planets(), src = { told: "💬 " + Z().srcTold, seen: "👀 " + Z().srcSeen, guess: "🔮 " + Z().srcGuess };
    const fb = new Map(feedback().filter(f => f.player === Store.player).map(f => [f.fact, f.answer]));
    const pend = pending(), surp = surprises();
    const factHTML = f => `<li class="zm-fact" data-f="${f.id}">
        ${f.card ? `<span class="card face zm-mini" style="background-image:url(assets/cards/${f.card}.webp)"></span>` : ""}
        <div class="zm-fact-body"><p>${esc(f.text)}</p>${f.html ? `<p class="zm-univers">${f.html}</p>` : ""}
          <p class="zm-src">${src[f.src]}${f.why ? ` · <span class="zm-why">${Z().why} ${esc(f.why)}</span>` : ""}</p>
          <p class="zm-fact-btns">${fb.get(f.id) === "agree" ? `<span class="zm-ok">✔ ${Z().agreed}</span>` : `<button type="button" data-fb="agree">✔ ${Z().agree}</button>`}
            ${f.fix ? `<button type="button" data-fix="${f.fix}">✏️ ${Z().fix}</button>` : ""}
            ${f.src === "seen" ? (fb.get(f.id) === "disagree" ? `<span class="zm-ok">${Z().disagreed}</span>` : `<button type="button" data-fb="disagree">🙅 ${Z().disagree}</button>`) : ""}
            ${f.src !== "told" ? `<button type="button" data-fb="forget">🙈 ${Z().forget}</button>` : ""}</p></div></li>`;
    box.innerHTML = `<div class="zm-head">${face("big")}<div><h3 class="ego-question">${Z().knowsTitle}</h3><p class="ego-sub">${Z().knowsIntro}</p><p class="zm-credit">${aboutLink()} · ${Z().credit}</p></div></div>
      ${pend.length ? `<section class="zm-guesses"><h4>${Z().guessTitle}</h4>${pend.slice(0, 3).map(id => `<div class="zm-guess"><p>${esc(guessText(id))}</p>${guessButtons(id)}</div>`).join("")}</section>` : ""}
      ${surp.length ? `<section class="zm-surprises"><h4>😮 ${Z().surprisesTitle}</h4><ul>${surp.map(s => `<li>${esc(s)}</li>`).join("")}</ul></section>` : ""}
      <div class="zm-planets">${ps.map(p => `<section class="zm-planet zm-${p.id}"><h4>${p.icon} ${Z().planets[p.id]}</h4>
        ${p.facts.length ? `<ul>${p.facts.map(factHTML).join("")}</ul>` : `<p class="zm-empty">${Z().empty[p.id]}</p>${Z().emptyFix[p.id] ? `<button class="act ghost" type="button" data-fix="${p.id === "seen" || p.id === "confirmed" ? "" : p.id}">${Z().emptyFix[p.id]}</button>` : ""}`}
      </section>`).join("")}</div>
      <p class="ego-change">🔒 ${Z().privacy}</p>`;
    wire(box, () => renderKnows(box, go));
    box.querySelectorAll("[data-fb]").forEach(b => {
      b.onclick = () => {
        feedback().push({ player: Store.player, fact: b.closest("[data-f]").dataset.f, answer: b.dataset.fb, time: Date.now() });
        Store.save();
        const y = window.scrollY;
        renderKnows(box, go);
        window.scrollTo(0, y);
      };
    });
    box.querySelectorAll("[data-fix]").forEach(b => { if (b.dataset.fix) b.onclick = () => go(b.dataset.fix); });
  }

  // Pour la carte de la section 5 sur l'accueil d'Ego : combien de choses ZeMowg sait.
  function count() { return planets().reduce((t, p) => t + p.facts.length, 0); }

  function texts(t) { T = t; }
  return { texts, renderKnows, guessCardHTML, wire, pending, count, face, open };
})();
