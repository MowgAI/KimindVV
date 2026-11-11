/* La parade de Kiboo, reprise de Kiboo (js/intro.js) : les 40 personnages des cartes
   défilent tout seuls ; chacun arrive en sautillant, fait son bruit, dit son nom et une
   petite phrase drôle (lang/personnages.js, lue à voix haute avec une voix de femme ou
   d'homme selon le personnage) puis laisse la place au suivant.
   Boutons : pause, son, suivant, retour au menu. Musique de la famille présentée
   (js/sound.js, repris de Kiboo). */

// Couleurs dans l'ordre des familles de Kiboo (utilisé aussi par js/sound.js).
const COLORS = ["blue", "green", "red", "yellow"];

const Parade = (() => {
  "use strict";
  const $ = id => document.getElementById(id);
  let T = null, lang = "fr";
  let run = 0, paused = false, forward = false, sound = true, skipNow = null, resumeFn = null;
  const wait = ms => new Promise(r => setTimeout(r, ms));

  /* ---------- La voix (js/voice.js) ---------- */
  // Une voix de femme ou d'homme selon le personnage (lang/personnages.js, gender).
  const speak = (text, gender = "m") => (sound ? Voice.speak(text, { lang, gender }) : Promise.resolve(false));
  const stopVoice = Voice.stop;

  // Un personnage arrive : son bruit, puis il parle.
  function introduce(s, v, text) {
    stopVoice();
    if (!sound) return Promise.resolve(false);
    Sound.character(s, v);
    const token = run;
    return wait(500).then(() => (token === run ? speak(text, genderOf(s, v)) : false));
  }

  /* ---------- L'écran de la parade ---------- */
  const presentation = (s, v) => (window.KIBOO_CHARACTERS[lang] || window.KIBOO_CHARACTERS.fr)[COLORS[s] + "-" + v];
  // En anglais, voix de femme pour toutes les filles ; en français, seulement pour les métiers.
  const genderOf = (s, v) => window.KIBOO_CHARACTERS[lang === "en" ? "genderEn" : "gender"][COLORS[s] + "-" + v] || "m";
  const cardImage = (s, v) => "assets/cards/" + COLORS[s] + "-" + v + ".webp";

  function labels() {
    $("parade-title").textContent = "🎪 " + T.parade;
    $("parade-pause").textContent = paused ? "▶ " + T.paradeResume : "⏸ " + T.paradePause;
    $("parade-sound").textContent = (sound ? "🔊 " : "🔇 ") + T.paradeSound;
    $("parade-sound").setAttribute("aria-pressed", sound);
    $("parade-back").textContent = T.paradeBack;
    $("parade-next").textContent = T.paradeNext + " ▶";
  }

  // Les 40 personnages défilent ; chacun parle (ou reste le temps de lire), puis le suivant arrive.
  async function runParade(start) {
    const me = ++run;
    for (let i = start; i <= 40;) {
      if (me !== run) return;
      forward = false;
      const s = Math.floor(i / 10), v = (i % 10) + 1;
      const text = i < 40 ? presentation(s, v) : T.paradeEnd;
      const floor = $("parade-floor");
      floor.textContent = "";
      if (i < 40) {
        const char = document.createElement("div");
        char.className = "parade-char";
        char.style.setProperty("--fam", "var(--c-" + COLORS[s] + ")");
        char.innerHTML = '<div class="card parade-big" role="img"></div><div class="parade-bubble"><p></p><p class="parade-count"></p></div>';
        char.querySelector(".card").style.backgroundImage = "url(" + cardImage(s, v) + ")";
        char.querySelector(".card").setAttribute("aria-label", LANGS[lang].colours[COLORS[s]] + " " + v);
        char.querySelector("p").textContent = text;
        char.querySelector(".parade-count").textContent = (i + 1) + " / 40";
        floor.append(char);
        Sound.music("fam" + s);
      } else {
        const end = document.createElement("div");
        end.className = "parade-end";
        [0, 1, 2, 3].forEach(f => {
          const c = document.createElement("div");
          c.className = "card";
          c.style.backgroundImage = "url(" + cardImage(f, 10) + ")";
          end.append(c);
        });
        const p = document.createElement("p");
        p.className = "parade-text";
        p.textContent = text;
        end.append(p);
        floor.append(end);
        Sound.music("intro");
      }
      const skip = new Promise(r => { skipNow = r; });
      const talk = paused ? Promise.resolve(false) : i < 40 ? introduce(s, v, text) : speak(text);
      await Promise.race([talk.then(spoken => wait(spoken ? 500 : Math.max(2200, text.length * 50))), skip]);
      if (me !== run) return;
      if (paused) {
        await new Promise(r => { resumeFn = r; });
        resumeFn = null;
        if (me !== run) return;
        if (!forward) continue;                     // reprise : le même personnage reparle
      }
      if (i === 40) { if (forward) close(); else skipNow = close; return; }   // fin : « Suivant » ferme
      i++;
    }
  }

  function open(texts, language) {
    T = texts;
    lang = language;
    paused = false;
    forward = false;
    labels();
    $("parade").hidden = false;
    document.body.classList.add("parade-open");
    $("parade-next").focus();
    runParade(0);
  }

  function close() {
    run++;
    stopVoice();
    Sound.music(null);
    $("parade").hidden = true;
    document.body.classList.remove("parade-open");
    if (resumeFn) resumeFn();
  }

  function init() {
    $("parade-back").addEventListener("click", close);
    $("parade-sound").addEventListener("click", () => {
      sound = !sound;
      if (!sound) stopVoice();
      labels();
    });
    $("parade-pause").addEventListener("click", () => {
      paused = !paused;
      labels();
      if (paused) stopVoice(); else if (resumeFn) resumeFn();
    });
    $("parade-next").addEventListener("click", () => {
      forward = true;
      if (paused) { paused = false; labels(); if (resumeFn) resumeFn(); }
      else { stopVoice(); if (skipNow) skipNow(); }
    });
    $("parade").addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }

  return { init, open, close, isOpen: () => !$("parade").hidden };
})();
