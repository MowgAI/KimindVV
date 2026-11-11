/* La page de lancement de KibooM, aux couleurs de la présentation de NukkAI : fond blanc
   avec des lignes ondulées violettes, le logo KIBOOM (lettres « BD », deux O en yeux), la
   phrase qui dit ce qu'est KibooM, et cinq rubriques : Play Kiboo (lien vers l'application
   Kiboo), Kimind, Les KiJeux, Amusement et Personnalisation. Choix de la langue en haut.
   Elle s'ouvre au lancement (sauf quand l'adresse mène directement à un jeu, #kimba…) ; un clic
   sur le logo de l'en-tête la rouvre. */
const Home = (() => {
  "use strict";
  const KIBOO_URL = "https://mowgai.github.io/Kiboo/";
  const GUIDES = ["archi", "lili", "mary", "fonzy", "johnny", "nath", "galadriel", "ray", "bea", "poupetta"];
  let T = null, onLang = null;
  const $ = id => document.getElementById(id);

  // Le logo KIBOOM : K rouge, I turquoise, B jaune, deux O crème en yeux, M orange.
  function logoHTML() {
    return '<span class="kb kb-k">K</span><span class="kb kb-i">I</span><span class="kb kb-b">B</span>' +
      '<span class="kb-o"><i></i></span><span class="kb-o"><i></i></span><span class="kb kb-m">M</span>';
  }

  // Lignes ondulées violettes du fond (comme sur les diapositives).
  function waves() {
    let paths = "";
    for (let i = 0; i < 36; i++) {
      const y = 120 + i * 9, a = 60 + i * 4;
      paths += `<path d="M -50 ${y} C 300 ${y - a} 500 ${y + 260 - i * 6} 800 ${y + 40} S 1300 ${y - 120 + i * 3} 1650 ${y - 60}"/>`;
    }
    return `<svg class="home-waves" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">${paths}</svg>`;
  }

  const card = (c, v) => `<span class="card face home-mini" style="background-image:url(assets/cards/${c}-${v}.webp)"></span>`;

  function render() {
    const H = T.home;
    const box = $("home");
    box.innerHTML = `${waves()}
      <div class="home-langs" role="group" aria-label="${T.language}">${Object.keys(LANGS).map(l =>
        `<button type="button" data-lang="${l}" aria-pressed="${l === $("lang").value}">${l.toUpperCase()}</button>`).join("")}</div>
      <div class="home-page">
        <h1 class="home-logo kiboom" aria-label="KibooM">${logoHTML()}</h1>
        <p class="home-pitch">${H.pitch}</p>
        <p class="home-soon">${H.soon}</p>
        <p class="home-slogan">${H.slogan}</p>
        <div class="home-rubs">
          <section class="rub">
            <h2 class="rub-title">${H.kiboo.title}</h2>
            <div class="rub-body">
              <div class="rub-robots">${[["red", 2, "kind"], ["red", 9, "wise"], ["red", 6, "sneaky"], ["red", 10, "unbeatable"]].map(([c, v, k]) =>
                `<span class="rub-robot">${card(c, v)}<span class="rub-chip ${k}">${H.kiboo.robots[k]}</span></span>`).join("")}</div>
              <p class="rub-text">${H.kiboo.text}</p>
              <a class="act" href="${KIBOO_URL}" target="_blank" rel="noopener">${H.kiboo.go} ↗</a>
            </div>
          </section>
          <section class="rub">
            <h2 class="rub-title">${H.kimind.title}</h2>
            <div class="rub-body">
              <div class="rub-qs">${"<span>?</span>".repeat(4)}</div>
              <p class="rub-text">${H.kimind.text}</p>
              <button class="act" type="button" data-go="kimind-title">${H.kimind.go}</button>
            </div>
          </section>
          <section class="rub">
            <h2 class="rub-title">${H.games.title}</h2>
            <div class="rub-body">
              <div class="rub-faces">${GUIDES.map(g => `<img src="assets/characters/${g}-face.webp" alt="">`).join("")}</div>
              <p class="rub-text">${H.games.text}</p>
              <button class="act" type="button" data-go="games-title">${H.games.go}</button>
            </div>
          </section>
          <section class="rub">
            <h2 class="rub-title">${H.fun.title}</h2>
            <div class="rub-body">
              <div class="rub-fun">${card("blue", 1)}${card("green", 10)}${card("yellow", 2)}</div>
              <p class="rub-text">${H.fun.text}</p>
              <button class="act" type="button" data-a="parade">🎪 ${H.fun.parade}</button>
            </div>
          </section>
          <section class="rub">
            <h2 class="rub-title">${H.perso.title}</h2>
            <div class="rub-body">
              <div class="rub-icons" aria-hidden="true">📊 👤 📝</div>
              <p class="rub-text">${H.perso.text}</p>
              <button class="act" type="button" data-a="stats">${H.perso.stats}</button>
              <button class="act ghost" type="button" data-a="player">👤 ${H.perso.player}</button>
            </div>
          </section>
        </div>
      </div>`;
    box.querySelectorAll("[data-go]").forEach(b => { b.onclick = () => { close(); location.hash = ""; setTimeout(() => $(b.dataset.go).scrollIntoView({ behavior: "smooth" }), 50); }; });
    box.querySelector("[data-a=parade]").onclick = () => { close(); Parade.open(T, $("lang").value); };
    box.querySelector("[data-a=stats]").onclick = () => { close(); location.hash = "stats"; };
    box.querySelector("[data-a=player]").onclick = () => Stats.askPlayer();
    box.querySelectorAll("[data-lang]").forEach(b => { b.onclick = () => onLang(b.dataset.lang); });
  }

  function open() {
    $("home").hidden = false;
    document.body.classList.add("home-open");
    render();
    $("home").scrollTop = 0;
  }

  function close() {
    $("home").hidden = true;
    document.body.classList.remove("home-open");
  }

  // Textes (au début et quand la langue change) ; la page ouverte est redessinée.
  function texts(t) {
    T = t;
    if (!$("home").hidden) render();
  }

  function init(setLang) {
    onLang = setLang;
    $("logo-btn").addEventListener("click", open);
    $("home").addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    if (!location.hash) open();
  }

  return { init, texts, open, close, logoHTML };
})();
