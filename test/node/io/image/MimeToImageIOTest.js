import test from 'ava'

import MimeToIO from '../../../../dist/io/internal/MimeToImageIO.js'

test('image/png maps to PNGImageIO', t => {
  const io = MimeToIO.get('image/png')
  t.is(io, 'PNGImageIO')
})

test('image/jpeg maps to JPEGImageIO', t => {
  const io = MimeToIO.get('image/jpeg')
  t.is(io, 'JPEGImageIO')
})

test('image/tiff maps to TIFFImageIO', t => {
  const io = MimeToIO.get('image/tiff')
  t.is(io, 'TIFFImageIO')
})

test('image/x-ms-bmp maps to BMPImageIO', t => {
  const io = MimeToIO.get('image/x-ms-bmp')
  t.is(io, 'BMPImageIO')
})

test('image/x-bmp maps to BMPImageIO', t => {
  const io = MimeToIO.get('image/x-bmp')
  t.is(io, 'BMPImageIO')
})

test('image/bmp maps to BMPImageIO', t => {
  const io = MimeToIO.get('image/bmp')
  t.is(io, 'BMPImageIO')
})

test('application/dicom maps to GDCMImageIO', t => {
  const io = MimeToIO.get('application/dicom')
  t.is(io, 'GDCMImageIO')
})
