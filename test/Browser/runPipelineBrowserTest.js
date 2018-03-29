import test from 'tape'
/*
import axios from 'axios'

import IntTypes from 'IntTypes'
import PixelTypes from 'PixelTypes'
import readImageFile from 'readImageFile'
*/

import runPipelineBrowser from 'runPipelineBrowser'
import IOTypes from 'IOTypes'

test('runPipelineNode captures stdout and stderr', (t) => {
  const args = []
  const outputs = null
  const inputs = null
  const stdoutStderrPath = 'StdoutStderr'
  return runPipelineBrowser(stdoutStderrPath, args, outputs, inputs)
    .then(function ({stdout, stderr, outputs}) {
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

test('runPipelineNode uses input and output files in the Emscripten filesystem', (t) => {
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
  return runPipelineBrowser(pipelinePath, args, desiredOutputs, inputs)
    .then(function ({stdout, stderr, outputs}) {
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

/* todo: patch itk to avoid pthread_attr_setscope call
test('runPipelineNode uses writes and read itk/Image in the Emscripten filesystem', (t) => {
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
    t.end()
  }

  const fileName = 'cthead1.png'
  const testFilePath = 'base/build/ExternalData/test/Input/' + fileName
  return axios.get(testFilePath, {responseType: 'blob'})
    .then(function (response) {
      const jsFile = new window.File([response.data], fileName)
      return jsFile
    }).then(function (jsFile) {
      return readImageFile(jsFile)
    }).then(function (image) {
      const pipelinePath = 'BinShrink'
      const args = ['cthead1.png.json', 'cthead1.png.shrink.json', '4']
      const desiredOutputs = [
        { path: args[1], type: IOTypes.Image }
      ]
      const inputs = [
        { path: args[0], type: IOTypes.Image, data: image }
      ]
      return runPipelineBrowser(pipelinePath, args, desiredOutputs, inputs)
    }).then(function ({stdout, stderr, outputs}) {
      verifyImage(outputs[0].data)
    })
})
*/
