import test from 'ava'
import path from 'path'

const loadModule = require(path.resolve(__dirname, '..', 'dist', 'itkloadEmscriptenModule.js'))
const itkConfig = require(path.resolve(__dirname, '..', 'dist', 'itkConfig.js'))
itkConfig.imageIOsURL = path.resolve(__dirname, '..', 'dist', 'ImageIOs')

test('load a module', t => {
  const modulePath = path.join(itkConfig.imageIOsURL, 'itkPNGImageIOJSBinding.js')
  const loaded = loadModule(modulePath)
  t.truthy(loaded)
})
