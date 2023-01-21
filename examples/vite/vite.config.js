import { defineConfig } from 'vite'
import path from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const itkConfig = path.resolve(__dirname, 'src', 'itkConfig.js')

export default defineConfig({
  plugins: [
    // put lazy loaded JavaScript and Wasm bundles in dist directory
    viteStaticCopy({
      targets: [
        { src: 'node_modules/itk-wasm/dist/web-workers/*', dest: 'dist/itk/web-workers' },
        {
          src: 'node_modules/itk-image-io/*',
          dest: 'dist/itk/image-io',
        },
        {
          src: 'node_modules/itk-mesh-io/*',
          dest: 'dist/itk/mesh-io',
          rename: 'mesh-io'
        }
      ],
    })
  ],
  resolve: {
    // where itk-wasm code has 'import ../itkConfig.js` point to the path of itkConfig
    alias: {
      '../itkConfig.js': itkConfig,
      '../../itkConfig.js': itkConfig
    }
  }
})
