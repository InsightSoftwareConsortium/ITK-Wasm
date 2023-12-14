import test from 'ava'

import { PixelTypes } from '../../../dist/index-node.js'

test('PixelTypes#Unknown should be defined', t => {
  const type = PixelTypes.Unknown
  t.is(type, 'Unknown')
})
