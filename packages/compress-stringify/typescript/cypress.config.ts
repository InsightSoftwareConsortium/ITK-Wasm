import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    defaultCommandTimeout: 20000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    includeShadowDom: true, // to query into itk-image-detail
  },
});
