/// <reference types="cypress" />

/**
 * AC: Success & error feedback handled
 * AddEmployeeModal: closes + resets on success, shows err.response.data.detail on failure
 * EditEmployeeModal: closes on success, shows err.response.data.detail on failure
 */
describe("Employee Modal — Success & Error Feedback", () => {

  // ── Add Employee ──────────────────────────────────────────────────────────

  describe("Add Employee feedback", () => {
    beforeEach(() => {
      cy.login();
      cy.visit("/employees");
      cy.openAddEmployeeModal();
    });

    it("closes the modal after a successful add", () => {
      cy.fixture("employees").then(({ newEmployee }) => {
        cy.intercept("POST", "/api/employees/", { statusCode: 201, body: {} }).as("create");
        cy.fillEmployeeForm(newEmployee);
        cy.submitEmployeeForm("Add Employee");
        cy.wait("@create");
        cy.contains("h2", "Add Employee").should("not.exist");
      });
    });

    it("resets the form after a successful add", () => {
      cy.fixture("employees").then(({ newEmployee }) => {
        cy.intercept("POST", "/api/employees/", { statusCode: 201, body: {} }).as("create");
        cy.fillEmployeeForm(newEmployee);
        cy.submitEmployeeForm("Add Employee");
        cy.wait("@create");
        // Reopen and confirm fields are cleared
        cy.openAddEmployeeModal();
        cy.contains("label", "First Name").siblings("input").should("have.value", "");
        cy.contains("label", "Email").siblings("input").should("have.value", "");
      });
    });

    it("shows the server detail message when the API returns 400", () => {
      cy.fixture("employees").then(({ newEmployee }) => {
        cy.intercept("POST", "/api/employees/", {
          statusCode: 400,
          body: { detail: "Email already exists" },
        }).as("create");
        cy.fillEmployeeForm(newEmployee);
        cy.submitEmployeeForm("Add Employee");
        cy.wait("@create");
        cy.contains("Email already exists").should("be.visible");
      });
    });

    it("keeps the modal open after a 400 so the user can correct the form", () => {
      cy.fixture("employees").then(({ newEmployee }) => {
        cy.intercept("POST", "/api/employees/", {
          statusCode: 400,
          body: { detail: "Email already exists" },
        }).as("create");
        cy.fillEmployeeForm(newEmployee);
        cy.submitEmployeeForm("Add Employee");
        cy.wait("@create");
        cy.contains("h2", "Add Employee").should("be.visible");
      });
    });

    it("keeps the modal open on 500", () => {
      cy.fixture("employees").then(({ newEmployee }) => {
        cy.intercept("POST", "/api/employees/", { statusCode: 500 }).as("create");
        cy.fillEmployeeForm(newEmployee);
        cy.submitEmployeeForm("Add Employee");
        cy.wait("@create");
        cy.contains("h2", "Add Employee").should("be.visible");
      });
    });

    it("shows 'Adding...' on the button while submitting", () => {
      cy.fixture("employees").then(({ newEmployee }) => {
        cy.intercept("POST", "/api/employees/", (req) => {
          req.reply({ delay: 1000, statusCode: 201, body: {} });
        }).as("create");
        cy.fillEmployeeForm(newEmployee);
        cy.submitEmployeeForm("Add Employee");
        cy.contains("button", "Adding...").should("be.visible");
        cy.wait("@create");
      });
    });
  });

  // ── Edit Employee ─────────────────────────────────────────────────────────

  describe("Edit Employee feedback", () => {
    beforeEach(() => {
      cy.login();
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
      });
    });

    it("closes the modal after a successful update", () => {
      cy.fixture("employees").then(({ existingEmployee, updatedEmployee }) => {
        cy.intercept("PATCH", `/api/employees/${existingEmployee.id}/`, {
          statusCode: 200,
          body: {},
        }).as("update");
        cy.fillEmployeeForm({ email: updatedEmployee.email });
        cy.submitEmployeeForm("Save Changes");
        cy.wait("@update");
        cy.contains("h2", "Edit Employee").should("not.exist");
      });
    });

    it("shows the server detail message when the API returns 400", () => {
      cy.fixture("employees").then(({ existingEmployee }) => {
        cy.intercept("PATCH", `/api/employees/${existingEmployee.id}/`, {
          statusCode: 400,
          body: { detail: "Email already in use" },
        }).as("update");
        cy.fillEmployeeForm({ email: "taken@company.com" });
        cy.submitEmployeeForm("Save Changes");
        cy.wait("@update");
        cy.contains("Email already in use").should("be.visible");
      });
    });

    it("keeps the modal open after a failed update", () => {
      cy.fixture("employees").then(({ existingEmployee }) => {
        cy.intercept("PATCH", `/api/employees/${existingEmployee.id}/`, {
          statusCode: 500,
        }).as("update");
        cy.fillEmployeeForm({ email: "new@company.com" });
        cy.submitEmployeeForm("Save Changes");
        cy.wait("@update");
        cy.contains("h2", "Edit Employee").should("be.visible");
      });
    });

    it("shows 'Saving...' on the button while submitting", () => {
      cy.fixture("employees").then(({ existingEmployee, updatedEmployee }) => {
        cy.intercept("PATCH", `/api/employees/${existingEmployee.id}/`, (req) => {
          req.reply({ delay: 1000, statusCode: 200, body: {} });
        }).as("update");
        cy.fillEmployeeForm({ email: updatedEmployee.email });
        cy.submitEmployeeForm("Save Changes");
        cy.contains("button", "Saving...").should("be.visible");
        cy.wait("@update");
      });
    });
  });
});