// @ts-nocheck

import Image from '../interface-types/image.js'

import WriteImageOptions from './write-image-options.js'
import WriteArrayBufferResult from './write-array-buffer-result.js'

/**
 * @deprecated Use writeImage from @itk-wasm/image-io instead
 */
async function writeImageArrayBuffer (webWorker: Worker | null, image: Image, fileName: string, options?: WriteImageOptions | string, useCompressionBackwardsCompatibility?: boolean
): Promise<WriteArrayBufferResult> {
  throw new Error('writeImageArrayBuffer is deprecated. Use writeImage from @itk-wasm/image-io instead.')
}

export default writeImageArrayBuffer
