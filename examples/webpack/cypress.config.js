const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout: 8000,
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    includeShadowDom: true, // to query into itk-image-detail
  },
})
