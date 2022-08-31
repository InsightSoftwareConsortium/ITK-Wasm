import { runPipelineNode } from 'itk-wasm/dist/node/index.js'
import path from 'path'

if (process.argv.length < 3) {
  console.error('Usage: node ./runEmscriptenNode.js <pipelinePath>')
  process.exit(1)
}

const pipelinePath = path.resolve(process.argv[2])
await runPipelineNode(pipelinePath)