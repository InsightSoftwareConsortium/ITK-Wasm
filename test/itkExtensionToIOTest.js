import test from 'ava'
import path from 'path'

const ExtensionToIO = require(path.resolve(__dirname, '..', 'dist', 'itkExtensionToIO.js'))

test('png maps to itkPNGImageIOJSBinding', t => {
  let io = ExtensionToIO['png']
  t.is(io, 'itkPNGImageIOJSBinding')
})

test('mha maps to itkMetaImageIOJSBinding', t => {
  let io = ExtensionToIO['mha']
  t.is(io, 'itkMetaImageIOJSBinding')
})

test('mhd maps to itkMetaImageIOJSBinding', t => {
  let io = ExtensionToIO['mhd']
  t.is(io, 'itkMetaImageIOJSBinding')
})

test('nrrd maps to itkNrrdImageIOJSBinding', t => {
  let io = ExtensionToIO['nrrd']
  t.is(io, 'itkNrrdImageIOJSBinding')
})

test('nhdr maps to itkNrrdImageIOJSBinding', t => {
  let io = ExtensionToIO['nhdr']
  t.is(io, 'itkNrrdImageIOJSBinding')
})

test('dcm maps to itkGDCMImageIOJSBinding', t => {
  let io = ExtensionToIO['dcm']
  t.is(io, 'itkGDCMImageIOJSBinding')
})

test('vtk maps to itkVTKImageIOJSBinding', t => {
  let io = ExtensionToIO['vtk']
  t.is(io, 'itkVTKImageIOJSBinding')
})
