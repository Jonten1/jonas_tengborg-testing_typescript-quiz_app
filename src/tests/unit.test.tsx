import { calculateScore } from '../utils/Utils';
import { fetchCategories } from '../api/Api';

// eslint-disable-next-line jest/valid-title
test('fetchCategories returns Object ', async () => {
  const response = await fetchCategories();
  expect(response).toBeInstanceOf(Object);
  expect(
    Object.keys(response).length
  ).toBeGreaterThan(0);
});

describe('calculateScore', () => {
  it('calculates the score', () => {
    const totalScore = 30;
    const difficultyMultiplier = 1.5;
    const increaseDifficultyMultiplier = 0.5;
    const correctAnswers = 3;
    const continualBonus = 2;

    const expectedScore =
      Math.floor(
        totalScore *
          (difficultyMultiplier +
            increaseDifficultyMultiplier) +
          correctAnswers
      ) * continualBonus;

    const actualScore = calculateScore(
      totalScore,
      difficultyMultiplier,
      increaseDifficultyMultiplier,
      correctAnswers,
      continualBonus
    );

    expect(actualScore).toBe(expectedScore);
  });
});
