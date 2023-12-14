import { defineConfig } from "cypress";

export default defineConfig({
  projectId: '3ow3bt',
  e2e: {
    defaultCommandTimeout: 20000,
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
