import test from 'ava'

import { gaussianKernelRadiusNode } from '../../dist/index-node.js'

test('Test gaussianKernelRadiusNode', async t => {
  const { radius } = await gaussianKernelRadiusNode({ size: [64, 64, 32], sigma: [2.0, 4.0, 2.0] })
  t.is(radius[0], 5)
  t.is(radius[1], 10)
  t.is(radius[2], 5)
})
