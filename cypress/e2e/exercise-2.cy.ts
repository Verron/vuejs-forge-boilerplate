describe("Exercise 2", () => {
  it("Interacts with navigation", () => {
    cy.visit("/")
    cy.contains("My Team").click()
    cy.contains("Team 1")
    cy.contains("Team 2")
    cy.contains("Boards").click()
    cy.url().should('include', '/boards')
  });
});
