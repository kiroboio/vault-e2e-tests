/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />
// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress
describe('connect to vault', () => {
  beforeEach(() => {
    cy.visit(Cypress.env("vault_url"));
  });

  it('open connect modal and run metamask or install metamask', () => {
    cy.task('connectBrowser')
    cy.wait(2000)
    cy.task('setPages')
    cy.task('loginToMetamask', { password: '12344321' })
    cy.reload()
    cy.viewport('macbook-16')
  });
});
