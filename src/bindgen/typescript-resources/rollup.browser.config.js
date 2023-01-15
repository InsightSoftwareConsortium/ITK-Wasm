import { nodeResolve } from '@rollup/plugin-node-resolve'
import copy from 'rollup-plugin-copy'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import ignore from 'rollup-plugin-ignore'
import terser from '@rollup/plugin-terser'
import packageJson from './package.json' assert { type: 'json' }
import json from '@rollup/plugin-json'

export default {
  input: './src/index.ts',
  output: [
    {
      file: `./dist/${packageJson.name}.js`,
      format: 'es',
      sourcemap: true,
      // plugins: [terser(),],
    },
  ],
  plugins: [
    copy({
      targets: [
        { src: 'node_modules/itk-wasm/dist/web-workers/bundles/pipeline.worker.js', dest: 'dist/pipelines/web-workers/' },
        { src: 'node_modules/itk-wasm/dist/web-workers/min-bundles/pipeline.worker.js', dest: 'dist/pipelines/web-workers/', rename: 'pipeline.min.worker.js' },
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
