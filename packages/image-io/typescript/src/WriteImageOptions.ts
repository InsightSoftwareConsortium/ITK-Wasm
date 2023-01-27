import { CastImageOptions } from 'itk-wasm'

interface WriteImageOptions extends CastImageOptions {
  useCompression?: boolean
  mimeType?: boolean
}

export default WriteImageOptions
