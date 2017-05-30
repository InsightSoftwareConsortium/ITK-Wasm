import test from 'ava'
import path from 'path'

const MimeToIO = require(path.resolve(__dirname, '..', 'dist', 'itkMimeToIO.js'))

test('image/png maps to itkPNGImageIOJSBinding', t => {
  let io = MimeToIO['image/png']
  t.is(io, 'itkPNGImageIOJSBinding')
})

test('image/tiff maps to itkTIFFImageIOJSBinding', t => {
  let io = MimeToIO['image/tiff']
  t.is(io, 'itkTIFFImageIOJSBinding')
})

test('application/dicom maps to itkGDCMImageIOJSBinding', t => {
  let io = MimeToIO['application/dicom']
  t.is(io, 'itkGDCMImageIOJSBinding')
})
