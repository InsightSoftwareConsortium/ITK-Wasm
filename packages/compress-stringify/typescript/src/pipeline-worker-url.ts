let pipelineWorkerUrl: string | URL | null = new URL('/web-workers/pipeline.worker.js', document.location.origin).href

export function setPipelineWorkerUrl (workerUrl: string | URL | null): void {
  pipelineWorkerUrl = workerUrl
}

export function getPipelineWorkerUrl (): string | URL | null {
  return pipelineWorkerUrl
}
