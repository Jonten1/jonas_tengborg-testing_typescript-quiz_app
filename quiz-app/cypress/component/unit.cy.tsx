import React from 'react';
import App from '../../src/App';

describe('<App>', () => {
  it('Mount', () => {
    cy.mount(<App />);

    cy.get('#nameField').type('John Doe');
    cy.get('button')
      .should('contain', 'Add')
      .click();
    cy.get('[data-cy=diff-options]')
      .children()
      .should('have.length', 4);
    cy.get('[data-cy=cat-options]')
      .children()
      .should('have.length', 4);

    cy.get('#Start').click();

    cy.get('[data-cy=question]').should(
      'not.be.empty'
    );
    for (let index = 0; index < 9; index++) {
      cy.get(
        '[data-testid="answer-button"]:first'
      ).click();
    }
  });
});
