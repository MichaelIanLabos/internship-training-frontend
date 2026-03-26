/// <reference types="cypress" />

/**
 * AC: Cache invalidation after mutation
 * useCreateEmployee, useUpdateEmployee both call:
 *   queryClient.invalidateQueries({ queryKey: ['employees'] })
 * This triggers a re-fetch of GET /api/employees/
 */
describe("Employee Modal — Cache Invalidation After Mutation", () => {

  // ── After Add ─────────────────────────────────────────────────────────────

  describe("After adding an employee", () => {
    it("re-fetches GET /api/employees/ after a successful create", () => {
      cy.login();
      cy.fixture("employees").then(({ emptyResponse, newEmployee, paginatedResponse }) => {
        cy.intercept("GET", "/api/employees/*", emptyResponse).as("getEmployees");
        cy.visit("/employees");
        cy.wait("@getEmployees");

        cy.intercept("POST", "/api/employees/", {
          statusCode: 201,
          body: paginatedResponse.records[0],
        }).as("create");

        // Re-stub GET to return the new employee after mutation
        cy.intercept("GET", "/api/employees/*", paginatedResponse).as("getEmployeesRefresh");

        cy.openAddEmployeeModal();
        cy.fillEmployeeForm(newEmployee);
        cy.submitEmployeeForm("Add Employee");

        cy.wait("@create");
        cy.wait("@getEmployeesRefresh");
      });
    });

    it("shows the new employee in the list after a successful create", () => {
      cy.login();
      cy.fixture("employees").then(({ emptyResponse, newEmployee, paginatedResponse }) => {
        cy.intercept("GET", "/api/employees/*", emptyResponse).as("getEmployees");
        cy.visit("/employees");
        cy.wait("@getEmployees");

        cy.intercept("POST", "/api/employees/", {
          statusCode: 201,
          body: paginatedResponse.records[0],
        }).as("create");

        cy.intercept("GET", "/api/employees/*", paginatedResponse).as("getEmployeesRefresh");

        cy.openAddEmployeeModal();
        cy.fillEmployeeForm(newEmployee);
        cy.submitEmployeeForm("Add Employee");

        cy.wait("@create");
        cy.wait("@getEmployeesRefresh");

        cy.contains("td", paginatedResponse.records[0].email).should("be.visible");
      });
    });

    it("does NOT show the new employee when the create request fails", () => {
      cy.login();
      cy.fixture("employees").then(({ emptyResponse, newEmployee }) => {
        cy.intercept("GET", "/api/employees/*", emptyResponse).as("getEmployees");
        cy.visit("/employees");
        cy.wait("@getEmployees");

        cy.intercept("POST", "/api/employees/", { statusCode: 500 }).as("create");

        cy.openAddEmployeeModal();
        cy.fillEmployeeForm(newEmployee);
        cy.submitEmployeeForm("Add Employee");
        cy.wait("@create");

        cy.contains("td", newEmployee.email).should("not.exist");
      });
    });
  });

  // ── After Edit ────────────────────────────────────────────────────────────

  describe("After editing an employee", () => {
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

    it("re-fetches GET /api/employees/ after a successful update", () => {
      cy.fixture("employees").then(({ existingEmployee, updatedEmployee, paginatedResponse }) => {
        const updatedResponse = {
          ...paginatedResponse,
          records: [{ ...paginatedResponse.records[0], ...updatedEmployee }],
        };

        cy.intercept("PATCH", `/api/employees/${existingEmployee.id}/`, {
          statusCode: 200,
          body: {},
        }).as("update");
        cy.intercept("GET", "/api/employees/*", updatedResponse).as("getEmployeesRefresh");

        cy.fillEmployeeForm({ email: updatedEmployee.email });
        cy.submitEmployeeForm("Save Changes");

        cy.wait("@update");
        cy.wait("@getEmployeesRefresh");
      });
    });

    it("reflects the updated email in the list after a successful edit", () => {
      cy.fixture("employees").then(({ existingEmployee, updatedEmployee, paginatedResponse }) => {
        const updatedResponse = {
          ...paginatedResponse,
          records: [{ ...paginatedResponse.records[0], email: updatedEmployee.email }],
        };

        cy.intercept("PATCH", `/api/employees/${existingEmployee.id}/`, {
          statusCode: 200,
          body: {},
        }).as("update");
        cy.intercept("GET", "/api/employees/*", updatedResponse).as("getEmployeesRefresh");

        cy.fillEmployeeForm({ email: updatedEmployee.email });
        cy.submitEmployeeForm("Save Changes");

        cy.wait("@update");
        cy.wait("@getEmployeesRefresh");

        cy.contains("td", updatedEmployee.email).should("be.visible");
      });
    });

    it("does NOT re-fetch the list after a failed update", () => {
      cy.fixture("employees").then(({ existingEmployee }) => {
        cy.intercept("PATCH", `/api/employees/${existingEmployee.id}/`, {
          statusCode: 500,
        }).as("update");

        let refreshCalled = false;
        cy.intercept("GET", "/api/employees/*", () => { refreshCalled = true; }).as("unexpectedRefresh");

        cy.fillEmployeeForm({ email: "fail@company.com" });
        cy.submitEmployeeForm("Save Changes");
        cy.wait("@update");


        cy.wait(500).then(() => {
          expect(refreshCalled).to.be.false;
        });
      });
    });
  });
});