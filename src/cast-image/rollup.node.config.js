import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'

export default {
  input: './src/indexNode.ts',
  output: [
    {
      file: './dist/itk-cast-image.node.js',
      format: 'es',
      sourcemap: true,
      plugins: [terser(),],
    },
  ],
  plugins: [
    commonjs({
      transformMixedEsModules: true
    }),
    nodeResolve({
      preferBuiltins: true,
      browser: false,
    }),
    typescript(),
    json(),
  ],
}
