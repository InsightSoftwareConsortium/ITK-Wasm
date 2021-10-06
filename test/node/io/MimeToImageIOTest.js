import test from 'ava'
import path from 'path'

import MimeToIO from '../../../dist/io/internal/MimeToImageIO.js'

test('image/png maps to itkPNGImageIOJSBinding', t => {
  const io = MimeToIO.get('image/png')
  t.is(io, 'itkPNGImageIOJSBinding')
})

test('image/jpeg maps to itkJPEGImageIOJSBinding', t => {
  const io = MimeToIO.get('image/jpeg')
  t.is(io, 'itkJPEGImageIOJSBinding')
})

test('image/tiff maps to itkTIFFImageIOJSBinding', t => {
  const io = MimeToIO.get('image/tiff')
  t.is(io, 'itkTIFFImageIOJSBinding')
})

test('image/x-ms-bmp maps to itkBMPImageIOJSBinding', t => {
  const io = MimeToIO.get('image/x-ms-bmp')
  t.is(io, 'itkBMPImageIOJSBinding')
})

test('image/x-bmp maps to itkBMPImageIOJSBinding', t => {
  const io = MimeToIO.get('image/x-bmp')
  t.is(io, 'itkBMPImageIOJSBinding')
})

test('image/bmp maps to itkBMPImageIOJSBinding', t => {
  const io = MimeToIO.get('image/bmp')
  t.is(io, 'itkBMPImageIOJSBinding')
})

test('application/dicom maps to itkGDCMImageIOJSBinding', t => {
  const io = MimeToIO.get('application/dicom')
  t.is(io, 'itkGDCMImageIOJSBinding')
})
