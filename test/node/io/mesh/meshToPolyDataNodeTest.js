import test from 'ava'
import path from 'path'

import { IntTypes, FloatTypes, PixelTypes, readMeshLocalFile, meshToPolyDataNode, polyDataToMeshNode } from '../../../../dist/index.js'

const testFilePath = path.resolve('build-emscripten', 'ExternalData', 'test', 'Input', 'cow.vtk')
const testBYUFilePath = path.resolve('build-emscripten', 'ExternalData', 'test', 'Input', 'cube.byu')

test('meshToPolyData converts a mesh to a polydata', async (t) => {
  const mesh = await readMeshLocalFile(testFilePath)
  const polyData = await meshToPolyDataNode(mesh)
  t.is(polyData.numberOfPoints, 2903)
  t.is(polyData.polygonsBufferSize, 15593)
  const meshRoundTrip = await polyDataToMeshNode(polyData)
  t.is(meshRoundTrip.meshType.dimension, 3)
  t.is(meshRoundTrip.meshType.pointComponentType, FloatTypes.Float32)
  t.is(meshRoundTrip.meshType.cellComponentType, IntTypes.UInt32)
  t.is(meshRoundTrip.meshType.pointPixelType, PixelTypes.Scalar)
  t.is(meshRoundTrip.meshType.cellPixelType, PixelTypes.Scalar)
  t.is(meshRoundTrip.numberOfPoints, 2903)
  t.is(meshRoundTrip.numberOfCells, 3263)
})

test('meshToPolyData converts a BYU mesh to a polydata', async (t) => {
  const mesh = await readMeshLocalFile(testBYUFilePath)
  const polyData = await meshToPolyDataNode(mesh)
  t.is(polyData.numberOfPoints, 8)
  t.is(polyData.polygonsBufferSize, 30)
  const meshRoundTrip = await polyDataToMeshNode(polyData)
  t.is(meshRoundTrip.meshType.dimension, 3)
  t.is(meshRoundTrip.meshType.pointComponentType, FloatTypes.Float32)
  t.is(meshRoundTrip.meshType.cellComponentType, IntTypes.UInt32)
  t.is(meshRoundTrip.meshType.pointPixelType, PixelTypes.Scalar)
  t.is(meshRoundTrip.meshType.cellPixelType, PixelTypes.Scalar)
  t.is(meshRoundTrip.numberOfPoints, 8)
  t.is(meshRoundTrip.numberOfCells, 6)
})
