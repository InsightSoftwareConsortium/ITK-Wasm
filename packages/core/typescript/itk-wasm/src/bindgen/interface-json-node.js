import path from 'path'

import { runPipelineNode } from '../../dist/index-node.js'

const pipelinePath = path.resolve(process.argv[2])
const { returnValue, stdout, stderr } = await runPipelineNode(pipelinePath, [
  '--interface-json'
])
process.exit(returnValue)
