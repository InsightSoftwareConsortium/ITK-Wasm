import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import ignore from 'rollup-plugin-ignore'
import terser from '@rollup/plugin-terser'
import packageJson from '../package.json' assert { type: 'json' }
import json from '@rollup/plugin-json'
import path from 'path'
import OMT from "@surma/rollup-plugin-off-main-thread"

const omtCustom = OMT()
omtCustom.resolveImportMeta = () => {
  return 'import.meta.url'
}

const bundleName = path.basename(packageJson.name)

export default {
  input: './src/index.ts',
  output: [
    {
      dir: `./dist`,
      format: 'es',
      sourcemap: true,
      // plugins: [terser(),],
    },
  ],
  onwarn: function onwarn(warning, warn) {
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    if (warning.message.includes('Very few browsers support ES modules in Workers.')) return;
    console.log('onwarn', warning)
    warn(warning);
  },
  plugins: [
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
    omtCustom,
  ]
}
