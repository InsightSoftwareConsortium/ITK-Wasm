// @ts-nocheck

import ReadImageResult from './read-image-result.js'
import ReadImageArrayBufferOptions from './read-image-array-buffer-options.js'

/**
 * @deprecated Use readImageBlob from @itk-wasm/image-io instead
 */
async function readImageBlob (webWorker: Worker | null, blob: Blob, fileName: string, options?: ReadImageArrayBufferOptions | string): Promise<ReadImageResult> {
  throw new Error('readImageBlob is deprecated. Use readImage from @itk-wasm/image-io instead.')
}

export default readImageBlob
