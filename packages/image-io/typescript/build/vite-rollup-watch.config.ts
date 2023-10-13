import { defineConfig } from 'vite'
import { generateConfig } from './vite.config'

export default defineConfig(({ mode }) => {
  const config: UserConfig = generateConfig({ mode })

  config.preview = {
    port: 5004,
  }

  config.build = {
    // Enable Rollup watcher @see https://vitejs.dev/config/#build-watch
    watch: {},

    // Opt for the fastest build
    target: 'esnext',
    minify: false,
    rollupOptions: { ...config.build.rollupOptions, treeshake: false },

    outDir: '../../../demo-app-rollup',
  }

  return config
})
