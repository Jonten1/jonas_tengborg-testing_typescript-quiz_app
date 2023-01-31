Feature: Quiz round

  Scenario: Start quiz round
    Given the quiz has started
    When the user clicks the "Start" button
    Then the first question should be displayed
    And the timer should count down from 30
