import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents() {},
  },
  component: {
    specPattern: "cypress/component/**/*.cy.tsx",
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
