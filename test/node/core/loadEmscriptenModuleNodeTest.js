import test from 'ava'
import path from 'path'
import fs from 'fs'

import loadModule from '../../../dist/core/internal/loadEmscriptenModuleNode.js'

test('load a module', async t => {
  const imageIOsPath = path.resolve('dist', 'image-io')
  const modulePath = path.join(imageIOsPath, 'itkPNGImageIOReadImage.js')
  const wasmBinaryPath = path.join(imageIOsPath, 'itkPNGImageIOReadImage.wasm')
  const wasmBinary = fs.readFileSync(wasmBinaryPath)
  const loaded = await loadModule(modulePath, wasmBinary)
  t.truthy(loaded)
})
