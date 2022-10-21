import { defineConfig } from 'vite'
import path from 'path'
import copy from 'rollup-plugin-copy'

const itkConfig = path.resolve(__dirname, 'src', 'itkConfigDevelopment.js')

export default defineConfig({
  build: {
    lib: {
      // entry: path.resolve(__dirname, 'src/index.ts'),
      entry: {
        lib: path.resolve(__dirname, 'src/index.ts'),
        app: path.resolve(__dirname, 'src/demo/app.js'),
      },
      name: 'ItkCastImage',
      fileName: (format, entryName) => {
        const extension = format === 'es' ? '.js' : '.umd.js'
        const fn = entryName === 'lib' ? `itk-cast-image${extension}` : `demo-app${extension}`
        return fn
      }
    },
    rollupOptions: {
      external: [],
      input: {
        app: path.resolve(__dirname, 'index.html'),
        lib: path.resolve(__dirname, 'src', 'index.ts'),
      },
      output: {
        globals: {
        }
      }
    },
    emptyOutDir: false,
  },
  plugins: [
    // put lazy loaded JavaScript and WASM bundles in dist directory
    copy({
      targets: [
        { src: 'node_modules/itk-wasm/dist/web-workers/bundles/pipeline.worker.js', dest: 'dist/pipelines/web-workers/' },
        { src: 'node_modules/itk-wasm/dist/web-workers/min-bundles/pipeline.worker.js', dest: 'dist/pipelines/web-workers/', rename: 'pipeline.min.worker.js' },
        { src: 'node_modules/xstate/dist/xstate.js', dest: 'dist/demo/' },
      ],
      hook: 'writeBundle'
    }),
  ],
  resolve: {
    // where itk-wasm code has 'import ../itkConfig.js` point to the path of itkConfig
    alias: {
      '../itkConfig.js': itkConfig,
      '../../itkConfig.js': itkConfig
    }
  },
  sourcemap: true,
})
