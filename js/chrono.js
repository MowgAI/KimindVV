/* Le chronomètre en option (choix de l'enfant, gardé pour chaque joueur, valable dans tous les jeux) :
   - none   : pas de chrono (par défaut) ;
   - hidden : le temps est mesuré et montré seulement à la fin de l'exercice ;
   - shown  : le temps défile pendant l'exercice.
   Les temps sont déjà mesurés dans chaque exercice (Store) : le chrono ne fait que les montrer.
   On compare l'enfant à lui-même (son meilleur temps au même jeu et au même niveau), jamais aux autres.
   Pendant un Kichallenge, c'est le chrono du défi qui s'affiche (js/kichallenge.js). */
const Chrono = (() => {
  "use strict";
  const MODES = ["none", "hidden", "shown"];
  let T = null, tracked = null, result = null;
  const $ = id => document.getElementById(id);
  const store = () => Store.data.timers || (Store.data.timers = {});

  function mode() { return (Store.player && store()[Store.player]) || "none"; }
  function setMode(m) {
    if (!Store.player || !MODES.includes(m)) return;
    store()[Store.player] = m;
    (Store.data.timerLog || (Store.data.timerLog = [])).push({ player: Store.player, mode: m, time: Date.now() });
    Store.save();
    render();
  }

  // 42 s, ou 1:05 au-delà d'une minute.
  function fmt(ms) {
    const s = Math.max(0, Math.round(ms / 1000));
    return s < 60 ? s + " s" : Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }

  // L'exercice en cours sur l'écran affiché (autres jeux : le dernier exercice du joueur dans ce jeu ;
  // Kimind : la partie en cours).
  function current() {
    const k = typeof window.kimindGame === "function" ? window.kimindGame() : null;
    if (k) return { key: "k" + k.start, start: k.start, end: k.end, done: !!k.recorded, ok: !!k.won };
    const h = location.hash.slice(1);
    if (!h || !GAMES.some(g => g.id === h)) return null;
    const inst = Store.data.instances.filter(i => i.player === Store.player && i.game === h).slice(-1)[0];
    if (!inst) return null;
    return { key: inst.id, inst, start: inst.start, end: inst.end, done: !!inst.end, ok: !inst.ragequit && !!inst.success };
  }

  // Le meilleur temps de l'enfant au même jeu et au même niveau (exercices réussis, sauf celui-ci).
  function best(inst) {
    const t = Store.data.instances.filter(i => i !== inst && i.player === inst.player && i.game === inst.game && i.level === inst.level && i.success && i.end).map(i => i.end - i.start);
    return t.length ? Math.min(...t) : null;
  }

  function pill() {
    let el = $("chrono-pill");
    if (!el) { el = document.createElement("div"); el.id = "chrono-pill"; el.className = "chrono-pill"; el.setAttribute("aria-live", "off"); document.body.append(el); }
    return el;
  }

  function tick() {
    const el = pill(), bar = $("chrono-bar");
    const busy = typeof Kichallenge !== "undefined" && Kichallenge.running();
    if (bar) bar.classList.toggle("off", busy);
    if (!T || !Store.player || busy || !bar || bar.hidden || mode() === "none") { el.hidden = true; tracked = null; result = null; return; }
    const c = current();
    if (!c) { el.hidden = true; return; }
    if (!c.done) {
      if (!tracked || tracked.key !== c.key) result = null;
      tracked = c;
      el.hidden = mode() !== "shown";
      el.classList.remove("end");
      el.textContent = "⏱️ " + fmt(Date.now() - c.start);
      return;
    }
    // L'exercice suivi vient de finir : on montre le temps (dans les deux modes), s'il est réussi.
    if (tracked && tracked.key === c.key && c.ok && c.end) {
      const ms = c.end - c.start, b = c.inst ? best(c.inst) : null;
      result = T.chrono.done(fmt(ms)) + (b === null ? "" : ms < b ? " · 🏆 " + T.chrono.record : " · " + T.chrono.best(fmt(b)));
      if (b !== null && ms < b && typeof Repliques !== "undefined") Repliques.say("record", c.inst);
      tracked = null;
    }
    if (result) { el.hidden = false; el.classList.add("end"); el.textContent = "⏱️ " + result; } else el.hidden = true;
  }

  // La barre de réglage, sous la barre des humeurs.
  function render() {
    const bar = $("chrono-bar");
    if (!bar || !T) return;
    bar.textContent = "";
    const lbl = document.createElement("span");
    lbl.className = "chrono-lbl";
    lbl.textContent = "⏱️ " + T.chrono.label;
    bar.append(lbl);
    MODES.forEach(m => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chrono-btn";
      b.textContent = T.chrono.modes[m];
      b.title = T.chrono.hints[m];
      b.setAttribute("aria-pressed", String(mode() === m));
      b.onclick = () => setMode(m);
      bar.append(b);
    });
    tick();
  }

  function texts(t) { T = t; render(); }
  function init() {
    setInterval(tick, 250);
    window.addEventListener("kiboom-player", render);
  }

  return { init, texts, mode, setMode, fmt, render };
})();
