import readImageTest from './readImageTest.js'
import DICOMSeriesTest from './DICOMSeriesTest.js'
import DICOMTest from './DICOMTest.js'
import JPEGTest from './JPEGTest.js'
import readImageFileSeriesTest from './readImageFileSeriesTest.js'

import readMeshTest from './readMeshTest.js'

import writeImageTest from './writeImageTest.js'
import writeMeshTest from './writeMeshTest.js'

import meshToPolyDataTest from './meshToPolyDataTest.js'

export default function () {
  readImageTest()
  DICOMSeriesTest()
  DICOMTest()
  JPEGTest()
  readImageFileSeriesTest()

  readMeshTest()

  writeImageTest()
  writeMeshTest()

  meshToPolyDataTest()
}
