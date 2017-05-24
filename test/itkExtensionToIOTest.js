import test from 'ava'
import path from 'path'

const ExtensionToIO = require(path.resolve(__dirname, '..', 'dist', 'itkExtensionToIO.js'))

test('png maps to itkPNGImageIOJSBinding', t => {
  let io = ExtensionToIO['png']
  t.is(io, 'itkPNGImageIOJSBinding')
})

test('nrrd maps to itkNrrdImageIOJSBinding', t => {
  let io = ExtensionToIO['nrrd']
  t.is(io, 'itkNrrdImageIOJSBinding')
})

test('nhdr maps to itkNrrdImageIOJSBinding', t => {
  let io = ExtensionToIO['nhdr']
  t.is(io, 'itkNrrdImageIOJSBinding')
})
