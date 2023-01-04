Feature: Quiz round

  Scenario: Start quiz round
    Given the quiz has started
    When the user clicks the "Start" button
    Then the first question should be displayed
    And the timer should start counting down from 30 seconds

  Scenario: Answer question
    Given the user is on the first question
    When the user selects an answer and clicks "Submit"
    Then the next question should be displayed
    And the score should be incremented by 1 if the answer is correct
    And the timer should be reset to 30 seconds

  Scenario: Finish quiz round
    Given the user is on the final question
    When the user selects an answer and clicks "Submit"
    Then the quiz results should be displayed
    And the final score should be calculated and displayed
    And the timer should stop
