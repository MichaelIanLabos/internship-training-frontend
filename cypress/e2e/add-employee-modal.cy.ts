/// <reference types="cypress" />

/**
 * AC: Add Employee modal created
 */
describe("Add Employee Modal", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/employees");
  });

  it("displays the Add Employee button on the page", () => {
    cy.contains("button", "Add Employee").should("be.visible");
  });

  it("opens the Add Employee modal when the button is clicked", () => {
    cy.openAddEmployeeModal();
    cy.contains("h2", "Add Employee").should("be.visible");
    cy.contains("p", "Add a new employee").should("be.visible");
  });

  it("renders all required form fields", () => {
    cy.openAddEmployeeModal();
    cy.contains("label", "First Name").should("exist");
    cy.contains("label", "Last Name").should("exist");
    cy.contains("label", "Middle Name").should("exist");
    cy.contains("label", "Email").should("exist");
    cy.contains("label", "Phone Number").should("exist");
    cy.contains("label", "Hire Date").should("exist");
    cy.contains("label", "Employment Status").should("exist");
  });

  it("renders the Add Employee and Cancel buttons", () => {
    cy.openAddEmployeeModal();
    cy.contains("button", "Add Employee").should("be.visible");
    cy.contains("button", "Cancel").should("be.visible");
  });

  it("opens with all fields empty", () => {
    cy.openAddEmployeeModal();
    cy.contains("label", "First Name").siblings("input").should("have.value", "");
    cy.contains("label", "Last Name").siblings("input").should("have.value", "");
    cy.contains("label", "Email").siblings("input").should("have.value", "");
  });

  it("closes the modal when Cancel is clicked", () => {
    cy.openAddEmployeeModal();
    cy.closeEmployeeModal();
    cy.contains("h2", "Add Employee").should("not.exist");
  });

  it("closes the modal when the backdrop is clicked", () => {
    cy.openAddEmployeeModal();
    cy.get(".fixed.inset-0.z-50").click({ force: true });
    cy.contains("h2", "Add Employee").should("not.exist");
  });

  it("resets fields after closing and reopening", () => {
    cy.openAddEmployeeModal();
    cy.fillEmployeeForm({ first_name: "Ghost" });
    cy.closeEmployeeModal();
    cy.openAddEmployeeModal();
    cy.contains("label", "First Name").siblings("input").should("have.value", "");
  });
});