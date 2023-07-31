/* eslint-disable testing-library/no-node-access */
import { calculateScore } from '../utils/Utils';
import { fetchCategories } from '../api/Api';
import { Question } from '../components/Question';
import { Categories } from '../components/Categories';

import {
  fireEvent,
  queryByAttribute,
  getByTestId,
  getByText,
  render,
  screen
} from '@testing-library/react';

// eslint-disable-next-line jest/valid-title
test('fetchCategories returns Object ', async () => {
  const response = await fetchCategories();
  expect(response).toBeInstanceOf(Object);
  expect(
    Object.keys(response).length
  ).toBeGreaterThan(0);
  expect(Object.keys(response)).not.toBeNull();
});
// test('Render categories', () => {
//   render(<Categories />);
//   const element = screen.getByTestId('container');
// });
test('No questions render at start', () => {
  render(<Question />);
  const container =
    document.querySelector('#questions');
  expect(container).toBeNull();
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
    expect(actualScore).not.toBeNull();
    expect(actualScore).not.toBeNaN();
  });
});
