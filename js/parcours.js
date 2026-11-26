/* Le parcours de KibooM : « Continuer mon aventure ».
   Ne pas avancer niveau par niveau dans un seul jeu : challenger, brûler des étapes, changer de
   jeu, proposer des jeux plus exigeants… en fonction de l'enfant, comparé à lui-même (charte de la
   personnalisation) :
   - dès le départ, d'après Ego KibooM (passe-temps, type de joueur, personnalité, ce qu'il dit de
     l'écran, ses peurs, ses défis acceptés) ;
   - puis d'après ce qu'il fait dans chaque jeu : un « niveau d'aisance » par jeu (0 à 1), qui monte
     quand il réussit (plus encore sans aide et vite) et descend quand il échoue ; un jeu jamais joué
     part de ce qu'il a montré dans les jeux qui demandent les mêmes compétences (lang/semantique.js).
   Le prochain exercice est choisi pour avoir à peu près 2 chances sur 3 de réussir (plus haut pour
   un enfant qui aime le défi, plus doux pour un enfant sensible), en variant les jeux ; Kiboo
   (récompense, et voie à part entière pour les « non scolaires ») et les ateliers créatifs sont
   proposés de temps en temps.
   Pendant le jeu, un petit bandeau de l'avatar propose de sauter des niveaux quand c'est trop facile,
   de changer quand ça résiste, et l'aventure suivante après quelques exercices.
   Textes : T.parcours. Données : Store.data.adventure (exporté en Prolog). */
const Parcours = (() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const KIMIND_LEVEL = { easy: 1, medium: 2, hard: 3 };
  const KIBOO_URL = "https://mowgai.github.io/Kiboo/";
  let T = null, pending = {}, picked = {}, current = null, seen = null, rerolls = [];

  /* ---------- Les deux modes ---------- */
  // « free » : l'enfant choisit son parcours (KibooM propose seulement) ; « auto » : KibooM choisit
  // les exercices et les niveaux. Gardé par joueur (Store.data.modes).
  const mode = () => ((Store.data.modes || {})[Store.player] === "auto" ? "auto" : "free");
  function setMode(m) {
    Store.data.modes = Store.data.modes || {};
    Store.data.modes[Store.player] = m;
    Store.save();
    document.body.classList.toggle("mode-auto", m === "auto");
  }
  // Qui a choisi l'exercice qui commence (pour la BK) : consommé une fois par jeu lancé par KibooM.
  function chosenBy(game) {
    if (picked[game]) { const v = picked[game]; delete picked[game]; return v; }
    return mode() === "auto" && game ? "ai" : "student";
  }

  const lang = () => (document.documentElement.lang === "en" ? "en" : "fr");
  const S = () => window.SEMANTIQUE.games;
  const steps = () => (Store.data.adventure || (Store.data.adventure = []));
  const myStepsLog = () => steps().filter(s => s.player === Store.player);
  const lastEgo = kind => (Store.data.ego || []).filter(r => r.player === Store.player && (r.kind || "style") === kind).slice(-1)[0] || null;
  const sig = x => 1 / (1 + Math.exp(-x));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const gameName = id => (T.games[id] ? T.games[id].name : T.versions[id] ? T.versions[id].name : id);

  /* ---------- Ce que l'enfant a fait ---------- */
  // Les exercices finis d'un jeu, dans l'ordre : { level, d (difficulté 0..1), s (0..1), fast }.
  function results(id) {
    const g = S()[id];
    if (!g) return [];
    const n = g.levels, d = l => (n > 1 ? (l - 1) / (n - 1) : 0.5);
    if (g.kimind) {
      return Store.data.kimind.filter(k => k.player === Store.player && k.version === id)
        .map(k => { const l = KIMIND_LEVEL[k.level] || 1; return { level: l, d: d(l), s: k.won ? 1 : 0, fast: k.won && k.rounds <= 4, time: k.time }; });
    }
    const list = Store.data.instances.filter(i => i.player === Store.player && i.game === id && (i.end || i.ragequit) && (i.tries || []).length);
    const durs = list.filter(i => i.success && i.end).map(i => i.end - i.start).sort((a, b) => a - b);
    const median = durs.length ? durs[Math.floor(durs.length / 2)] : Infinity;
    return list.map(i => {
      const autonomous = (i.tries || []).every(t => t.autonomous !== false) && !i.help;
      const s = i.ragequit ? 0 : i.success ? (autonomous ? 1 : 0.7) : 0;
      return { level: i.level, d: d(i.level), s, fast: !!i.success && autonomous && i.end && i.end - i.start <= median, time: i.start };
    });
  }

  // Ce que l'enfant a dit dans Ego, réduit à quelques nombres (0 si on ne sait pas).
  function ego() {
    const style = lastEgo("style"), pers = lastEgo("personality"), id = lastEgo("identity");
    const tr = (pers && pers.traits) || {}, st = (style && style.traits) || {}, lk = (pers && pers.likes) || {};
    const arr = k => (Array.isArray(lk[k]) ? lk[k] : []);
    const type = style && style.percents ? Object.keys(style.percents).sort((a, b) => style.percents[b] - style.percents[a])[0] : null;
    const goals = style && style.goals ? Object.keys(style.goals).filter(g => style.goals[g] === "accepted") : [];
    return {
      type, goals, hobbies: arr("hobbies"), fears: arr("fears").filter(f => f !== "none"), afterScreen: arr("after_screen"),
      emotivity: tr.emotivity || 0, neuroticism: tr.neuroticism || 0, aggressiveness: tr.aggressiveness || 0,
      risk: tr.risk_aversion || 0, extraversion: tr.extraversion || 0, individualism: tr.individualism || 0,
      creativity: Math.max(tr.creativity || 0, tr.openness || 0), experience: tr.experience || 0,
      reason: st.reason || 0, novelty: st.novelty || 0, act: st.act || 0, reflect: st.reflect || 0, goal: st.goal || 0,
      known: !!(style || pers || id),
    };
  }

  // Affinité de l'enfant pour chaque compétence, d'après Ego (−1 à 1).
  function skillAffinity(e) {
    return {
      logic: e.reason * 0.6 + (e.type === "architect" ? 0.3 : 0),
      strategy: e.experience * 0.4 + (e.hobbies.includes("board_games") ? 0.3 : 0) + (e.hobbies.includes("video_games") ? 0.2 : 0),
      memory: (e.hobbies.includes("drawing") ? 0.2 : 0) + (e.type === "spectateur" ? 0.2 : 0),
      speed: e.act * 0.5 - e.reflect * 0.3 + (e.hobbies.includes("sport") ? 0.1 : 0),
      calc: e.goal * 0.3 + (e.type === "achiever" ? 0.2 : 0),
    };
  }
  const weights = (id, d) => {
    const sk = S()[id].skills, w = {};
    Object.keys(sk).forEach(k => { w[k] = sk[k][0] + (sk[k][1] - sk[k][0]) * d; });
    return w;
  };

  // Le niveau d'aisance de l'enfant dans chaque jeu (0 : tout début, 1 : maîtrise le dernier niveau).
  function abilities(e) {
    const ids = Object.keys(S()), aff = skillAffinity(e), a = {}, played = {};
    ids.forEach(id => {
      const w = weights(id, 0.5), tot = Object.values(w).reduce((x, y) => x + y, 0) || 1;
      const prior = 0.12 + 0.12 * Object.keys(w).reduce((x, k) => x + (w[k] / tot) * (aff[k] || 0), 0);
      let v = prior;
      const res = results(id);
      res.forEach(r => {
        const expect = sig((v - r.d) * 6), k = 0.18;
        v += k * ((r.fast && r.s === 1 ? 1.15 : r.s) - expect);
        if (r.s >= 0.7 && r.d > v) v = Math.min(r.d, v + 0.1);       // réussir plus dur que prévu : on rattrape vite
      });
      a[id] = Math.max(0, Math.min(1.05, v));
      played[id] = res.length;
    });
    // Un jeu jamais joué hérite (en partie) de l'aisance montrée dans les jeux aux mêmes compétences.
    const skillLevel = {};
    ["memory", "calc", "logic", "strategy", "speed"].forEach(k => {
      let s = 0, n = 0;
      ids.filter(id => played[id]).forEach(id => { const w = weights(id, a[id])[k] || 0; s += w * a[id]; n += w; });
      skillLevel[k] = n ? s / n : null;
    });
    ids.filter(id => !played[id]).forEach(id => {
      const w = weights(id, 0.3);
      let s = 0, n = 0;
      Object.keys(w).forEach(k => { if (skillLevel[k] !== null) { s += w[k] * skillLevel[k]; n += w[k]; } });
      if (n) a[id] = 0.5 * a[id] + 0.5 * (s / n) * 0.8;
    });
    return { a, played, skillLevel };
  }

  // Les derniers exercices finis, tous jeux confondus : { id, s, fast, time }.
  function recent(n) {
    const out = [];
    Object.keys(S()).forEach(id => results(id).forEach(r => out.push(Object.assign({ id }, r))));
    return out.sort((x, y) => x.time - y.time).slice(-n);
  }

  /* ---------- Le choix de la prochaine aventure ---------- */
  function target(e, rec) {
    let t = 0.65;
    if ((e.type === "achiever" || e.type === "explorer") && e.emotivity < 0.67) t = 0.57;
    if (e.emotivity >= 0.67 || e.neuroticism >= 0.67 || e.goals.includes("stay_calm")) t = 0.74;
    if (e.risk >= 0.67) t = Math.max(t, 0.7);
    const last = rec.slice(-3);
    if (last.length >= 2 && last.slice(-2).every(r => r.s === 0)) t += 0.1;          // ça résiste : plus doux
    if (last.length === 3 && last.every(r => r.s === 1 && r.fast)) t -= 0.1;         // trop facile : plus dur
    return Math.max(0.45, Math.min(0.85, t));
  }

  function choose(exclude) {
    const e = ego(), { a, played } = abilities(e), rec = recent(8), tgt = target(e, rec);
    const lastIds = myStepsLog().slice(-3).map(s => s.game);
    const lastGame = rec.length ? rec[rec.length - 1].id : null;
    const serious = [], fun = [];
    Object.keys(S()).forEach(id => results(id).forEach(r => (S()[id].ton === "serious" ? serious : S()[id].ton === "fun" ? fun : []).push(r.s)));
    const avg = l => (l.length ? l.reduce((x, y) => x + y, 0) / l.length : null);
    const nonScolaire = (avg(fun) !== null && avg(serious) !== null && avg(fun) - avg(serious) > 0.25) ||
      e.hobbies.includes("video_games") || e.hobbies.includes("board_games") || (e.goal < -0.2 && e.experience >= 0.5);
    // Kiboo et les ateliers créatifs, de temps en temps.
    const n = myStepsLog().length, lastSpecial = myStepsLog().slice().reverse().findIndex(s => s.game === "kiboo" || s.game === "atelier");
    const sinceSpecial = lastSpecial < 0 ? n : lastSpecial;
    if (!exclude.includes("kiboo") && n >= 3 && sinceSpecial >= (nonScolaire ? 2 : 4)) {
      return { game: "kiboo", level: null, p: null, why: nonScolaire ? "kibooTalent" : "kibooReward" };
    }
    if (!exclude.includes("atelier") && n >= 2 && sinceSpecial >= 3 && (e.creativity >= 0.67 || e.hobbies.includes("drawing")) && Math.random() < 0.5) {
      return { game: "atelier", level: null, p: null, why: "create" };
    }
    let best = null;
    Object.keys(S()).filter(id => !exclude.includes(id)).forEach(id => {
      const g = S()[id];
      // Le niveau le plus proche de la cible de réussite.
      let lv = 1, bestGap = 9, pBest = 0;
      for (let l = 1; l <= g.levels; l++) {
        const d = g.levels > 1 ? (l - 1) / (g.levels - 1) : 0.5, p = sig((a[id] - d) * 6), gap = Math.abs(p - tgt);
        if (gap < bestGap) { bestGap = gap; lv = l; pBest = p; }
      }
      let score = -bestGap * 2, why = "challenge";
      const res = results(id), maxDone = res.length ? Math.max(...res.filter(r => r.s >= 0.7).map(r => r.level), 0) : 0;
      if (id === lastGame) score -= 0.4;
      else if (lastIds.includes(id)) score -= 0.15;
      if (!played[id]) {
        if (e.type === "explorer" || e.novelty > 0.25 || e.goals.includes("try_new")) { score += 0.3; why = "new"; }
        else if (e.type === "architect" || e.novelty < -0.25) score -= 0.15;
        else score += 0.08;
      }
      if (played[id] && lv >= maxDone + 2) { score += e.type === "achiever" ? 0.25 : 0.12; why = "jump"; }
      if (g.ton === "fun" && nonScolaire) { score += 0.2; if (why === "challenge") why = "fun"; }
      if (g.ton === "serious" && nonScolaire) score -= 0.1;
      if (g.ton === "serious" && (e.type === "achiever" || e.type === "architect")) score += 0.05;
      if (g.opponent && (e.extraversion >= 0.67 || e.individualism >= 0.67)) { score += 0.15; if (why === "challenge") why = "duel"; }
      if (g.opponent && e.aggressiveness >= 0.67 && e.emotivity >= 0.67) score -= 0.1;
      const chronoNow = g.chrono && lv >= g.chrono;
      if (chronoNow && (e.afterScreen.includes("grumpy") || e.neuroticism >= 0.67 || e.goals.includes("stay_calm"))) score -= 0.35;
      if (g.look && lv >= g.look && (e.afterScreen.includes("eyes") || e.type === "spectateur")) score -= 0.15;
      // Les défis acceptés.
      if (e.goals.includes("reflect_more") && (g.kimind || id === "kipotter")) { score += 0.25; why = "goal_reflect"; }
      if (e.goals.includes("act_more") && id === "kibal") { score += 0.25; why = "goal_act"; }
      if (e.goals.includes("persist_more") && res.length && res[res.length - 1].s === 0) { score += 0.25; why = "goal_persist"; }
      if (e.goals.includes("stay_calm") && !chronoNow && g.ton === "fun") score += 0.1;
      // Un talent : la compétence la plus forte de ce jeu est une force de l'enfant.
      if (why === "challenge" && played[id] && a[id] >= 0.6) why = "talent";
      score += Math.random() * 0.12;                              // un peu de surprise
      if (!best || score > best.score) best = { game: id, level: lv, p: Math.round(pBest * 100) / 100, score, why };
    });
    return best;
  }

  /* ---------- Les phrases : l'avatar parle à l'enfant ---------- */
  function hobbyLine(e) {
    const P = T.parcours.hobby;
    const h = e.hobbies.find(x => P[x]);
    return h ? P[h] : "";
  }
  function sentence(c) {
    const P = T.parcours, e = ego(), name = Store.player || "";
    const hello = P.hello[Math.floor(Math.random() * P.hello.length)].replace("{name}", esc(name));
    if (c.game === "kiboo") return hello + " " + P.why[c.why];
    if (c.game === "atelier") return hello + " " + P.why.create;
    const why = (P.why[c.why] || P.why.challenge).replace(/\{game\}/g, "<b>" + esc(gameName(c.game)) + "</b>").replace("{level}", c.level);
    const extra = c.why === "fun" || c.why === "duel" ? hobbyLine(e) : "";
    return hello + " " + why + (extra ? " " + extra : "");
  }
  const levelLabel = c => (S()[c.game] && S()[c.game].kimind ? T.levels[["easy", "medium", "hard"][c.level - 1]] : P().level.replace("{n}", c.level));
  const P = () => T.parcours;

  /* ---------- Lancer une aventure ---------- */
  function go(c, from) {
    steps().push({ player: Store.player, time: Date.now(), game: c.game, level: c.level, p: c.p, why: c.why, from: from || "home" });
    Store.save();
    try { sessionStorage.setItem("kiboom-adventure", "1"); } catch (e) { /* stockage indisponible */ }
    hideToast();
    if (c.game === "kiboo") { window.open(KIBOO_URL, "_blank", "noopener"); return; }
    if (typeof Home !== "undefined") Home.close();
    if (c.game === "atelier") { location.hash = Math.random() < 0.5 ? "invente" : "intrus"; return; }
    pending[c.game] = c.level;
    picked[c.game] = mode() === "auto" ? "ai" : "suggested";
    if (location.hash === "#" + c.game) window.dispatchEvent(new Event("hashchange")); else location.hash = c.game;
  }
  // Le jeu demande son niveau de départ (une seule fois).
  function takeLevel(id) { const l = pending[id]; delete pending[id]; return l || null; }

  // La carte « Continuer mon aventure » (accueil) : l'avatar propose, avec ses mots.
  function cardHTML() {
    if (!Store.player || !T) return "";
    current = choose(rerolls);
    if (!current) return "";
    const av = Store.avatar, c = current;
    const label = c.game === "kiboo" ? "Kiboo ↗" : c.game === "atelier" ? P().atelier : esc(gameName(c.game)) + " · " + levelLabel(c);
    return `<div class="adv-card">${av ? `<span class="card face adv-av" style="background-image:url(assets/cards/${av}.webp)"></span>` : `<span class="adv-icon">🧭</span>`}
      <div class="adv-text"><p class="adv-title">🧭 ${P().title}</p><p>${sentence(c)}</p><p class="adv-next">${label}</p></div>
      <div class="adv-btns"><button class="act" type="button" data-adv="go">▶ ${P().go}</button>${mode() === "free" ? `<button class="act ghost" type="button" data-adv="other">🔄 ${P().other}</button>` : ""}</div>
      <div class="adv-modes" role="group" aria-label="${P().modeLabel}">
        <button type="button" data-mode="free" aria-pressed="${mode() === "free"}">🧑 ${P().modeFree}</button>
        <button type="button" data-mode="auto" aria-pressed="${mode() === "auto"}">🤖 ${P().modeAuto}</button>
        <span>${mode() === "free" ? P().modeFreeHint : P().modeAutoHint}</span></div></div>`;
  }
  function wire(root, rerender) {
    const g = root.querySelector("[data-adv=go]"), o = root.querySelector("[data-adv=other]");
    if (g) g.onclick = () => { const c = current; rerolls = []; go(c, "home"); };
    if (o) o.onclick = () => { rerolls.push(current.game); if (rerolls.length > 6) rerolls = []; rerender(); };
    root.querySelectorAll("[data-mode]").forEach(b => { b.onclick = () => { setMode(b.dataset.mode); rerender(); }; });
  }
  // Pour le menu : une carte « Continuer mon aventure ».
  function menuInfo() {
    if (!Store.player || !T) return null;
    const c = choose([]);
    if (!c) return null;
    current = c;
    return { text: sentence(c).replace(/<[^>]+>/g, ""), run: () => go(c, "menu") };
  }

  /* ---------- Pendant le jeu : sauter, changer, continuer ---------- */
  function screenGame() {
    const h = location.hash.slice(1);
    return S()[h] ? h : null;
  }
  function toast(html) {
    let el = $("adv-toast");
    if (!el) { el = document.createElement("div"); el.id = "adv-toast"; el.className = "adv-toast"; el.setAttribute("role", "status"); document.body.append(el); }
    const av = Store.avatar;
    el.innerHTML = `${av ? `<span class="card face adv-av small" style="background-image:url(assets/cards/${av}.webp)"></span>` : ""}<div>${html}</div>`;
    el.hidden = false;
    if (typeof config !== "undefined" && config.voice) Voice.speak(el.textContent, { lang: lang() });
    return el;
  }
  function hideToast() { const el = $("adv-toast"); if (el) el.hidden = true; }

  // Après chaque exercice fini : trop facile → sauter ; ça résiste → changer ; après 3 → la suite.
  function watch() {
    if (!Store.player || !T) return;
    const id = screenGame();
    const count = Store.data.instances.filter(i => i.player === Store.player && (i.end || i.ragequit) && (i.tries || []).length).length + Store.data.kimind.filter(k => k.player === Store.player).length;
    if (seen === null || !id) { seen = count; return; }
    if (count === seen) return;
    seen = count;
    const res = results(id), g = S()[id];
    if (!res.length) return;
    const last = res.slice(-3), cur = res[res.length - 1].level;
    if (mode() === "auto") return autoNext(id, res);
    const sinceStart = res.filter(r => r.time >= (myStepsLog().slice(-1)[0] || { time: 0 }).time).length;
    if (last.length === 3 && last.every(r => r.s === 1 && r.fast) && cur < g.levels) {
      const to = Math.min(g.levels, cur + (ego().risk >= 0.67 ? 1 : 2));
      const el = toast(`<p>${P().tooEasy.replace("{level}", g.kimind ? T.levels[["easy", "medium", "hard"][to - 1]] : to)}</p><p class="adv-btns"><button class="act" data-t="jump">🚀 ${P().jump}</button><button class="act ghost" data-t="next">🧭 ${P().other}</button><button class="act ghost" data-t="stay">${P().stay}</button></p>`);
      el.querySelector("[data-t=jump]").onclick = () => go({ game: id, level: to, p: null, why: "jump" }, "toast");
      el.querySelector("[data-t=next]").onclick = () => go(choose([id]), "toast");
      el.querySelector("[data-t=stay]").onclick = hideToast;
      return;
    }
    if (last.length >= 2 && last.slice(-2).every(r => r.s === 0)) {
      const el = toast(`<p>${P().hard}</p><p class="adv-btns"><button class="act" data-t="next">🧭 ${P().otherGame}</button><button class="act ghost" data-t="stay">${P().keepTrying}</button></p>`);
      el.querySelector("[data-t=next]").onclick = () => go(choose([id]), "toast");
      el.querySelector("[data-t=stay]").onclick = hideToast;
      return;
    }
    if (sinceStart >= 3 && res[res.length - 1].s > 0) {
      const el = toast(`<p>${P().well.replace("{game}", esc(gameName(id)))}</p><p class="adv-btns"><button class="act" data-t="next">🧭 ${P().nextAdventure}</button><button class="act ghost" data-t="stay">${P().stayHere}</button></p>`);
      el.querySelector("[data-t=next]").onclick = () => go(choose([id]), "toast");
      el.querySelector("[data-t=stay]").onclick = hideToast;
    }
  }

  // Mode « KibooM choisit » : après chaque exercice, KibooM décide de la suite (même jeu à un autre
  // niveau, ou un autre jeu après 3 exercices, ou plus tôt si ça résiste) ; l'enfant n'a qu'à dire
  // « On continue » (ou faire une pause, ou repasser en « Je choisis »).
  function autoNext(id, res) {
    const e = ego(), sinceStart = res.filter(r => r.time >= (myStepsLog().slice(-1)[0] || { time: 0 }).time).length;
    const last = res.slice(-2);
    let next;
    if (sinceStart >= 3 || (last.length === 2 && last.every(r => r.s === 0))) next = choose([id]);
    else {
      const { a } = abilities(e), g = S()[id], tgt = target(e, recent(8));
      let lv = 1, gap = 9;
      for (let l = 1; l <= g.levels; l++) {
        const d = g.levels > 1 ? (l - 1) / (g.levels - 1) : 0.5, p = sig((a[id] - d) * 6);
        if (Math.abs(p - tgt) < gap) { gap = Math.abs(p - tgt); lv = l; }
      }
      next = { game: id, level: lv, p: null, why: lv > res[res.length - 1].level + 1 ? "jump" : "same" };
    }
    const label = next.game === "kiboo" ? "Kiboo ↗" : next.game === "atelier" ? P().atelier : esc(gameName(next.game)) + " · " + levelLabel(next);
    const el = toast(`<p>${next.game === id ? (next.why === "jump" ? P().autoJump : P().autoSame) : P().autoOther}</p><p class="adv-next">${label}</p>
      <p class="adv-btns"><button class="act" data-t="go">▶ ${P().continue}</button><button class="act ghost" data-t="free">🧑 ${P().modeFree}</button></p>`);
    el.querySelector("[data-t=go]").onclick = () => go(next, "auto");
    el.querySelector("[data-t=free]").onclick = () => { setMode("free"); hideToast(); };
  }

  function texts(t) { T = t; }
  function init() {
    document.body.classList.toggle("mode-auto", mode() === "auto");
    setInterval(watch, 1500);
    window.addEventListener("hashchange", hideToast);
    window.addEventListener("kiboom-player", () => { seen = null; rerolls = []; hideToast(); document.body.classList.toggle("mode-auto", mode() === "auto"); });
  }

  return { init, texts, choose, go, takeLevel, cardHTML, wire, menuInfo, abilities, ego, results, mode, setMode, chosenBy };
})();
