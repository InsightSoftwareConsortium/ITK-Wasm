interface RunPipelineOptions {
  /** webWorker to use for computation. Can be an existing worker, null to create a new worker, or `false` to run in the current thread. */
  webWorker?: Worker | null | boolean

  /** Url where WebAssembly pipelines are hosted. */
  pipelineBaseUrl?: string | URL

  /** Query params to use when requesting for WebAssembly pipelines */
  pipelineQueryParams?: Record<string, string>

  /** Url where the pipeline web worker is hosted. */
  pipelineWorkerUrl?: string | URL | null

  /** When SharedArrayBuffer's are not available, do not copy inputs. */
  noCopy?: boolean
}

export default RunPipelineOptions
