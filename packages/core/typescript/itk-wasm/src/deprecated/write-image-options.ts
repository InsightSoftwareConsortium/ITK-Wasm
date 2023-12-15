import CastImageOptions from '../cast-image-options.js'

interface WriteImageOptions extends CastImageOptions {
  useCompression?: boolean
  mimeType?: boolean
}

export default WriteImageOptions
