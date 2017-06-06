import test from 'ava'
import path from 'path'

const MimeToIO = require(path.resolve(__dirname, '..', 'dist', 'MimeToIO.js'))

test('image/png maps to itkPNGImageIOJSBinding', t => {
  let io = MimeToIO['image/png']
  t.is(io, 'itkPNGImageIOJSBinding')
})

test('image/jpeg maps to itkJPEGImageIOJSBinding', t => {
  let io = MimeToIO['image/jpeg']
  t.is(io, 'itkJPEGImageIOJSBinding')
})

test('image/tiff maps to itkTIFFImageIOJSBinding', t => {
  let io = MimeToIO['image/tiff']
  t.is(io, 'itkTIFFImageIOJSBinding')
})

test('image/x-ms-bmp maps to itkBMPImageIOJSBinding', t => {
  let io = MimeToIO['image/x-ms-bmp']
  t.is(io, 'itkBMPImageIOJSBinding')
})

test('image/x-bmp maps to itkBMPImageIOJSBinding', t => {
  let io = MimeToIO['image/x-bmp']
  t.is(io, 'itkBMPImageIOJSBinding')
})

test('image/bmp maps to itkBMPImageIOJSBinding', t => {
  let io = MimeToIO['image/bmp']
  t.is(io, 'itkBMPImageIOJSBinding')
})

test('application/dicom maps to itkGDCMImageIOJSBinding', t => {
  let io = MimeToIO['application/dicom']
  t.is(io, 'itkGDCMImageIOJSBinding')
})
