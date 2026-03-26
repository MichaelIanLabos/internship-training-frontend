// Import custom commands
import "./commands";

// Silence common Next.js / React Query / NextAuth console noise during tests
Cypress.on("uncaught:exception", (err) => {
  if (
    err.message.includes("Hydration") ||
    err.message.includes("router") ||
    err.message.includes("ResizeObserver") ||
    err.message.includes("next-auth") ||
    err.message.includes("NEXT_REDIRECT")
  ) {
    return false;
  }
});

// Log in once and reuse the session across all tests.
// cy.session caches cookies so the login UI only runs when the
// session is missing or expired — not before every single test.
beforeEach(() => {
  cy.login();
});