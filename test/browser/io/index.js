import readImageTest from './readImageTest.js'
import readImageFileSeriesTest from './readImageFileSeriesTest.js'

import readMeshTest from './readMeshTest.js'

import writeImageTest from './writeImageTest.js'
import writeMeshTest from './writeMeshTest.js'

import meshToPolyDataTest from './meshToPolyDataTest.js'

export default function () {
  readImageTest()
  readImageFileSeriesTest()

  readMeshTest()

  writeImageTest()
  writeMeshTest()

  meshToPolyDataTest()
}
