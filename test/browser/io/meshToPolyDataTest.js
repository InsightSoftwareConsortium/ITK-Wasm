import test from 'tape'
import axios from 'axios'

import { IntTypes, FloatTypes, PixelTypes, readMeshArrayBuffer, meshToPolyData, polyDataToMesh } from 'browser/index.js'

const fileName = 'cow.vtk'
const testFilePath = 'base/build-emscripten/ExternalData/test/Input/' + fileName

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
  t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
  t.is(mesh.meshType.pointPixelType, PixelTypes.Scalar)
  t.is(mesh.meshType.cellPixelType, PixelTypes.Scalar)
  t.is(mesh.numberOfPoints, 2903)
  t.is(mesh.numberOfCells, 3263)
  t.end()
}

export default function () {
  test('meshToPolyData converts a mesh to a polydata', async (t) => {
    const response = await axios.get(testFilePath, { responseType: 'arraybuffer' })
    const { mesh, webWorker } = await readMeshArrayBuffer(null, response.data, 'cow.vtk')
    const { polyData } = await meshToPolyData(webWorker, mesh)
    t.is(polyData.numberOfPoints, 2903)
    t.is(polyData.polygonsBufferSize, 15593)
    const roundTrip = await polyDataToMesh(webWorker, polyData)
    const meshRoundTrip = roundTrip.mesh
    webWorker.terminate()
    t.is(meshRoundTrip.meshType.dimension, 3)
    t.is(meshRoundTrip.meshType.pointComponentType, FloatTypes.Float32)
    t.is(meshRoundTrip.meshType.cellComponentType, IntTypes.UInt32)
    t.is(meshRoundTrip.meshType.pointPixelType, PixelTypes.Scalar)
    t.is(meshRoundTrip.meshType.cellPixelType, PixelTypes.Scalar)
    t.is(meshRoundTrip.numberOfPoints, 2903)
    t.is(meshRoundTrip.numberOfCells, 3263)
    verifyMesh(t, meshRoundTrip)
  })
}
