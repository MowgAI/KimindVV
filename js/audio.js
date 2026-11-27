/* Bruitages et voix des jeux, en option (deux boutons en haut de la page, éteints par défaut,
   gardés dans le navigateur).
   - Bruitages (js/sound.js, repris de Kiboo) : une carte posée ou retournée, une bonne ou une
     mauvaise réponse, la fin d'une partie gagnée ou perdue.
   - Voix : une voix de garçon (voix d'homme, plus aiguë) lit les messages des jeux, dans la
     langue choisie (js/voice.js).
   - Musique (js/sound.js) : choisie d'après ce qu'on fait (voir STYLE), habillée selon les goûts
     musicaux de l'enfant (Ego) ; éteinte par défaut.
   Les jeux n'ont rien à faire : on écoute les changements de leurs messages (.cg-msg, et
   #won pour Kimind) et l'apparition de leur bouton « Encore ! ». Un message marqué
   data-quiet (le compte à rebours de KiDory) n'est pas lu. */
const config = { sfx: false, voice: false, music: false };      // lu aussi par js/sound.js (config.sfx)
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
    $("btn-music").textContent = (config.music ? "🎵 " : "🔇 ") + T.audio.music;
    $("btn-music").setAttribute("aria-pressed", config.music);
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

  /* La musique suit ce que fait l'enfant :
     - accueil et menu : les musiques joyeuses de Kiboo (intro) ;
     - Kichallenge : dynamique et rapide (challenge) ;
     - jeux de réflexion (Kimind, Kimba, Kiplus, KiJun, Kipharaon, KiDory, KiPotter, Kicompuzzle),
       Ego, enquête, statistiques : calme et douce (game), pour se concentrer ;
     - Kibal (aller vite) : entraînante (lively) ; Kipuzzle et Kiduel (adversaire) : malicieuse (duel) ;
     - ateliers créatifs : rêveuse (creative) ;
     - écran de pause : silence (la pause, c'est loin de l'écran) ; la parade garde ses musiques. */
  const STYLE = { kibal: "lively", kipuzzle: "duel", kiduel: "duel", invente: "creative", intrus: "creative", kichallenge: "challenge" };
  function wanted() {
    const pause = $("coach-break");
    if (pause && !pause.hidden) return null;
    if ($("home") && !$("home").hidden) return "intro";
    if (typeof Kichallenge !== "undefined" && Kichallenge.running()) return "challenge";
    const h = location.hash.slice(1);
    if (!h) return "intro";
    return STYLE[h] || "game";
  }
  // Les goûts musicaux du joueur (Ego, chapitre 2, « Ce que j'aime ») : un goût tiré au hasard à chaque
  // nouvelle musique, pour varier ; aucun (ou « je ne sais pas ») : les musiques telles quelles.
  function taste() {
    const l = (Store.likes().music_taste || []).filter(x => x !== "dunno");
    return l.length ? l[Math.floor(Math.random() * l.length)] : null;
  }
  let lastPlayer = null;
  function updateMusic() {
    const parade = $("parade");
    if (parade && !parade.hidden) return;                 // la parade choisit ses musiques
    const style = config.music ? wanted() : null;
    if (Sound.playing() !== style || Store.player !== lastPlayer) { lastPlayer = Store.player; Sound.music(style, { taste: style ? taste() : null }); }
  }

  // Allumer ou éteindre la musique, les bruitages ou la voix (barre ⚙️ et page de lancement).
  function toggle(kind) {
    config[kind] = !config[kind];
    save();
    labels();
    if (kind === "music") { Sound.unlock(); updateMusic(); }
    if (kind === "sfx" && config.sfx) Sound.sfx("click");
    if (kind === "voice") { if (config.voice) Voice.speak(T.audio.hello, { lang: lang(), gender: "m", pitch: BOY }); else Voice.stop(); }
  }
  // Texte d'un bouton (pour la page de lancement).
  function label(kind) {
    const on = config[kind];
    return { music: (on ? "🎵 " : "🔇 ") + T.audio.music, sfx: (on ? "🔊 " : "🔈 ") + T.audio.sfx, voice: (on ? "🗣️ " : "🤐 ") + T.audio.voice }[kind];
  }

  function init(getLang) {
    $("btn-music").addEventListener("click", () => toggle("music"));
    setInterval(updateMusic, 600);
    lang = getLang;
    $("btn-sfx").addEventListener("click", () => toggle("sfx"));
    $("btn-voice").addEventListener("click", () => toggle("voice"));
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

  return { init, texts, toggle, label, isOn: k => !!config[k] };
})();
