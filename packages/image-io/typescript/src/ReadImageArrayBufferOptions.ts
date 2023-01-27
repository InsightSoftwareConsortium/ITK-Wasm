import { CastImageOptions } from 'itk-wasm'

interface ReadImageArrayBufferOptions extends CastImageOptions {
  mimeType?: string
}

export default ReadImageArrayBufferOptions
