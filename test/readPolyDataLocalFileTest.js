import test from 'ava'
import path from 'path'

const readPolyDataLocalFile = require(path.resolve(__dirname, '..', 'dist', 'readPolyDataLocalFile.js'))

test('readPolyDataLocalFile reads a vtkPolyData', (t) => {
  const verifyPolyData = (polyData) => {
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
  }

  const testPolyDataFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'cow.vtk')
  return readPolyDataLocalFile(testPolyDataFilePath).then(function (polyData) {
    verifyPolyData(polyData)
  })
})
