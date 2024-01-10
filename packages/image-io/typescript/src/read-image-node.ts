import path from 'path'
import mime from 'mime-types'

import {
  Image,
  getFileExtension,
  castImage,
} from 'itk-wasm'

import mimeToImageIo from './mime-to-image-io.js'
import extensionToImageIo from './extension-to-image-io.js'
import imageIoIndexNode from './image-io-index-node.js'

import ReadImageNodeOptions from './read-image-node-options.js'

interface ReaderResult {
  couldRead: boolean,
  image: Image
}
interface ReaderOptions {
  /** Only read image metadata -- do not read pixel data. */
  informationOnly?: boolean
}
type Reader = (serializedImage: string, options: ReaderOptions) => Promise<ReaderResult>


/**
 * Read an image file format and convert it to the itk-wasm file format
 *
 * @param {string} serializedImage - Path to input image serialized in the file format
 * @param {ReadImageNodeOptions} options - options to cast resulting image type or to only read image metadata
 *
 * @returns {Promise<Image>} - Image result
 */
async function readImageNode(
  serializedImage: string,
  options: ReadImageNodeOptions = {}
) : Promise<Image> {

  const absoluteFilePath = path.resolve(serializedImage)
  const mimeType = mime.lookup(absoluteFilePath)
  const extension = getFileExtension(absoluteFilePath)

  let io = null
  if (mimeType && mimeToImageIo.has(mimeType)) {
    io = mimeToImageIo.get(mimeType)
  } else if (extensionToImageIo.has(extension)) {
    io = extensionToImageIo.get(extension)
  } else {
    for (const readerWriter of imageIoIndexNode.values()) {
      if (readerWriter[0] !== null) {
        let { couldRead, image } = await (readerWriter[0] as Reader)(absoluteFilePath, { informationOnly: options.informationOnly })
        if (couldRead) {
          if (typeof options !== 'undefined') {
            image = castImage(image, options)
          }
          return image
        }
      }
    }
  }
  if (io === null ) {
    throw Error('Could not find IO for: ' + absoluteFilePath)
  }
  const readerWriter = imageIoIndexNode.get(io as string)

  const reader = (readerWriter as Array<Reader>)[0]
  let { couldRead, image } = await reader(absoluteFilePath, { informationOnly: options.informationOnly })
  if (!couldRead) {
    throw Error('Could not read: ' + absoluteFilePath)
  }

  if (typeof options !== 'undefined') {
    image = castImage(image, options)
  }

  return image
}

export default readImageNode
