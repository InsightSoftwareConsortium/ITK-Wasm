import test from 'ava'
import path from 'path'

const ExtensionToIO = require(path.resolve(__dirname, '..', 'dist', 'extensionToImageIO.js'))

test('bmp maps to itkBMPImageIOJSBinding', t => {
  let io = ExtensionToIO['bmp']
  t.is(io, 'itkBMPImageIOJSBinding')
})

test('jpeg maps to itkJPEGImageIOJSBinding', t => {
  let io = ExtensionToIO['jpeg']
  t.is(io, 'itkJPEGImageIOJSBinding')
})

test('jpg maps to itkJPEGImageIOJSBinding', t => {
  let io = ExtensionToIO['jpg']
  t.is(io, 'itkJPEGImageIOJSBinding')
})

test('png maps to itkPNGImageIOJSBinding', t => {
  let io = ExtensionToIO['png']
  t.is(io, 'itkPNGImageIOJSBinding')
})

test('pic maps to itkBioRadImageIOJSBinding', t => {
  let io = ExtensionToIO['pic']
  t.is(io, 'itkBioRadImageIOJSBinding')
})

test('lsm maps to itkLSMImageIOJSBinding', t => {
  let io = ExtensionToIO['lsm']
  t.is(io, 'itkLSMImageIOJSBinding')
})

test('mnc maps to itkMINCImageIOJSBinding', t => {
  let io = ExtensionToIO['mnc']
  t.is(io, 'itkMINCImageIOJSBinding')
})

test('MNC maps to itkMINCImageIOJSBinding', t => {
  let io = ExtensionToIO['MNC']
  t.is(io, 'itkMINCImageIOJSBinding')
})

test('mnc.gz maps to itkMINCImageIOJSBinding', t => {
  let io = ExtensionToIO['mnc.gz']
  t.is(io, 'itkMINCImageIOJSBinding')
})

test('MNC.GZ maps to itkMINCImageIOJSBinding', t => {
  let io = ExtensionToIO['MNC.GZ']
  t.is(io, 'itkMINCImageIOJSBinding')
})

test('mnc2 maps to itkMINCImageIOJSBinding', t => {
  let io = ExtensionToIO['mnc2']
  t.is(io, 'itkMINCImageIOJSBinding')
})

test('MNC2 maps to itkMINCImageIOJSBinding', t => {
  let io = ExtensionToIO['MNC2']
  t.is(io, 'itkMINCImageIOJSBinding')
})

test('mgh maps to itkMGHImageIOJSBinding', t => {
  let io = ExtensionToIO['mgh']
  t.is(io, 'itkMGHImageIOJSBinding')
})

test('mgz maps to itkMGHImageIOJSBinding', t => {
  let io = ExtensionToIO['mgz']
  t.is(io, 'itkMGHImageIOJSBinding')
})

test('mgh.gz maps to itkMGHImageIOJSBinding', t => {
  let io = ExtensionToIO['mgh.gz']
  t.is(io, 'itkMGHImageIOJSBinding')
})

test('mha maps to itkMetaImageIOJSBinding', t => {
  let io = ExtensionToIO['mha']
  t.is(io, 'itkMetaImageIOJSBinding')
})

test('mhd maps to itkMetaImageIOJSBinding', t => {
  let io = ExtensionToIO['mhd']
  t.is(io, 'itkMetaImageIOJSBinding')
})

test('mrc maps to itkMRCImageIOJSBinding', t => {
  let io = ExtensionToIO['mrc']
  t.is(io, 'itkMRCImageIOJSBinding')
})

test('nia maps to itkNiftiImageIOJSBinding', t => {
  let io = ExtensionToIO['nia']
  t.is(io, 'itkNiftiImageIOJSBinding')
})

test('nii maps to itkNiftiImageIOJSBinding', t => {
  let io = ExtensionToIO['nii']
  t.is(io, 'itkNiftiImageIOJSBinding')
})

test('hdr maps to itkNiftiImageIOJSBinding', t => {
  let io = ExtensionToIO['hdr']
  t.is(io, 'itkNiftiImageIOJSBinding')
})

test('hdf5 maps to itkHDF5ImageIOJSBinding', t => {
  let io = ExtensionToIO['hdf5']
  t.is(io, 'itkHDF5ImageIOJSBinding')
})

test('nrrd maps to itkNrrdImageIOJSBinding', t => {
  let io = ExtensionToIO['nrrd']
  t.is(io, 'itkNrrdImageIOJSBinding')
})

test('nhdr maps to itkNrrdImageIOJSBinding', t => {
  let io = ExtensionToIO['nhdr']
  t.is(io, 'itkNrrdImageIOJSBinding')
})

test('gipl maps to itkGiplImageIOJSBinding', t => {
  let io = ExtensionToIO['gipl']
  t.is(io, 'itkGiplImageIOJSBinding')
})

test('dcm maps to itkDCMTKImageIOJSBinding', t => {
  let io = ExtensionToIO['dcm']
  t.is(io, 'itkDCMTKImageIOJSBinding')
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
