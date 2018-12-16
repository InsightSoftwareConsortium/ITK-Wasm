const path = require('path')
const runPipelineNode = require('itk/runPipelineNode')

const pipelinePath = path.resolve(__dirname, 'web-build', 'hello')
runPipelineNode(pipelinePath)
