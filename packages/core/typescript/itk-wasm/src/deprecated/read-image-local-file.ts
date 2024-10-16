// @ts-nocheck

import Image from '../interface-types/image.js'

import CastImageOptions from '../cast-image-options.js'

/**
 * @deprecated Use readImageNode from @itk-wasm/image-io instead
 */
async function readImageLocalFile (filePath: string, options?: CastImageOptions): Promise<Image> {
  throw new Error('readImageLocalFile is deprecated. Use readImageNode from @itk-wasm/image-io instead.')
}

export default readImageLocalFile
