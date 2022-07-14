describe("Exercise 5", () => {
    it("Works with bord columns", () => {
        cy.visit("/boards");
        cy.contains("New Board +").click();
        cy.contains("span", 'Board Created: Board 4')
        cy.contains("div", "Board 4").click();
        cy.url().should('include', '/boards/board-4')

        cy.contains("New Column +").click()

        cy.dragElementToTarget("[data-column-index='0'] [data-task-index='0']", "[data-column-index='1']")
        cy.wait(200)
        cy.dragElementToTarget("[data-column-index='0'] [data-task-index='0']", "[data-column-index='1']")
        cy.wait(200)
        cy.dragElementToTarget("[data-column-index='1'] [data-task-index='1']", "[data-column-index='0']")
        cy.wait(200)
        cy.dragElementToTarget("[data-column-index='1'] [data-task-index='0']", "[data-column-index='0']")
    });
  });
  