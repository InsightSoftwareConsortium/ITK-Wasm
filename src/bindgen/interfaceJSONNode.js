import path from 'path'

import { runPipelineNode } from '../../dist/node/index.js'

const pipelinePath = path.resolve(process.argv[2])
const { returnValue, stdout, stderr } = await runPipelineNode(pipelinePath, ['--interface-json'])
process.exit(returnValue)

