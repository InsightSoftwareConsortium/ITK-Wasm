import test from 'ava'
import path from 'path'

// Todo changes src -> dist
const runPipelineNode = require(path.resolve(__dirname, '..', 'src', 'runPipelineNode.js'))
const IOTypes = require(path.resolve(__dirname, '..', 'src', 'IOTypes.js'))

test('runPipelineNode captures stdout and stderr', (t) => {
  const args = []
  const outputs = null
  const inputs = null
  const stdoutStderrPath = path.resolve(__dirname, 'StdoutStderrPipeline', 'web-build', 'StdoutStderr')
  return runPipelineNode(stdoutStderrPath, args, outputs, inputs)
    .then(function ({stdout, stderr, outputs}) {
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
    })
})
