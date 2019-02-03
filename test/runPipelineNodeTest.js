import test from 'ava'
import path from 'path'

const IntTypes = require(path.resolve(__dirname, '..', 'dist', 'IntTypes.js'))
const FloatTypes = require(path.resolve(__dirname, '..', 'dist', 'FloatTypes.js'))
const PixelTypes = require(path.resolve(__dirname, '..', 'dist', 'PixelTypes.js'))
const readImageLocalFile = require(path.resolve(__dirname, '..', 'dist', 'readImageLocalFile.js'))
const readMeshLocalFile = require(path.resolve(__dirname, '..', 'dist', 'readMeshLocalFile.js'))

const testInputFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'cthead1.png')
const testMeshInputFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'cow.vtk')

const runPipelineNode = require(path.resolve(__dirname, '..', 'dist', 'runPipelineNode.js'))
const IOTypes = require(path.resolve(__dirname, '..', 'dist', 'IOTypes.js'))

test('runPipelineNode captures stdout and stderr', (t) => {
  const args = []
  const outputs = null
  const inputs = null
  const stdoutStderrPath = path.resolve(__dirname, 'StdoutStderrPipeline', 'web-build', 'StdoutStderr')
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
  const pipelinePath = path.resolve(__dirname, 'InputOutputFilesPipeline', 'web-build', 'InputOutputFiles')
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

test('runPipelineNode writes and reads an itk/Image in the Emscripten filesystem', (t) => {
  const verifyImage = (image) => {
    t.is(image.imageType.dimension, 2, 'dimension')
    t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
    t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
    t.is(image.imageType.components, 1, 'components')
    t.is(image.origin[0], 1.5, 'origin[0]')
    t.is(image.origin[1], 1.5, 'origin[1]')
    t.is(image.spacing[0], 4.0, 'spacing[0]')
    t.is(image.spacing[1], 4.0, 'spacing[1]')
    t.is(image.size[0], 64, 'size[0]')
    t.is(image.size[1], 64, 'size[1]')
    t.is(image.data.byteLength, 4096, 'data.byteLength')
  }

  return readImageLocalFile(testInputFilePath)
    .then(function (image) {
      const pipelinePath = path.resolve(__dirname, 'BinShrinkPipeline', 'web-build', 'BinShrink')
      const args = ['cthead1.png.json', 'cthead1.png.shrink.json', '4']
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

test('runPipelineNode writes and reads an itk/Mesh in the Emscripten filesystem', (t) => {
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
      const pipelinePath = path.resolve(__dirname, 'MeshReadWritePipeline', 'web-build', 'MeshReadWrite')
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
