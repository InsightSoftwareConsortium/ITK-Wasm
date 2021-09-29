import registerWebworker from 'webworker-promise/lib/register.js'

import mimeToIO from '../io/internal/MimeToMeshIO.js'
import getFileExtension from '../io/getFileExtension.js'
import extensionToIO from '../io/internal/extensionToMeshIO.js'
import MeshIOIndex from '../io/internal/MeshIOIndex.js'
import loadEmscriptenModule from '../core/internal/loadEmscriptenModuleBrowser.js'

import readMeshEmscriptenFSFile from '../io/internal/readMeshEmscriptenFSFile.js'
import writeMeshEmscriptenFSFile from '../io/internal/writeMeshEmscriptenFSFile.js'

import MeshIOBaseEmscriptenModule from '../io/internal/MeshIOBaseEmscriptenModule.js'

import Mesh from '../core/Mesh.js'

interface Input {
  operation: 'readMesh' | 'writeMesh'
  config: { itkModulesPath: string }
}

interface ReadMeshInput extends Input {
  name: string
  type: string
  data: ArrayBuffer
}

interface WriteMeshInput extends Input {
  name: string
  type: string
  mesh: Mesh
  useCompression: boolean
  binaryFileType: boolean
}

// To cache loaded io modules
const ioToModule: Map<string,MeshIOBaseEmscriptenModule> = new Map()

async function readMesh (input: ReadMeshInput) {
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
      if (ioToModule.has(trialIO)) {
        ioModule = ioToModule.get(trialIO) as MeshIOBaseEmscriptenModule
      } else {
        ioToModule.set(trialIO, loadEmscriptenModule(input.config.itkModulesPath, 'MeshIOs', trialIO, false) as MeshIOBaseEmscriptenModule)
        ioModule = ioToModule.get(trialIO) as MeshIOBaseEmscriptenModule
      }
      const meshIO = new ioModule.ITKMeshIO()
      ioModule.mkdirs(mountpoint)
      const filePath = `${mountpoint}/${input.name}`
      ioModule.writeFile(filePath, new Uint8Array(input.data))
      meshIO.SetFileName(filePath)
      if (meshIO.CanReadFile(filePath)) {
        io = trialIO
        ioModule.unlink(filePath)
        break
      }
      ioModule.unlink(filePath)
    }
  }
  if (io === null) {
    ioToModule.clear()
    throw new Error('Could not find IO for: ' + input.name)
  }

  let ioModule = null
  if (ioToModule.has(io as string)) {
    ioModule = ioToModule.get(io as string) as MeshIOBaseEmscriptenModule
  } else {
    ioToModule.set(io as string, loadEmscriptenModule(input.config.itkModulesPath, 'MeshIOs', io as string, false) as MeshIOBaseEmscriptenModule)
    ioModule = ioToModule.get(io as string) as MeshIOBaseEmscriptenModule
  }

  ioModule.mkdirs(mountpoint)
  const filePath = `${mountpoint}/${input.name}`
  ioModule.writeFile(filePath, new Uint8Array(input.data))
  const mesh = readMeshEmscriptenFSFile(ioModule, filePath)
  ioModule.unlink(filePath)

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

async function writeMesh(input: WriteMeshInput) {
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
      if (ioToModule.has(trialIO)) {
        ioModule = ioToModule.get(trialIO) as MeshIOBaseEmscriptenModule
      } else {
        ioToModule.set(trialIO, loadEmscriptenModule(input.config.itkModulesPath, 'MeshIOs', trialIO, false) as MeshIOBaseEmscriptenModule)
        ioModule = ioToModule.get(trialIO) as MeshIOBaseEmscriptenModule
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
    ioToModule.clear()
    throw new Error('Could not find IO for: ' + input.name)
  }

  let ioModule = null
  if (ioToModule.has(io as string)) {
    ioModule = ioToModule.get(io as string) as MeshIOBaseEmscriptenModule
  } else {
    ioToModule.set(io as string, loadEmscriptenModule(input.config.itkModulesPath, 'MeshIOs', io as string, false) as MeshIOBaseEmscriptenModule)
    ioModule = ioToModule.get(io as string) as MeshIOBaseEmscriptenModule
  }

  const filePath = `${mountpoint}/${input.name}`
  ioModule.mkdirs(mountpoint)
  writeMeshEmscriptenFSFile(ioModule,
    { useCompression: input.useCompression, binaryFileType: input.binaryFileType },
    input.mesh, filePath)
  const writtenFile = ioModule.readFile(filePath, { encoding: 'binary' }) as Uint8Array
  ioModule.unlink(filePath)

  return new registerWebworker.TransferableResponse(writtenFile.buffer, [writtenFile.buffer])
}

registerWebworker(async function (input: ReadMeshInput | WriteMeshInput) {
  if (input.operation === 'readMesh') {
    return readMesh(input as ReadMeshInput)
  } else if (input.operation === 'writeMesh') {
    return writeMesh(input as WriteMeshInput)
  } else {
    throw new Error('Unknown worker operation')
  }
})
