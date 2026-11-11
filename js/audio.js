/* Bruitages et voix des jeux, en option (deux boutons en haut de la page, éteints par défaut,
   gardés dans le navigateur).
   - Bruitages (js/sound.js, repris de Kiboo) : une carte posée ou retournée, une bonne ou une
     mauvaise réponse, la fin d'une partie gagnée ou perdue.
   - Voix : une voix de garçon (voix d'homme, plus aiguë) lit les messages des jeux, dans la
     langue choisie (js/voice.js).
   Les jeux n'ont rien à faire : on écoute les changements de leurs messages (.cg-msg, et
   #won pour Kimind) et l'apparition de leur bouton « Encore ! ». Un message marqué
   data-quiet (le compte à rebours de KiDory) n'est pas lu. */
const config = { sfx: false, voice: false };      // lu aussi par js/sound.js (config.sfx)
const GameAudio = (() => {
  "use strict";
  const KEY = "kimind-audio";
  const BOY = { match: 1.35, other: 1.1 };          // hauteur de la voix de garçon
  let T = null, lang = () => "fr";
  try { Object.assign(config, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* stockage indisponible */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(config)); } catch (e) { /* idem */ } };
  const $ = id => document.getElementById(id);
  const visible = e => e.offsetParent !== null;

  function labels() {
    $("btn-sfx").textContent = (config.sfx ? "🔊 " : "🔈 ") + T.audio.sfx;
    $("btn-sfx").setAttribute("aria-pressed", config.sfx);
    $("btn-voice").textContent = (config.voice ? "🗣️ " : "🤐 ") + T.audio.voice;
    $("btn-voice").setAttribute("aria-pressed", config.voice);
  }

  // Un message a changé : bruitage selon sa couleur (juste, faux), puis lecture à voix haute.
  // Le bandeau de Kimind (#won) est réécrit à chaque affichage : on ne le lit qu'une fois.
  let wonText = "";
  function onMessage(e, ended) {
    const text = e.textContent.trim();
    if (e.id === "won") { if (e.hidden || text === wonText) return; wonText = text; }
    if (!text || !visible(e)) return;
    // En fin de partie, la fanfare (onEnd) remplace le son de la bonne ou mauvaise réponse.
    if (!ended.has(e.closest("section"))) {
      if (e.classList.contains("ok")) Sound.sfx("ok");
      else if (e.classList.contains("ko")) Sound.sfx("ko");
    }
    if (config.voice && !e.dataset.quiet) Voice.speak(text, { lang: lang(), gender: "m", pitch: BOY });
  }

  // Fin de partie : le bouton « Encore ! » apparaît (ou le bandeau « Bravo » de Kimind).
  function onEnd(e) {
    if (e.id === "won") { wonText = ""; return Sound.sfx("win"); }
    const msg = e.closest("section").querySelector(".cg-msg");
    Sound.sfx(msg && msg.classList.contains("ko") ? "lose" : "win", 0.3);
  }

  function init(getLang) {
    lang = getLang;
    $("btn-sfx").addEventListener("click", () => { config.sfx = !config.sfx; save(); labels(); if (config.sfx) Sound.sfx("click"); });
    $("btn-voice").addEventListener("click", () => {
      config.voice = !config.voice;
      save();
      labels();
      if (config.voice) Voice.speak(T.audio.hello, { lang: lang(), gender: "m", pitch: BOY }); else Voice.stop();
    });
    new MutationObserver(records => {
      const msgs = new Set(), ended = new Set();
      records.forEach(r => {
        const node = r.target.nodeType === 3 ? r.target.parentElement : r.target;
        if (!node) return;
        if (r.type === "attributes") {
          if (!node.hidden && (node.matches("[data-r=next]") || node.id === "won")) { onEnd(node); ended.add(node.closest("section")); }
          return;
        }
        const m = node.closest(".cg-msg, #won");
        if (m) msgs.add(m);
      });
      msgs.forEach(m => onMessage(m, ended));
    }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["hidden"] });
    // Une carte posée, retournée ou jouée.
    document.addEventListener("click", e => {
      if (e.target.closest("button.card, .slot-btn, .pz-cell.valid, .bal-zone")) Sound.sfx("card");
    }, true);
  }

  function texts(t) { T = t; labels(); }

  return { init, texts };
})();
