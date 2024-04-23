import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    defaultCommandTimeout: 60000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    includeShadowDom: true, // to query into itk-image-details
  },
});
