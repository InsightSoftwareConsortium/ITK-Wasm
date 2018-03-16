import test from 'ava'
import path from 'path'

const loadModule = require(path.resolve(__dirname, '..', 'dist', 'loadEmscriptenModuleNode.js'))

test('load a module', t => {
  const imageIOsPath = path.resolve(__dirname, '..', 'dist', 'ImageIOs')
  const modulePath = path.join(imageIOsPath, 'itkPNGImageIOJSBinding.js')
  const loaded = loadModule(modulePath)
  t.truthy(loaded)
})
