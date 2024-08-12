// @ts-nocheck

import ReadImageResult from './read-image-result.js'
import ReadImageArrayBufferOptions from './read-image-array-buffer-options.js'

/**
 * @deprecated Use readImageArrayBuffer from @itk-wasm/image-io instead
 */
async function readImageArrayBuffer (webWorker: Worker | null, arrayBuffer: ArrayBuffer, fileName: string, options?: ReadImageArrayBufferOptions | string): Promise<ReadImageResult> {
  throw new Error('readImageArrayBuffer is deprecated. Use readImage from @itk-wasm/image-io instead.')
}

export default readImageArrayBuffer
