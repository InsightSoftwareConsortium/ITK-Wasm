import fs from 'fs'
import path from 'path'
import mime from 'mime-types'

import mimeToIO from './internal/MimeToMeshIO.js'
import getFileExtension from './getFileExtension.js'
import extensionToIO from './internal/extensionToMeshIO.js'
import MeshIOIndex from './internal/MeshIOIndex.js'

import loadEmscriptenModule from '../core/internal/loadEmscriptenModuleNode.js'
import writeMeshEmscriptenFSFile from './internal/writeMeshEmscriptenFSFile.js'
import WriteMeshOptions from './WriteMeshOptions.js'
import Mesh from '../core/Mesh.js'
import MeshIOBaseEmscriptenModule from './internal/MeshIOBaseEmscriptenModule.js'
import localPathRelativeToModule from './localPathRelativeToModule.js'

/**
 * Write a mesh to a file on the local filesystem in Node.js.
 *
 * @param: useCompression compression the pixel data when possible
 * @param: binaryFileType write in an binary as opposed to a ascii format, if
 * possible
 * @param: mesh itk.Mesh instance to write
 * @param: filePath path to the file on the local filesystem.
 *
 * @return empty Promise
 */
async function writeMeshLocalFile(options: WriteMeshOptions, mesh: Mesh, filePath: string): Promise<null> {
  const meshIOsPath = localPathRelativeToModule(import.meta.url, '../mesh-io')
  const absoluteFilePath = path.resolve(filePath)
  const mimeType = mime.lookup(absoluteFilePath)
  const extension = getFileExtension(absoluteFilePath)

  let useCompression = false
  if(typeof options.useCompression !== 'undefined') {
    useCompression = options.useCompression
  }
  let binaryFileType = false
  if(typeof options.binaryFileType !== 'undefined') {
    binaryFileType = options.binaryFileType
  }
  let io = null
  if (mimeToIO.has(mimeType)) {
    io = mimeToIO.get(mimeType)
  } else if (extensionToIO.has(extension)) {
    io = extensionToIO.get(extension)
  } else {
    for (let idx = 0; idx < MeshIOIndex.length; ++idx) {
      const modulePath = path.join(meshIOsPath, MeshIOIndex[idx] + '.js')
      const Module = await loadEmscriptenModule(modulePath) as MeshIOBaseEmscriptenModule
      const meshIO = new Module.ITKMeshIO()
      const mountedFilePath = Module.mountContainingDir(absoluteFilePath)
      meshIO.SetFileName(mountedFilePath)
      if (meshIO.CanWriteFile(mountedFilePath)) {
        io = MeshIOIndex[idx]
        Module.unmountContainingDir(mountedFilePath)
        break
      }
      Module.unmountContainingDir(mountedFilePath)
    }
  }
  if (io === null) {
    throw Error('Could not find IO for: ' + absoluteFilePath)
  }

  const modulePath = path.join(meshIOsPath, io as string + '.js')
  const Module = await loadEmscriptenModule(modulePath) as MeshIOBaseEmscriptenModule
  const mountedFilePath = Module.mountContainingDir(absoluteFilePath)
  writeMeshEmscriptenFSFile(Module, { useCompression, binaryFileType }, mesh, mountedFilePath)
  Module.unmountContainingDir(mountedFilePath)
  return null
}

export default writeMeshLocalFile
