import registerWebworker from 'webworker-promise/lib/register'

import mimeToIO from '../MimeToMeshIO'
import getFileExtension from '../getFileExtension'
import extensionToIO from '../extensionToMeshIO'
import MeshIOIndex from '../MeshIOIndex'
import loadEmscriptenModule from '../loadEmscriptenModuleBrowser'

import readMeshEmscriptenFSFile from '../readMeshEmscriptenFSFile'
import writeMeshEmscriptenFSFile from '../writeMeshEmscriptenFSFile'

// To cache loaded io modules
let ioToModule = {}

async function readMesh(input) {
  const extension = getFileExtension(input.name)
  const mountpoint = '/work'

  let io = null
  if (mimeToIO.has(input.type)) {
    io = mimeToIO.get(input.type)
  } else if (extensionToIO.has(extension)) {
    io = extensionToIO.get(extension)
  } else {
    for (let idx = 0; idx < MeshIOIndex.length; ++idx) {
      let ioModule = null
      const trialIO = MeshIOIndex[idx]
      if (trialIO in ioToModule) {
        ioModule = ioToModule[trialIO]
      } else {
        ioToModule[trialIO] = await loadEmscriptenModule(input.config.itkModulesPath, 'MeshIOs', trialIO)
        ioModule = ioToModule[trialIO]
      }
      const meshIO = new ioModule.ITKMeshIO()
      const blob = new Blob([input.data])
      const blobs = [{ name: input.name, data: blob }]
      ioModule.mountBlobs(mountpoint, blobs)
      const filePath = mountpoint + '/' + input.name
      meshIO.SetFileName(filePath)
      if (meshIO.CanReadFile(filePath)) {
        io = trialIO
        ioModule.unmountBlobs(mountpoint)
        break
      }
      ioModule.unmountBlobs(mountpoint)
    }
  }
  if (io === null) {
    ioToModule = {}
    return new Error('Could not find IO for: ' + input.name)
  }

  let ioModule = null
  if (io in ioToModule) {
    ioModule = ioToModule[io]
  } else {
    ioToModule[io] = await loadEmscriptenModule(input.config.itkModulesPath, 'MeshIOs', io)
    ioModule = ioToModule[io]
  }

  const blob = new Blob([input.data])
  const blobs = [{ name: input.name, data: blob }]
  ioModule.mountBlobs(mountpoint, blobs)
  const filePath = mountpoint + '/' + input.name
  const mesh = readMeshEmscriptenFSFile(ioModule, filePath)
  ioModule.unmountBlobs(mountpoint)

  const transferables = []
  if (mesh.points) {
    transferables.push(mesh.points.buffer)
  }
  if (mesh.pointData) {
    transferables.push(mesh.pointData.buffer)
  }
  if (mesh.cells) {
    transferables.push(mesh.cells.buffer)
  }
  if (mesh.cellData) {
    transferables.push(mesh.cellData.buffer)
  }
  return new registerWebworker.TransferableResponse(mesh, transferables)
}

async function writeMesh(input) {
  const extension = getFileExtension(input.name)
  const mountpoint = '/work'

  let io = null
  if (mimeToIO.has(input.type)) {
    io = mimeToIO.get(input.type)
  } else if (extensionToIO.has(extension)) {
    io = extensionToIO.get(extension)
  } else {
    for (let idx = 0; idx < MeshIOIndex.length; ++idx) {
      let ioModule = null
      const trialIO = MeshIOIndex[idx]
      if (trialIO in ioToModule) {
        ioModule = ioToModule[trialIO]
      } else {
        ioToModule[trialIO] = await loadEmscriptenModule(input.config.itkModulesPath, 'MeshIOs', trialIO)
        ioModule = ioToModule[trialIO]
      }
      const meshIO = new ioModule.ITKMeshIO()
      const filePath = mountpoint + '/' + input.name
      meshIO.SetFileName(filePath)
      if (meshIO.CanWriteFile(filePath)) {
        io = trialIO
        break
      }
    }
  }
  if (io === null) {
    ioToModule = {}
    return new Error('Could not find IO for: ' + input.name)
  }

  let ioModule = null
  if (io in ioToModule) {
    ioModule = ioToModule[io]
  } else {
    ioToModule[io] = await loadEmscriptenModule(input.config.itkModulesPath, 'MeshIOs', io)
    ioModule = ioToModule[io]
  }

  const filePath = mountpoint + '/' + input.name
  ioModule.mkdirs(mountpoint)
  writeMeshEmscriptenFSFile(ioModule,
    { useCompression: input.useCompression, binaryFileType: input.binaryFileType },
    input.mesh, filePath)
  const writtenFile = ioModule.readFile(filePath, { encoding: 'binary' })

  return new registerWebworker.TransferableResponse(writtenFile.buffer, [writtenFile.buffer])
}

registerWebworker(function (input) {
  if (input.operation === 'readMesh') {
    return readMesh(input)
  } else if (input.operation === 'writeMesh') {
    return writeMesh(input)
  } else {
    return Promise.resolve(new Error('Unknown worker operation'))
  }
})
