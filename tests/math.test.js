import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS, makeProblem, checkAnswer, parseAnswer } from '../src/math.js';
import { buildMessages } from '../src/prompts.js';

test('each level generates mathematically consistent tasks and tailored scaffolding', () => {
  for (const level of LEVELS) {
    const seen = new Set();
    for (let variation = 0; variation < 42; variation++) {
      const problem = makeProblem(level.id, variation);
      assert.equal(problem.hints.length, 3);
      assert.equal(problem.steps.length, 3);
      assert.ok(problem.answer > 0);
      assert.ok(checkAnswer(problem.answer.toFixed(2), problem).correct);
      assert.ok(!checkAnswer(String(problem.answer + 1), problem).correct);
      seen.add(problem.question);
      if (level.id === 'foundation') assert.equal(problem.answer ** 2, problem.a ** 2 + problem.b ** 2);
      if (level.id === 'standard') assert.equal(problem.answer ** 2 + problem.a ** 2, problem.c ** 2);
      if (level.id === 'advanced') {
        const squared = [(problem.a + problem.b) ** 2 + problem.c ** 2, (problem.a + problem.c) ** 2 + problem.b ** 2, (problem.b + problem.c) ** 2 + problem.a ** 2];
        assert.ok(Math.abs(problem.answer ** 2 - Math.min(...squared)) < 1e-10);
        assert.ok(problem.answer > Math.hypot(problem.a, problem.b, problem.c));
      }
    }
    assert.ok(seen.size >= 6, 'each level has at least six distinct variations');
  }
});

test('default problems match independently known answers', () => {
  assert.equal(makeProblem('foundation').answer, 10);
  assert.equal(makeProblem('standard').answer, 12);
  assert.equal(makeProblem('advanced').answer, Math.sqrt(193));
  assert.ok(checkAnswer('13.89', makeProblem('advanced')).correct);
  assert.ok(!checkAnswer('13.88', makeProblem('advanced')).correct);
  assert.ok(!checkAnswer('13.90', makeProblem('advanced')).correct);
});

test('answer parser handles decimals and rejects ambiguous or invalid input', () => {
  for (const invalid of ['', ' ', 'NaN', 'Infinity', '-1', '0', '1e1', '10 cm', '1.2.3', '<script>']) {
    assert.equal(parseAnswer(invalid), null, invalid);
    assert.ok(checkAnswer(invalid, makeProblem()).invalid);
  }
  assert.equal(parseAnswer(' 13,89 '), 13.89);
  assert.equal(parseAnswer('.5'), .5);
  assert.equal(parseAnswer('10.0'), 10);
  assert.ok(checkAnswer('10', makeProblem()).correct);
  assert.ok(!checkAnswer('10.01', makeProblem()).correct);
});

test('AI prompts adapt language and contain a verified hint for each level', () => {
  const prompts = LEVELS.map(level => {
    const problem = makeProblem(level.id);
    const messages = buildMessages(problem, 1);
    assert.equal(messages.length, 2);
    assert.equal(messages[0].role, 'system');
    assert.ok(messages[1].content.includes(problem.hints[1]));
    assert.ok(messages[1].content.includes(problem.question));
    assert.match(messages[0].content, /Do not give the final answer/);
    return messages[0].content;
  });
  assert.equal(new Set(prompts).size, 3);
});

test('invalid problem parameters are rejected', () => {
  assert.throws(() => makeProblem('unknown'));
  assert.throws(() => makeProblem('foundation', -1));
  assert.throws(() => makeProblem('foundation', 0.5));
});
