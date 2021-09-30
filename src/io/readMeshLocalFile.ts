import path from 'path'
import mime from 'mime-types'

import mimeToIO from './internal/MimeToMeshIO.js'
import getFileExtension from './getFileExtension.js'
import extensionToIO from './internal/extensionToMeshIO.js'
import MeshIOIndex from './internal/MeshIOIndex.js'

import Mesh from '../core/Mesh.js'

import loadEmscriptenModule from './../core/internal/loadEmscriptenModuleNode.js'
import readMeshEmscriptenFSFile from './internal/readMeshEmscriptenFSFile.js'
import MeshIOBaseEmscriptenModule from './internal/MeshIOBaseEmscriptenModule.js'

function readMeshLocalFile(filePath: string): Promise<Mesh> {
  return new Promise(function (resolve, reject) {
    const meshIOsPath = path.resolve(__dirname, 'mesh-io')
    const absoluteFilePath = path.resolve(filePath)
    try {
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
          if (meshIO.CanReadFile(mountedFilePath)) {
            io = MeshIOIndex[idx]
            Module.unmountContainingDirectory(mountedFilePath)
            break
          }
          Module.unmountContainingDirectory(mountedFilePath)
        }
      }
      if (io === null) {
        reject(Error('Could not find IO for: ' + absoluteFilePath))
      }

      const modulePath = path.join(meshIOsPath, io as string)
      const Module = loadEmscriptenModule(modulePath) as MeshIOBaseEmscriptenModule
      const mountedFilePath = Module.mountContainingDirectory(absoluteFilePath)
      const mesh = readMeshEmscriptenFSFile(Module, mountedFilePath)
      Module.unmountContainingDirectory(mountedFilePath)
      resolve(mesh)
    } catch (err) {
      reject(err)
    }
  })
}

export default readMeshLocalFile
