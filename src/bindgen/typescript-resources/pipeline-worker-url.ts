// @ts-expect-error error TS2732: Cannot find module '../package.json'. Consider using '--resolveJsonModule' to import module with '.json' extension.
import packageJson from '../package.json'
let pipelineWorkerUrl: string | URL | null = `https://cdn.jsdelivr.net/npm/<bindgenPackageName>@${packageJson.version as string}/dist/web-workers/pipeline.worker.js`

export function setPipelineWorkerUrl (workerUrl: string | URL | null): void {
  pipelineWorkerUrl = workerUrl
}

export function getPipelineWorkerUrl (): string | URL | null {
  return pipelineWorkerUrl
}
