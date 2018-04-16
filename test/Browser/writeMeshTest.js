import test from 'tape'
import axios from 'axios'

import readMeshArrayBuffer from 'readMeshArrayBuffer'
import writeMeshArrayBuffer from 'writeMeshArrayBuffer'

import IntTypes from 'IntTypes'
import FloatTypes from 'FloatTypes'

const fileName = 'cow.vtk'
const testFilePath = 'base/build/ExternalData/test/Input/' + fileName

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
  t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
  t.is(mesh.meshType.pointPixelType, 1)
  t.is(mesh.meshType.cellPixelType, 1)
  t.is(mesh.numberOfPoints, 2903)
  t.is(mesh.numberOfCells, 3263)
  t.end()
}

test('writeMeshArrayBuffer writes to an ArrayBuffer', t => {
  return axios.get(testFilePath, {responseType: 'arraybuffer'})
    .then(function (response) {
      return readMeshArrayBuffer(null, response.data, 'cow.vtk').then(function (mesh) {
        const useCompression = false
        return writeMeshArrayBuffer(null, useCompression, mesh, 'cow.vtk')
      })
    })
    .then(function (writtenArrayBuffer) {
      return readMeshArrayBuffer(null, writtenArrayBuffer, 'cow.vtk').then(function (mesh) {
        verifyMesh(t, mesh)
      })
    })
})
