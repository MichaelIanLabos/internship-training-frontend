/// <reference types="cypress" />
/// <reference path="./index.d.ts" />

// ─── Auth ────────────────────────────────────────────────────────────────────

Cypress.Commands.add("login", () => {
  cy.session(
    // Include the email in the ID so changing credentials busts the cache
    `auth-session-${Cypress.env("AUTH_EMAIL")}`,
    () => {
      cy.visit("/login");

      cy.get("input[type='email']").should("be.visible").type(Cypress.env("AUTH_EMAIL"));
      cy.get("input[type='password']").should("be.visible").type(Cypress.env("AUTH_PASSWORD"));
      cy.get("button[type='submit']").click();

      cy.url().should("include", "/dashboard");
    },
    {
      cacheAcrossSpecs: true,
      validate() {
        cy.window().then((win) => {
          const token = win.localStorage.getItem("access_token");
          expect(token, "access_token in localStorage").to.not.be.null;
        });
      },
    }
  );
});

// ─── Modal Helpers ───────────────────────────────────────────────────────────

Cypress.Commands.add("openAddEmployeeModal", () => {
  cy.contains("button", "Add Employee").click();
  cy.contains("h2", "Add Employee").should("be.visible");
});

Cypress.Commands.add("openEditEmployeeModal", (employeeId: number) => {
  cy.get(`[data-testid='edit-btn-${employeeId}']`).click();
  cy.contains("h2", "Edit Employee").should("be.visible");
});

Cypress.Commands.add("fillEmployeeForm", (fields: Partial<EmployeeForm>) => {
  if (fields.first_name !== undefined) {
    cy.contains("label", "First Name").siblings("input").clear().type(fields.first_name);
  }
  if (fields.last_name !== undefined) {
    cy.contains("label", "Last Name").siblings("input").clear().type(fields.last_name);
  }
  if (fields.middle_name !== undefined) {
    cy.contains("label", "Middle Name").siblings("input").clear().type(fields.middle_name);
  }
  if (fields.email !== undefined) {
    cy.contains("label", "Email").siblings("input").clear().type(fields.email);
  }
  if (fields.phone_number !== undefined) {
    cy.contains("label", "Phone Number").siblings("input").clear().type(fields.phone_number);
  }
  if (fields.hire_date !== undefined) {
    cy.contains("label", "Hire Date").siblings("input").clear().type(fields.hire_date);
  }
  if (fields.employment_status !== undefined) {
    cy.contains("label", "Employment Status").siblings("select").select(fields.employment_status);
  }
});

Cypress.Commands.add("submitEmployeeForm", (label?: string) => {
  cy.contains("button", label ?? /Add Employee|Save Changes/).click();
});

Cypress.Commands.add("closeEmployeeModal", () => {
  cy.contains("button", "Cancel").click();
});