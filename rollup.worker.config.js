import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import path from 'path'

export default {
  output: {
    dir: path.join('dist', 'web-workers', 'bundles'),
    format: 'iife'
  },
  context: 'self',
  plugins: [
    nodeResolve({ preferBuiltins: false, browser: true }),
    commonjs({ transformMixedEsModules: true }),
  ]
}
