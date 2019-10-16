import test from 'ava'
import path from 'path'

const ExtensionToIO = require(path.resolve(__dirname, '..', 'dist', 'extensionToImageIO.js'))

test('bmp maps to itkBMPImageIOJSBinding', t => {
  const io = ExtensionToIO.bmp
  t.is(io, 'itkBMPImageIOJSBinding')
})

test('jpeg maps to itkJPEGImageIOJSBinding', t => {
  const io = ExtensionToIO.jpeg
  t.is(io, 'itkJPEGImageIOJSBinding')
})

test('jpg maps to itkJPEGImageIOJSBinding', t => {
  const io = ExtensionToIO.jpg
  t.is(io, 'itkJPEGImageIOJSBinding')
})

test('png maps to itkPNGImageIOJSBinding', t => {
  const io = ExtensionToIO.png
  t.is(io, 'itkPNGImageIOJSBinding')
})

test('pic maps to itkBioRadImageIOJSBinding', t => {
  const io = ExtensionToIO.pic
  t.is(io, 'itkBioRadImageIOJSBinding')
})

test('lsm maps to itkLSMImageIOJSBinding', t => {
  const io = ExtensionToIO.lsm
  t.is(io, 'itkLSMImageIOJSBinding')
})

test('mnc maps to itkMINCImageIOJSBinding', t => {
  const io = ExtensionToIO.mnc
  t.is(io, 'itkMINCImageIOJSBinding')
})

test('MNC maps to itkMINCImageIOJSBinding', t => {
  const io = ExtensionToIO.MNC
  t.is(io, 'itkMINCImageIOJSBinding')
})

test('mnc.gz maps to itkMINCImageIOJSBinding', t => {
  const io = ExtensionToIO['mnc.gz']
  t.is(io, 'itkMINCImageIOJSBinding')
})

test('MNC.GZ maps to itkMINCImageIOJSBinding', t => {
  const io = ExtensionToIO['MNC.GZ']
  t.is(io, 'itkMINCImageIOJSBinding')
})

test('mnc2 maps to itkMINCImageIOJSBinding', t => {
  const io = ExtensionToIO.mnc2
  t.is(io, 'itkMINCImageIOJSBinding')
})

test('MNC2 maps to itkMINCImageIOJSBinding', t => {
  const io = ExtensionToIO.MNC2
  t.is(io, 'itkMINCImageIOJSBinding')
})

test('mgh maps to itkMGHImageIOJSBinding', t => {
  const io = ExtensionToIO.mgh
  t.is(io, 'itkMGHImageIOJSBinding')
})

test('mgz maps to itkMGHImageIOJSBinding', t => {
  const io = ExtensionToIO.mgz
  t.is(io, 'itkMGHImageIOJSBinding')
})

test('mgh.gz maps to itkMGHImageIOJSBinding', t => {
  const io = ExtensionToIO['mgh.gz']
  t.is(io, 'itkMGHImageIOJSBinding')
})

test('mha maps to itkMetaImageIOJSBinding', t => {
  const io = ExtensionToIO.mha
  t.is(io, 'itkMetaImageIOJSBinding')
})

test('mhd maps to itkMetaImageIOJSBinding', t => {
  const io = ExtensionToIO.mhd
  t.is(io, 'itkMetaImageIOJSBinding')
})

test('mrc maps to itkMRCImageIOJSBinding', t => {
  const io = ExtensionToIO.mrc
  t.is(io, 'itkMRCImageIOJSBinding')
})

test('nia maps to itkNiftiImageIOJSBinding', t => {
  const io = ExtensionToIO.nia
  t.is(io, 'itkNiftiImageIOJSBinding')
})

test('nii maps to itkNiftiImageIOJSBinding', t => {
  const io = ExtensionToIO.nii
  t.is(io, 'itkNiftiImageIOJSBinding')
})

test('hdr maps to itkNiftiImageIOJSBinding', t => {
  const io = ExtensionToIO.hdr
  t.is(io, 'itkNiftiImageIOJSBinding')
})

test('hdf5 maps to itkHDF5ImageIOJSBinding', t => {
  const io = ExtensionToIO.hdf5
  t.is(io, 'itkHDF5ImageIOJSBinding')
})

test('nrrd maps to itkNrrdImageIOJSBinding', t => {
  const io = ExtensionToIO.nrrd
  t.is(io, 'itkNrrdImageIOJSBinding')
})

test('nhdr maps to itkNrrdImageIOJSBinding', t => {
  const io = ExtensionToIO.nhdr
  t.is(io, 'itkNrrdImageIOJSBinding')
})

test('gipl maps to itkGiplImageIOJSBinding', t => {
  const io = ExtensionToIO.gipl
  t.is(io, 'itkGiplImageIOJSBinding')
})

test('dcm maps to itkDCMTKImageIOJSBinding', t => {
  const io = ExtensionToIO.dcm
  t.is(io, 'itkDCMTKImageIOJSBinding')
})

test('tif maps to itkTIFFImageIOJSBinding', t => {
  const io = ExtensionToIO.tif
  t.is(io, 'itkTIFFImageIOJSBinding')
})

test('TIF maps to itkTIFFImageIOJSBinding', t => {
  const io = ExtensionToIO.TIF
  t.is(io, 'itkTIFFImageIOJSBinding')
})

test('tiff maps to itkTIFFImageIOJSBinding', t => {
  const io = ExtensionToIO.tiff
  t.is(io, 'itkTIFFImageIOJSBinding')
})

test('TIFF maps to itkTIFFImageIOJSBinding', t => {
  const io = ExtensionToIO.TIFF
  t.is(io, 'itkTIFFImageIOJSBinding')
})

test('vtk maps to itkVTKImageIOJSBinding', t => {
  const io = ExtensionToIO.vtk
  t.is(io, 'itkVTKImageIOJSBinding')
})

test('VTK maps to itkVTKImageIOJSBinding', t => {
  const io = ExtensionToIO.VTK
  t.is(io, 'itkVTKImageIOJSBinding')
})
