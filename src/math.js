export const LEVELS = [
  { id: 'foundation', name: 'Foundation', subtitle: 'Build your confidence', eyebrow: 'Start with the essentials', minutes: 3, number: 1 },
  { id: 'standard', name: 'Standard', subtitle: 'Connect the dots', eyebrow: 'Put the idea to work', minutes: 4, number: 2 },
  { id: 'advanced', name: 'Advanced', subtitle: 'Go a little further', eyebrow: 'Think beyond the triangle', minutes: 6, number: 3 },
];

const TRIPLES = [[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25], [20, 21, 29]];
const BOXES = [[3, 4, 12], [4, 5, 10], [5, 6, 12], [3, 8, 10], [6, 8, 15], [4, 7, 12]];
export const pretty = value => Number.isInteger(value) ? String(value) : value.toFixed(2);

export function makeProblem(level = 'foundation', variation = 0) {
  if (!LEVELS.some(item => item.id === level)) throw new Error('Unknown difficulty level');
  if (!Number.isSafeInteger(variation) || variation < 0) throw new Error('Invalid variation');
  const common = { id: `${level}-${variation}`, level, variation, unit: 'cm' };
  if (level === 'foundation') {
    const [a, b, c] = TRIPLES[variation % TRIPLES.length];
    return {
      ...common, a, b, c, answer: c,
      title: 'Meet the missing side.',
      question: `A right triangle has two shorter sides measuring ${a} cm and ${b} cm. What is the length of the hypotenuse, c?`,
      answerLabel: 'Length of the hypotenuse',
      hints: [
        'The hypotenuse is the longest side, opposite the right angle. Label it c.',
        `Use a² + b² = c². Substitute the two shorter sides: ${a}² + ${b}² = c².`,
        `${a * a} + ${b * b} = ${c * c}. Take the positive square root to find c.`,
      ],
      steps: [
        { title: 'Identify the sides', text: `The two legs are a = ${a} cm and b = ${b} cm. The unknown hypotenuse is c.` },
        { title: 'Square and add', text: `c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}.` },
        { title: 'Take the square root', text: `c = √${c * c} = ${c} cm. A length is positive, so we use the positive root.` },
      ],
      takeaway: 'When both legs are known, add their squares and take the square root.',
      feedback: `Add the squares of ${a} and ${b}, then take the square root. The longest side must be greater than ${b}.`,
    };
  }
  if (level === 'standard') {
    const [a, b, c] = TRIPLES[(variation + 1) % TRIPLES.length];
    return {
      ...common, a, b, c, answer: b, unit: 'm',
      title: 'A new point of view.',
      question: `A ${c} m ladder leans against a vertical wall. Its foot is ${a} m from the wall on level ground. How high up the wall does the ladder reach?`,
      answerLabel: 'Height reached by the ladder',
      hints: [
        `The wall and ground form a right angle. The ${c} m ladder is the hypotenuse.`,
        `Rearrange the theorem: height² = ${c}² − ${a}². This time you subtract.`,
        `height² = ${c * c} − ${a * a} = ${b * b}. Find its positive square root.`,
      ],
      steps: [
        { title: 'Model the situation', text: `The ladder is the hypotenuse c = ${c} m; the horizontal leg is a = ${a} m.` },
        { title: 'Find the missing leg', text: `b² = c² − a² = ${c}² − ${a}² = ${c * c} − ${a * a} = ${b * b}.` },
        { title: 'Interpret the result', text: `b = √${b * b} = ${b} m. The ladder reaches ${b} metres up the wall.` },
      ],
      takeaway: 'When the hypotenuse and one leg are known, subtract the squares.',
      feedback: `The ladder is the hypotenuse. Subtract ${a}² from ${c}², then take the positive square root.`,
    };
  }
  const [a, b, c] = BOXES[variation % BOXES.length];
  const routes = [
    { sum: `${a} + ${b}`, other: c, squared: (a + b) ** 2 + c ** 2 },
    { sum: `${a} + ${c}`, other: b, squared: (a + c) ** 2 + b ** 2 },
    { sum: `${b} + ${c}`, other: a, squared: (b + c) ** 2 + a ** 2 },
  ];
  const minimum = Math.min(...routes.map(route => route.squared));
  const answer = Math.sqrt(minimum);
  return {
    ...common, a, b, c, routes, answer,
    title: 'Take the unexpected route.',
    question: `A beetle travels between opposite corners of a ${a} × ${b} × ${c} cm rectangular box, staying on its surface. What is the shortest possible distance? Round your answer to 2 decimal places.`,
    answerLabel: 'Shortest distance along the surface',
    hints: [
      'Imagine unfolding two adjacent faces into a flat rectangle. A straight line across that rectangle is a possible route.',
      `There are three distinct unfoldings: (${a} + ${b}) by ${c}, (${a} + ${c}) by ${b}, and (${b} + ${c}) by ${a}.`,
      `Compare the three diagonals using Pythagoras. The smallest squared distance is ${minimum}; take its square root.`,
    ],
    steps: [
      { title: 'Unfold the surface', text: 'A shortest surface path becomes a straight diagonal when the adjacent faces are laid flat. Compare the three possible face pairings.' },
      { title: 'Compare all three routes', text: routes.map(route => `(${route.sum})² + ${route.other}² = ${route.squared}`).join('; ') + '.' },
      { title: 'Choose the shortest', text: `The smallest squared distance is ${minimum}, so d = √${minimum} ≈ ${answer.toFixed(2)} cm. The space diagonal cuts through the box and is not a valid surface path.` },
    ],
    takeaway: 'A three-dimensional problem can become a familiar triangle when you unfold it.',
    feedback: 'Compare the diagonals of all three unfolded rectangles. Remember: a diagonal through the inside of the box is not a surface path.',
  };
}

export function parseAnswer(input) {
  const normalized = String(input).trim().replace(',', '.');
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return null;
  const number = Number(normalized);
  return Number.isFinite(number) && number > 0 ? number : null;
}

export function checkAnswer(input, problem) {
  const value = parseAnswer(input);
  if (value === null) return { correct: false, invalid: true, message: 'Enter a positive number, such as 10 or 13.89.' };
  // Advanced answers are explicitly requested to two decimal places. Compare rounded values.
  const correct = problem.level === 'advanced'
    ? Math.round(value * 100) === Math.round(problem.answer * 100)
    : Math.abs(value - problem.answer) <= 0.000001;
  return { correct, invalid: false, message: correct ? `Exactly right. ${pretty(problem.answer)} ${problem.unit} — you found it!` : problem.feedback };
}
