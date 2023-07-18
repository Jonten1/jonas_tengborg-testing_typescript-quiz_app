import {QuizSettings} from "../../src/utils/QuizSettings";
describe("Quiz App", () => {
  it("should select difficulty, enter name and start the Quiz", () => {
    cy.visit("http://localhost:3000");
    cy.get(".nameInput")
      .type("player");
    cy.get(".difficultyMenu")
      .select("Easy");
    cy.wait(1500);

    cy.contains("Start").click();
    for (let i = 0; i < QuizSettings.questionsPerRound; i++) {
      cy.get("button.buttonCat")
        .then((categoryButtons) => {
          const randomCat = Math.floor(
            Math.random() * categoryButtons.length
          );
          cy.wrap(categoryButtons).eq(randomCat).click();
        });

      cy.wait(4500);

      cy.get("button.answerButton")
        .then((answerButtons) => {
          const randomAnswer = Math.floor(
            Math.random() * answerButtons.length
          );
          cy.wrap(answerButtons).eq(randomAnswer).click();
        });

      cy.wait(1500);
    }
  });
});
