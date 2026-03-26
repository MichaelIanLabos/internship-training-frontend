import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    fixturesFolder: "cypress/fixtures",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000,
    env: {
      // ⚠️ Replace these with your actual test account credentials.
      // For CI, override via environment variables:
      //   CYPRESS_AUTH_EMAIL=foo@bar.com CYPRESS_AUTH_PASSWORD=secret npx cypress run
      AUTH_EMAIL: process.env.CYPRESS_AUTH_EMAIL ?? "your-test-user@company.com",
      AUTH_PASSWORD: process.env.CYPRESS_AUTH_PASSWORD ?? "your-test-password",
    },
    setupNodeEvents(on, config) {
      return config;
    },
  },
});