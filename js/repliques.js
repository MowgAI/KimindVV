/* Les répliques de KibooM : l'avatar réagit pendant les jeux, avec des phrases qui changent et qui
   dépendent de l'enfant (âge, passe-temps, type de joueur, sensibilité, heure), tirées de
   lang/repliques.js, plus les phrases que l'enfant a écrites lui-même dans Ego (« Mes répliques »).
   Le message du jeu garde l'information ; la réplique s'ajoute dans une bulle de l'avatar.
   Pas deux fois la même réplique parmi les 15 dernières. Rien à changer dans les jeux : on observe
   les exercices enregistrés (Store) : essais, aides, fins, niveaux.
   Chaque réplique montrée est gardée pour la BK : message_shown/5. */
const Repliques = (() => {
  "use strict";
  const R = () => window.REPLIQUES;
  // Moments que l'enfant peut remplir lui-même (Ego) ; les autres moments s'y rattachent.
  const OWN_MOMENTS = ["success", "fail", "levelUp", "record", "help", "start"];
  const OWN_OF = { success: "success", fast: "success", effort: "success", streak: "success", fail: "fail", levelUp: "levelUp", record: "record", help: "help", start: "start" };
  const FALLBACK = { fast: "success", effort: "success", streak: "success" };
  let T = null, seen = {}, kimindSeen = null, lastAt = 0, lastFailAt = 0, hideTimer = null, started = {};
  const $ = id => document.getElementById(id);
  const lang = () => (document.documentElement.lang === "en" ? "en" : "fr");
  const log = () => Store.data.replies || (Store.data.replies = []);
  const own = () => (Store.data.lines || (Store.data.lines = []));
  const myOwn = () => own().filter(l => l.player === Store.player);

  /* ---------- Qui est l'enfant ---------- */
  function age() {
    const id = (Store.data.ego || []).filter(r => r.player === Store.player && r.kind === "identity").slice(-1)[0];
    if (!id) return null;
    if (id.birth) {
      const [y, m] = id.birth.split("-").map(Number), now = new Date();
      return now.getFullYear() - y - (now.getMonth() + 1 >= m ? 0 : 1);
    }
    const a = parseInt(id.answers && id.answers.age, 10);
    return a || null;
  }
  const band = a => (a === null ? "mid" : a <= 7 ? "young" : a <= 10 ? "mid" : "old");
  function profile() {
    const e = typeof Parcours !== "undefined" ? Parcours.ego() : { hobbies: [], type: null, emotivity: 0, neuroticism: 0 };
    // Ce qu'il n'aime pas n'est jamais utilisé (un enfant qui déteste le foot n'entend jamais « Buuut ! »).
    const lk = Store.likes(), free = Store.likesFree(), no = lk.dislikes || [], L = lang(), personal = {};
    const opt = (qid, id) => { const q = (EGO.likesExtra || []).find(x => x.id === qid), o = q && q.options.find(x => x.id === id); return o ? o[L].replace(/^(le |la |l'|les )/, "") : null; };
    if (free.fav_player && !no.includes("sport")) personal.player = free.fav_player;
    const team = (lk.fav_team || [])[0] ? opt("fav_team", lk.fav_team[0]) : free.fav_team;
    if (team && !no.includes("sport")) personal.team = team;
    if (free.fav_artist && !no.includes("music")) personal.artist = free.fav_artist;
    const ctry = (lk.country_love || [])[0] && EGO.countries.find(c => c.id === lk.country_love[0]);
    if (ctry) personal.country = ctry[L];
    return { personal, band: band(age()), hobbies: (e.hobbies || []).filter(h => !no.includes(h)), type: e.type, sensitive: e.emotivity >= 0.67 || e.neuroticism >= 0.67, evening: new Date().getHours() >= 19 };
  }

  /* ---------- Choisir une réplique ---------- */
  function candidates(moment, p) {
    const out = [], add = (list, w, prefix) => (list || []).forEach((l, i) => out.push({ id: prefix + "_" + (i + 1), text: l[lang() === "en" ? 1 : 0], w }));
    const g = R().general[moment] || R().general[FALLBACK[moment]] || {};
    const gm = R().general[moment] ? moment : FALLBACK[moment];
    add(g[p.band] || g.all, 1, "gen_" + gm + "_" + (g[p.band] ? p.band : "all"));
    // Ce qu'il nous a dit dans « Mes goûts » : son joueur, son équipe, son artiste, son pays de rêve.
    Object.entries(p.personal).forEach(([k, val]) => {
      const lines = (R().personal && R().personal[k] && R().personal[k][moment]) || [];
      lines.forEach((l, i) => out.push({ id: "personal_" + k + "_" + moment + "_" + (i + 1), text: l[lang() === "en" ? 1 : 0].split("{" + k + "}").join(val), w: 1.6 }));
    });
    // Passe-temps : ensemble ils pèsent plus que les phrases générales, et on alterne entre eux.
    p.hobbies.forEach(h => { const hb = R().hobbies[h]; if (hb) { const m = hb[moment] ? moment : FALLBACK[moment]; add(hb[m], 2 / p.hobbies.length + 0.3, h + "_" + m); } });
    if (p.type && R().types[p.type]) { const tp = R().types[p.type], m = tp[moment] ? moment : FALLBACK[moment]; add(tp[m], 1.2, p.type + "_" + m); }
    if (p.sensitive && R().sensitive[moment]) add(R().sensitive[moment], 3, "sensitive_" + moment);
    if (p.evening && R().evening[moment]) add(R().evening[moment], 1, "evening_" + moment);
    // Les phrases de l'enfant (ses mots à lui, même taquins) : plus souvent que les nôtres.
    myOwn().filter(l => l.moment === OWN_OF[moment]).forEach(l => out.push({ id: l.id, text: l.text, w: 2.5, own: true }));
    return out;
  }

  function pick(moment) {
    const p = profile();
    const mine = log().filter(r => r.player === Store.player), recent = new Set(mine.slice(-15).map(r => r.id));
    let list = candidates(moment, p).filter(c => c.text);
    if (!list.length) return null;
    const fresh = list.filter(c => !recent.has(c.id));
    // Toutes déjà dites récemment : on reprend celle qu'on n'a pas entendue depuis le plus longtemps.
    if (!fresh.length) {
      const lastUse = id => { for (let k = mine.length - 1; k >= 0; k--) if (mine[k].id === id) return k; return -1; };
      return list.slice().sort((x, y) => lastUse(x.id) - lastUse(y.id))[0];
    }
    list = fresh;
    let r = Math.random() * list.reduce((t, c) => t + c.w, 0);
    for (const c of list) { r -= c.w; if (r <= 0) return c; }
    return list[list.length - 1];
  }

  // Montre une réplique pour ce moment (inst : l'exercice concerné, s'il y en a un).
  function say(moment, inst) {
    if (!T || !Store.player) return;
    const now = Date.now();
    const important = ["success", "fast", "effort", "streak", "levelUp", "record", "ragequit"].includes(moment);
    if (!important && now - lastAt < 5000) return;
    if (moment === "fail") { if (now - lastFailAt < 9000 || Math.random() < 0.4) return; lastFailAt = now; }
    const c = pick(moment);
    if (!c) return;
    lastAt = now;
    const l = log();
    l.push({ player: Store.player, inst: inst ? inst.id : null, moment, id: c.id, own: !!c.own, time: now });
    if (l.length > 3000) l.splice(0, l.length - 3000);
    Store.save();
    show(c.text);
  }

  function show(text) {
    let el = $("rep-bubble");
    if (!el) { el = document.createElement("div"); el.id = "rep-bubble"; el.className = "rep-bubble"; el.setAttribute("role", "status"); document.body.append(el); }
    const av = Store.avatar;
    el.innerHTML = (av ? `<span class="card face rep-av" style="background-image:url(assets/cards/${av}.webp)"></span>` : `<span class="rep-av rep-emoji">💬</span>`) + `<span class="rep-text"></span>`;
    el.querySelector(".rep-text").textContent = text;
    // Les couleurs de son équipe préférée, s'il en a une.
    const t = (Store.likes().fav_team || [])[0], tq = (EGO.likesExtra || []).find(x => x.id === "fav_team"), to = t && tq && tq.options.find(o => o.id === t);
    el.style.borderColor = to ? to.colors[0] : "";
    el.style.boxShadow = to ? "0 0 0 3px " + to.colors[1] + ", 0 8px 24px rgba(0,0,0,0.22)" : "";
    el.hidden = false;
    el.classList.remove("rep-pop"); void el.offsetWidth; el.classList.add("rep-pop");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { el.hidden = true; }, 4500);
    if (typeof config !== "undefined" && config.voice && typeof Voice !== "undefined") {
      const spoken = text.replace(/\p{Extended_Pictographic}|‍|️/gu, "").trim();
      if (spoken) Voice.speak(spoken, { lang: lang() });
    }
  }

  /* ---------- Observer les exercices ---------- */
  function onGameScreen() { const h = location.hash.slice(1); return GAMES.some(g => g.id === h) || (typeof window.kimindGame === "function" && !!window.kimindGame()); }

  function finished(i, mine) {
    if (i.ragequit) return (i.tries || []).length ? say("ragequit", i) : null;
    if (!i.success) return say("fail", i);
    const ended = mine.filter(x => x.end && !x.ragequit && (x.tries || []).length);
    let run = 0;
    for (let k = ended.length - 1; k >= 0 && ended[k].success; k--) run++;
    if (run >= 3 && run % 3 === 0) return say("streak", i);    // tous les 3 de suite
    if ((i.tries || []).length >= 3) return say("effort", i);
    const prev = mine.filter(x => x !== i && x.game === i.game && x.level === i.level && x.success && x.end).map(x => x.end - x.start).sort((a, b) => a - b);
    if (prev.length >= 2 && i.end - i.start < prev[Math.floor(prev.length / 2)] * 0.75 && !i.help) return say("fast", i);
    say("success", i);
  }

  function watch() {
    if (!T || !Store.player) return;
    const mine = Store.data.instances.filter(i => i.player === Store.player);
    const active = onGameScreen();
    mine.slice(-6).forEach(i => {
      const s = seen[i.id], tries = (i.tries || []).length, help = i.help || 0, end = !!i.end;
      if (!s) {
        seen[i.id] = { tries, help, end };
        if (!active || end || Date.now() - i.start > 3000) return;
        const before = mine.filter(x => x.game === i.game && x !== i && x.start < i.start).slice(-1)[0];
        if (before && before.end && !before.ragequit && Date.now() - before.end < 120000) {
          if (i.level > before.level) say("levelUp", i);
          else if (i.level < before.level) say("levelDown", i);
        } else if (!started[i.game]) say("start", i);
        started[i.game] = true;
        return;
      }
      if (!active) { seen[i.id] = { tries, help, end }; return; }
      if (help > s.help) say("help", i);
      if (end && !s.end) finished(i, mine);
      else if (tries > s.tries && !end && i.tries[tries - 1] && i.tries[tries - 1].success === false) say("fail", i);
      seen[i.id] = { tries, help, end };
    });
    const k = Store.data.kimind.filter(x => x.player === Store.player);
    if (kimindSeen !== null && k.length > kimindSeen && k[k.length - 1].won) say("success", null);
    kimindSeen = k.length;
  }

  /* ---------- Les phrases de l'enfant (Ego, « Mes répliques ») ---------- */
  function addOwn(moment, text) {
    text = String(text || "").trim().slice(0, 80);
    if (!text || !OWN_MOMENTS.includes(moment) || !Store.player) return false;
    own().push({ id: "own_" + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36), player: Store.player, moment, text, time: Date.now() });
    Store.save();
    return true;
  }
  function removeOwn(id) {
    const l = own(), i = l.findIndex(x => x.id === id && x.player === Store.player);
    if (i >= 0) { l.splice(i, 1); Store.save(); }
  }

  function texts(t) { T = t; }
  function init() {
    // Ce qui existe déjà au chargement ne déclenche rien.
    Store.data.instances.forEach(i => { seen[i.id] = { tries: (i.tries || []).length, help: i.help || 0, end: !!i.end }; });
    kimindSeen = null;
    setInterval(watch, 400);
  }

  return { init, texts, say, pick, addOwn, removeOwn, myOwn, OWN_MOMENTS };
})();
