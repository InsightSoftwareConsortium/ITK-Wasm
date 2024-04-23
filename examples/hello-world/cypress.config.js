import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'ybp4mr',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    includeShadowDom: true, // to query into itk-image-detail
    baseUrl: 'http://localhost:8083',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
