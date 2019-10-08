import test from 'tape'
import axios from 'axios'

// import readPolyDataArrayBuffer from 'readPolyDataArrayBuffer'
// import readPolyDataBlob from 'readPolyDataBlob'
import readPolyDataFile from 'readPolyDataFile'

const fileName = 'cow.vtk'
const testFilePath = 'base/build/ExternalData/test/Input/' + fileName

const verifyPolyData = (t, polyData) => {
  t.is(polyData.vtkClass, 'vtkPolyData')
  t.is(polyData.points.vtkClass, 'vtkPoints')
  t.is(polyData.points.name, 'points')
  t.is(polyData.points.numberOfComponents, 3)
  t.is(polyData.points.dataType, 'Float32Array')
  t.is(polyData.points.size, 8709)
  t.is(polyData.points.buffer.byteLength, 34836)
  t.is(polyData.polys.vtkClass, 'vtkCellArray')
  t.is(polyData.polys.name, 'polys')
  t.is(polyData.polys.numberOfComponents, 1)
  t.is(polyData.polys.dataType, 'Int32Array')
  t.is(polyData.polys.size, 15593)
  t.is(polyData.polys.buffer.byteLength, 62372)
  t.end()
}

// test('readPolyDataArrayBuffer reads an ArrayBuffer', (t) => {
// return axios.get(testFilePath, { responseType: 'arraybuffer' })
// .then(function (response) {
// return readPolyDataArrayBuffer(null, response.data, 'cow.vtk')
// })
// .then(function ({ polyData, webWorker }) {
// webWorker.terminate()
// verifyPolyData(t, polyData)
// })
// })

// Todo: fix me
// test('readPolyDataFile reads a Blob without a file extension', (t) => {
// return axios.get(testFilePath, {responseType: 'blob'})
// .then(function (response) {
// return readPolyDataBlob(response.data, 'cow')
// })
// .then(function (polyData) {
// verifyPolyData(t, polyData)
// })
// })

// test('readPolyDataBlob reads a Blob', (t) => {
// return axios.get(testFilePath, { responseType: 'blob' })
// .then(function (response) {
// return readPolyDataBlob(null, response.data, 'cow.vtk')
// })
// .then(function ({ polyData, webWorker }) {
// webWorker.terminate()
// verifyPolyData(t, polyData)
// })
// })

test('readPolyDataFile reads a File', (t) => {
  return axios.get(testFilePath, { responseType: 'blob' }).then(function (response) {
    const jsFile = new window.File([response.data], fileName)
    return jsFile
  })
    .then(function (jsFile) {
      return readPolyDataFile(null, jsFile)
    })
    .then(function ({ polyData, webWorker }) {
      webWorker.terminate()
      verifyPolyData(t, polyData)
    })
})
