import test from 'ava'
import path from 'path'

const MimeToIO = require(path.resolve(__dirname, '..', 'dist', 'MimeToImageIO.js'))

test('image/png maps to itkPNGImageIOJSBinding', t => {
  const io = MimeToIO['image/png']
  t.is(io, 'itkPNGImageIOJSBinding')
})

test('image/jpeg maps to itkJPEGImageIOJSBinding', t => {
  const io = MimeToIO['image/jpeg']
  t.is(io, 'itkJPEGImageIOJSBinding')
})

test('image/tiff maps to itkTIFFImageIOJSBinding', t => {
  const io = MimeToIO['image/tiff']
  t.is(io, 'itkTIFFImageIOJSBinding')
})

test('image/x-ms-bmp maps to itkBMPImageIOJSBinding', t => {
  const io = MimeToIO['image/x-ms-bmp']
  t.is(io, 'itkBMPImageIOJSBinding')
})

test('image/x-bmp maps to itkBMPImageIOJSBinding', t => {
  const io = MimeToIO['image/x-bmp']
  t.is(io, 'itkBMPImageIOJSBinding')
})

test('image/bmp maps to itkBMPImageIOJSBinding', t => {
  const io = MimeToIO['image/bmp']
  t.is(io, 'itkBMPImageIOJSBinding')
})

test('application/dicom maps to itkDCMTKImageIOJSBinding', t => {
  const io = MimeToIO['application/dicom']
  t.is(io, 'itkDCMTKImageIOJSBinding')
})
