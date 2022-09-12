/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import visualizer from 'rollup-plugin-visualizer';
import styles from 'rollup-plugin-styles';
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: './src/demo/spectrum.ts',
  output: [
    {
      file: './dist/demo/spectrum.umd.js',
      format: 'umd',
      sourcemap: true,
      plugins: [terser(),],
    },
  ],
  inlineDynamicImports: true,

  plugins: [
    commonjs({
      transformMixedEsModules: true
    }),
    nodeResolve({
      exportConditions: ['browser', 'production'],
      browser: true,
    }),
    typescript(),
    styles({
      mode: 'extract',
    }),
    visualizer({
      brotliSize: true,
      gzipSize: true,
    }),
  ],

  moduleContext: {
    [require.resolve('focus-visible')]: 'window',
  },
};
