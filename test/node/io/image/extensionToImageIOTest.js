import test from 'ava'

import ExtensionToIO from '../../../../dist/io/internal/extensionToImageIO.js'

test('bmp maps to itkBMPImageIO', t => {
  const io = ExtensionToIO.get('bmp')
  t.is(io, 'itkBMPImageIO')
})

test('jpeg maps to itkJPEGImageIO', t => {
  const io = ExtensionToIO.get('jpeg')
  t.is(io, 'itkJPEGImageIO')
})

test('jpg maps to itkJPEGImageIO', t => {
  const io = ExtensionToIO.get('jpg')
  t.is(io, 'itkJPEGImageIO')
})

test('png maps to itkPNGImageIO', t => {
  const io = ExtensionToIO.get('png')
  t.is(io, 'itkPNGImageIO')
})

test('pic maps to itkBioRadImageIO', t => {
  const io = ExtensionToIO.get('pic')
  t.is(io, 'itkBioRadImageIO')
})

test('lsm maps to itkLSMImageIO', t => {
  const io = ExtensionToIO.get('lsm')
  t.is(io, 'itkLSMImageIO')
})

test('mnc maps to itkMINCImageIO', t => {
  const io = ExtensionToIO.get('mnc')
  t.is(io, 'itkMINCImageIO')
})

test('MNC maps to itkMINCImageIO', t => {
  const io = ExtensionToIO.get('MNC')
  t.is(io, 'itkMINCImageIO')
})

test('mnc.gz maps to itkMINCImageIO', t => {
  const io = ExtensionToIO.get('mnc.gz')
  t.is(io, 'itkMINCImageIO')
})

test('MNC.GZ maps to itkMINCImageIO', t => {
  const io = ExtensionToIO.get('MNC.GZ')
  t.is(io, 'itkMINCImageIO')
})

test('mnc2 maps to itkMINCImageIO', t => {
  const io = ExtensionToIO.get('mnc2')
  t.is(io, 'itkMINCImageIO')
})

test('MNC2 maps to itkMINCImageIO', t => {
  const io = ExtensionToIO.get('MNC2')
  t.is(io, 'itkMINCImageIO')
})

test('mgh maps to itkMGHImageIO', t => {
  const io = ExtensionToIO.get('mgh')
  t.is(io, 'itkMGHImageIO')
})

test('mgz maps to itkMGHImageIO', t => {
  const io = ExtensionToIO.get('mgz')
  t.is(io, 'itkMGHImageIO')
})

test('mgh.gz maps to itkMGHImageIO', t => {
  const io = ExtensionToIO.get('mgh.gz')
  t.is(io, 'itkMGHImageIO')
})

test('mha maps to itkMetaImageIO', t => {
  const io = ExtensionToIO.get('mha')
  t.is(io, 'itkMetaImageIO')
})

test('mhd maps to itkMetaImageIO', t => {
  const io = ExtensionToIO.get('mhd')
  t.is(io, 'itkMetaImageIO')
})

test('mrc maps to itkMRCImageIO', t => {
  const io = ExtensionToIO.get('mrc')
  t.is(io, 'itkMRCImageIO')
})

test('nia maps to itkNiftiImageIO', t => {
  const io = ExtensionToIO.get('nia')
  t.is(io, 'itkNiftiImageIO')
})

test('nii maps to itkNiftiImageIO', t => {
  const io = ExtensionToIO.get('nii')
  t.is(io, 'itkNiftiImageIO')
})

test('hdr maps to itkNiftiImageIO', t => {
  const io = ExtensionToIO.get('hdr')
  t.is(io, 'itkNiftiImageIO')
})

test('hdf5 maps to itkHDF5ImageIO', t => {
  const io = ExtensionToIO.get('hdf5')
  t.is(io, 'itkHDF5ImageIO')
})

test('nrrd maps to itkNrrdImageIO', t => {
  const io = ExtensionToIO.get('nrrd')
  t.is(io, 'itkNrrdImageIO')
})

test('nhdr maps to itkNrrdImageIO', t => {
  const io = ExtensionToIO.get('nhdr')
  t.is(io, 'itkNrrdImageIO')
})

test('gipl maps to itkGiplImageIO', t => {
  const io = ExtensionToIO.get('gipl')
  t.is(io, 'itkGiplImageIO')
})

test('dcm maps to itkGDCMImageIO', t => {
  const io = ExtensionToIO.get('dcm')
  t.is(io, 'itkGDCMImageIO')
})

test('tif maps to itkTIFFImageIO', t => {
  const io = ExtensionToIO.get('tif')
  t.is(io, 'itkTIFFImageIO')
})

test('TIF maps to itkTIFFImageIO', t => {
  const io = ExtensionToIO.get('TIF')
  t.is(io, 'itkTIFFImageIO')
})

test('tiff maps to itkTIFFImageIO', t => {
  const io = ExtensionToIO.get('tiff')
  t.is(io, 'itkTIFFImageIO')
})

test('TIFF maps to itkTIFFImageIO', t => {
  const io = ExtensionToIO.get('TIFF')
  t.is(io, 'itkTIFFImageIO')
})

test('vtk maps to itkVTKImageIO', t => {
  const io = ExtensionToIO.get('vtk')
  t.is(io, 'itkVTKImageIO')
})

test('VTK maps to itkVTKImageIO', t => {
  const io = ExtensionToIO.get('VTK')
  t.is(io, 'itkVTKImageIO')
})

test('isq maps to itkScancoImageIO', t => {
  const io = ExtensionToIO.get('isq')
  t.is(io, 'itkScancoImageIO')
})

test('ISQ maps to itkScancoImageIO', t => {
  const io = ExtensionToIO.get('ISQ')
  t.is(io, 'itkScancoImageIO')
})

test('fdf maps to itkFDFImageIO', t => {
  const io = ExtensionToIO.get('fdf')
  t.is(io, 'itkFDFImageIO')
})

test('FDF maps to itkFDFImageIO', t => {
  const io = ExtensionToIO.get('FDF')
  t.is(io, 'itkFDFImageIO')
})
