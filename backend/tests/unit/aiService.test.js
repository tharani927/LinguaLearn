const { generateDeterministicFeedback } = require('../../src/services/aiService');

describe('Unit Tests: AI Diagnostic Engine', () => {
  test('Generates structured educational diagnostics with deterministic fallback', () => {
    const skillBreakdown = {
      grammar: { total: 2, correct: 1 },
      vocabulary: { total: 2, correct: 2 },
    };
    const userAnswers = [
      { question_id: 1, is_correct: true, user_answer: 'Buenos días' },
      { question_id: 4, is_correct: false, user_answer: 'es' },
    ];

    const result = generateDeterministicFeedback(75, skillBreakdown, userAnswers, 4);

    expect(result).toBeDefined();
    expect(result.overallSummary).toContain('Solid performance');
    expect(result.engineUsed).toBe('deterministic_rule_engine');
    expect(Array.isArray(result.strengths)).toBe(true);
    expect(Array.isArray(result.weaknesses)).toBe(true);
    expect(Array.isArray(result.recommendations)).toBe(true);
  });
});
