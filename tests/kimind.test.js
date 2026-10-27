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

// Un tour : une réponse par position ; les 4 couleurs doivent être différentes.
const round = K.answerRound(sol, [{ position: 0, colour: "yellow", value: 3 }, { position: 2, colour: "blue", value: 6 }]);
assert.deepStrictEqual(round.map(c => c.answer), [{ colour: true, value: "less" }, { colour: false, value: "more" }]);
const found = [sol[1], sol[3]];
assert.ok(K.validOffer([{ position: 0, colour: "yellow", value: 3 }, { position: 2, colour: "green", value: 6 }], found));
assert.ok(!K.validOffer([{ position: 0, colour: "yellow", value: 3 }, { position: 2, colour: "red", value: 6 }], found));
assert.ok(!K.validOffer([{ position: 0, colour: "yellow", value: null }, { position: 2, colour: "green", value: 6 }], found));

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


// KiMinus : la carte 0 compte en +, les autres en + ou en −, somme entre −29 et 40.
assert.strictEqual(K.signedSum([{ value: 1 }, { value: 10 }, { value: 10 }, { value: 10 }], [1, -1, -1, -1]), -29);
for (const level of Object.keys(K.SIGNED_LEVELS)) {
  for (let i = 0; i < 50; i++) {
    const g = K.newSignedGame(level);
    const { sum, signs } = g.statement;
    assert.strictEqual(g.level, level);
    assert.strictEqual(signs[0], 1);
    assert.ok(signs.every(x => x === 1 || x === -1));
    assert.ok(sum >= -29 && sum <= 40);
    assert.strictEqual(K.signedSum(g.solution, signs), sum);
    const all = K.allSolutions(g.statement);
    assert.strictEqual(all.length, g.nbSolutions);
    assert.ok(all.every(s => K.signedSum(s, signs) === sum));
    assert.ok(all.some(s => JSON.stringify(s) === JSON.stringify(g.solution)));
  }
}

// KiMinus 2 : signes cachés ; les solutions comprennent les signes.
assert.strictEqual(K.SIGN_COMBOS.length, 8);
assert.deepStrictEqual(K.answerSigns([1, -1, 1, -1], [{ position: 1, sign: -1 }, { position: 3, sign: 1 }]).map(s => s.ok), [true, false]);
for (const level of Object.keys(K.HIDDEN_LEVELS)) {
  for (let i = 0; i < 10; i++) {
    const g = K.newHiddenSignsGame(level);
    assert.strictEqual(g.level, level);
    assert.ok(!g.statement.signs && g.statement.hiddenSigns);
    assert.strictEqual(K.signedSum(g.solution, g.signs), g.statement.sum);
    const all = K.allSolutions(g.statement);
    assert.strictEqual(all.length, g.nbSolutions);
    const key = s => JSON.stringify(s.cards) + s.signs;
    assert.ok(all.some(s => key(s) === key({ cards: g.solution, signs: g.signs })));
    // Après un tour, la vraie solution reste possible.
    const plays = K.answerRound(g.solution, [0, 1, 2, 3].map(p => ({ position: p, colour: "red", value: 5 })));
    const signPlays = K.answerSigns(g.signs, [1, 2, 3].map(p => ({ position: p, sign: 1 })));
    const rest = K.remaining(g.statement, plays, signPlays);
    assert.ok(rest.some(s => key(s) === key({ cards: g.solution, signs: g.signs })));
    assert.ok(rest.every(s => signPlays.every(sp => (s.signs[sp.position] === sp.sign) === sp.ok)));
  }
}

console.log("Tous les tests passent.");
