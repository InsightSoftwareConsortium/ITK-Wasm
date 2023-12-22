import { Image, WorkerPoolFunctionResult } from 'itk-wasm'

interface ReadImageResult extends WorkerPoolFunctionResult {
  image: Image
}

export default ReadImageResult
