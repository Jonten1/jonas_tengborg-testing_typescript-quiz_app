describe('Full quiz game', () => {
  it('should be possible to play a full quiz game', () => {
    cy.visit('http://localhost:3000');

    cy.log('Given that I enter my name');
    cy.get('h1').should('contain', 'Quiz');
    cy.get('#nameField').type('John Doe');
    cy.log('And click the add-button');
    cy.get('button').should('contain', 'Add').click();

    cy.get('#Start').click();

    cy.log('Then I should see a question');
    cy.log('And I select an answer')
    for (let index = 0; index < 9; index++) {
      cy.get(
        '[data-testid="answer-button"]:first'
      ).click();
    }
  });
});
