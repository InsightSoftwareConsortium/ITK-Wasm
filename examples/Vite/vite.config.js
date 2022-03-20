import path from 'path'
import { defineConfig } from 'vite'
import copy from 'rollup-plugin-copy'

const itkConfig = path.resolve(__dirname, 'src', 'itkConfig.js')


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
  copy({
    targets: [{ src: 'node_modules/itk-wasm/dist/web-workers', dest: 'dist/itk' },
      { src: 'node_modules/itk-image-io', dest: 'dist/itk', rename: 'image-io' },
      { src: 'node_modules/itk-mesh-io', dest: 'dist/itk', rename: 'mesh-io' },
    ],
    hook: 'writeBundle'
  })],
  resolve: {
    alias: {
      '../itkConfig.js': itkConfig,
      '../../itkConfig.js': itkConfig,
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src', 'index.js'),
      name: 'bundle',
      formats: ['es', 'umd'],
      fileName: "index",
    },
  },
})
