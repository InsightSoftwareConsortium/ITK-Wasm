import test from 'ava'

import { pthreadSupportAvailable } from '../../../dist/index-node.js'

test('node pthread support available', (t) => {
  t.truthy(pthreadSupportAvailable())
})
