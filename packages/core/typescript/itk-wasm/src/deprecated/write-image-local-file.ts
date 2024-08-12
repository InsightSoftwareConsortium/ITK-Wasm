// @ts-nocheck

import WriteImageOptions from './write-image-options.js'

import Image from '../interface-types/image.js'

/**
 * @deprecated Use writeImageNode from @itk-wasm/image-io instead
 */
async function writeImageLocalFile (image: Image, filePath: string, options?: WriteImageOptions | boolean
): Promise<null> {
  throw new Error('writeImageLocalFile is deprecated. Use writeImageNode from @itk-wasm/image-io instead.')
}

export default writeImageLocalFile
