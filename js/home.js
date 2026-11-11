/* L'accueil de Kiboom, comme celui de Kiboo : le logo KIBOOM se forme lettre par lettre (le
   « KIB » et les deux O en yeux de Kiboo, le M aux couleurs de Kimind), les personnages des
   jeux sautillent autour et Poupetta traverse l'écran. Boutons : Jouer (le menu), La parade ;
   choix de la langue ; une case permet de ne plus afficher l'accueil (gardée dans le
   navigateur) ; un clic sur le logo de l'en-tête le rouvre. L'accueil ne s'ouvre pas tout seul
   quand l'adresse mène directement à un jeu (#kimba…). Les animations sont coupées si
   l'appareil demande de réduire les animations. */
const Home = (() => {
  "use strict";
  const KEY = "kiboom-home-off";
  const GUIDES = ["archi", "lili", "mary", "fonzy", "johnny", "nath", "galadriel", "ray", "bea", "poupetta"];
  // Places des personnages autour du logo (en % de l'écran) et taille.
  const SPOTS = [[6, 12], [84, 10], [4, 52], [88, 48], [14, 80], [78, 78], [26, 6], [64, 4], [40, 86], [56, 84]];
  let T = null, onLang = null, off = false;
  try { off = localStorage.getItem(KEY) === "1"; } catch (e) { /* stockage indisponible */ }
  const $ = id => document.getElementById(id);

  // Le logo KIBOOM : K rouge, I bleu clair, B jaune, deux yeux, M vert.
  function logoHTML(cls) {
    return `<span class="kb-k">K</span><span class="kb-i">I</span><span class="kb-b">B</span><span class="kb-eye"></span><span class="kb-eye"></span><span class="kb-m">M</span>`;
  }

  function render() {
    const box = $("home");
    box.innerHTML = `
      <div class="home-langs" role="group" aria-label="${T.language}">${Object.keys(LANGS).map(l =>
        `<button type="button" data-lang="${l}" aria-pressed="${l === $("lang").value}">${l.toUpperCase()}</button>`).join("")}</div>
      ${GUIDES.map((g, i) => `<img class="home-hop" src="assets/characters/${g}.webp" alt="" style="left:${SPOTS[i][0]}%;top:${SPOTS[i][1]}%;animation-delay:${0.9 + i * 0.12}s, ${i * 0.15}s">`).join("")}
      <img class="home-run" src="assets/characters/poupetta.webp" alt="">
      <div class="home-center">
        <h1 class="home-logo kiboom" aria-label="Kiboom">${logoHTML()}</h1>
        <p class="home-tagline">${T.home.tagline}</p>
        <p class="home-games">${T.home.games}</p>
        <div class="home-btns">
          <button class="act home-play" type="button" data-a="play">▶️ ${T.home.play}</button>
          <button class="act ghost" type="button" data-a="parade">🎪 ${T.home.parade}</button>
        </div>
        <label class="home-off"><input type="checkbox" data-a="off"${off ? " checked" : ""}> ${T.home.noShow}</label>
      </div>`;
    box.querySelector("[data-a=play]").onclick = close;
    box.querySelector("[data-a=parade]").onclick = () => { close(); Parade.open(T, $("lang").value); };
    box.querySelector("[data-a=off]").onchange = e => {
      off = e.target.checked;
      try { localStorage.setItem(KEY, off ? "1" : "0"); } catch (err) { /* idem */ }
    };
    box.querySelectorAll("[data-lang]").forEach(b => { b.onclick = () => onLang(b.dataset.lang); });
  }

  function open() {
    $("home").hidden = false;
    document.body.classList.add("home-open");
    render();
    $("home").querySelector("[data-a=play]").focus();
  }

  function close() {
    $("home").hidden = true;
    document.body.classList.remove("home-open");
    if (location.hash) location.hash = "";
  }

  // Textes (au début et quand la langue change) ; l'accueil ouvert est redessiné.
  function texts(t) {
    T = t;
    if (!$("home").hidden) render();
  }

  function init(setLang) {
    onLang = setLang;
    $("logo-btn").addEventListener("click", open);
    $("home").addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    if (!off && !location.hash) open();
  }

  return { init, texts, open, close, logoHTML };
})();
