/* eslint-disable cypress/no-unnecessary-waiting */
import 'cypress-wait-until';

const moveEth = ({ value }) =>
  new Promise(resolve => {
    cy.waitUntil(() => cy.contains('Move assets', { timeout: 30000 }).click()).then(async () => {
      await cy.get('input').get('#move_assets_regular_input').type('0');
      await cy.wait(3000);
      await cy.get('input').get('#move_assets_vault_input').type('0');
      await cy.wait(3000);
      await cy.get('input').get('#move_assets_vault_input').type(value);
      await cy.wait(3000);
      await cy.get('button').contains('Move Kiro', { matchCase: false }).click();
      await cy.wait(3000);
      await cy.get('#close').click();
      cy.task('confirm');
      resolve();
    });
  });

describe('move assets', () => {
  beforeEach(() => {
    cy.viewport('macbook-16');
  });
  it('move assets', () => {
    const initValue = '1.2';
    const newValue = '2.123';
    const waitUntilNewValue = () => cy.contains(newValue, { timeout: 50000 }).should('exist');

    moveEth({ value: newValue }).then(() => {
      cy.waitUntil(waitUntilNewValue).then(() => {
        moveEth({ value: initValue });
      });
    });
  });
});
