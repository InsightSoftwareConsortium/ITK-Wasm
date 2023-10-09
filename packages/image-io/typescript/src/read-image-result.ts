import { Image } from 'itk-wasm'

interface ReadImageResult {
  image: Image
  webWorker: Worker
}

export default ReadImageResult
