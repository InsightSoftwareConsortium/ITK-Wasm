const test = require('ava')
const path = require('path')

const PixelTypes = require(path.resolve(__dirname, '..', 'dist', 'PixelTypes.js'))

test('PixelTypes#Unknown should be defined', t => {
  const type = PixelTypes.Unknown
  t.is(type, 0)
})
