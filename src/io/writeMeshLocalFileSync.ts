import path from 'path'
import mime from 'mime-types'

import mimeToIO from './internal/MimeToMeshIO.js'
import getFileExtension from './getFileExtension.js'
import extensionToIO from './internal/extensionToMeshIO.js'
import MeshIOIndex from './internal/MeshIOIndex.js'

import loadEmscriptenModule from '../core/internal/loadEmscriptenModuleNode.js'
import writeMeshEmscriptenFSFile from './internal/writeMeshEmscriptenFSFile.js'
import MeshIOBaseEmscriptenModule from './internal/MeshIOBaseEmscriptenModule.js'

import WriteMeshOptions from './WriteMeshOptions.js'

import Mesh from '../core/Mesh.js'

/**
 * Write a mesh to a file on the local filesystem in Node.js.
 *
 * @param: useCompression compression the pixel data when possible
 * @param: binaryFileType write in an binary as opposed to a ascii format, if
 * possible
 * @param: mesh itk.Mesh instance to write
 * @param: filePath path to the file on the local filesystem.
 *
 * @return null
 */
function writeMeshLocalFileSync(options: WriteMeshOptions, mesh: Mesh, filePath: string): null {
  const meshIOsPath = path.resolve(__dirname, 'MeshIOs')
  const absoluteFilePath = path.resolve(filePath)
  const mimeType = mime.lookup(absoluteFilePath)
  const extension = getFileExtension(absoluteFilePath)

  let io = null
  if (mimeToIO.has(mimeType)) {
    io = mimeToIO.get(mimeType)
  } else if (extensionToIO.has(extension)) {
    io = extensionToIO.get(extension)
  } else {
    for (let idx = 0; idx < MeshIOIndex.length; ++idx) {
      const modulePath = path.join(meshIOsPath, MeshIOIndex[idx])
      const Module = loadEmscriptenModule(modulePath) as MeshIOBaseEmscriptenModule
      const meshIO = new Module.ITKMeshIO()
      const mountedFilePath = Module.mountContainingDirectory(absoluteFilePath)
      meshIO.SetFileName(mountedFilePath)
      if (meshIO.CanWriteFile(mountedFilePath)) {
        io = MeshIOIndex[idx]
        Module.unmountContainingDirectory(mountedFilePath)
        break
      }
      Module.unmountContainingDirectory(mountedFilePath)
    }
  }
  if (io === null) {
    throw Error('Could not find IO for: ' + absoluteFilePath)
  }

  const modulePath = path.join(meshIOsPath, io as string)
  const Module = loadEmscriptenModule(modulePath) as MeshIOBaseEmscriptenModule
  const mountedFilePath = Module.mountContainingDirectory(absoluteFilePath)
  let useCompression = false
  if(typeof options.useCompression !== 'undefined') {
    useCompression = options.useCompression
  }
  let binaryFileType = false
  if(typeof options.binaryFileType !== 'undefined') {
    binaryFileType = options.binaryFileType
  }
  writeMeshEmscriptenFSFile(Module, { useCompression, binaryFileType }, mesh, mountedFilePath)
  Module.unmountContainingDirectory(mountedFilePath)
  return null
}

export default writeMeshLocalFileSync
