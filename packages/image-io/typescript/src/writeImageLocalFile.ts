import path from 'path'
import mime from 'mime-types'

import { getExtension, loadEmscriptenModule, runPipelineEmscripten, PipelineEmscriptenModule, InterfaceTypes, PipelineInput, PipelineOutput, castImage, Image } from 'itk-wasm'

import mimeToIO from './internal/MimeToImageIO.js'
import extensionToIO from './extensionToImageIO.js'
import ImageIOIndex from './internal/ImageIOIndex.js'

import findLocalImageIOPath from './internal/findLocalImageIOPath.js'
import WriteImageOptions from './WriteImageOptions.js'

async function writeImageLocalFile (image: Image, filePath: string, options?: WriteImageOptions | boolean
): Promise<null> {
  if (typeof image === 'boolean') {
    throw new Error('useCompression is now the last argument in itk-wasm')
  }

  let useCompression = false
  if (typeof options === 'boolean') {
    useCompression = options
  }
  if (typeof options === 'object' && typeof options.useCompression !== 'undefined') {
    useCompression = options.useCompression
  }

  const imageIOsPath = findLocalImageIOPath()
  const absoluteFilePath = path.resolve(filePath)
  const mimeType = mime.lookup(absoluteFilePath)
  const extension = getFileExtension(absoluteFilePath)

  const args = ['0', absoluteFilePath, '--memory-io', '--quiet']
  if (useCompression) {
    args.push('--use-compression')
  }
  const desiredOutputs = [
  ] as PipelineOutput[]
  let inputImage = image
  if (typeof options === 'object' && (typeof options.componentType !== 'undefined' || typeof options.pixelType !== 'undefined')) {
    inputImage = castImage(image, options)
  }
  const inputs = [
    { type: InterfaceTypes.Image, data: inputImage }
  ] as PipelineInput[]

  let io = null
  if (mimeType !== false && mimeToIO.has(mimeType)) {
    io = mimeToIO.get(mimeType)
  } else if (extensionToIO.has(extension)) {
    io = extensionToIO.get(extension)
  } else {
    for (let idx = 0; idx < ImageIOIndex.length; ++idx) {
      const modulePath = path.join(imageIOsPath, ImageIOIndex[idx] + '-write-image.js')
      const writeImageModule = await loadEmscriptenModule(modulePath) as PipelineEmscriptenModule
      const mountedFilePath = writeImageModule.mountContainingDir(absoluteFilePath)
      const { returnValue } = runPipelineEmscripten(writeImageModule, args, desiredOutputs, inputs)
      writeImageModule.unmountContainingDir(mountedFilePath)
      if (returnValue === 0) {
        return null
      }
    }
  }
  if (io === null) {
    throw Error('Could not find IO for: ' + absoluteFilePath)
  }

  const modulePath = path.join(imageIOsPath, io as string + '-write-image.js')
  const writeImageModule = await loadEmscriptenModule(modulePath) as PipelineEmscriptenModule
  const mountedFilePath = writeImageModule.mountContainingDir(absoluteFilePath)
  runPipelineEmscripten(writeImageModule, args, desiredOutputs, inputs)
  writeImageModule.unmountContainingDir(mountedFilePath)
  return null
}

export default writeImageLocalFile
