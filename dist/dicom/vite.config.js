import { defineConfig } from 'vite'
import path from 'path'
import copy from 'rollup-plugin-copy'

const itkConfig = path.resolve(__dirname, 'src', 'itkConfigDevelopment.js')

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ItkDicom',
      fileName: (format) => format === 'es' ? 'itk-dicom.js' : 'itk-dicom.umd.js',
    },
    rollupOptions: {
      external: [],
      input: {
        app: './index.html'
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
