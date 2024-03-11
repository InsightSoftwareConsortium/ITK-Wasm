import loadEmscriptenModule from '../internal/load-emscripten-module-web-worker.js'
import PipelineEmscriptenModule from '../pipeline-emscripten-module.js'
import RunPipelineOptions from '../run-pipeline-options.js'

// To cache loaded pipeline modules wrapped in a Promise
const pipelineToModule: Map<string, Promise<PipelineEmscriptenModule>> = new Map()

async function loadPipelineModule (pipelinePath: string | object, baseUrl: string, queryParams?: RunPipelineOptions['pipelineQueryParams']): Promise<PipelineEmscriptenModule> {
  let moduleRelativePathOrURL: string | URL = pipelinePath as string
  let pipeline = pipelinePath as string
  let pipelineModule = null
  if (typeof pipelinePath !== 'string') {
    moduleRelativePathOrURL = new URL((pipelinePath as URL).href)
    pipeline = moduleRelativePathOrURL.href
  }
  if (pipelineToModule.has(pipeline)) {
    pipelineModule = await pipelineToModule.get(pipeline) as PipelineEmscriptenModule
  } else {
    pipelineToModule.set(pipeline, loadEmscriptenModule(moduleRelativePathOrURL, baseUrl, queryParams) as Promise<PipelineEmscriptenModule>)
    pipelineModule = await pipelineToModule.get(pipeline) as PipelineEmscriptenModule
  }
  return pipelineModule
}

export default loadPipelineModule
