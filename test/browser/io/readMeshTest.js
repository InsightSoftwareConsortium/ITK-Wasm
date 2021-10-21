import test from 'tape'
import axios from 'axios'

import { IntTypes, FloatTypes, readMeshArrayBuffer, readMeshBlob, readMeshFile } from 'browser/index.js'

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

export default function () {
  test('readMeshArrayBuffer reads an ArrayBuffer', (t) => {
    return axios.get(testFilePath, { responseType: 'arraybuffer' })
      .then(function (response) {
        return readMeshArrayBuffer(null, response.data, 'cow.vtk')
      })
      .then(function ({ mesh, webWorker }) {
        webWorker.terminate()
        verifyMesh(t, mesh)
      })
  })

  // Todo: fix me
  // test('readMeshFile reads a Blob without a file extension', (t) => {
  // return axios.get(testFilePath, {responseType: 'blob'})
  // .then(function (response) {
  // return readMeshBlob(response.data, 'cow')
  // })
  // .then(function (mesh) {
  // verifyMesh(t, mesh)
  // })
  // })

  test('readMeshBlob reads a Blob', (t) => {
    return axios.get(testFilePath, { responseType: 'blob' })
      .then(function (response) {
        return readMeshBlob(null, response.data, 'cow.vtk')
      })
      .then(function ({ mesh, webWorker }) {
        webWorker.terminate()
        verifyMesh(t, mesh)
      })
  })

  test('readMeshFile reads a File', (t) => {
    return axios.get(testFilePath, { responseType: 'blob' }).then(function (response) {
      const jsFile = new window.File([response.data], fileName)
      return jsFile
    })
      .then(function (jsFile) {
        return readMeshFile(null, jsFile)
      })
      .then(function ({ mesh, webWorker }) {
        webWorker.terminate()
        verifyMesh(t, mesh)
      })
  })

  test('readMeshFile re-uses a WebWorker', (t) => {
    return axios.get(testFilePath, { responseType: 'blob' }).then(function (response) {
      const jsFile = new window.File([response.data], fileName)
      return jsFile
    })
      .then(function (jsFile) {
        return readMeshFile(null, jsFile)
      })
      .then(function ({ webWorker }) {
        axios.get(testFilePath, { responseType: 'blob' }).then(function (response) {
          const jsFile = new window.File([response.data], fileName)
          return jsFile
        })
          .then(function (jsFile) {
            return readMeshFile(webWorker, jsFile)
              .then(function ({ mesh, webWorker }) {
                webWorker.terminate()
                verifyMesh(t, mesh)
              })
          })
      })
  })

  test('readMeshFile throws a catchable error for an invalid file', (t) => {
    const invalidArray = new Uint8Array([21, 4, 4, 4, 4, 9, 5, 0, 82, 42])
    const invalidBlob = new window.Blob([invalidArray])
    const invalidFile = new window.File([invalidBlob], 'invalid.file')
    return readMeshFile(null, invalidFile).then(function ({ mesh }) {
      t.fail('should not have successfully read the mesh')
      t.end()
    }).catch(function (error) {
      t.pass(String(error))
      t.pass('thrown an error that was caught')
      t.end()
    })
  })
}
