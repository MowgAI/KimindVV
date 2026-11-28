/* Deux façons ludiques d'affiner « Mes goûts » (Ego, espace 4), sans chat et sans IA en ligne :
   - « Ceci ou cela ? » : 10 duels rapides en grandes images (cartes, personnages, émojis) ; on répond
     sans lire beaucoup (bien pour les petits et les dys). Réponses : l'un, l'autre, les deux, aucun.
     Données : EGO.thisOrThat ; réponses datées dans Store.data.tot (la plus récente compte).
   - « Mon univers » : un tableau où l'enfant pose les autocollants de ce qu'il aime (ceux tirés de ses
     goûts d'abord, puis tous les autres, et ses propres mots), les déplace, les agrandit. C'est créatif,
     c'est une trace de lui, et ZeMowg le montre dans « Ce que ZeMowg sait de moi ».
     Données : Store.data.univers[joueur] = { items: [{ e | card | text, x, y (0..1), s }], time }.
   Export : this_or_that/4, univers_sticker/3. */
const Gouts = (() => {
  "use strict";
  let T = null, round = null, selected = null;
  const lang = () => (document.documentElement.lang === "en" ? "en" : "fr");
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const totLog = () => Store.data.tot || (Store.data.tot = []);
  const N = 10;

  /* ---------- Ceci ou cela ? ---------- */
  // Les réponses actuelles du joueur : { cat_dog: "a", ... } (la plus récente l'emporte).
  function answers() {
    const out = {};
    totLog().filter(t => t.player === Store.player).forEach(t => { out[t.id] = t.answer; });
    return out;
  }
  const side = (x, big) => x.card ? `<span class="card face tot-card${big ? "" : " small"}" style="background-image:url(assets/cards/${x.card}.webp)"></span>`
    : x.face ? `<img class="tot-face${big ? "" : " small"}" src="assets/characters/${x.face}-face.webp" alt="">` : `<span class="tot-emoji${big ? "" : " small"}">${x.icon}</span>`;
  const icon = x => (x.icon ? x.icon : side(x, false));

  // Ce que l'enfant préfère, en petit (pour le résumé et pour ZeMowg) : [{ html, text }].
  function summary() {
    const a = answers(), L = lang(), out = [];
    EGO.thisOrThat.forEach(d => {
      const v = a[d.id];
      if (v === "a" || v === "b") out.push({ id: d.id, html: icon(d[v]), text: d[v][L] });
      else if (v === "both") out.push({ id: d.id, html: icon(d.a) + icon(d.b), text: d.a[L] + " + " + d.b[L] });
    });
    return out;
  }

  function startRound() {
    const a = answers();
    const fresh = EGO.thisOrThat.filter(d => !(d.id in a)), old = EGO.thisOrThat.filter(d => d.id in a);
    const shuffle = l => l.slice().sort(() => Math.random() - 0.5);
    round = { list: shuffle(fresh).concat(shuffle(old)).slice(0, N), i: 0 };
  }

  function renderTot(box, done) {
    if (!round) startRound();
    const L = lang(), C = T.tot;
    if (round.i >= round.list.length) {
      const s = summary();
      box.innerHTML = `<div class="ego-q"><h3 class="ego-question">⚡ ${C.title}</h3><p class="ego-sub">${C.end}</p></div>
        <div class="tot-summary">${s.map(x => `<span class="tot-chip" title="${esc(x.text)}">${x.html} ${esc(x.text)}</span>`).join("")}</div>
        <div class="ego-nav"><button class="act" type="button" data-t="again">🔁 ${C.again}</button><button class="act ghost" type="button" data-t="back">✔ ${C.back}</button></div>`;
      box.querySelector("[data-t=again]").onclick = () => { startRound(); renderTot(box, done); };
      box.querySelector("[data-t=back]").onclick = () => { round = null; done(); };
      return;
    }
    const d = round.list[round.i];
    box.innerHTML = `<div class="ego-q"><h3 class="ego-question">⚡ ${C.title}</h3><p class="ego-sub">${C.intro}</p></div>
      <p class="tot-step">${C.step(round.i + 1, round.list.length)}</p>
      <div class="tot-duel">
        <button type="button" class="tot-side" data-a="a">${side(d.a, true)}<span>${esc(d.a[L])}</span></button>
        <span class="tot-or">${C.or}</span>
        <button type="button" class="tot-side" data-a="b">${side(d.b, true)}<span>${esc(d.b[L])}</span></button>
      </div>
      <p class="tot-more"><button class="act ghost" type="button" data-a="both">💞 ${C.both}</button><button class="act ghost" type="button" data-a="none">🙅 ${C.none}</button><button class="act ghost" type="button" data-a="skip">⏭ ${C.skip}</button></p>
      <div class="ego-nav"><button class="act ghost" type="button" data-t="back">← ${C.back}</button></div>`;
    box.querySelectorAll("[data-a]").forEach(b => {
      b.onclick = () => {
        if (b.dataset.a !== "skip") { totLog().push({ player: Store.player, id: d.id, answer: b.dataset.a, time: Date.now() }); Store.save(); }
        round.i++;
        renderTot(box, done);
      };
    });
    box.querySelector("[data-t=back]").onclick = () => { round = null; done(); };
  }

  /* ---------- Mon univers ---------- */
  const store = () => Store.data.univers || (Store.data.univers = {});
  function univers() { return store()[Store.player] || { items: [], time: null }; }
  function saveUnivers(u) { u.time = Date.now(); store()[Store.player] = u; Store.save(); }

  // Les autocollants tirés de ce que l'enfant nous a dit (goûts, Ceci ou cela, avatar), puis tous les autres.
  function suggested() {
    const lk = Store.likes(), out = [], seen = new Set(), add = it => { if (!it) return; const k = it.e || it.card; if (k && !seen.has(k)) { seen.add(k); out.push(it); } };
    if (Store.avatar) add({ card: Store.avatar });
    EGO.likes.concat(EGO.likesExtra || []).forEach(q => {
      if (q.id === "dislikes" || q.id === "fears" || q.id === "screen_liking" || q.id === "after_screen") return;
      const opts = q.options || EGO[q.list] || [];
      (lk[q.id] || []).forEach(v => { const o = opts.find(x => x.id === v); if (o && o.icon) add({ e: o.icon }); });
    });
    const a = answers();
    EGO.thisOrThat.forEach(d => { const v = a[d.id]; [v === "a" || v === "both" ? d.a : null, v === "b" || v === "both" ? d.b : null].forEach(x => { if (x) add(x.card ? { card: x.card } : x.face ? null : { e: x.icon }); }); });
    return out.filter(Boolean);
  }

  const itemHTML = (it, k) => {
    const inner = it.card ? `<span class="card face uv-card" style="background-image:url(assets/cards/${it.card}.webp)"></span>` : it.text ? `<span class="uv-text">${esc(it.text)}</span>` : it.e;
    return `<span class="uv-item${selected === k ? " sel" : ""}" data-k="${k}" style="left:${it.x * 100}%;top:${it.y * 100}%;--s:${it.s || 1}">${inner}</span>`;
  };

  function renderUnivers(box, done) {
    const C = T.univers, u = univers(), sug = suggested();
    const pal = (list, cls) => list.map(it => `<button type="button" class="uv-pick ${cls}" data-add='${esc(JSON.stringify(it))}'>${it.card ? `<span class="card face uv-card small" style="background-image:url(assets/cards/${it.card}.webp)"></span>` : it.e}</button>`).join("");
    box.innerHTML = `<div class="ego-q"><h3 class="ego-question">🪐 ${C.title}</h3><p class="ego-sub">${C.intro}</p></div>
      <div class="uv-board" aria-label="${esc(C.title)}">${u.items.map(itemHTML).join("")}${u.items.length ? "" : `<p class="uv-hint">${C.empty}</p>`}</div>
      <p class="uv-tools">${selected !== null && u.items[selected] ? `<button class="act ghost" type="button" data-u="bigger">➕ ${C.bigger}</button><button class="act ghost" type="button" data-u="smaller">➖ ${C.smaller}</button><button class="act ghost" type="button" data-u="del">🗑️ ${C.remove}</button>` : `<span class="uv-tip">${C.tip}</span>`}</p>
      ${sug.length ? `<h4 class="uv-h">${C.forYou}</h4><div class="uv-palette">${pal(sug, "mine")}</div>` : ""}
      <h4 class="uv-h">${C.all}</h4><div class="uv-palette">${pal(EGO.stickers.map(e => ({ e })), "")}</div>
      <p class="uv-word"><input type="text" maxlength="24" placeholder="${esc(C.wordPh)}"><button class="act ghost" type="button" data-u="word">✍️ ${C.word}</button></p>
      <div class="ego-nav"><button class="act" type="button" data-u="back">✔ ${C.done}</button></div>`;
    const board = box.querySelector(".uv-board");
    const rerender = () => { const y = window.scrollY; renderUnivers(box, done); window.scrollTo(0, y); };
    const place = it => { const v = univers(); v.items.push(Object.assign({ x: 0.15 + Math.random() * 0.7, y: 0.15 + Math.random() * 0.7, s: 1 }, it)); selected = v.items.length - 1; saveUnivers(v); rerender(); };
    box.querySelectorAll("[data-add]").forEach(b => { b.onclick = () => place(JSON.parse(b.dataset.add)); });
    const word = box.querySelector(".uv-word input");
    const addWord = () => { const t = word.value.trim().slice(0, 24); if (t) place({ text: t }); };
    box.querySelector("[data-u=word]").onclick = addWord;
    word.addEventListener("keydown", e => { if (e.key === "Enter") addWord(); });
    const act = (n, f) => { const b = box.querySelector("[data-u=" + n + "]"); if (b) b.onclick = f; };
    act("bigger", () => { const v = univers(); v.items[selected].s = Math.min(3, (v.items[selected].s || 1) + 0.3); saveUnivers(v); rerender(); });
    act("smaller", () => { const v = univers(); v.items[selected].s = Math.max(0.5, (v.items[selected].s || 1) - 0.3); saveUnivers(v); rerender(); });
    act("del", () => { const v = univers(); v.items.splice(selected, 1); selected = null; saveUnivers(v); rerender(); });
    act("back", () => { selected = null; done(); });
    // Déplacer un autocollant (souris ou doigt) ; un simple clic le sélectionne.
    board.querySelectorAll(".uv-item").forEach(el => {
      el.addEventListener("pointerdown", ev => {
        ev.preventDefault();
        const k = +el.dataset.k, r = board.getBoundingClientRect();
        let moved = false;
        el.setPointerCapture(ev.pointerId);
        const move = e => {
          moved = true;
          el.style.left = Math.min(98, Math.max(2, ((e.clientX - r.left) / r.width) * 100)) + "%";
          el.style.top = Math.min(96, Math.max(4, ((e.clientY - r.top) / r.height) * 100)) + "%";
        };
        const up = () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerup", up);
          const v = univers();
          if (moved) { v.items[k].x = parseFloat(el.style.left) / 100; v.items[k].y = parseFloat(el.style.top) / 100; saveUnivers(v); }
          selected = k;
          rerender();
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerup", up);
      });
    });
  }

  // Petite vue de l'univers (pour ZeMowg) : les autocollants en ligne.
  function universLine() {
    return univers().items.map(it => (it.card ? `<span class="card face zm-mini inline" style="background-image:url(assets/cards/${it.card}.webp)"></span>` : it.text ? "« " + esc(it.text) + " »" : it.e)).join(" ");
  }

  function texts(t) { T = t; }
  return { texts, renderTot, renderUnivers, summary, univers, universLine, answers };
})();
