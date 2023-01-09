import path from 'path'
import { runPipelineNode } from 'itk-wasm'

const pipelinePath = path.resolve('emscripten-build', 'hello')
await runPipelineNode(pipelinePath, [])
