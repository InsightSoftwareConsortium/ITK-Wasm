import path from 'path'

import { runPipelineNode } from '../../dist/index-node.js'

const pipelinePath = path.resolve(process.argv[2])
console.log(pipelinePath)
const { returnValue, stdout, stderr } = await runPipelineNode(pipelinePath, ['--interface-json'])
process.exit(returnValue)

