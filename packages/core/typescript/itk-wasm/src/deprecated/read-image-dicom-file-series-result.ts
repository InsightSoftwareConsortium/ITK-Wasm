import Image from '../interface-types/image.js'
import WorkerPool from '../worker-pool/worker-pool.js'

interface ReadImageDicomFileSeriesResult {
  /** WebWorkerPool used for computation */
  webWorkerPool: WorkerPool | null

  /** Output image volume */
  outputImage: Image

  /** Output sorted filenames */
  sortedFilenames: Object

}

export default ReadImageDicomFileSeriesResult
