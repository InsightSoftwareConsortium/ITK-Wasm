// @ts-nocheck

import ReadImageResult from './read-image-result.js'

import CastImageOptions from '../cast-image-options.js'

/**
 * @deprecated Use readImage from @itk-wasm/image-io instead
 */
async function readImageFile (webWorker: Worker | null, file: File, options?: CastImageOptions): Promise<ReadImageResult> {
  throw new Error('readImageFile is deprecated. Use readImage from @itk-wasm/image-io instead.')
}

export default readImageFile
