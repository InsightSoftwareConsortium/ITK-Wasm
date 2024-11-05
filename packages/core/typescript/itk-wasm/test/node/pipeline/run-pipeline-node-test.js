import test from 'ava'
import path from 'path'
import fs from 'fs-extra'

import {
  IntTypes,
  FloatTypes,
  PixelTypes,
  runPipelineNode,
  InterfaceTypes
} from '../../../dist/index-node.js'

function readCthead1 () {
  const testInputImageDir = path.resolve(
    'test',
    'pipelines',
    'median-filter-pipeline',
    'cthead1.iwi'
  )
  const image = JSON.parse(
    fs.readFileSync(path.join(testInputImageDir, 'index.json'), {
      encoding: 'utf8'
    })
  )
  image.imageType.componentType = IntTypes.UInt8
  image.imageType.pixelType = PixelTypes.RGB
  const directionBuffer = fs.readFileSync(
    path.join(testInputImageDir, 'data', 'direction.raw'),
    null
  )
  const directionData = new Float64Array(
    directionBuffer.buffer.slice(
      directionBuffer.byteOffset,
      directionBuffer.byteOffset + directionBuffer.byteLength
    )
  )
  image.direction = directionData
  const dataBuffer = fs.readFileSync(
    path.join(testInputImageDir, 'data', 'data.raw'),
    null
  )
  const pixelData = new Uint8Array(
    dataBuffer.buffer.slice(
      dataBuffer.byteOffset,
      dataBuffer.byteOffset + dataBuffer.byteLength
    )
  )
  image.data = pixelData
  return image
}
function readCow () {
  const testInputMeshDir = path.resolve(
    'test',
    'pipelines',
    'mesh-read-write-pipeline',
    'cow.iwm'
  )
  const mesh = JSON.parse(
    fs.readFileSync(path.join(testInputMeshDir, 'index.json'), {
      encoding: 'utf8'
    })
  )
  const pointsBuffer = fs.readFileSync(
    path.join(testInputMeshDir, 'data', 'points.raw'),
    null
  )
  const points = new Float32Array(
    pointsBuffer.buffer.slice(
      pointsBuffer.byteOffset,
      pointsBuffer.byteOffset + pointsBuffer.byteLength
    )
  )
  mesh.points = points
  const cellsBuffer = fs.readFileSync(
    path.join(testInputMeshDir, 'data', 'cells.raw'),
    null
  )
  const cells = new Uint32Array(
    cellsBuffer.buffer.slice(
      cellsBuffer.byteOffset,
      cellsBuffer.byteOffset + cellsBuffer.byteLength
    )
  )
  mesh.cells = cells
  mesh.pointData = null
  mesh.cellData = null
  return mesh
}
function readLinearTransform () {
  const testInputTransformDir = path.resolve(
    'test',
    'pipelines',
    'transform-read-write-pipeline',
    'LinearTransform.iwt'
  )
  const transformList = JSON.parse(
    fs.readFileSync(path.join(testInputTransformDir, 'index.json'), {
      encoding: 'utf8'
    })
  )
  const fixedParametersBuffer = fs.readFileSync(
    path.join(testInputTransformDir, 'data', '0', 'fixed-parameters.raw'),
    null
  )
  const fixedParameters = new Float64Array(
    fixedParametersBuffer.buffer.slice(
      fixedParametersBuffer.byteOffset,
      fixedParametersBuffer.byteOffset + fixedParametersBuffer.byteLength
    )
  )
  transformList[0].fixedParameters = fixedParameters

  const parametersBuffer = fs.readFileSync(
    path.join(testInputTransformDir, 'data', '0', 'parameters.raw'),
    null
  )
  const parameters = new Float64Array(
    parametersBuffer.buffer.slice(
      parametersBuffer.byteOffset,
      parametersBuffer.byteOffset + parametersBuffer.byteLength
    )
  )
  transformList[0].parameters = parameters
  return transformList
}

test('runPipelineNode captures stdout and stderr', (t) => {
  const args = []
  const outputs = null
  const inputs = null
  const stdoutStderrPath = path.resolve(
    'test',
    'pipelines',
    'emscripten-build',
    'stdout-stderr-pipeline',
    'stdout-stderr-test'
  )
  return runPipelineNode(stdoutStderrPath, args, outputs, inputs).then(
    function ({ returnValue, stdout, stderr }) {
      t.is(returnValue, 0)
      t.is(
        stdout,
        `I’m writing my code,
But I do not realize,
Hours have gone by.
`
      )
      t.is(
        stderr,
        `The modem humming
Code rapidly compiling.
Click. Perfect success.
`
      )
    }
  )
})

test('runPipelineNode uses input and output text and binary data via memory io', (t) => {
  const pipelinePath = path.resolve(
    'test',
    'pipelines',
    'emscripten-build',
    'input-output-files-pipeline',
    'input-output-files-test'
  )
  const args = [
    '--memory-io',
    '--input-text-stream',
    '0',
    '--input-binary-stream',
    '1',
    '0',
    '1'
  ]
  const desiredOutputs = [
    { type: InterfaceTypes.TextStream },
    { type: InterfaceTypes.BinaryStream }
  ]
  const inputs = [
    { type: InterfaceTypes.TextStream, data: { data: 'The answer is 42.' } },
    {
      type: InterfaceTypes.BinaryStream,
      data: { data: new Uint8Array([222, 173, 190, 239]) }
    }
  ]
  return runPipelineNode(pipelinePath, args, desiredOutputs, inputs).then(
    function ({ stdout, stderr, outputs }) {
      t.is(outputs[0].type, InterfaceTypes.TextStream)
      t.is(outputs[0].data.data, 'The answer is 42.')
      t.is(outputs[1].type, InterfaceTypes.BinaryStream)
      t.is(outputs[1].data.data[0], 222)
      t.is(outputs[1].data.data[1], 173)
      t.is(outputs[1].data.data[2], 190)
      t.is(outputs[1].data.data[3], 239)
      t.is(
        stdout,
        `Input text: The answer is 42.
`
      )
      t.is(
        stderr,
        `Input binary: ffffffdeffffffadffffffbeffffffef
`
      )
    }
  )
})

test('runPipelineNode uses input and output text and binary files', (t) => {
  const pipelinePath = path.resolve(
    'test',
    'pipelines',
    'emscripten-build',
    'input-output-files-pipeline',
    'input-output-files-test'
  )
  const testInputTextFile = path.resolve(
    'test',
    'data',
    'cow.iwm',
    'index.json'
  )
  const testInputBinFile = path.resolve(
    'test',
    'data',
    'cow.iwm',
    'data',
    'cells.raw'
  )
  const testOutputTextFile = path.resolve(
    'test',
    'data',
    'cow.iwm',
    'data',
    'output.txt'
  )
  const testOutputBinFile = path.resolve(
    'test',
    'data',
    'cow.iwm',
    'data',
    'output.bin'
  )

  const args = [
    '--memory-io',
    '--input-text-stream',
    '0',
    '--input-binary-stream',
    '1',
    '0',
    '1',
    testOutputTextFile,
    testOutputBinFile,
    '-f',
    '--input-text-file',
    testInputTextFile,
    '--input-binary-file',
    testInputBinFile
  ]
  const desiredOutputs = [
    { type: InterfaceTypes.TextStream },
    { type: InterfaceTypes.BinaryStream }
  ]
  const inputs = [
    { type: InterfaceTypes.TextStream, data: { data: 'The answer is 42.' } },
    {
      type: InterfaceTypes.BinaryStream,
      data: { data: new Uint8Array([222, 173, 190, 239]) }
    }
  ]

  const mountDirs = new Set()
  mountDirs.add(path.dirname(testInputTextFile))
  mountDirs.add(path.dirname(testInputBinFile))
  mountDirs.add(path.dirname(testOutputTextFile))
  mountDirs.add(path.dirname(testOutputBinFile))

  return runPipelineNode(
    pipelinePath,
    args,
    desiredOutputs,
    inputs,
    mountDirs
  ).then(function ({ stdout, stderr, outputs }) {
    t.is(outputs[0].type, InterfaceTypes.TextStream)
    t.is(outputs[1].type, InterfaceTypes.BinaryStream)
  })
})

test('runPipelineNode uses input and output json data via memory io', (t) => {
  const pipelinePath = path.resolve(
    'test',
    'pipelines',
    'emscripten-build',
    'input-output-json-pipeline',
    'input-output-json-test'
  )
  const args = ['--memory-io', '0', '0']
  const desiredOutputs = [{ type: InterfaceTypes.JsonCompatible }]
  const jsonObject = { key1: 'text', key2: 8 }
  const inputs = [{ type: InterfaceTypes.JsonCompatible, data: jsonObject }]
  return runPipelineNode(pipelinePath, args, desiredOutputs, inputs).then(
    function ({ outputs }) {
      t.is(outputs[0].type, InterfaceTypes.JsonCompatible)
      t.deepEqual(outputs[0].data, jsonObject)
    }
  )
})

test('runPipelineNode writes and reads an itk.Image via memory io', async (t) => {
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

  const image = readCthead1()
  const pipelinePath = path.resolve(
    'test',
    'pipelines',
    'emscripten-build',
    'median-filter-pipeline',
    'median-filter-test'
  )
  const args = ['0', '0', '--radius', '4', '--memory-io']
  const desiredOutputs = [{ type: InterfaceTypes.Image }]
  const inputs = [{ type: InterfaceTypes.Image, data: image }]
  const { outputs } = await runPipelineNode(
    pipelinePath,
    args,
    desiredOutputs,
    inputs
  )
  verifyImage(outputs[0].data)
})

test('runPipelineNode writes and reads an itk.Mesh via memory io', async (t) => {
  const verifyMesh = (mesh) => {
    t.is(mesh.meshType.dimension, 3)
    t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
    t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
    t.is(mesh.meshType.pointPixelType, PixelTypes.Scalar)
    t.is(mesh.meshType.cellPixelType, PixelTypes.Scalar)
    t.is(mesh.numberOfPoints, 2903)
    t.is(mesh.numberOfCells, 3263)
  }

  const mesh = readCow()
  const pipelinePath = path.resolve(
    'test',
    'pipelines',
    'emscripten-build',
    'mesh-read-write-pipeline',
    'mesh-read-write-test'
  )
  const args = ['0', '0', '--memory-io']
  const desiredOutputs = [{ type: InterfaceTypes.Mesh }]
  const inputs = [{ type: InterfaceTypes.Mesh, data: mesh }]
  const { outputs } = await runPipelineNode(
    pipelinePath,
    args,
    desiredOutputs,
    inputs
  )
  verifyMesh(outputs[0].data)
})

test('runPipelineNode writes and reads an itk.TransformList via memory io', async (t) => {
  const verifyTransform = (transformList) => {
    t.is(transformList.length, 1)
    t.is(transformList[0].transformType.transformParameterization, 'Affine')
    t.is(transformList[0].transformType.parametersValueType, 'float64')
    t.is(transformList[0].transformType.inputDimension, 3)
    t.is(transformList[0].transformType.outputDimension, 3)
    t.is(transformList[0].numberOfFixedParameters, 3)
    t.is(transformList[0].fixedParameters.length, 3)
    t.is(transformList[0].numberOfParameters, 12)
    t.is(transformList[0].parameters.length, 12)
  }

  const transformList = readLinearTransform()
  const pipelinePath = path.resolve(
    'test',
    'pipelines',
    'emscripten-build',
    'transform-read-write-pipeline',
    'transform-read-write-test'
  )
  const args = ['0', '0', '--memory-io']
  const desiredOutputs = [{ type: InterfaceTypes.TransformList }]
  const inputs = [{ type: InterfaceTypes.TransformList, data: transformList }]
  const { outputs } = await runPipelineNode(
    pipelinePath,
    args,
    desiredOutputs,
    inputs
  )
  verifyTransform(outputs[0].data)
})
