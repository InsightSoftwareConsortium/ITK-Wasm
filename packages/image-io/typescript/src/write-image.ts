import {
  Image,
  BinaryFile,
  castImage,
  copyImage,
  getFileExtension,
} from 'itk-wasm'

import mimeToImageIo from './mime-to-image-io.js'
import extensionToImageIo from './extension-to-image-io.js'
import imageIoIndex from './image-io-index.js'
import WriteImageOptions from './write-image-options.js'
import WriteImageResult from './write-image-result.js'

interface WriterOptions {
  informationOnly?: boolean
  useCompression?: boolean
  /** WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. */
  webWorker?: Worker | null | boolean
}
interface WriterResult {
  webWorker: Worker
  couldWrite: boolean
  serializedImage: BinaryFile
}
type Writer = (image: Image, serializedImage: string, options: WriterOptions) => Promise<WriterResult>

/**
 * Write an itk-wasm Image converted to an serialized image file format
 *
 * @param {Image} image - Input image
 * @param {string} serializedImage - Output image serialized in the file format.
 * @param {WriteImageOptions} options - options object
 *
 * @returns {Promise<WriteImageResult>} - result object
 */
async function writeImage(
  image: Image,
  serializedImage: string,
  options: WriteImageOptions = {}
) : Promise<WriteImageResult> {

  let inputImage = image
  if (typeof options.componentType !== 'undefined' || typeof options.pixelType !== 'undefined') {
    inputImage = castImage(image, options)
  }

  const mimeType = options.mimeType
  const extension = getFileExtension(serializedImage).toLowerCase()
  let usedWebWorker = options.webWorker

  let io = null
  if (typeof mimeType !== 'undefined' && mimeToImageIo.has(mimeType)) {
    io = mimeToImageIo.get(mimeType)
  } else if (extensionToImageIo.has(extension)) {
    io = extensionToImageIo.get(extension)
  } else {
    for (const readerWriter of imageIoIndex.values()) {
      if (readerWriter[1] !== null) {
        let { webWorker: testWebWorker, couldWrite, serializedImage: serializedImageBuffer } = await (readerWriter[1] as unknown as Writer)(copyImage(inputImage), serializedImage, options)
        usedWebWorker = testWebWorker
        if (couldWrite) {
          return { webWorker: usedWebWorker as Worker, serializedImage: serializedImageBuffer }
        }
      }
    }
  }
  if (!io) {
    throw Error('Could not find IO for: ' + serializedImage)
  }
  const readerWriter = imageIoIndex.get(io as string)

  const writer = (readerWriter as Array<Writer>)[1]
  let { webWorker: testWebWorker, couldWrite, serializedImage: serializedImageBuffer } = await writer(inputImage, serializedImage, options)
  usedWebWorker = testWebWorker
  if (!couldWrite) {
    throw Error('Could not write: ' + serializedImage)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    serializedImage: serializedImageBuffer
  }
  return result
}

export default writeImage
