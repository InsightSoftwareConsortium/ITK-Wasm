import test from 'ava'
import path from 'path'

const ExtensionToIO = require(path.resolve(__dirname, '..', 'dist', 'extensionToIO.js'))

test('bmp maps to itkBMPImageIOJSBinding', t => {
  let io = ExtensionToIO['bmp']
  t.is(io, 'itkBMPImageIOJSBinding')
})

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

test('nia maps to itkNiftiImageIOJSBinding', t => {
  let io = ExtensionToIO['nia']
  t.is(io, 'itkNiftiImageIOJSBinding')
})

test('nii maps to itkNiftiImageIOJSBinding', t => {
  let io = ExtensionToIO['nii']
  t.is(io, 'itkNiftiImageIOJSBinding')
})

test('gz maps to itkNiftiImageIOJSBinding', t => {
  let io = ExtensionToIO['gz']
  t.is(io, 'itkNiftiImageIOJSBinding')
})

test('hdr maps to itkNiftiImageIOJSBinding', t => {
  let io = ExtensionToIO['hdr']
  t.is(io, 'itkNiftiImageIOJSBinding')
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

test('tif maps to itkTIFFImageIOJSBinding', t => {
  let io = ExtensionToIO['tif']
  t.is(io, 'itkTIFFImageIOJSBinding')
})

test('TIF maps to itkTIFFImageIOJSBinding', t => {
  let io = ExtensionToIO['TIF']
  t.is(io, 'itkTIFFImageIOJSBinding')
})

test('tiff maps to itkTIFFImageIOJSBinding', t => {
  let io = ExtensionToIO['tiff']
  t.is(io, 'itkTIFFImageIOJSBinding')
})

test('TIFF maps to itkTIFFImageIOJSBinding', t => {
  let io = ExtensionToIO['TIFF']
  t.is(io, 'itkTIFFImageIOJSBinding')
})

test('vtk maps to itkVTKImageIOJSBinding', t => {
  let io = ExtensionToIO['vtk']
  t.is(io, 'itkVTKImageIOJSBinding')
})

test('VTK maps to itkVTKImageIOJSBinding', t => {
  let io = ExtensionToIO['VTK']
  t.is(io, 'itkVTKImageIOJSBinding')
})
