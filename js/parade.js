/* La parade de Kiboo, reprise de Kiboo (js/intro.js) : les 40 personnages des cartes
   défilent tout seuls ; chacun arrive en sautillant, fait son bruit, dit sa présentation
   (lang/personnages.js, lue à voix haute) puis laisse la place au suivant.
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

  /* ---------- La voix (synthèse vocale du navigateur) ---------- */
  const speechOk = "speechSynthesis" in window;
  const LOCALE = { fr: "fr-FR", en: "en-GB" };
  const RATE = { fr: 1.18, en: 0.95 };
  // Voix agréables, par ordre de préférence (les noms varient selon les appareils), comme dans Kiboo.
  const NICE = {
    fr: ["Thomas", "Henri", "Paul", "Nicolas", "Rémy", "Antoine", "Jérôme", "Mathieu", "Daniel", "Google français"],
    en: ["Samantha", "Karen", "Moira", "Tessa", "Libby", "Sonia", "Jenny", "Aria", "Google UK English Female", "Google US English"],
  };

  function pickVoice() {
    const list = speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().replace("_", "-").startsWith(lang));
    const fine = v => /natural|online|premium|enhanced|amélior|neural|siri/i.test(v.name);
    for (const good of [true, false]) for (const name of NICE[lang] || []) {
      const v = list.find(x => x.name.includes(name) && fine(x) === good);
      if (v) return v;
    }
    return list.find(fine) || list[0] || null;
  }

  // Lit le texte ; la promesse est tenue à la fin de la lecture (false si rien n'est lu :
  // pas de voix dans la langue sur l'appareil, ou son coupé).
  function speak(text) {
    if (!speechOk || !sound) return Promise.resolve(false);
    const v = pickVoice();
    if (!v) return Promise.resolve(false);
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LOCALE[lang] || "fr-FR";
    u.voice = v;
    u.rate = RATE[lang] || 1;
    u.pitch = 1.1;
    const done = new Promise(resolve => { u.onend = u.onerror = () => { Sound.duck(false); resolve(true); }; });
    u.onstart = () => Sound.duck(true);
    speechSynthesis.speak(u);
    return done;
  }
  const stopVoice = () => { if (speechOk) speechSynthesis.cancel(); };

  // Un personnage arrive : son bruit, puis il parle.
  function introduce(s, v, text) {
    stopVoice();
    if (!sound) return Promise.resolve(false);
    Sound.character(s, v);
    const token = run;
    return wait(750).then(() => (token === run ? speak(text) : false));
  }

  /* ---------- L'écran de la parade ---------- */
  const presentation = (s, v) => (window.KIBOO_CHARACTERS[lang] || window.KIBOO_CHARACTERS.fr)[COLORS[s] + "-" + v];
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
      await Promise.race([talk.then(spoken => wait(spoken ? 900 : Math.max(2500, text.length * 60))), skip]);
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
