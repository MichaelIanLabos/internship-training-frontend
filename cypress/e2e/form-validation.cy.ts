/// <reference types="cypress" />

/**
 * AC: Form validation implemented
 * Validation lives in the validate() function inside AddEmployeeModal / EditEmployeeModal.
 * Required: first_name, last_name, email (+ format), hire_date
 */
describe("Employee Form Validation", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/employees");
    cy.openAddEmployeeModal();
  });

  // ── Required fields ───────────────────────────────────────────────────────

  it("shows required-field errors when submitting an empty form", () => {
    cy.submitEmployeeForm("Add Employee");
    cy.contains("First name is required").should("be.visible");
    cy.contains("Last name is required").should("be.visible");
    cy.contains("Email is required").should("be.visible");
    cy.contains("Hire date is required").should("be.visible");
  });

  it("keeps the modal open when required fields are missing", () => {
    cy.submitEmployeeForm("Add Employee");
    cy.contains("h2", "Add Employee").should("be.visible");
  });

  it("clears the first_name error once a valid value is typed", () => {
    cy.submitEmployeeForm("Add Employee");
    cy.contains("First name is required").should("be.visible");
    cy.contains("label", "First Name").siblings("input").type("Alice");
    cy.contains("First name is required").should("not.exist");
  });

  it("clears the last_name error once a valid value is typed", () => {
    cy.submitEmployeeForm("Add Employee");
    cy.contains("Last name is required").should("be.visible");
    cy.contains("label", "Last Name").siblings("input").type("Smith");
    cy.contains("Last name is required").should("not.exist");
  });

  it("clears the hire_date error once a date is selected", () => {
    cy.submitEmployeeForm("Add Employee");
    cy.contains("Hire date is required").should("be.visible");
    cy.contains("label", "Hire Date").siblings("input").type("2024-01-01");
    cy.contains("Hire date is required").should("not.exist");
  });

  // ── Email format ──────────────────────────────────────────────────────────

  it("shows invalid email error for a malformed email", () => {
    cy.fillEmployeeForm({ email: "not-valid" });
    cy.submitEmployeeForm("Add Employee");
    cy.contains("Invalid email format").should("be.visible");
  });

  it("shows invalid email error for an email missing the domain", () => {
    cy.fillEmployeeForm({ email: "user@" });
    cy.submitEmployeeForm("Add Employee");
    cy.contains("Invalid email format").should("be.visible");
  });

  it("accepts a correctly formatted email", () => {
    cy.fillEmployeeForm({ email: "valid@example.com" });
    cy.submitEmployeeForm("Add Employee");
    cy.contains("Invalid email format").should("not.exist");
  });

  // ── Full valid form ───────────────────────────────────────────────────────

  it("shows no validation errors when all required fields are filled correctly", () => {
    cy.intercept("POST", "/api/employees/", { statusCode: 201, body: {} }).as("create");
    cy.fixture("employees").then(({ newEmployee }) => {
      cy.fillEmployeeForm(newEmployee);
      cy.submitEmployeeForm("Add Employee");
      cy.contains("First name is required").should("not.exist");
      cy.contains("Last name is required").should("not.exist");
      cy.contains("Email is required").should("not.exist");
      cy.contains("Invalid email format").should("not.exist");
      cy.contains("Hire date is required").should("not.exist");
    });
  });

  // ── Edit modal validation ─────────────────────────────────────────────────

  it("validates fields in the Edit Employee modal too", () => {
    cy.closeEmployeeModal();
    cy.fixture("employees").then(({ paginatedResponse, existingEmployee }) => {
      cy.intercept("GET", "/api/employees/*", paginatedResponse).as("getEmployees");
      cy.visit("/employees");
      cy.wait("@getEmployees");

      cy.contains("td", existingEmployee.email)
        .closest("tr")
        .find("button")
        .first()
        .click();
      cy.contains("h2", "Edit Employee").should("be.visible");

      cy.contains("label", "Email").siblings("input").clear();
      cy.submitEmployeeForm("Save Changes");
      cy.contains("Email is required").should("be.visible");
    });
  });
});