import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    defaultCommandTimeout: 40000,
    setupNodeEvents(on, config) {
    },
    includeShadowDom: true, // to query into itk-image-details
  },
});
