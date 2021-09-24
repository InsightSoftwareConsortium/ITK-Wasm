import Image from "../core/Image.js"
import WorkerPool from "../core/WorkerPool.js"

interface ReadImageResult {
  image: Image
  webWorkerPool: WorkerPool
}

export default ReadImageResult
