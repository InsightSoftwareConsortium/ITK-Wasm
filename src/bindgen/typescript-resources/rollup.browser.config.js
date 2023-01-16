import { nodeResolve } from '@rollup/plugin-node-resolve'
import copy from 'rollup-plugin-copy'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import ignore from 'rollup-plugin-ignore'
import terser from '@rollup/plugin-terser'
import packageJson from '../package.json' assert { type: 'json' }
import json from '@rollup/plugin-json'

const itkConfig = './src/itkConfig.js'

export default {
  input: './src/index.ts',
  output: [
    {
      file: `./dist/bundles/${packageJson.name}.js`,
      format: 'es',
      sourcemap: true,
      // plugins: [terser(),],
    },
  ],
  plugins: [
    copy({
      targets: [
        { src: 'node_modules/itk-wasm/dist/web-workers/bundles/pipeline.worker.js', dest: 'dist/web-workers/' },
      ],
      hook: 'writeBundle'
    }),
    ignore(['crypto']),
    nodeResolve({
      preferBuiltins: false,
      browser: true,
    }),
    commonjs({
      transformMixedEsModules: true
    }),
    nodePolyfills(),
    typescript(),
    json(),
  ],
  resolve: {
    // where itk-wasm code has 'import ../itkConfig.js` point to the path of itkConfig
    alias: {
      '../itkConfig.js': itkConfig,
      '../../itkConfig.js': itkConfig
    }
  }
}
