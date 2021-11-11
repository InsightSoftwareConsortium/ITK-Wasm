import test from 'ava'
import path from 'path'

import { IntTypes, FloatTypes, getMatrixElement, PixelTypes, readLocalFile } from '../../../dist/index.js'

const testImageFilePath = path.resolve('build', 'ExternalData', 'test', 'Input', 'cthead1.png')
const testMeshFilePath = path.resolve('build', 'ExternalData', 'test', 'Input', 'cow.vtk')

test('readLocalFile reads an image file path given on the local filesystem', t => {
  return readLocalFile(testImageFilePath).then(function (image) {
    t.is(image.imageType.dimension, 2)
    t.is(image.imageType.componentType, IntTypes.UInt8)
    t.is(image.imageType.pixelType, PixelTypes.RGB)
    t.is(image.imageType.components, 3)
    t.is(image.origin[0], 0.0)
    t.is(image.origin[1], 0.0)
    t.is(image.spacing[0], 1.0)
    t.is(image.spacing[1], 1.0)
    t.is(getMatrixElement(image.direction, 2, 0, 0), 1.0)
    t.is(getMatrixElement(image.direction, 2, 0, 1), 0.0)
    t.is(getMatrixElement(image.direction, 2, 1, 0), 0.0)
    t.is(getMatrixElement(image.direction, 2, 1, 1), 1.0)
    t.is(image.size[0], 256)
    t.is(image.size[1], 256)
    t.is(image.data.length, 196608)
  })
})

test('readLocalFile reads a mesh on the local filesystem', (t) => {
  return readLocalFile(testMeshFilePath).then(function (mesh) {
    t.is(mesh.meshType.dimension, 3)
    t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
    t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
    t.is(mesh.meshType.pointPixelType, PixelTypes.Scalar)
    t.is(mesh.meshType.cellPixelType, PixelTypes.Scalar)
    t.is(mesh.numberOfPoints, 2903)
    t.is(mesh.numberOfCells, 3263)
  })
})

test('readLocalFile reads polyData on the local filesystem', (t) => {
  const verifyPolyData = (polyData) => {
    t.is(polyData.vtkClass, 'vtkPolyData')
    t.is(polyData.points.vtkClass, 'vtkPoints')
    t.is(polyData.points.name, 'points')
    t.is(polyData.points.numberOfComponents, 3)
    t.is(polyData.points.dataType, 'Float32Array')
    t.is(polyData.points.size, 6183)
    t.is(polyData.polys.vtkClass, 'vtkCellArray')
    t.is(polyData.polys.name, 'polys')
    t.is(polyData.polys.numberOfComponents, 1)
    t.is(polyData.polys.dataType, 'Int32Array')
    t.is(polyData.polys.size, 11759)
    t.is(polyData.pointData.vtkClass, 'vtkDataSetAttributes')
    t.is(polyData.pointData.arrays[0].data.name, 'Ids')
    t.is(polyData.pointData.arrays[0].data.numberOfComponents, 1)
    t.is(polyData.pointData.arrays[0].data.dataType, 'Int32Array')
    t.is(polyData.pointData.arrays[0].data.size, 2061)
    t.is(polyData.pointData.arrays[1].data.name, 'AsH3')
    t.is(polyData.pointData.arrays[1].data.numberOfComponents, 1)
    t.is(polyData.pointData.arrays[1].data.dataType, 'Float64Array')
    t.is(polyData.pointData.arrays[1].data.size, 2061)
    t.is(polyData.cellData.arrays[1].data.name, 'ObjectId')
    t.is(polyData.cellData.arrays[1].data.numberOfComponents, 1)
    t.is(polyData.cellData.arrays[1].data.dataType, 'Int32Array')
    t.is(polyData.cellData.arrays[1].data.size, 2547)
  }

  const testPolyDataFilePath = path.resolve('build', 'ExternalData', 'test', 'Input', 'diskout.vtp')
  return readLocalFile(testPolyDataFilePath).then(function (polyData) {
    verifyPolyData(polyData)
  })
})
