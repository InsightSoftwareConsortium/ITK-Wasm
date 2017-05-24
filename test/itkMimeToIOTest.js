import test from 'ava'
import path from 'path'

const MimeToIO = require(path.resolve(__dirname, '..', 'dist', 'itkMimeToIO.js'))

test('image/png maps to itkPNGImageIOJSBinding', t => {
  let io = MimeToIO['image/png']
  t.is(io, 'itkPNGImageIOJSBinding')
})
