/* La voix : synthèse vocale du navigateur, en français ou en anglais, avec une voix de femme
   ou d'homme. Les navigateurs ne disent pas si une voix est féminine ou masculine : on la
   reconnaît à son nom (les noms varient selon les appareils). Si l'appareil n'a pas de voix du
   genre demandé, la hauteur marque la différence. Utilisée par la parade (js/parade.js) et par
   la lecture des messages des jeux (js/audio.js). */
const Voice = (() => {
  "use strict";
  const ok = "speechSynthesis" in window;
  const LOCALE = { fr: "fr-FR", en: "en-GB" };
  const RATE = { fr: 1.35, en: 1.1 };
  // Hauteur selon le genre : voix du bon genre trouvée (match) ou non (other).
  const PITCH = { f: { match: 1.25, other: 1.45 }, m: { match: 0.95, other: 0.7 } };
  const NAMES = {
    fr: {
      m: ["Thomas", "Henri", "Paul", "Nicolas", "Rémy", "Antoine", "Jérôme", "Mathieu", "Claude", "Daniel", "Guillaume", "Eloi", "Remi"],
      f: ["Amélie", "Audrey", "Aurélie", "Marie", "Virginie", "Julie", "Denise", "Hortense", "Céline", "Léa", "Vivienne", "Brigitte", "Eloise", "Joséphine", "Charlotte", "Google français"],
    },
    en: {
      m: ["Daniel", "Arthur", "Oliver", "Alex", "Fred", "Tom", "Aaron", "Guy", "Ryan", "George", "David", "Mark", "Thomas", "Google UK English Male"],
      f: ["Samantha", "Karen", "Moira", "Tessa", "Libby", "Sonia", "Jenny", "Aria", "Serena", "Kate", "Hazel", "Susan", "Zira", "Google UK English Female", "Google US English"],
    },
  };
  const FEMALE = /female|femme|woman/i, MALE = /\bmale\b|homme|\bman\b/i;

  function pick(lang, gender) {
    const list = speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().replace("_", "-").startsWith(lang));
    if (!list.length) return null;
    const fine = v => /natural|online|premium|enhanced|amélior|neural|siri/i.test(v.name);
    const names = (NAMES[lang] || NAMES.fr)[gender];
    const ofGender = v => names.some(n => v.name.includes(n)) || (gender === "f" ? FEMALE : MALE).test(v.name);
    const voice = list.find(v => ofGender(v) && fine(v)) || list.find(ofGender);
    return voice ? { voice, match: true } : { voice: list.find(fine) || list[0], match: false };
  }

  // Lit le texte ; options : lang (fr, en), gender (m, f), pitch ({ match, other } pour
  // remplacer la hauteur par défaut), rate (vitesse, multiplie la vitesse normale). La promesse est tenue à la fin de la lecture (false si
  // rien n'est lu : pas de voix dans la langue sur l'appareil).
  function speak(text, { lang = "fr", gender = "m", pitch = null, rate = 1 } = {}) {
    if (!ok || !text) return Promise.resolve(false);
    const p = pick(lang, gender);
    if (!p) return Promise.resolve(false);
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LOCALE[lang] || "fr-FR";
    u.voice = p.voice;
    u.rate = (RATE[lang] || 1.2) * rate;
    u.pitch = (pitch || PITCH[gender])[p.match ? "match" : "other"];
    const done = new Promise(resolve => { u.onend = u.onerror = () => { Sound.duck(false); resolve(true); }; });
    u.onstart = () => Sound.duck(true);
    speechSynthesis.speak(u);
    return done;
  }
  const stop = () => { if (ok) speechSynthesis.cancel(); };

  return { speak, stop, ok };
})();
