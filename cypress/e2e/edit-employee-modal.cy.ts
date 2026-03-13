/// <reference types="cypress" />

/**
 * AC: Edit Employee modal created
 */
describe("Edit Employee Modal", () => {
  beforeEach(() => {
    cy.login();
    cy.fixture("employees").then(({ paginatedResponse }) => {
      cy.intercept("GET", "/api/employees/*", paginatedResponse).as("getEmployees");
      cy.visit("/employees");
      cy.wait("@getEmployees");
    });
  });

  it("displays edit and delete action buttons for each employee row", () => {
    cy.fixture("employees").then(({ existingEmployee }) => {
      // Edit button is the pencil icon — first action button in the row
      cy.contains("td", existingEmployee.email)
        .closest("tr")
        .find("button")
        .first()
        .should("be.visible");
    });
  });

  it("opens the Edit Employee modal when the edit button is clicked", () => {
    cy.fixture("employees").then(({ existingEmployee }) => {
      cy.contains("td", existingEmployee.email)
        .closest("tr")
        .find("button")
        .first()
        .click();
      cy.contains("h2", "Edit Employee").should("be.visible");
      cy.contains("p", "Update employee information").should("be.visible");
    });
  });

  it("pre-populates the form with the existing employee's data", () => {
    cy.fixture("employees").then(({ existingEmployee }) => {
      cy.contains("td", existingEmployee.email)
        .closest("tr")
        .find("button")
        .first()
        .click();
      cy.contains("h2", "Edit Employee").should("be.visible");
      cy.contains("label", "First Name")
        .siblings("input")
        .should("have.value", existingEmployee.first_name);
      cy.contains("label", "Last Name")
        .siblings("input")
        .should("have.value", existingEmployee.last_name);
      cy.contains("label", "Email")
        .siblings("input")
        .should("have.value", existingEmployee.email);
    });
  });

  it("renders Save Changes and Cancel buttons", () => {
    cy.fixture("employees").then(({ existingEmployee }) => {
      cy.contains("td", existingEmployee.email)
        .closest("tr")
        .find("button")
        .first()
        .click();
      cy.contains("button", "Save Changes").should("be.visible");
      cy.contains("button", "Cancel").should("be.visible");
    });
  });

  it("closes the modal when Cancel is clicked", () => {
    cy.fixture("employees").then(({ existingEmployee }) => {
      cy.contains("td", existingEmployee.email)
        .closest("tr")
        .find("button")
        .first()
        .click();
      cy.closeEmployeeModal();
      cy.contains("h2", "Edit Employee").should("not.exist");
    });
  });

  it("closes the modal when the backdrop is clicked", () => {
    cy.fixture("employees").then(({ existingEmployee }) => {
      cy.contains("td", existingEmployee.email)
        .closest("tr")
        .find("button")
        .first()
        .click();
      cy.get(".fixed.inset-0.z-50").click({ force: true });
      cy.contains("h2", "Edit Employee").should("not.exist");
    });
  });
});