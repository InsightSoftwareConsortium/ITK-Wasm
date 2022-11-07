import CastImageOptions from '../core/CastImageOptions.js'

interface WriteImageOptions extends CastImageOptions {
  useCompression?: boolean
  mimeType?: boolean
}

export default WriteImageOptions
