import test from 'ava'
import path from 'path'

import loadModule from '../../dist/core/internal/loadEmscriptenModuleNode.js'

test('load a module', async t => {
  const imageIOsPath = path.resolve('dist', 'image-io')
  const modulePath = path.join(imageIOsPath, 'itkPNGImageIOJSBindingWasm.js')
  const loaded = await loadModule(modulePath)
  t.truthy(loaded)
})
