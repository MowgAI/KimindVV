/* Le conseil de KibooM : des recommandations personnalisées, dites par l'avatar de l'enfant.
   1. Les pauses. Pendant qu'il joue, KibooM propose une pause :
      - après un temps de jeu continu (plus court pour les plus jeunes, et pour ceux qui disent que
        l'écran les fatigue, les énerve ou leur donne envie de bouger) ;
      - après plusieurs échecs d'affilée ou un abandon ;
      - quand il choisit l'humeur « fatigué » ou « pas content » ;
      - le soir, tard.
      Le conseil vient de ses goûts (Ego KibooM, « Ce que j'aime ») : écouter sa musique, jouer
      dehors avec des amis, dessiner son personnage, bouger… L'enfant répond « D'accord, je fais une
      pause » (écran de pause, minuteur facultatif) ou « Encore un peu ! » (le conseil revient plus
      tard, deux fois au plus).
   2. « Pour toi » : un exercice recommandé, d'après ses défis acceptés, sinon son type de joueur.
   Chaque conseil et la réponse de l'enfant sont gardés (Store.data.coach) et exportés en Prolog :
   ils serviront à comparer les réponses aux questionnaires et le comportement dans l'appli.
   Textes : lang/ego.js (EGO.coach) et lang/*.js (T.coach). */
const Coach = (() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const TICK = 15000;                 // vérification toutes les 15 secondes
  const COOLDOWN = 8 * 60000;         // pas deux conseils à moins de 8 minutes
  const SNOOZE = 5 * 60000;           // « Encore un peu ! » : 5 minutes de plus
  let T = null, playMs = 0, lastTick = Date.now(), lastAdvice = 0, snoozes = 0, extraMs = 0;
  let lateShown = false, seenRagequits = null, current = null, timer = null;

  const lang = () => (document.documentElement.lang === "en" ? "en" : "fr");
  const any = list => list[Math.floor(Math.random() * list.length)];
  const log = () => (Store.data.coach || (Store.data.coach = []));
  const lastEgo = kind => (Store.data.ego || []).filter(r => r.player === Store.player && (r.kind || "style") === kind).slice(-1)[0] || null;

  // Ses goûts (chapitre 2, « Ce que j'aime ») : { hobbies: [...], break_pref: [...], ... }.
  function likes() {
    const r = lastEgo("personality");
    const out = {};
    Object.entries((r && r.likes) || {}).forEach(([k, v]) => { if (v !== "skip") out[k] = Array.isArray(v) ? v : [v]; });
    return out;
  }
  const has = (lk, tag) => { const [q, v] = tag.split(":"); return (lk[q] || []).includes(v); };

  // Temps de jeu avant une pause, en minutes, selon l'âge et ce qu'il dit de l'écran.
  function limitMin() {
    const id = lastEgo("identity"), age = id && id.answers ? parseInt(id.answers.age, 10) : NaN, lk = likes();
    let m = isNaN(age) ? 20 : age <= 6 ? 15 : age <= 8 ? 20 : 25;
    if (["eyes", "grumpy", "move"].some(v => has(lk, "after_screen:" + v))) m -= 5;
    return Math.max(15, m);                    // jamais moins de 15 minutes (choix de l'auteure)
  }

  // Un jeu à l'écran (pas le menu, l'accueil, les statistiques ni Ego), page visible.
  function playing() {
    if (document.visibilityState !== "visible" || document.body.classList.contains("home-open") || document.body.classList.contains("parade-open")) return false;
    return !!document.querySelector("#game-screen:not([hidden]), section.game-other:not([hidden]):not(#stats-screen):not(#ego-screen)");
  }

  /* ---------- Le conseil ---------- */
  function avatarName() {
    const a = Store.avatar, m = (window.PARADE_MODES || {})[lang()] || {};
    return a && m.gentil && m.gentil[a] ? m.gentil[a].n[0] : null;
  }
  function tipFor(trigger) {
    const L = lang(), C = EGO.coach;
    if (trigger === "late") return { id: "sleep", text: C.lateTip[L] };
    const lk = likes();
    const fits = C.tips.filter(t => !t.need.length || t.need.some(tag => has(lk, tag)));
    const personal = fits.filter(t => t.need.length);
    const t = any(personal.length ? personal : fits);
    const music = (lk.music_taste || []).filter(v => C.music[v]);
    const name = avatarName();
    let text = t[L].replace("{music}", (music.length ? C.music[any(music)] : C.music.any)[L]).replace("{avatar}", name || T.coach.yourCharacter);
    // Le conseil vient d'un de ses passe-temps : on le dit (« Toi qui aimes le dessin… »).
    const hobby = t.need.map(tag => tag.split(":")).find(([q, v]) => q === "hobbies" && has(lk, "hobbies:" + v));
    if (hobby) {
      const opt = EGO.likes.find(q => q.id === "hobbies").options.find(o => o.id === hobby[1]);
      if (opt) text = C.hobbyIntro[L].replace("{h}", opt[L]) + " " + text.charAt(0).toLowerCase() + text.slice(1);
    }
    return { id: t.id, text };
  }

  function advise(trigger) {
    if (!T || !Store.player || current || $("coach").open) return;
    const L = lang(), tip = tipFor(trigger);
    const opener = EGO.coach.openers[trigger][L].replace("{min}", Math.round(playMs / 60000));
    current = { player: Store.player, time: Date.now(), trigger, tip: tip.id, response: null };
    log().push(current);
    Store.save();
    lastAdvice = Date.now();
    const av = Store.avatar;
    $("coach-avatar").innerHTML = av ? `<span class="card face coach-card" style="background-image:url(assets/cards/${av}.webp)"></span>` : `<span class="coach-mirror">🪞</span>`;
    $("coach-text").innerHTML = `<b>${opener}</b><br>${tip.text}`;
    $("coach-tip-again").textContent = tip.text;
    $("coach-pause").textContent = "👍 " + T.coach.pauseOk;
    $("coach-snooze").textContent = "⏳ " + T.coach.snooze;
    $("coach-snooze").hidden = snoozes >= 2 || trigger === "late";
    $("coach-ask").hidden = false;
    $("coach-break").hidden = true;
    $("coach-goodbye").hidden = true;
    $("coach").showModal();
    if (typeof config !== "undefined" && config.voice) Voice.speak(opener + " " + tip.text, { lang: L });
  }

  function respond(answer) {
    if (current) { current.response = answer; Store.save(); }
    if (answer === "snooze") {
      snoozes++;
      extraMs += SNOOZE;
      close();
      return;
    }
    // La pause : on remet le compteur à zéro.
    playMs = 0; extraMs = 0; snoozes = 0;
    $("coach-ask").hidden = true;
    $("coach-break").hidden = false;
    $("coach-break-title").textContent = "🌈 " + T.coach.pauseTitle;
    $("coach-timer").textContent = "";
    $("coach-timer-btn").textContent = "⏱️ " + T.coach.startTimer;
    $("coach-timer-btn").hidden = false;
    $("coach-back").textContent = T.coach.back;
    $("coach-leave").textContent = "👋 " + T.coach.leave;
    $("coach-bye").textContent = T.coach.byeHint;
    current.breakStart = Date.now();
  }

  function startTimer() {
    let left = 5 * 60;
    $("coach-timer-btn").hidden = true;
    const show = () => { $("coach-timer").textContent = Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0"); };
    show();
    clearInterval(timer);
    timer = setInterval(() => {
      left--;
      show();
      if (left <= 0) { clearInterval(timer); $("coach-timer").textContent = "🔔 " + T.coach.timeUp; if (typeof Sound !== "undefined") Sound.sfx("win"); }
    }, 1000);
  }

  function close() {
    clearInterval(timer);
    if (current && current.breakStart) { current.breakSeconds = Math.round((Date.now() - current.breakStart) / 1000); delete current.breakStart; Store.save(); }
    current = null;
    if ($("coach").open) $("coach").close();
    lastTick = Date.now();
  }

  /* ---------- Quand proposer une pause ---------- */
  function tick() {
    const now = Date.now(), dt = Math.min(now - lastTick, 2 * TICK);
    lastTick = now;
    if (!Store.player || !playing()) return;
    playMs += dt;
    if (current || now - lastAdvice < COOLDOWN && lastAdvice) return;
    const h = new Date().getHours();
    if (!lateShown && (h >= 20 || h < 6)) { lateShown = true; return advise("late"); }
    if (playMs >= limitMin() * 60000 + extraMs) return advise("time");
    if (failing()) advise("fails");
  }

  // Plusieurs échecs d'affilée (les 4 derniers essais ratés) ou un nouvel abandon.
  function failing() {
    const mine = Store.data.instances.filter(i => i.player === Store.player);
    const quits = mine.filter(i => i.ragequit).length;
    if (seenRagequits === null) seenRagequits = quits;
    if (quits > seenRagequits) { seenRagequits = quits; return true; }
    const tries = [].concat(...mine.slice(-4).map(i => i.tries || [])).filter(t => typeof t.success === "boolean").slice(-4);
    return tries.length === 4 && tries.every(t => !t.success) && mine.slice(-1)[0].start > lastAdvice;
  }

  /* ---------- « Pour toi » : l'exercice recommandé ---------- */
  function gameName(id) {
    if (T.games[id]) return T.games[id].name;
    if (T.versions[id]) return T.versions[id].name;
    return id;
  }
  function recommendation() {
    const L = lang(), R = EGO.coach.reco;
    if (!Store.player) return null;
    const mine = Store.data.instances.filter(i => i.player === Store.player);
    const played = new Set(mine.map(i => i.game).concat(Store.data.kimind.filter(g => g.player === Store.player).map(g => g.version)));
    const never = GAMES.map(g => g.id).filter(id => !played.has(id));
    const style = lastEgo("style");
    const pick = (key, hash) => ({ hash, text: R[key][L].replace("{game}", gameName(hash)), key });
    // Un défi accepté (un différent chaque jour, s'il y en a plusieurs).
    const goals = style && style.goals ? Object.keys(style.goals).filter(g => style.goals[g] === "accepted") : [];
    if (goals.length) {
      const g = goals[new Date().getDate() % goals.length];
      if (g === "reflect_more") return pick(g, "initiale");
      if (g === "persist_more") { const failed = mine.filter(i => (i.tries || []).length && !i.success).slice(-1)[0]; return pick(g, failed ? failed.game : "kijun"); }
      if (g === "stay_calm") return pick(g, "kimba");
      if (g === "act_more") return pick(g, "kibal");
      if (g === "try_new") return pick(g, never[0] || "kipuzzle");
      if (g === "ask_help") return pick(g, "kimba");
      if (g === "check_progress") return { hash: "stats", text: R[g][L], key: g };
    }
    if (!style) return { hash: "ego", text: R.noEgo[L], key: "noEgo" };
    const top = Object.keys(style.percents).sort((a, b) => style.percents[b] - style.percents[a])[0];
    if (top === "explorer") return pick(top, never[0] || "kiduel");
    if (top === "achiever") {
      const count = {};
      mine.forEach(i => { count[i.game] = (count[i.game] || 0) + 1; });
      return pick(top, Object.keys(count).sort((a, b) => count[b] - count[a])[0] || "kimba");
    }
    if (top === "architect") return pick(top, "kicompuzzle");
    return pick(top, "kidory");
  }

  /* ---------- Démarrage ---------- */
  function texts(t) { T = t; }
  function init() {
    $("coach-pause").addEventListener("click", () => respond("pause"));
    $("coach-snooze").addEventListener("click", () => respond("snooze"));
    $("coach-timer-btn").addEventListener("click", startTimer);
    $("coach-back").addEventListener("click", close);
    // Le but n'est pas de garder l'enfant devant l'écran : on l'invite à quitter l'appli.
    $("coach-leave").addEventListener("click", () => {
      if (current) { current.left = true; Store.save(); }
      $("coach-break").hidden = true;
      $("coach-goodbye").hidden = false;
      $("coach-goodbye-text").textContent = T.coach.goodbye.replace("{name}", Store.player || "");
      if (typeof config !== "undefined" && config.voice) Voice.speak(T.coach.goodbye.replace("{name}", Store.player || ""), { lang: lang() });
      try { window.close(); } catch (e) { /* un onglet ouvert à la main ne se ferme pas tout seul */ }
    });
    $("coach").addEventListener("cancel", e => { e.preventDefault(); if (!$("coach-ask").hidden) respond("snooze"); else close(); });
    // L'humeur « fatigué » ou « pas content » : un conseil tout de suite.
    const add = Store.addState;
    Store.addState = (state, context) => {
      add(state, context);
      if (state === "tired" || state === "unhappy") setTimeout(() => advise(state), 900);
    };
    window.addEventListener("kiboom-player", () => { playMs = 0; extraMs = 0; snoozes = 0; seenRagequits = null; });
    setInterval(tick, TICK);
  }

  return { init, texts, recommendation, advise, limitMin, _state: () => ({ playMs, extraMs, snoozes }) };
})();
