interface RunPipelineOptions {
  /** Url where WebAssembly pipelines are hosted. */
  pipelineBaseUrl?: string | URL

  /** Url where the pipeline web worker is hosted. */
  pipelineWorkerUrl?: string | URL | null
}

export default RunPipelineOptions
