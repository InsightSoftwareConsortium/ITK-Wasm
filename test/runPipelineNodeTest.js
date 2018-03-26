import test from 'ava'
import path from 'path'

// Todo changes src -> dist
const runPipelineNode = require(path.resolve(__dirname, '..', 'src', 'runPipelineNode.js'))

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
