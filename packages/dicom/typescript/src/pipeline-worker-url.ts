import packageJson from '../package.json'
let pipelineWorkerUrl: string | URL | null = `https://cdn.jsdelivr.net/npm/@itk-wasm/dicom@@${packageJson.version as string}/dist/web-workers/pipeline.worker.js`

export function setPipelineWorkerUrl (workerUrl: string | URL | null): void {
  pipelineWorkerUrl = workerUrl
}

export function getPipelineWorkerUrl (): string | URL | null {
  return pipelineWorkerUrl
}
