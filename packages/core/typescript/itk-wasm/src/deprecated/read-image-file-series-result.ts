import Image from '../interface-types/image.js'
import WorkerPool from '../worker-pool/worker-pool.js'

interface ReadImageFileSeriesResult {
  image: Image
  webWorkerPool: WorkerPool
}

export default ReadImageFileSeriesResult
