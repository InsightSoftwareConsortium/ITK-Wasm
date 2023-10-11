import path from 'path'

import {
  Image,
  getFileExtension,
  castImage,
} from 'itk-wasm'

import mimeToImageIo from './mime-to-image-io.js'
import extensionToImageIo from './extension-to-image-io.js'
import imageIoIndexNode from './image-io-index-node.js'

import WriteImageOptions from './write-image-options.js'

interface WriterOptions {
  useCompression?: boolean
}
interface WriterResult {
  couldWrite: boolean
}
type Writer = (image: Image, serializedImage: string, options: WriterOptions) => Promise<WriterResult>


/**
 * Write an image to a serialized file format and from an the itk-wasm Image
 *
 * @param {Image} image - Input image
 * @param {string} serializedImage - Output image serialized in the file format.
 * @param {WriteImageOptions} options - options object
 *
 * @returns {void} - result object
 */
async function writeImageNode(
  image: Image,
  serializedImage: string,
  options: WriteImageOptions = {}
) : Promise<void> {
  const absoluteFilePath = path.resolve(serializedImage)
  const mimeType = options.mimeType
  const extension = getFileExtension(absoluteFilePath)

  let inputImage = image
  if (typeof options.componentType !== 'undefined' || typeof options.pixelType !== 'undefined') {
    inputImage = castImage(image, { componentType: options.componentType, pixelType: options.pixelType })
  }

  let io = null
  if (typeof mimeType !== 'undefined' && mimeToImageIo.has(mimeType)) {
    io = mimeToImageIo.get(mimeType)
  } else if (extensionToImageIo.has(extension)) {
    io = extensionToImageIo.get(extension)
  } else {
    for (const readerWriter of imageIoIndexNode.values()) {
      if (readerWriter[1] !== null) {
        let { couldWrite } = await (readerWriter[1] as Writer)(inputImage, absoluteFilePath, { useCompression: options.useCompression })
        if (couldWrite) {
          return
        }
      }
    }
  }
  if (io === null ) {
    throw Error('Could not find IO for: ' + absoluteFilePath)
  }
  const readerWriter = imageIoIndexNode.get(io as string)

  const writer = (readerWriter as Array<Writer>)[1]
  let { couldWrite } = await writer(inputImage, absoluteFilePath, { useCompression: options.useCompression })
  if (!couldWrite) {
    throw Error('Could not write: ' + absoluteFilePath)
  }
}

export default writeImageNode
