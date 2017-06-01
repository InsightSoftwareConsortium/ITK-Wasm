import test from 'ava'
import path from 'path'

const PixelTypes = require(path.resolve(__dirname, '..', 'dist', 'PixelTypes.js'))

test('PixelTypes#Unknown should be defined', t => {
  let type = PixelTypes.Unknown
  t.is(type, 0)
})
