import { BinaryFile, WorkerPoolFunctionOption, WorkerPool } from 'itk-wasm'

interface ReadImageDicomFileSeriesOptions extends WorkerPoolFunctionOption {
  /** File names in the series */
  inputImages: string[] | File[] | BinaryFile[]

  /** The input files are a single sorted series */
  singleSortedSeries?: boolean

  /** Web worker pool */
  webWorkerPool?: null | WorkerPool,
}

export default ReadImageDicomFileSeriesOptions
