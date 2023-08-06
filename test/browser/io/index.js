import readImageTest from './readImageTest.js'
import JPEGTest from './JPEGTest.js'
import readImageFileSeriesTest from './readImageFileSeriesTest.js'

import readMeshTest from './readMeshTest.js'

import writeImageTest from './writeImageTest.js'
import writeMeshTest from './writeMeshTest.js'

import meshToPolyDataTest from './meshToPolyDataTest.js'

export default function () {
  readImageTest()
  JPEGTest()
  readImageFileSeriesTest()

  readMeshTest()

  writeImageTest()
  writeMeshTest()

  meshToPolyDataTest()
}
