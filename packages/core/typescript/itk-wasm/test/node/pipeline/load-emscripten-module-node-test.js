import test from 'ava'
import path from 'path'
import fs from 'fs'

import loadModule from '../../../dist/pipeline/internal/load-emscripten-module-node.js'

test('load a module', async t => {
  const testPipelineDir = path.resolve('test', 'pipelines', 'emscripten-build', 'stdout-stderr-pipeline')
  const modulePath = path.join(testPipelineDir, 'stdout-stderr-test.js')
  const wasmBinaryPath = path.join(testPipelineDir, 'stdout-stderr-test.wasm')
  const wasmBinary = fs.readFileSync(wasmBinaryPath)
  const loaded = await loadModule(modulePath, wasmBinary)
  t.truthy(loaded)
})
