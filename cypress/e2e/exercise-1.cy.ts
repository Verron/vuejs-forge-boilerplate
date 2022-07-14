describe("Exercise 1", () => {
  it("Interacts with boards", () => {
    cy.visit("/boards");
    cy.contains("div", "Board 1");
    cy.contains("div", "Board 2");
    cy.contains("div", "Board 3");
    cy.contains("New Board +").click();
    cy.contains("div", "Board 4");
  });
});
