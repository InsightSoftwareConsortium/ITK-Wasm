interface WorkerPoolFunctionOption {
  /** WebWorker used for computation */
  webWorker?: Worker | null | boolean

  /** When SharedArrayBuffer's are not available, do not copy inputs. */
  noCopy?: boolean
}

export default WorkerPoolFunctionOption
