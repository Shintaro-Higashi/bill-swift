/// <reference types="cypress" />
Cypress.Commands.add('login', (email: string, password: string) => {})

Cypress.Commands.add('logout', () => {})

declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<void>
    logout(): Chainable<void>
  }
}
