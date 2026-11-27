/* Kichallenge : un défi chronométré de 5 exercices tirés au hasard dans des jeux différents.
   L'enfant choisit la difficulté du défi (facile : niveaux 1 à 3, moyen : 4 à 6, difficile : 7 à 9) ;
   chaque exercice se joue dans son jeu habituel, puis on passe au suivant.
   Temps du défi = somme des temps des exercices (le chrono attend entre deux exercices)
   + 10 s par aide (l'aide reste permise : c'est toujours un choix de l'enfant)
   + 30 s par exercice raté ou passé (on continue quand même : pas d'élimination).
   Records personnels seulement, par difficulté : l'enfant est comparé à lui-même (charte),
   jamais aux autres joueurs. */
const Kichallenge = (() => {
  "use strict";
  // Jeux du défi : un exercice court, sans adversaire (Kipuzzle et Kiduel sont des parties entières).
  const POOL = ["kimba", "kiplus", "kijun", "kipharaon", "kidory", "kibal", "kipotter", "kicompuzzle"];
  const DIFF = { easy: [1, 3], medium: [4, 6], hard: [7, 9] };
  const N = 5, HELP_MS = 10000, MISS_MS = 30000;
  const ICON = "assets/cards/blue-10.webp";
  let T = null, run = null, diff = "easy", last = null, screen = null, waiting = false;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const C = () => T.kichallenge;
  const fmt = ms => Chrono.fmt(ms);
  const runs = () => Store.data.challenges || (Store.data.challenges = []);
  const mine = d => runs().filter(r => r.player === Store.player && r.completed && (!d || r.difficulty === d));
  const gameName = id => (T.games[id] ? T.games[id].name : id);
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

  function running() { return !!run; }

  // Store.startInstance demande si l'exercice qui commence fait partie du défi (une seule fois par exercice).
  function tag(game) {
    const ex = run && run.list[run.i];
    if (!ex || ex.game !== game || ex.tagged) return undefined;
    ex.tagged = true;
    return run.id;
  }

  /* ---------- Écran d'accueil du défi ---------- */
  function start(t) {
    T = t;
    if (run) abort();
    if (last) return renderResult();
    renderIntro();
  }

  function renderIntro() {
    const recs = Object.keys(DIFF).map(d => {
      const l = mine(d);
      if (!l.length) return `<li><b>${C().diffs[d]}</b> : ${C().noRecord}</li>`;
      const b = Math.min(...l.map(r => r.total));
      return `<li><b>${C().diffs[d]}</b> : 🏆 ${fmt(b)} · ${C().runs(l.length)} · ${C().first(fmt(l[0].total))}</li>`;
    }).join("");
    screen.innerHTML = `<div class="ch-box">
      <div class="ch-head"><span class="card face ch-icon" style="background-image:url(${ICON})"></span>
        <div><h2>${C().title}</h2><p>${C().intro}</p></div></div>
      <ul class="ch-rules">${C().rules.map(r => `<li>${r}</li>`).join("")}</ul>
      <p class="ch-lbl">${C().chooseDiff}</p>
      <div class="ch-diffs" role="group">${Object.keys(DIFF).map(d => `<button type="button" class="ch-diff" data-d="${d}" aria-pressed="${d === diff}">${C().diffs[d]}<small>${C().diffHints[d]}</small></button>`).join("")}</div>
      <p><button class="act" type="button" data-c="go">▶ ${C().go}</button></p>
      <h3>${C().recordsTitle}</h3><ul class="ch-recs">${recs}</ul>
      <p class="ch-note">${C().onlyYou}</p></div>`;
    screen.querySelectorAll("[data-d]").forEach(b => { b.onclick = () => { diff = b.dataset.d; renderIntro(); }; });
    screen.querySelector("[data-c=go]").onclick = begin;
  }

  /* ---------- Le défi ---------- */
  function begin() {
    const games = POOL.slice().sort(() => Math.random() - 0.5).slice(0, N);
    run = { id: "ch_" + Date.now().toString(36), player: Store.player, difficulty: diff, start: Date.now(), i: -1,
      list: games.map(g => ({ game: g, level: rand(...DIFF[diff]) })) };
    last = null;
    document.body.classList.add("in-challenge");
    next();
  }

  function next() {
    waiting = false;
    run.i++;
    if (run.i >= N) return finish();
    const ex = run.list[run.i];
    ex.launched = Date.now();
    Parcours.prepare(ex.game, ex.level, "challenge");
    if (location.hash === "#" + ex.game) window.dispatchEvent(new Event("hashchange")); else location.hash = ex.game;
    banner();
  }

  // L'exercice du défi en cours (dans le Store), s'il a commencé.
  function instOf(ex) { return Store.data.instances.filter(i => i.challenge === run.id && i.game === ex.game).slice(-1)[0] || null; }

  // Temps d'un exercice fini, avec les secondes ajoutées.
  const cost = ex => ex.ms + ex.help * HELP_MS + (ex.ok ? 0 : MISS_MS);

  function close(ex, inst, skipped) {
    ex.closed = true;
    ex.inst = inst ? inst.id : null;
    ex.ms = inst && inst.end ? inst.end - inst.start : Date.now() - ex.launched;
    ex.help = inst ? inst.help || 0 : 0;
    ex.skipped = !!skipped || !inst || !!inst.ragequit;
    ex.ok = !ex.skipped && !!inst.success;
  }

  function total(now) {
    let t = 0;
    run.list.forEach(ex => {
      if (ex.closed) t += cost(ex);
      else if (ex === run.list[run.i] && !waiting) {
        const inst = instOf(ex);
        if (inst) t += (now - inst.start) + (inst.help || 0) * HELP_MS;
      }
    });
    return t;
  }

  function watch() {
    if (!run) return;
    const ex = run.list[run.i];
    if (ex && !ex.closed) {
      const inst = instOf(ex);
      if (inst && inst.end) {
        close(ex, inst, false);
        waiting = true;
        banner();
        return;
      }
    }
    const t = document.querySelector("#ch-banner .ch-time");
    if (t) t.textContent = "⏱️ " + fmt(total(Date.now()));
  }

  function bannerEl() {
    let el = $("ch-banner");
    if (!el) { el = document.createElement("div"); el.id = "ch-banner"; el.className = "ch-banner"; document.body.append(el); }
    return el;
  }

  function banner() {
    const el = bannerEl();
    if (!run) { el.hidden = true; return; }
    const ex = run.list[run.i];
    el.hidden = false;
    let msg = "", btns;
    if (waiting) {
      msg = ex.ok ? C().exDone(fmt(ex.ms)) : C().exMissed;
      if (ex.help) msg += " " + C().helpAdded(ex.help * HELP_MS / 1000);
      btns = `<button class="act" type="button" data-c="next">${run.i + 1 < N ? C().nextEx : C().seeResult} ▶</button><span class="ch-wait">${C().clockWaits}</span>`;
    } else btns = `<button class="act ghost" type="button" data-c="skip">⏭ ${C().skip}</button><button class="act ghost" type="button" data-c="stop">✖ ${C().stop}</button>`;
    el.innerHTML = `<span class="card face ch-icon small" style="background-image:url(${ICON})"></span>
      <div class="ch-info"><b>Kichallenge · ${C().diffs[run.difficulty]}</b><span>${C().step(run.i + 1, N)} · ${esc(gameName(ex.game))} · ${C().level} ${ex.level}</span>${msg ? `<span class="ch-msg">${msg}</span>` : ""}</div>
      <span class="ch-time">⏱️ ${fmt(total(Date.now()))}</span><div class="ch-btns">${btns}</div>`;
    const b = s => el.querySelector("[data-c=" + s + "]");
    if (b("next")) b("next").onclick = next;
    if (b("skip")) b("skip").onclick = skip;
    if (b("stop")) b("stop").onclick = () => { abort(); location.hash = "kichallenge"; };
  }

  // Passer un exercice : il compte comme raté (+30 s) et on continue.
  function skip() {
    const ex = run.list[run.i];
    const g = GAMES.find(x => x.id === ex.game);
    if (g) g.game().leave();               // l'exercice laissé en plan est noté comme un abandon
    close(ex, instOf(ex), true);
    Store.save();
    next();
  }

  // Défi arrêté en route (bouton, menu ou autre écran) : gardé dans les données, sans record.
  function abort() {
    if (!run) return;
    const r = run;
    run = null;
    waiting = false;
    document.body.classList.remove("in-challenge");
    banner();
    save(r, false);
  }

  function save(r, completed) {
    const rec = { id: r.id, player: r.player, difficulty: r.difficulty, time: r.start, completed,
      list: r.list.map(ex => ({ game: ex.game, level: ex.level, inst: ex.inst || null, ms: ex.ms || 0, help: ex.help || 0, ok: !!ex.ok, skipped: !!ex.skipped, closed: !!ex.closed })) };
    if (completed) {
      rec.total = r.list.reduce((t, ex) => t + cost(ex), 0);
      const before = mine(r.difficulty);
      rec.best = before.length ? Math.min(...before.map(x => x.total)) : null;
      rec.first = before.length ? before[0].total : null;
      rec.record = rec.best === null || rec.total < rec.best;
    }
    runs().push(rec);
    Store.save();
    return rec;
  }

  function finish() {
    const r = run;
    run = null;
    waiting = false;
    document.body.classList.remove("in-challenge");
    banner();
    last = save(r, true);
    location.hash = "kichallenge";
  }

  /* ---------- Résultat ---------- */
  function renderResult() {
    const r = last;
    last = null;
    let head;
    if (r.best === null) head = `<p class="ch-big">🏆 ${C().firstTime}</p>`;
    else if (r.record) head = `<p class="ch-big">🏆 ${C().newRecord}</p><p>${C().beatBy(fmt(r.best - r.total))}</p>`;
    else head = `<p class="ch-big">${C().noNewRecord}</p><p>${C().yourRecord(fmt(r.best))}</p>`;
    if (r.first !== null && r.total < r.first) head += `<p>${C().sinceFirst(fmt(r.first - r.total))}</p>`;
    const rows = r.list.map(ex => `<tr><td>${esc(gameName(ex.game))}</td><td>${ex.level}</td><td>${ex.skipped ? C().skipped : ex.ok ? "✅" : C().missed}</td><td>${fmt(ex.ms)}</td><td>${ex.help ? "+" + ex.help * HELP_MS / 1000 + " s" : ""}${ex.ok ? "" : (ex.help ? " " : "") + "+" + MISS_MS / 1000 + " s"}</td></tr>`).join("");
    screen.innerHTML = `<div class="ch-box">
      <div class="ch-head"><span class="card face ch-icon" style="background-image:url(${ICON})"></span>
        <div><h2>${C().title} · ${C().diffs[r.difficulty]}</h2><p class="ch-total">⏱️ ${fmt(r.total)}</p></div></div>
      ${head}
      <table class="ch-table"><thead><tr><th>${C().colGame}</th><th>${C().level}</th><th>${C().colResult}</th><th>${C().colTime}</th><th>${C().colAdded}</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="adv-btns"><button class="act" type="button" data-c="again">🔁 ${C().again}</button><button class="act ghost" type="button" data-c="intro">${C().changeDiff}</button></p></div>`;
    diff = r.difficulty;
    screen.querySelector("[data-c=again]").onclick = begin;
    screen.querySelector("[data-c=intro]").onclick = renderIntro;
  }

  // Quitter le défi par un autre chemin (menu, autre écran) l'arrête.
  function onHash() {
    if (!run) return;
    const ex = run.list[run.i];
    if (location.hash.slice(1) !== ex.game) abort();
  }

  function texts(t) { T = t; if (run) banner(); }
  function init() {
    screen = $("kichallenge-screen");
    setInterval(watch, 300);
    window.addEventListener("hashchange", onHash);
  }

  return { init, texts, start, running, tag };
})();
