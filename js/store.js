/* Données des parties, pour la personnalisation : joueurs, exercices joués (essais, temps,
   aides, abandons), parties de Kimind et humeurs choisies par l'enfant.
   Tout reste dans le navigateur (localStorage) : rien ne part sur Internet. La page
   Statistiques (js/stats.js) les montre et les exporte en faits Prolog, au format de la
   théorie du domaine (BK) de Kiboom.
   Si le stockage est indisponible (navigation privée…), les données vivent le temps de la page. */
const Store = (() => {
  "use strict";
  const KEY = "kimind-data";
  const PLAYER_KEY = "kimind-player";
  let data = { players: [], instances: [], kimind: [], states: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && saved.instances) data = Object.assign(data, saved);
  } catch (e) { /* stockage indisponible ou abîmé : on repart de zéro */ }
  let player = null;
  try { player = localStorage.getItem(PLAYER_KEY); } catch (e) { /* idem */ }
  if (player && !data.players.includes(player)) player = null;

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* stockage plein ou indisponible */ }
  }

  // Identifiant Prolog d'un joueur : minuscules, lettres et chiffres (ex. « Léa B. » → lea_b).
  function playerId(name) {
    return name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "joueur";
  }

  function setPlayer(name) {
    name = name.trim();
    if (!name) return;
    if (!data.players.includes(name)) data.players.push(name);
    player = name;
    try { localStorage.setItem(PLAYER_KEY, name); } catch (e) { /* idem */ }
    save();
  }

  // Numéro d'exercice dans la série du joueur (exercise_number de la BK).
  const exerciseNumber = () => data.instances.filter(i => i.player === player).length + 1;

  // Un exercice des jeux « une réponse par couleur » commence ; renvoie l'objet à compléter.
  function startInstance(fields) {
    const inst = Object.assign({
      id: "ex_" + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36),
      player,
      number: exerciseNumber(),
      start: Date.now(),
      tries: [],
      help: 0,
      ragequit: false,
      success: false,
    }, fields);
    data.instances.push(inst);
    save();
    return inst;
  }

  function addState(state, context) {
    data.states.push({ player, state, time: Date.now(), game: context.game || null, instance: context.instance || null });
    save();
  }

  function addKimind(game) {
    data.kimind.push(Object.assign({ player, time: Date.now() }, game));
    save();
  }

  function clear() {
    data = { players: data.players, instances: [], kimind: [], states: [] };
    save();
  }

  return {
    get player() { return player; },
    get data() { return data; },
    playerId, setPlayer, startInstance, addState, addKimind, save, clear,
  };
})();
