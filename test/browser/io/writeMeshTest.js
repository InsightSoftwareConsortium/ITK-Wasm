import test from 'tape'
import axios from 'axios'

import { IntTypes, FloatTypes, PixelTypes, readMeshArrayBuffer, writeMeshArrayBuffer } from 'browser/index.js'

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
  test('writeMeshArrayBuffer writes to an ArrayBuffer', t => {
    return axios.get(testFilePath, { responseType: 'arraybuffer' })
      .then(function (response) {
        return readMeshArrayBuffer(null, response.data, 'cow.vtk').then(function ({ mesh, webWorker }) {
          webWorker.terminate()
          const useCompression = false
          return writeMeshArrayBuffer(null, mesh, 'cow.vtk', { useCompression })
        })
      })
      .then(function ({ arrayBuffer: writtenArrayBuffer, webWorker }) {
        webWorker.terminate()
        return readMeshArrayBuffer(null, writtenArrayBuffer, 'cow.vtk').then(function ({ mesh, webWorker }) {
          webWorker.terminate()
          verifyMesh(t, mesh)
        })
      })
  })
}
