import Image from '../core/interface-types/image.js'
import WorkerPool from '../core/WorkerPool.js'

interface ReadImageFileSeriesResult {
  image: Image
  webWorkerPool: WorkerPool
}

export default ReadImageFileSeriesResult
