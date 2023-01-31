import { defineFeature, loadFeature } from 'jest-cucumber';


const feature = loadFeature('./specs/features/game.feature');

defineFeature(feature, test => {
  test('Start quiz round', ({
    given,
    when,
    then,
    and
  }) => {
    given('I want to start the quiz', () => {

    });

    when(/^the user clicks the (.*) button$/, (arg0) => {

    });

    then('the first question should be displayed', () => {

    });

    and(/^the timer should count down from (.*)$/, (arg0) => {

    });
  });
});
