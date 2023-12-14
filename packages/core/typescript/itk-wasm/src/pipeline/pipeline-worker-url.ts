let pipelineWorkerUrl: string | URL | null | undefined

export function setPipelineWorkerUrl (workerUrl: string | URL | null): void {
  pipelineWorkerUrl = workerUrl
}

export function getPipelineWorkerUrl (): string | URL | null | undefined {
  return pipelineWorkerUrl
}
