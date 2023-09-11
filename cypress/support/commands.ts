/// <reference types="cypress" />
/// <reference types="./index.d.ts" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import {
  getCreateButton,
  getDeleteButton,
  getEditButton,
  getPageHeaderTitle,
  getSaveButton,
  getShowButton,
} from './commands/refine'
import { list, create, edit, show, resourceDelete } from './commands/resource'
import { assertDocumentTitle } from './commands/document-title-handler'

// add commands to the Cypress chain
import './commands/intercepts'
import {
  fillMaterialUIForm,
  getMaterialUIColumnHeader,
  getMaterialUIDeletePopoverButton,
  getMaterialUIFormItemError,
  getMaterialUILoadingCircular,
  getMaterialUINotifications,
} from './commands/material-ui'

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
})

Cypress.config('defaultCommandTimeout', 20000)
Cypress.config('requestTimeout', 20000)

Cypress.Commands.add('assertDocumentTitle', assertDocumentTitle)

Cypress.Commands.add('resourceList', list)
Cypress.Commands.add('resourceCreate', create)
Cypress.Commands.add('resourceEdit', edit)
Cypress.Commands.add('resourceShow', show)
Cypress.Commands.add('resourceDelete', resourceDelete)

Cypress.Commands.add('getSaveButton', getSaveButton)
Cypress.Commands.add('getCreateButton', getCreateButton)
Cypress.Commands.add('getDeleteButton', getDeleteButton)
Cypress.Commands.add('getEditButton', getEditButton)
Cypress.Commands.add('getShowButton', getShowButton)
Cypress.Commands.add('getPageHeaderTitle', getPageHeaderTitle)

Cypress.Commands.add('getMaterialUINotification', getMaterialUINotifications)
Cypress.Commands.add('getMaterialUIDeletePopoverButton', getMaterialUIDeletePopoverButton)
Cypress.Commands.add('getMaterialUIFormItemError', getMaterialUIFormItemError)
Cypress.Commands.add('getMaterialUILoadingCircular', getMaterialUILoadingCircular)
Cypress.Commands.add('getMaterialUIColumnHeader', getMaterialUIColumnHeader)

Cypress.Commands.add('fillMaterialUIForm', fillMaterialUIForm)

/**
 * Disable telemetry calls
 */
beforeEach(() => {
  cy.intercept('https://telemetry.refine.dev/**', {
    body: 'Disabled telemetry to avoid unwanted entries in the database',
    statusCode: 200,
  }).as('telemetry')
})
