import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'

export default defineConfig(generateConfig)

export function generateConfig() {
  return {
    root: path.join('test', 'browser', 'demo-app'),
    build: {
      outDir: '../../../demo-app',
      emptyOutDir: true,
      chunkSizeWarningLimit: 800e6,
    },
    worker: {
      format: 'es'
    },
    plugins: [
      // put lazy loaded JavaScript and Wasm bundles in dist directory
      viteStaticCopy({
        targets: [
          { src: '../../../dist/pipelines/*', dest: 'pipelines' },
        ],
      })
    ],
  }
}
