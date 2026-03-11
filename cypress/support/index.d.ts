/// <reference types="cypress" />

interface EmployeeForm {
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone_number: string;
  hire_date: string;
  employment_status: string;
}

declare namespace Cypress {
  interface Chainable {
    login(): Chainable<void>;
    openAddEmployeeModal(): Chainable<void>;
    openEditEmployeeModal(employeeId: number): Chainable<void>;
    fillEmployeeForm(fields: Partial<EmployeeForm>): Chainable<void>;
    submitEmployeeForm(label?: string): Chainable<void>;
    closeEmployeeModal(): Chainable<void>;
  }
}