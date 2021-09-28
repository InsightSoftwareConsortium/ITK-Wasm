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

/**
 * Write an image to a file on the local filesystem in Node.js.
 *
 * @param: useCompression compression the pixel data when possible
 * @param: image itk.Image instance to write
 * @param: filePath path to the file on the local filesystem.
 *
 * @return Promise<null>
 */
function writeImageLocalFile(useCompression: boolean, image: Image, filePath: string): Promise<null> {
  return new Promise(function (resolve, reject) {
    const imageIOsPath = path.resolve(__dirname, 'ImageIOs')
    const absoluteFilePath = path.resolve(filePath)
    try {
      const mimeType = mime.lookup(absoluteFilePath)
      const extension = getFileExtension(absoluteFilePath)

      let io = null
      if (mimeType && mimeToIO.has(mimeType)) {
        io = mimeToIO.get(mimeType)
      } else if (extensionToIO.has(extension)) {
        io = extensionToIO.get(extension)
      } else {
        for (let idx = 0; idx < ImageIOIndex.length; ++idx) {
          const modulePath = path.join(imageIOsPath, ImageIOIndex[idx])
          const Module = loadEmscriptenModule(modulePath) as ImageIOBaseEmscriptenModule
          const imageIO = new Module.ITKImageIO()
          const mountedFilePath = Module.mountContainingDirectory(absoluteFilePath)
          imageIO.SetFileName(mountedFilePath)
          if (imageIO.CanWriteFile(mountedFilePath)) {
            io = ImageIOIndex[idx]
            Module.unmountContainingDirectory(mountedFilePath)
            break
          }
          Module.unmountContainingDirectory(mountedFilePath)
        }
      }
      if (io === null) {
        reject(Error('Could not find IO for: ' + absoluteFilePath))
      }

      const modulePath = path.join(imageIOsPath, io as string)
      const Module = loadEmscriptenModule(modulePath) as ImageIOBaseEmscriptenModule
      const mountedFilePath = Module.mountContainingDirectory(absoluteFilePath)
      writeImageEmscriptenFSFile(Module, useCompression, image, mountedFilePath)
      Module.unmountContainingDirectory(mountedFilePath)
      resolve(null)
    } catch (err) {
      reject(err)
    }
  })
}

export default writeImageLocalFile
