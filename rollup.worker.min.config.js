import { nodeResolve } from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import path from 'path'

export default {
  output: {
    dir: path.join('dist', 'web-workers', 'min-bundles'),
    format: 'iife'
  },
  context: 'self',
  plugins: [
    nodeResolve({ preferBuiltins: false, browser: true }),
    commonjs({ transformMixedEsModules: true }),
    babel({
      extensions: ['.js'],
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
    }),
    terser(),
  ]
}
