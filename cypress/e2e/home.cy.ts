describe("Home Page", () => {
  it("should load the home page", () => {
    cy.visit("/");
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });
});
