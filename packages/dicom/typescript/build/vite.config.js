import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'

export default defineConfig({
  root: path.join('test', 'browser', 'demo-app'),
  build: {
    outDir: '../../../demo-app',
    emptyOutDir: true,
  },
  worker: {
    format: 'es'
  },
  optimizeDeps: {
    exclude: ['itk-wasm', '@itk-wasm/image-io']
  },
  plugins: [
    // put lazy loaded JavaScript and Wasm bundles in dist directory
    viteStaticCopy({
      targets: [
        { src: '../../../dist/pipelines/*', dest: 'pipelines' },
        { src: '../../../node_modules/@itk-wasm/image-io/dist/pipelines/*.{js,wasm,wasm.zst}', dest: 'pipelines' },
      ],
    })
  ],
})
