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

function readCthead1() {
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
function readCow() {
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
function readLinearTransform() {
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

test('runPipelineNode creates a composite transform with expected parameters', async (t) => {
  const verifyCompositeTransform = (transformList) => {
    t.is(
      transformList.length,
      3,
      'should have composite + 2 component transforms'
    )

    // First transform should be the composite
    const compositeTransform = transformList[0]
    t.is(
      compositeTransform.transformType.transformParameterization,
      'Composite',
      'first should be composite transform'
    )
    t.is(
      compositeTransform.transformType.inputDimension,
      2,
      'should be 2D transform'
    )
    t.is(
      compositeTransform.transformType.outputDimension,
      2,
      'should be 2D transform'
    )

    // The composite transform contains the Rigid2D parameters: [angle, tx, ty], and affine parameters: [m00, m01, m10, m11, tx, ty]
    t.is(
      compositeTransform.numberOfParameters,
      9,
      'Composite should report 9 parameters total'
    )

    // Check composite fixed parameters (from Rigid2D): [center_x, center_y]
    t.is(
      compositeTransform.numberOfFixedParameters,
      4,
      'should report 4 fixed parameters total'
    )

    // Second transform should be the Rigid2D (but contains Affine parameters due to ITK internals)
    const rigid2DTransform = transformList[1]
    t.is(
      rigid2DTransform.transformType.transformParameterization,
      'Rigid2D',
      'second should be Rigid2D transform'
    )
    t.is(
      rigid2DTransform.transformType.inputDimension,
      2,
      'should be 2D transform'
    )
    t.is(
      rigid2DTransform.transformType.outputDimension,
      2,
      'should be 2D transform'
    )

    t.is(
      rigid2DTransform.numberOfParameters,
      3,
      'Rigid2D should report 3 parameters'
    )
    t.is(
      rigid2DTransform.parameters.length,
      3,
      'parameters array should have 3 elements'
    )

    t.true(
      Math.abs(rigid2DTransform.parameters[0] - 0.5235987901687622) < 0.0001,
      'Rotation'
    )
    t.true(
      Math.abs(rigid2DTransform.parameters[1] - 5.0) < 0.001,
      'translation x should be 5.0'
    )
    t.true(
      Math.abs(rigid2DTransform.parameters[2] - 3.0) < 0.001,
      'translation y should be 3.0'
    )

    // Check Rigid2D fixed parameters (but contains Affine center): [center_x, center_y]
    t.is(
      rigid2DTransform.numberOfFixedParameters,
      2,
      'should have 2 fixed parameters'
    )
    t.is(
      rigid2DTransform.fixedParameters.length,
      2,
      'fixed parameters array should have 2 elements'
    )
    t.is(rigid2DTransform.fixedParameters[0], 10.0, 'center x should be 10.0')
    t.is(rigid2DTransform.fixedParameters[1], 15.0, 'center y should be 15.0')

    // Third transform should be the Affine (but appears empty)
    const affineTransform = transformList[2]
    t.is(
      affineTransform.transformType.transformParameterization,
      'Affine',
      'third should be Affine transform'
    )
    t.is(
      affineTransform.transformType.inputDimension,
      2,
      'should be 2D transform'
    )
    t.is(
      affineTransform.transformType.outputDimension,
      2,
      'should be 2D transform'
    )

    // The Affine transform appears to be empty (parameters moved to Rigid2D slot)
    t.is(
      affineTransform.numberOfParameters,
      6,
      'Affine should have 6 parameters'
    )
    t.is(
      affineTransform.parameters.length,
      6,
      'Affine parameters array should have 6 elements'
    )
    t.is(
      affineTransform.numberOfFixedParameters,
      2,
      'should have 2 fixed parameters'
    )
    t.is(
      affineTransform.fixedParameters.length,
      2,
      'should have 2 fixed parameters'
    )
    t.is(
      affineTransform.fixedParameters[0],
      20.0,
      'Affine center x should be 20.0'
    )
    t.is(
      affineTransform.fixedParameters[1],
      25.0,
      'Affine center y should be 25.0'
    )
    t.is(
      affineTransform.parameters[4],
      2.5,
      'Affine.parameters[4] should be 2.5'
    )
  }

  const pipelinePath = path.resolve(
    'test',
    'pipelines',
    'emscripten-build',
    'composite-transform-pipeline',
    'composite-transform-test'
  )
  const args = ['0', '--memory-io']
  const desiredOutputs = [{ type: InterfaceTypes.TransformList }]
  const inputs = []

  const { outputs } = await runPipelineNode(
    pipelinePath,
    args,
    desiredOutputs,
    inputs
  )

  verifyCompositeTransform(outputs[0].data)
})
