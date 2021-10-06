import fs from 'fs'
import path from 'path'
import mime from 'mime-types'

import mimeToIO from './internal/MimeToImageIO.js'
import getFileExtension from './getFileExtension.js'
import extensionToIO from './internal/extensionToImageIO.js'
import ImageIOIndex from './internal/ImageIOIndex.js'

import loadEmscriptenModule from '../core/internal/loadEmscriptenModuleNode.js'
import writeImageEmscriptenFSFile from './internal/writeImageEmscriptenFSFile.js'
import ImageIOBaseEmscriptenModule from './internal/ImageIOBaseEmscriptenModule.js'

import Image from '../core/Image.js'
import localPathRelativeToModule from './localPathRelativeToModule.js'

/**
 * Write an image to a file on the local filesystem in Node.js.
 *
 * @param: useCompression compression the pixel data when possible
 * @param: image itk.Image instance to write
 * @param: filePath path to the file on the local filesystem.
 *
 * @return Promise<null>
 */
async function writeImageLocalFile(useCompression: boolean, image: Image, filePath: string): Promise<null> {
  const imageIOsPath = localPathRelativeToModule(import.meta.url, '../image-io')
  const absoluteFilePath = path.resolve(filePath)
  const mimeType = mime.lookup(absoluteFilePath)
  const extension = getFileExtension(absoluteFilePath)

  let io = null
  if (mimeType && mimeToIO.has(mimeType)) {
    io = mimeToIO.get(mimeType)
  } else if (extensionToIO.has(extension)) {
    io = extensionToIO.get(extension)
  } else {
    for (let idx = 0; idx < ImageIOIndex.length; ++idx) {
      const modulePath = path.join(imageIOsPath, ImageIOIndex[idx] + '.js')
      const wasmBinary = fs.readFileSync(path.join(imageIOsPath, ImageIOIndex[idx] + '.wasm'))
      const Module = await loadEmscriptenModule(modulePath, wasmBinary) as ImageIOBaseEmscriptenModule
      const imageIO = new Module.ITKImageIO()
      const mountedFilePath = Module.mountContainingDir(absoluteFilePath)
      imageIO.SetFileName(mountedFilePath)
      if (imageIO.CanWriteFile(mountedFilePath)) {
        io = ImageIOIndex[idx]
        Module.unmountContainingDir(mountedFilePath)
        break
      }
      Module.unmountContainingDir(mountedFilePath)
    }
  }
  if (io === null) {
    throw Error('Could not find IO for: ' + absoluteFilePath)
  }

  const modulePath = path.join(imageIOsPath, io as string + '.js')
  const wasmBinary = fs.readFileSync(path.join(imageIOsPath, io as string + '.wasm'))
  const Module = await loadEmscriptenModule(modulePath, wasmBinary) as ImageIOBaseEmscriptenModule
  const mountedFilePath = Module.mountContainingDir(absoluteFilePath)
  writeImageEmscriptenFSFile(Module, useCompression, image, mountedFilePath)
  Module.unmountContainingDir(mountedFilePath)
  return null
}

export default writeImageLocalFile
