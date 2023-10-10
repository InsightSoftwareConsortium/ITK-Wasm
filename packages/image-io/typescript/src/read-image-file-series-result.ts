import { Image, WorkerPool } from 'itk-wasm'

interface ReadImageFileSeriesResult {
  image: Image
  webWorkerPool: WorkerPool
}

export default ReadImageFileSeriesResult
