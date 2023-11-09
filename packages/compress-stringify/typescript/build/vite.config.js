import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'

export default defineConfig({
  root: path.join('test', 'browser', 'demo-app'),
  build: {
    outDir: '../../../demo-app',
    emptyOutDir: true,
  },
  optimizeDeps: {
    exclude: ['itk-wasm']
  },
  plugins: [
    // put lazy loaded JavaScript and Wasm bundles in dist directory
    viteStaticCopy({
      targets: [
        { src: '../../../dist/pipelines/*', dest: 'pipelines' },
      ],
    })
  ],
})
