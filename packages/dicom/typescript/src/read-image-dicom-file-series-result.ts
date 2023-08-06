import { Image, WorkerPool } from 'itk-wasm'

interface ReadImageDicomFileSeriesResult {
  /** WebWorkerPool used for computation */
  webWorkerPool: WorkerPool | null

  /** Output image volume */
  outputImage: Image

  /** Output sorted filenames */
  sortedFilenames: Object

}

export default ReadImageDicomFileSeriesResult
