import test from 'ava'

import MimeToIO from '../../../../dist/io/internal/MimeToImageIO.js'

test('image/png maps to itkPNGImageIO', t => {
  const io = MimeToIO.get('image/png')
  t.is(io, 'itkPNGImageIO')
})

test('image/jpeg maps to itkJPEGImageIO', t => {
  const io = MimeToIO.get('image/jpeg')
  t.is(io, 'itkJPEGImageIO')
})

test('image/tiff maps to itkTIFFImageIO', t => {
  const io = MimeToIO.get('image/tiff')
  t.is(io, 'itkTIFFImageIO')
})

test('image/x-ms-bmp maps to itkBMPImageIO', t => {
  const io = MimeToIO.get('image/x-ms-bmp')
  t.is(io, 'itkBMPImageIO')
})

test('image/x-bmp maps to itkBMPImageIO', t => {
  const io = MimeToIO.get('image/x-bmp')
  t.is(io, 'itkBMPImageIO')
})

test('image/bmp maps to itkBMPImageIO', t => {
  const io = MimeToIO.get('image/bmp')
  t.is(io, 'itkBMPImageIO')
})

test('application/dicom maps to itkGDCMImageIO', t => {
  const io = MimeToIO.get('application/dicom')
  t.is(io, 'itkGDCMImageIO')
})
