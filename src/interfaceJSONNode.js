import path from 'path'

import { runPipelineNode } from '../dist/node/index.js'

const pipelinePath = path.resolve('./public/pipelines/structured-report-to-text')
const { returnValue, stdout, stderr } = await runPipelineNode(pipelinePath, ['--interface-json'])
process.exit(returnValue)

