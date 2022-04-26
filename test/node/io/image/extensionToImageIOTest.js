import test from 'ava'

import ExtensionToIO from '../../../../dist/io/extensionToImageIO.js'

test('bmp maps to BMPImageIO', t => {
  const io = ExtensionToIO.get('bmp')
  t.is(io, 'BMPImageIO')
})

test('jpeg maps to JPEGImageIO', t => {
  const io = ExtensionToIO.get('jpeg')
  t.is(io, 'JPEGImageIO')
})

test('jpg maps to JPEGImageIO', t => {
  const io = ExtensionToIO.get('jpg')
  t.is(io, 'JPEGImageIO')
})

test('png maps to PNGImageIO', t => {
  const io = ExtensionToIO.get('png')
  t.is(io, 'PNGImageIO')
})

test('pic maps to BioRadImageIO', t => {
  const io = ExtensionToIO.get('pic')
  t.is(io, 'BioRadImageIO')
})

test('lsm maps to LSMImageIO', t => {
  const io = ExtensionToIO.get('lsm')
  t.is(io, 'LSMImageIO')
})

test('mnc maps to MINCImageIO', t => {
  const io = ExtensionToIO.get('mnc')
  t.is(io, 'MINCImageIO')
})

test('MNC maps to MINCImageIO', t => {
  const io = ExtensionToIO.get('MNC')
  t.is(io, 'MINCImageIO')
})

test('mnc.gz maps to MINCImageIO', t => {
  const io = ExtensionToIO.get('mnc.gz')
  t.is(io, 'MINCImageIO')
})

test('MNC.GZ maps to MINCImageIO', t => {
  const io = ExtensionToIO.get('MNC.GZ')
  t.is(io, 'MINCImageIO')
})

test('mnc2 maps to MINCImageIO', t => {
  const io = ExtensionToIO.get('mnc2')
  t.is(io, 'MINCImageIO')
})

test('MNC2 maps to MINCImageIO', t => {
  const io = ExtensionToIO.get('MNC2')
  t.is(io, 'MINCImageIO')
})

test('mgh maps to MGHImageIO', t => {
  const io = ExtensionToIO.get('mgh')
  t.is(io, 'MGHImageIO')
})

test('mgz maps to MGHImageIO', t => {
  const io = ExtensionToIO.get('mgz')
  t.is(io, 'MGHImageIO')
})

test('mgh.gz maps to MGHImageIO', t => {
  const io = ExtensionToIO.get('mgh.gz')
  t.is(io, 'MGHImageIO')
})

test('mha maps to MetaImageIO', t => {
  const io = ExtensionToIO.get('mha')
  t.is(io, 'MetaImageIO')
})

test('mhd maps to MetaImageIO', t => {
  const io = ExtensionToIO.get('mhd')
  t.is(io, 'MetaImageIO')
})

test('mrc maps to MRCImageIO', t => {
  const io = ExtensionToIO.get('mrc')
  t.is(io, 'MRCImageIO')
})

test('nia maps to NiftiImageIO', t => {
  const io = ExtensionToIO.get('nia')
  t.is(io, 'NiftiImageIO')
})

test('nii maps to NiftiImageIO', t => {
  const io = ExtensionToIO.get('nii')
  t.is(io, 'NiftiImageIO')
})

test('hdr maps to NiftiImageIO', t => {
  const io = ExtensionToIO.get('hdr')
  t.is(io, 'NiftiImageIO')
})

test('hdf5 maps to HDF5ImageIO', t => {
  const io = ExtensionToIO.get('hdf5')
  t.is(io, 'HDF5ImageIO')
})

test('nrrd maps to NrrdImageIO', t => {
  const io = ExtensionToIO.get('nrrd')
  t.is(io, 'NrrdImageIO')
})

test('nhdr maps to NrrdImageIO', t => {
  const io = ExtensionToIO.get('nhdr')
  t.is(io, 'NrrdImageIO')
})

test('gipl maps to GiplImageIO', t => {
  const io = ExtensionToIO.get('gipl')
  t.is(io, 'GiplImageIO')
})

test('dcm maps to GDCMImageIO', t => {
  const io = ExtensionToIO.get('dcm')
  t.is(io, 'GDCMImageIO')
})

test('tif maps to TIFFImageIO', t => {
  const io = ExtensionToIO.get('tif')
  t.is(io, 'TIFFImageIO')
})

test('TIF maps to TIFFImageIO', t => {
  const io = ExtensionToIO.get('TIF')
  t.is(io, 'TIFFImageIO')
})

test('tiff maps to TIFFImageIO', t => {
  const io = ExtensionToIO.get('tiff')
  t.is(io, 'TIFFImageIO')
})

test('TIFF maps to TIFFImageIO', t => {
  const io = ExtensionToIO.get('TIFF')
  t.is(io, 'TIFFImageIO')
})

test('vtk maps to VTKImageIO', t => {
  const io = ExtensionToIO.get('vtk')
  t.is(io, 'VTKImageIO')
})

test('VTK maps to VTKImageIO', t => {
  const io = ExtensionToIO.get('VTK')
  t.is(io, 'VTKImageIO')
})

test('isq maps to ScancoImageIO', t => {
  const io = ExtensionToIO.get('isq')
  t.is(io, 'ScancoImageIO')
})

test('ISQ maps to ScancoImageIO', t => {
  const io = ExtensionToIO.get('ISQ')
  t.is(io, 'ScancoImageIO')
})

test('fdf maps to FDFImageIO', t => {
  const io = ExtensionToIO.get('fdf')
  t.is(io, 'FDFImageIO')
})

test('FDF maps to FDFImageIO', t => {
  const io = ExtensionToIO.get('FDF')
  t.is(io, 'FDFImageIO')
})
