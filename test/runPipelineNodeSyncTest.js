import test from 'ava'
import path from 'path'

const IntTypes = require(path.resolve(__dirname, '..', 'dist', 'IntTypes.js'))
const FloatTypes = require(path.resolve(__dirname, '..', 'dist', 'FloatTypes.js'))
const PixelTypes = require(path.resolve(__dirname, '..', 'dist', 'PixelTypes.js'))
const readImageLocalFileSync = require(path.resolve(__dirname, '..', 'dist', 'readImageLocalFileSync.js'))
const readMeshLocalFileSync = require(path.resolve(__dirname, '..', 'dist', 'readMeshLocalFileSync.js'))

const testInputFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'cthead1.png')
const testMeshInputFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'cow.vtk')

const runPipelineNodeSync = require(path.resolve(__dirname, '..', 'dist', 'runPipelineNodeSync.js'))
const IOTypes = require(path.resolve(__dirname, '..', 'dist', 'IOTypes.js'))

test('runPipelineNodeSync captures stdout and stderr', (t) => {
  const args = []
  const desiredOutputs = null
  const inputs = null
  const stdoutStderrPath = path.resolve(__dirname, 'StdoutStderrPipeline', 'web-build', 'StdoutStderr')
  const { stdout, stderr } = runPipelineNodeSync(stdoutStderrPath, args, desiredOutputs, inputs)
  t.is(stdout, `I’m writing my code,
But I do not realize,
Hours have gone by.
`)
  t.is(stderr, `The modem humming
Code rapidly compiling.
Click. Perfect success.
`)
})

test('runPipelineNodeSync uses input and output files in the Emscripten filesystem', (t) => {
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
  const { stdout, stderr, outputs } = runPipelineNodeSync(pipelinePath, args, desiredOutputs, inputs)
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

test('runPipelineNodeSync writes and reads an itk/Image in the Emscripten filesystem', (t) => {
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

  const image = readImageLocalFileSync(testInputFilePath)
  const pipelinePath = path.resolve(__dirname, 'MedianFilterPipeline', 'web-build', 'MedianFilter')
  const args = ['cthead1.png.json', 'cthead1.png.shrink.json', '4']
  const desiredOutputs = [
    { path: args[1], type: IOTypes.Image }
  ]
  const inputs = [
    { path: args[0], type: IOTypes.Image, data: image }
  ]
  const { outputs } = runPipelineNodeSync(pipelinePath, args, desiredOutputs, inputs)
  verifyImage(outputs[0].data)
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

  const mesh = readMeshLocalFileSync(testMeshInputFilePath)
  const pipelinePath = path.resolve(__dirname, 'MeshReadWritePipeline', 'web-build', 'MeshReadWrite')
  const args = ['cow.vtk.json', 'cow.vtk.written.json']
  const desiredOutputs = [
    { path: args[1], type: IOTypes.Mesh }
  ]
  const inputs = [
    { path: args[0], type: IOTypes.Mesh, data: mesh }
  ]
  const { outputs } = runPipelineNodeSync(pipelinePath, args, desiredOutputs, inputs)
  verifyMesh(outputs[0].data)
})
