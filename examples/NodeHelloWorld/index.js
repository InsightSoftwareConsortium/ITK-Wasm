import path from 'path'
import { runPipelineNode } from 'itk-wasm'

const pipelinePath = path.resolve('web-build', 'hello')
await runPipelineNode(pipelinePath)
