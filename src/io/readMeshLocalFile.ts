import fs from 'fs'
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
import localPathRelativeToModule from './localPathRelativeToModule.js'

async function readMeshLocalFile (filePath: string): Promise<Mesh> {
  const meshIOsPath = localPathRelativeToModule(import.meta.url, '../mesh-io')
  if (!fs.existsSync(meshIOsPath)) {
    throw Error("Cannot find path to itk mesh IO's")
  }
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
      const modulePath = path.join(meshIOsPath, MeshIOIndex[idx] + '.js')
      const Module = await loadEmscriptenModule(modulePath) as MeshIOBaseEmscriptenModule
      const meshIO = new Module.ITKMeshIO()
      const mountedFilePath = Module.mountContainingDir(absoluteFilePath)
      meshIO.SetFileName(mountedFilePath)
      if (meshIO.CanReadFile(mountedFilePath)) {
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
  const mesh = readMeshEmscriptenFSFile(Module, mountedFilePath)
  Module.unmountContainingDir(mountedFilePath)
  return mesh
}

export default readMeshLocalFile
