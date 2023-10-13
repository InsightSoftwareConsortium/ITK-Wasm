import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import ignore from 'rollup-plugin-ignore'
import terser from '@rollup/plugin-terser'
import packageJson from '../package.json' assert { type: 'json' }
import json from '@rollup/plugin-json'
import path from 'path'

const bundleName = path.basename(packageJson.name)

export default {
  input: './src/index.ts',
  output: [
    {
      file: `./dist/bundles/${bundleName}.js`,
      format: 'es',
      sourcemap: true,
      // plugins: [terser(),],
    },
  ],
  plugins: [
    copy({
      targets: [
        { src: 'node_modules/itk-wasm/dist/core/web-workers/bundles/itk-wasm-pipeline.worker.js', dest: 'dist/web-workers/' },
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
}
