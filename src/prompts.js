export const MODEL_ID = 'onnx-community/SmolLM2-135M-Instruct';

export function buildMessages(problem, hintIndex = 0) {
  const style = {
    foundation: 'Use very simple language and one small step at a time. Explain what the hypotenuse is.',
    standard: 'Explain the relation between the real-world situation and a right triangle. Help the learner rearrange the formula.',
    advanced: 'Encourage spatial reasoning. Explain unfolding faces and comparing all three routes; distinguish a surface path from a space diagonal.',
  }[problem.level];
  return [
    { role: 'system', content: `You are Axiom, a concise, encouraging geometry tutor. ${style} Explain only the supplied verified hint. Do not change numbers or invent calculations. Do not give the final answer. Use at most three short sentences in plain English. Avoid Markdown and LaTeX.` },
    { role: 'user', content: `Difficulty: ${problem.level}. Problem: ${problem.question}\nVerified hint to explain: ${problem.hints[Math.min(hintIndex, problem.hints.length - 1)]}\nExplain why this hint helps.` },
  ];
}
