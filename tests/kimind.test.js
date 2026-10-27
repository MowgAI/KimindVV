/* Tests du moteur : node tests/kimind.test.js */
const assert = require("assert");
const K = require("../js/kimind.js");

// Exemples de la documentation de Kimind (nombre de solutions avec les positions).
assert.strictEqual(K.valueSolutions(20, [["yellow", "red"], ["blue"], ["green"]]).length * 24, 168);
assert.strictEqual(K.valueSolutions(34, [["blue"], ["red"], ["green"], ["yellow"]]).length * 24, 24);

// Réponses : la vraie valeur est plus petite, plus grande ou égale.
const sol = [{ colour: "yellow", value: 2 }, { colour: "red", value: 3 }, { colour: "green", value: 8 }, { colour: "blue", value: 8 }];
assert.deepStrictEqual(K.answer(sol, 1, "blue", 7), { colour: false, value: "less" });
assert.deepStrictEqual(K.answer(sol, 3, "yellow", 1), { colour: false, value: "more" });
assert.deepStrictEqual(K.answer(sol, 0, "yellow", 2), { colour: true, value: "equals" });

// Chaque partie tirée respecte son niveau, et sa solution fait partie des solutions possibles.
for (const level of Object.keys(K.LEVELS)) {
  for (let i = 0; i < 200; i++) {
    const g = K.newGame(level);
    assert.strictEqual(g.level, level);
    assert.strictEqual(g.solution.reduce((t, c) => t + c.value, 0), g.statement.sum);
    assert.strictEqual(new Set(g.solution.map(c => c.colour)).size, 4);
    const all = K.allSolutions(g.statement);
    assert.strictEqual(all.length, g.nbSolutions);
    assert.ok(all.some(s => JSON.stringify(s) === JSON.stringify(g.solution)));
  }
}

// Après des coups, la solution reste toujours possible.
const g = K.newGame("hard");
const plays = [];
for (let p = 0; p < 4; p++) {
  const play = { position: p, colour: "blue", value: 5 };
  play.answer = K.answer(g.solution, p, play.colour, play.value);
  plays.push(play);
}
const rest = K.remaining(g.statement, plays);
assert.ok(rest.length >= 1 && rest.length <= g.nbSolutions);
assert.ok(rest.some(s => JSON.stringify(s) === JSON.stringify(g.solution)));

console.log("Tous les tests passent.");
