import fs from 'fs'
import test from 'ava'
import path from 'path'

import { IntTypes, FloatTypes, PixelTypes, readImageLocalFile, readMeshLocalFile, runPipelineNode, IOTypes } from '../../../dist/index.js'

const testInputFilePath = path.resolve('build', 'ExternalData', 'test', 'Input', 'cthead1.png')
const testMeshInputFilePath = path.resolve('build', 'ExternalData', 'test', 'Input', 'cow.vtk')

test('runPipelineNode captures stdout and stderr', (t) => {
  const args = []
  const outputs = null
  const inputs = null
  const stdoutStderrPath = path.resolve('test', 'pipelines', 'StdoutStderrPipeline', 'web-build', 'StdoutStderrTest')
  return runPipelineNode(stdoutStderrPath, args, outputs, inputs)
    .then(function ({ stdout, stderr, outputs }) {
      t.is(stdout, `I’m writing my code,
But I do not realize,
Hours have gone by.
`)
      t.is(stderr, `The modem humming
Code rapidly compiling.
Click. Perfect success.
`)
    })
})

test('runPipelineNode uses input and output files in the Emscripten filesystem', (t) => {
  const pipelinePath = path.resolve('test', 'pipelines', 'InputOutputFilesPipeline', 'web-build', 'InputOutputFilesTest')
  const args = ['input.txt', 'input.bin', 'output.txt', 'output.bin']
  const desiredOutputs = [
    { path: 'output.txt', type: IOTypes.Text },
    { path: 'output.bin', type: IOTypes.Binary }
  ]
  const inputs = [
    { path: 'input.txt', type: IOTypes.Text, data: 'The answer is 42.' },
    { path: 'input.bin', type: IOTypes.Binary, data: new Uint8Array([222, 173, 190, 239]) }
  ]
  return runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
    .then(function ({ stdout, stderr, outputs }) {
      t.is(outputs[0].path, 'output.txt')
      t.is(outputs[0].type, IOTypes.Text)
      t.is(outputs[0].data, 'The answer is 42.')
      t.is(outputs[1].path, 'output.bin')
      t.is(outputs[1].type, IOTypes.Binary)
      t.is(outputs[1].data[0], 222)
      t.is(outputs[1].data[1], 173)
      t.is(outputs[1].data[2], 190)
      t.is(outputs[1].data[3], 239)
      t.is(stdout, `Input text: The answer is 42.
`)
      t.is(stderr, `Input binary: ffffffdeffffffadffffffbeffffffef
`)
    })
})

test('runPipelineNode writes and reads an itk.Image in the Emscripten filesystem', (t) => {
  const verifyImage = (image) => {
    t.is(image.imageType.dimension, 2, 'dimension')
    t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
    t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
    t.is(image.imageType.components, 1, 'components')
    t.is(image.origin[0], 0.0, 'origin[0]')
    t.is(image.origin[1], 0.0, 'origin[1]')
    t.is(image.spacing[0], 1.0, 'spacing[0]')
    t.is(image.spacing[1], 1.0, 'spacing[1]')
    t.is(image.size[0], 256, 'size[0]')
    t.is(image.size[1], 256, 'size[1]')
    t.is(image.data.byteLength, 65536, 'data.byteLength')
  }

  return readImageLocalFile(testInputFilePath)
    .then(function (image) {
      const pipelinePath = path.resolve('test', 'pipelines', 'MedianFilterPipeline', 'web-build', 'MedianFilterTest')
      const args = ['./cthead1.png.iwi', './cthead1.png.median.iwi', '4']
      const desiredOutputs = [
        { path: args[1], type: IOTypes.Image }
      ]
      const inputs = [
        { path: args[0], type: IOTypes.Image, data: image }
      ]
      return runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
    }).then(function ({ stdout, stderr, outputs }) {
      verifyImage(outputs[0].data)
    })
})

test('runPipelineNode writes and reads an itk.Mesh in the Emscripten filesystem', (t) => {
  const verifyMesh = (mesh) => {
    t.is(mesh.meshType.dimension, 3)
    t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
    t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
    t.is(mesh.meshType.pointPixelType, 1)
    t.is(mesh.meshType.cellPixelType, 1)
    t.is(mesh.numberOfPoints, 2903)
    t.is(mesh.numberOfCells, 3263)
  }

  return readMeshLocalFile(testMeshInputFilePath)
    .then(function (mesh) {
      const pipelinePath = path.resolve('test', 'pipelines', 'MeshReadWritePipeline', 'web-build', 'MeshReadWriteTest')
      const args = ['cow.vtk.json', 'cow.vtk.written.json']
      const desiredOutputs = [
        { path: args[1], type: IOTypes.Mesh }
      ]
      const inputs = [
        { path: args[0], type: IOTypes.Mesh, data: mesh }
      ]
      return runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
    }).then(function ({ stdout, stderr, outputs }) {
      verifyMesh(outputs[0].data)
    })
})

test('runPipelineNode reads a vtkPolyData from the Emscripten filesystem', (t) => {
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

  const polyDataFileContents = new Uint8Array(fs.readFileSync(testMeshInputFilePath))
  const pipelinePath = path.resolve('test', 'pipelines', 'WriteVTKPolyDataPipeline', 'web-build', 'WriteVTKPolyDataTest')
  const args = ['cow.vtk', 'cow.vtk.written.json']
  const desiredOutputs = [
    { path: args[1], type: IOTypes.vtkPolyData }
  ]
  const inputs = [
    { path: args[0], type: IOTypes.Binary, data: polyDataFileContents }
  ]
  return runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
    .then(function ({ stdout, stderr, outputs }) {
      verifyPolyData(outputs[0].data)
    })
})

test('mesh-to-polydata converts an itk/Mesh to a vtk.js vtkPolyData', (t) => {
  const verifyPolyData = (polyData) => {
    t.is(polyData.vtkClass, 'vtkPolyData')
    t.is(polyData.points.vtkClass, 'vtkPoints')
    t.is(polyData.points.name, 'points')
    t.is(polyData.points.numberOfComponents, 3)
    t.is(polyData.points.dataType, 'Float32Array')
    t.is(polyData.points.size, 8709)
    t.is(polyData.points.buffer.byteLength, 34836)
    t.is(polyData.points.values[0], 3.716360092163086)
    t.is(polyData.points.values[1], 2.3433899879455566)
    t.is(polyData.points.values[2], 0.0)
    t.is(polyData.polys.vtkClass, 'vtkCellArray')
    t.is(polyData.polys.name, 'polys')
    t.is(polyData.polys.numberOfComponents, 1)
    t.is(polyData.polys.dataType, 'Int32Array')
    t.is(polyData.polys.size, 15593)
    t.is(polyData.polys.buffer.byteLength, 62372)
    t.is(polyData.polys.values[0], 4)
    t.is(polyData.polys.values[1], 250)
    t.is(polyData.polys.values[2], 251)
  }

  return readMeshLocalFile(testMeshInputFilePath)
    .then(function (mesh) {
      const pipelinePath = path.resolve('src', 'pipeline', 'mesh-to-polydata', 'web-build', 'MeshToPolyData')
      const args = ['cow.vtk.json', 'cow.vtk.written.json']
      const desiredOutputs = [
        { path: args[1], type: IOTypes.vtkPolyData }
      ]
      const inputs = [
        { path: args[0], type: IOTypes.Mesh, data: mesh }
      ]
      return runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
        .then(function ({ stdout, stderr, outputs }) {
          verifyPolyData(outputs[0].data)
        })
    })
})
