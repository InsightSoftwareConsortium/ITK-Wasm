import test from 'ava'
import path from 'path'

import { IntTypes, FloatTypes, PixelTypes, readMeshLocalFile, meshToPolyDataNode, polyDataToMeshNode } from '../../../../dist/index.js'

const testFilePath = path.resolve('build', 'ExternalData', 'test', 'Input', 'cow.vtk')

test('meshToPolyData converts a mesh to a polydata', async (t) => {
  const mesh = await readMeshLocalFile(testFilePath)
  const polyData = await meshToPolyDataNode(mesh)
  t.is(polyData.numberOfPoints, 2903)
  t.is(polyData.polygonsBufferSize, 15593)
  const meshRoundTrip = await polyDataToMeshNode(polyData)
  t.is(meshRoundTrip.meshType.dimension, 3)
  t.is(meshRoundTrip.meshType.pointComponentType, FloatTypes.Float32)
  t.is(meshRoundTrip.meshType.cellComponentType, IntTypes.UInt64)
  t.is(meshRoundTrip.meshType.pointPixelType, PixelTypes.Scalar)
  t.is(meshRoundTrip.meshType.cellPixelType, PixelTypes.Scalar)
  t.is(meshRoundTrip.numberOfPoints, 2903)
  t.is(meshRoundTrip.numberOfCells, 3263)
})
