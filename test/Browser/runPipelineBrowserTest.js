import test from 'tape'
import axios from 'axios'

import IntTypes from 'IntTypes'
import FloatTypes from 'FloatTypes'
import PixelTypes from 'PixelTypes'
import readImageFile from 'readImageFile'
import readMeshFile from 'readMeshFile'

import runPipelineBrowser from 'runPipelineBrowser'
import IOTypes from 'IOTypes'

test('runPipelineBrowser captures stdout and stderr', (t) => {
  const args = []
  const outputs = null
  const inputs = null
  const stdoutStderrPath = 'StdoutStderr'
  return runPipelineBrowser(null, stdoutStderrPath, args, outputs, inputs)
    .then(function ({ stdout, stderr, outputs, webWorker }) {
      webWorker.terminate()
      t.is(stdout, `I’m writing my code,
But I do not realize,
Hours have gone by.
`)
      t.is(stderr, `The modem humming
Code rapidly compiling.
Click. Perfect success.
`)
      t.end()
    })
})

test('runPipelineBrowser re-uses a WebWorker', (t) => {
  const args = []
  const outputs = null
  const inputs = null
  const stdoutStderrPath = 'StdoutStderr'
  return runPipelineBrowser(null, stdoutStderrPath, args, outputs, inputs)
    .then(function ({ stdout, stderr, outputs, webWorker }) {
      return runPipelineBrowser(webWorker, stdoutStderrPath, args, outputs, inputs)
        .then(function ({ stdout, stderr, outputs, webWorker }) {
          t.is(stdout, `I’m writing my code,
But I do not realize,
Hours have gone by.
`)
          t.is(stderr, `The modem humming
Code rapidly compiling.
Click. Perfect success.
`)
          t.end()
        })
    })
})

test('runPipelineBrowser uses input and output files in the Emscripten filesystem', (t) => {
  const pipelinePath = 'InputOutputFiles'
  const args = ['input.txt', 'input.bin', 'output.txt', 'output.bin']
  const desiredOutputs = [
    { path: 'output.txt', type: IOTypes.Text },
    { path: 'output.bin', type: IOTypes.Binary }
  ]
  const inputs = [
    { path: 'input.txt', type: IOTypes.Text, data: 'The answer is 42.' },
    { path: 'input.bin', type: IOTypes.Binary, data: new Uint8Array([222, 173, 190, 239]) }
  ]
  return runPipelineBrowser(null, pipelinePath, args, desiredOutputs, inputs)
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
      t.end()
    })
})

test('runPipelineBrowser uses writes and read itk/Image in the Emscripten filesystem', (t) => {
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
    t.end()
  }

  const fileName = 'cthead1.png'
  const testFilePath = 'base/build/ExternalData/test/Input/' + fileName
  return axios.get(testFilePath, { responseType: 'blob' })
    .then(function (response) {
      const jsFile = new window.File([response.data], fileName)
      return jsFile
    }).then(function (jsFile) {
      return readImageFile(null, jsFile)
    }).then(function ({ image, webWorker }) {
      webWorker.terminate()
      const pipelinePath = 'MedianFilter'
      const args = ['cthead1.png.json', 'cthead1.png.shrink.json', '4']
      const desiredOutputs = [
        { path: args[1], type: IOTypes.Image }
      ]
      const inputs = [
        { path: args[0], type: IOTypes.Image, data: image }
      ]
      return runPipelineBrowser(null, pipelinePath, args, desiredOutputs, inputs)
    }).then(function ({ stdout, stderr, outputs }) {
      verifyImage(outputs[0].data)
    })
})

test('runPipelineBrowser writes and reads an itk/Mesh in the Emscripten filesystem', (t) => {
  const verifyMesh = (mesh) => {
    t.is(mesh.meshType.dimension, 3)
    t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
    t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
    t.is(mesh.meshType.pointPixelType, 1)
    t.is(mesh.meshType.cellPixelType, 1)
    t.is(mesh.numberOfPoints, 2903)
    t.is(mesh.numberOfCells, 3263)
    t.end()
  }

  const fileName = 'cow.vtk'
  const testMeshInputFilePath = `base/build/ExternalData/test/Input/${fileName}`
  return axios.get(testMeshInputFilePath, { responseType: 'blob' })
    .then(function (response) {
      const jsFile = new window.File([response.data], fileName)
      return jsFile
    }).then(function (jsFile) {
      return readMeshFile(null, jsFile)
    }).then(function ({ mesh, webWorker }) {
      webWorker.terminate()
      const pipelinePath = 'MeshReadWrite'
      const args = ['cow.vtk.json', 'cow.vtk.written.json']
      const desiredOutputs = [
        { path: args[1], type: IOTypes.Mesh }
      ]
      const inputs = [
        { path: args[0], type: IOTypes.Mesh, data: mesh }
      ]
      return runPipelineBrowser(null, pipelinePath, args, desiredOutputs, inputs)
    }).then(function ({ stdout, stderr, outputs }) {
      verifyMesh(outputs[0].data)
    })
})

test('runPipelineBrowser reads a vtkPolyData from the Emscripten filesystem', (t) => {
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
    t.end()
  }

  const fileName = 'cow.vtk'
  const testFilePath = 'base/build/ExternalData/test/Input/' + fileName
  return axios.get(testFilePath, { responseType: 'arraybuffer' })
    .then(function (response) {
      const polyDataFileContents = new Uint8Array(response.data)
      const pipelinePath = 'WriteVTKPolyData'
      const args = ['cow.vtk', 'cow.vtk.written.json']
      const desiredOutputs = [
        { path: args[1], type: IOTypes.vtkPolyData }
      ]
      const inputs = [
        { path: args[0], type: IOTypes.Binary, data: polyDataFileContents }
      ]
      return runPipelineBrowser(null, pipelinePath, args, desiredOutputs, inputs)
        .then(function ({ outputs }) {
          verifyPolyData(outputs[0].data)
        })
    })
})
