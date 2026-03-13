/// <reference types="cypress" />

/**
 * AC: API integration successful
 * employeeApi.create  → POST /api/employees/
 * employeeApi.update  → PATCH /api/employees/:id/
 */
describe("Employee Modal — API Integration", () => {

  // ── Add Employee → POST /api/employees/ ──────────────────────────────────

  describe("Add Employee", () => {
    beforeEach(() => {
      cy.login();
      cy.visit("/employees");
      cy.openAddEmployeeModal();
    });

    it("sends a POST to /api/employees/ on submit", () => {
      cy.fixture("employees").then(({ newEmployee }) => {
        cy.intercept("POST", "/api/employees/", { statusCode: 201, body: {} }).as("create");
        cy.fillEmployeeForm(newEmployee);
        cy.submitEmployeeForm("Add Employee");
        cy.wait("@create").its("request.method").should("eq", "POST");
      });
    });

    it("sends the correct payload", () => {
      cy.fixture("employees").then(({ newEmployee }) => {
        cy.intercept("POST", "/api/employees/", { statusCode: 201, body: {} }).as("create");
        cy.fillEmployeeForm(newEmployee);
        cy.submitEmployeeForm("Add Employee");
        cy.wait("@create").then(({ request }) => {
          expect(request.body).to.include({
            first_name: newEmployee.first_name,
            last_name: newEmployee.last_name,
            email: newEmployee.email,
            employment_status: newEmployee.employment_status,
          });
        });
      });
    });

    it("handles a 201 Created response", () => {
      cy.fixture("employees").then(({ newEmployee }) => {
        cy.intercept("POST", "/api/employees/", { statusCode: 201, body: {} }).as("create");
        cy.fillEmployeeForm(newEmployee);
        cy.submitEmployeeForm("Add Employee");
        cy.wait("@create").its("response.statusCode").should("eq", 201);
      });
    });

    it("keeps modal open and shows server error on 400", () => {
      cy.fixture("employees").then(({ newEmployee }) => {
        cy.intercept("POST", "/api/employees/", {
          statusCode: 400,
          body: { detail: "Email already exists" },
        }).as("create");
        cy.fillEmployeeForm(newEmployee);
        cy.submitEmployeeForm("Add Employee");
        cy.wait("@create");
        cy.contains("h2", "Add Employee").should("be.visible");
        cy.contains("Email already exists").should("be.visible");
      });
    });

    it("keeps modal open on 500", () => {
      cy.fixture("employees").then(({ newEmployee }) => {
        cy.intercept("POST", "/api/employees/", { statusCode: 500 }).as("create");
        cy.fillEmployeeForm(newEmployee);
        cy.submitEmployeeForm("Add Employee");
        cy.wait("@create");
        cy.contains("h2", "Add Employee").should("be.visible");
      });
    });

    it("disables the submit button while the request is in-flight", () => {
      cy.fixture("employees").then(({ newEmployee }) => {
        cy.intercept("POST", "/api/employees/", (req) => {
          req.reply({ delay: 1000, statusCode: 201, body: {} });
        }).as("create");
        cy.fillEmployeeForm(newEmployee);
        cy.submitEmployeeForm("Add Employee");
        cy.contains("button", "Adding...").should("be.disabled");
        cy.wait("@create");
      });
    });
  });

  // ── Edit Employee → PATCH /api/employees/:id/ ────────────────────────────

  describe("Edit Employee", () => {
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

    it("sends a PATCH to /api/employees/:id/ on save", () => {
      cy.fixture("employees").then(({ existingEmployee, updatedEmployee }) => {
        cy.intercept("PATCH", `/api/employees/${existingEmployee.id}/`, {
          statusCode: 200,
          body: { ...existingEmployee, ...updatedEmployee },
        }).as("update");
        cy.fillEmployeeForm({ email: updatedEmployee.email });
        cy.submitEmployeeForm("Save Changes");
        cy.wait("@update").its("request.method").should("eq", "PATCH");
      });
    });

    it("sends the updated payload to the correct endpoint", () => {
      cy.fixture("employees").then(({ existingEmployee, updatedEmployee }) => {
        cy.intercept("PATCH", `/api/employees/${existingEmployee.id}/`, {
          statusCode: 200,
          body: {},
        }).as("update");
        cy.fillEmployeeForm({ email: updatedEmployee.email });
        cy.submitEmployeeForm("Save Changes");
        cy.wait("@update").then(({ request }) => {
          expect(request.url).to.include(`/api/employees/${existingEmployee.id}/`);
          expect(request.body).to.include({ email: updatedEmployee.email });
        });
      });
    });

    it("handles a 200 OK response", () => {
      cy.fixture("employees").then(({ existingEmployee, updatedEmployee }) => {
        cy.intercept("PATCH", `/api/employees/${existingEmployee.id}/`, {
          statusCode: 200,
          body: {},
        }).as("update");
        cy.fillEmployeeForm({ email: updatedEmployee.email });
        cy.submitEmployeeForm("Save Changes");
        cy.wait("@update").its("response.statusCode").should("eq", 200);
      });
    });

    it("keeps modal open and shows server error on 400", () => {
      cy.fixture("employees").then(({ existingEmployee }) => {
        cy.intercept("PATCH", `/api/employees/${existingEmployee.id}/`, {
          statusCode: 400,
          body: { detail: "Email already in use" },
        }).as("update");
        cy.fillEmployeeForm({ email: "taken@company.com" });
        cy.submitEmployeeForm("Save Changes");
        cy.wait("@update");
        cy.contains("h2", "Edit Employee").should("be.visible");
        cy.contains("Email already in use").should("be.visible");
      });
    });
  });
});