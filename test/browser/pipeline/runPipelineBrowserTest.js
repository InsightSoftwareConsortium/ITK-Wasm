import test from 'tape'
import axios from 'axios'

import { IntTypes, FloatTypes, PixelTypes, readImageFile, readMeshFile, runPipelineBrowser, IOTypes, InterfaceTypes } from 'browser/index.js'

export default function () {
  test('runPipelineBrowser captures stdout and stderr', (t) => {
    const args = []
    const outputs = null
    const inputs = null
    const stdoutStderrPath = 'StdoutStderrTest'
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
    const stdoutStderrPath = 'StdoutStderrTest'
    return runPipelineBrowser(null, stdoutStderrPath, args, outputs, inputs)
      .then(function ({ stdout, stderr, outputs, webWorker }) {
        return runPipelineBrowser(webWorker, stdoutStderrPath, args, outputs, inputs)
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
  })

  test('runPipelineBrowser runs a pipeline in a web worker with an absolute URL', (t) => {
    const args = []
    const outputs = null
    const inputs = null
    const absoluteURL = new URL('base/dist/pipeline/StdoutStderrTest', document.location)
    return runPipelineBrowser(null, absoluteURL, args, outputs, inputs)
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

  test('runPipelineBrowser runs a pipeline on the main thread with an absolute URL', (t) => {
    const args = []
    const outputs = null
    const inputs = null
    const absoluteURL = new URL('base/dist/pipeline/StdoutStderrTest', document.location)
    return runPipelineBrowser(false, absoluteURL, args, outputs, inputs)
      .then(function ({ stdout, stderr, outputs }) {
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

  test('runPipelineBrowser uses input and output files in the Emscripten filesystem', (t) => {
    const pipelinePath = 'InputOutputFilesTest'
    const args = ['--use-files',
      '--input-text-file', './input.txt',
      '--input-binary-file', './input.bin',
      '--output-text-file', './output.txt',
      '--output-binary-file', './output.bin'
    ]
    const outputText = { path: './output.txt' }
    const outputBinary = { path: './output.bin' }
    const desiredOutputs = [
      { data: outputText, type: InterfaceTypes.TextFile },
      { data: outputBinary, type: InterfaceTypes.BinaryFile }
    ]
    const inputs = [
      { type: InterfaceTypes.TextFile, data: { path: './input.txt', data: 'The answer is 42.' } },
      { type: InterfaceTypes.BinaryFile, data: { path: './input.bin', data: new Uint8Array([222, 173, 190, 239]) } }
    ]
    return runPipelineBrowser(null, pipelinePath, args, desiredOutputs, inputs)
      .then(function ({ stdout, stderr, outputs, webWorker }) {
        webWorker.terminate()
        t.is(outputs[0].type, InterfaceTypes.TextFile)
        t.is(outputs[0].data.path, './output.txt')
        t.is(outputs[0].data.data, 'The answer is 42.')
        t.is(outputs[1].type, InterfaceTypes.BinaryFile)
        t.is(outputs[1].data.path, './output.bin')
        t.is(outputs[1].data.data[0], 222)
        t.is(outputs[1].data.data[1], 173)
        t.is(outputs[1].data.data[2], 190)
        t.is(outputs[1].data.data[3], 239)
        t.is(stdout, `Input text: The answer is 42.
`)
        t.is(stderr, `Input binary: ffffffdeffffffadffffffbeffffffef
`)
        t.end()
      })
  })

  test('runPipelineNode uses input and output text and binary data via memory io', (t) => {
    const pipelinePath = 'InputOutputFilesTest'
    const args = ['--memory-io',
      '--input-text-stream', '0',
      '--input-binary-stream', '1',
      '--output-text-stream', '0',
      '--output-binary-stream', '1'
    ]
    const desiredOutputs = [
      { type: InterfaceTypes.TextStream },
      { type: InterfaceTypes.BinaryStream }
    ]
    const inputs = [
      { type: InterfaceTypes.TextStream, data: { data: 'The answer is 42.' } },
      { type: InterfaceTypes.BinaryStream, data: { data: new Uint8Array([222, 173, 190, 239]) } }
    ]
    return runPipelineBrowser(null, pipelinePath, args, desiredOutputs, inputs)
      .then(function ({ stdout, stderr, outputs, webWorker }) {
        webWorker.terminate()
        t.is(outputs[0].type, InterfaceTypes.TextStream)
        t.is(outputs[0].data.data, 'The answer is 42.')
        t.is(outputs[1].type, InterfaceTypes.BinaryStream)
        t.is(outputs[1].data.data[0], 222)
        t.is(outputs[1].data.data[1], 173)
        t.is(outputs[1].data.data[2], 190)
        t.is(outputs[1].data.data[3], 239)
        t.is(stdout, `Input text: The answer is 42.
`)
        t.is(stderr, `Input binary: ffffffdeffffffadffffffbeffffffef
`)
        t.end()
      })
  })

  test('runPipelineBrowser runs on the main thread when first argument is false', (t) => {
    const pipelinePath = 'InputOutputFilesTest'
    const args = ['--use-files',
      '--input-text-file', './input.txt',
      '--input-binary-file', './input.bin',
      '--output-text-file', './output.txt',
      '--output-binary-file', './output.bin'
    ]
    const outputText = { path: './output.txt' }
    const outputBinary = { path: './output.bin' }
    const desiredOutputs = [
      { data: outputText, type: InterfaceTypes.TextFile },
      { data: outputBinary, type: InterfaceTypes.BinaryFile }
    ]
    const inputs = [
      { type: InterfaceTypes.TextFile, data: { path: './input.txt', data: 'The answer is 42.' } },
      { type: InterfaceTypes.BinaryFile, data: { path: './input.bin', data: new Uint8Array([222, 173, 190, 239]) } }
    ]
    return runPipelineBrowser(false, pipelinePath, args, desiredOutputs, inputs)
      .then(function ({ stdout, stderr, outputs }) {
        t.is(outputs[0].type, InterfaceTypes.TextFile)
        t.is(outputs[0].data.path, './output.txt')
        t.is(outputs[0].data.data, 'The answer is 42.')
        t.is(outputs[1].type, InterfaceTypes.BinaryFile)
        t.is(outputs[1].data.path, './output.bin')
        t.is(outputs[1].data.data[0], 222)
        t.is(outputs[1].data.data[1], 173)
        t.is(outputs[1].data.data[2], 190)
        t.is(outputs[1].data.data[3], 239)
        t.is(stdout, `Input text: The answer is 42.
`)
        t.is(stderr, `Input binary: ffffffdeffffffadffffffbeffffffef
`)
        t.end()
      })
  })

  test('runPipelineBrowser uses writes and read itk.Image in the Emscripten filesystem', (t) => {
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
        const pipelinePath = 'MedianFilterTest'
        const args = ['--memory-io',
          '0',
          '0',
          '--radius', '4']
        const desiredOutputs = [
          { type: InterfaceTypes.Image }
        ]
        const inputs = [
          { type: InterfaceTypes.Image, data: image }
        ]
        return runPipelineBrowser(null, pipelinePath, args, desiredOutputs, inputs)
      }).then(function ({ stdout, stderr, outputs, webWorker }) {
        webWorker.terminate()
        verifyImage(outputs[0].data)
      })
  })

  test('runPipelineBrowser writes and reads an itk.Mesh in the Emscripten filesystem', async (t) => {
    const verifyMesh = (mesh) => {
      t.is(mesh.meshType.dimension, 3)
      t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
      t.is(mesh.meshType.cellComponentType, IntTypes.UInt64)
      t.is(mesh.meshType.pointPixelType, PixelTypes.Scalar)
      t.is(mesh.meshType.cellPixelType, PixelTypes.Scalar)
      t.is(mesh.numberOfPoints, 2903)
      t.is(mesh.numberOfCells, 3263)
      t.end()
    }

    const fileName = 'cow.vtk'
    const testMeshInputFilePath = `base/build/ExternalData/test/Input/${fileName}`
    const response = await axios.get(testMeshInputFilePath, { responseType: 'blob' })
    const jsFile = await new window.File([response.data], fileName)
    const { mesh, webWorker } = await readMeshFile(null, jsFile)
    webWorker.terminate()
    const pipelinePath = 'MeshReadWriteTest'
    const args = ['./cow.vtk.iwm', './cow.vtk.written.iwm']
    const desiredOutputs = [
      { path: args[1], type: IOTypes.Mesh }
    ]
    const inputs = [
      { path: args[0], type: IOTypes.Mesh, data: mesh }
    ]
    const { outputs, webWorker: pipelineWorker } = await runPipelineBrowser(null, pipelinePath, args, desiredOutputs, inputs)
    pipelineWorker.terminate()
    verifyMesh(outputs[0].data)
  })
}
