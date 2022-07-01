import { defineConfig } from "cypress";

export default defineConfig({
  projectId: '3ow3bt',
  e2e: {
    baseUrl: "http://localhost:8083",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
