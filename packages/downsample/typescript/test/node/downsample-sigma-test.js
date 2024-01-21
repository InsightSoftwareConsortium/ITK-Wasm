import test from 'ava'
import path from 'path'

import { downsampleSigmaNode } from '../../dist/index-node.js'

test('Test downsampleSigmaNode', async t => {
  const { sigma } = await downsampleSigmaNode({ shrinkFactors: [2, 4] })
  t.is(sigma[0], 0.735534255037358)
  t.is(sigma[1], 1.6447045940431997)
})
