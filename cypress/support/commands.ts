/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
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
declare namespace Cypress {
  interface Chainable {
    dragTo(target: string, dataTranser: DataTransfer): Chainable<HTMLElement>;
    dragElementToTarget(
      element: string,
      target: string
    ): Chainable<HTMLElement>;
  }
}

Cypress.Commands.add(
  "dragTo",
  { prevSubject: "element" },
  (subject, targetEl, dataTransfer) => {
    cy.wrap(subject)
      .trigger("pointerdown", {
        which: 1,
        button: 0,
        eventConstructor: "PointerEvent",
      })
      .trigger("mousedown", {
        which: 1,
        button: 0,
        eventConstructor: "MouseEvent",
      })
      .trigger("dragstart", { dataTransfer, eventConstructor: "DragEvent" });

    cy.get(targetEl)
      .trigger("dragover", { dataTransfer, eventConstructor: "DragEvent" })
      .trigger("mousemove", { eventConstructor: "MouseEvent" })
      .trigger("pointermove", { eventConstructor: "PointerEvent" })
      .wait(100)
      .trigger("drop", { dataTransfer, eventConstructor: "DragEvent" })
      .then(() => {
        cy.get(targetEl)
          .trigger("mouseup", {
            which: 1,
            button: 0,
            eventConstructor: "MouseEvent",
          })
          .then(() => {
            cy.get(targetEl)
              .trigger("pointerup", {
                which: 1,
                button: 0,
                eventConstructor: "PointerEvent",
              })
              .then(() => {
                cy.get(targetEl).should("exist");
                cy.log("what is this", subject);
              });
          });
      });
  }
);

Cypress.Commands.add("dragElementToTarget", (element, target) => {
  cy.get(element).dragTo(target, new DataTransfer());
});
