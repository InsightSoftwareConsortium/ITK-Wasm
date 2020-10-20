import registerWebworker from 'webworker-promise/lib/register'

import mimeToIO from '../MimeToImageIO'
import getFileExtension from '../getFileExtension'
import extensionToIO from '../extensionToImageIO'
import ImageIOIndex from '../ImageIOIndex'
import loadEmscriptenModule from '../loadEmscriptenModuleBrowser'

import readImageEmscriptenFSFile from '../readImageEmscriptenFSFile'
import writeImageEmscriptenFSFile from '../writeImageEmscriptenFSFile'
import readImageEmscriptenFSDICOMFileSeries from '../readImageEmscriptenFSDICOMFileSeries'

// To cache loaded io modules
let ioToModule = {}
let seriesReaderModule = null

function * availableIOModules (input) {
  for (let idx = 0; idx < ImageIOIndex.length; idx++) {
    const trialIO = ImageIOIndex[idx]
    const ioModule = loadEmscriptenModule(input.config.itkModulesPath, 'ImageIOs', trialIO)
    yield ioModule
  }
}

async function readImage (input) {
  const extension = getFileExtension(input.name)
  const mountpoint = '/work'

  let io = null
  if (mimeToIO.has(input.type)) {
    io = mimeToIO.get(input.type)
  } else if (extensionToIO.has(extension)) {
    io = extensionToIO.get(extension)
  } else {
    let idx = 0
    for (const mod of availableIOModules(input)) {
      const trialIO = ImageIOIndex[idx]
      const imageIO = new mod.ITKImageIO()
      mod.mkdirs(mountpoint)
      const filePath = `${mountpoint}/${input.name}`
      mod.writeFile(filePath, new Uint8Array(input.data))
      imageIO.SetFileName(filePath)
      if (imageIO.CanReadFile(filePath)) {
        io = trialIO
        mod.unlink(filePath)
        ioToModule[io] = mod
        break
      }
      mod.unlink(filePath)
      idx++
    }
    if (io === null) {
      throw new Error('Could not find IO for: ' + input.name)
    }
  }

  function inputToResponse (ioModule) {
    ioModule.mkdirs(mountpoint)
    const filePath = `${mountpoint}/${input.name}`
    ioModule.writeFile(filePath, new Uint8Array(input.data))
    const image = readImageEmscriptenFSFile(ioModule, filePath)
    ioModule.unlink(filePath)

    if (image.data.buffer instanceof SharedArrayBuffer) { // eslint-disable-line
      return new registerWebworker.TransferableResponse(image, [])
    } else {
      return new registerWebworker.TransferableResponse(image, [image.data.buffer])
    }
  }

  if (io in ioToModule) {
    const ioModule = ioToModule[io]
    return inputToResponse(ioModule)
  } else {
    const ioModule = loadEmscriptenModule(input.config.itkModulesPath, 'ImageIOs', io)
    ioToModule[io] = ioModule
    return inputToResponse(ioModule)
  }
}

async function writeImage (input) {
  const extension = getFileExtension(input.name)
  const mountpoint = '/work'

  let io = null
  if (mimeToIO.has(input.type)) {
    io = mimeToIO.get(input.type)
  } else if (extensionToIO.has(extension)) {
    io = extensionToIO.get(extension)
  } else {
    for (const ioModule of availableIOModules(input)) {
      const imageIO = new ioModule.ITKImageIO()
      const filePath = mountpoint + '/' + input.name
      imageIO.SetFileName(filePath)
      if (imageIO.CanWriteFile(filePath)) {
        io = trialIO
        break
      }
    }
  }
  if (io === null) {
    ioToModule = {}
    throw new Error('Could not find IO for: ' + input.name)
  }

  let ioModule = null
  if (io in ioToModule) {
    ioModule = ioToModule[io]
  } else {
    ioToModule[io] = loadEmscriptenModule(input.config.itkModulesPath, 'ImageIOs', io)
    ioModule = ioToModule[io]
  }

  const filePath = mountpoint + '/' + input.name
  ioModule.mkdirs(mountpoint)
  writeImageEmscriptenFSFile(ioModule, input.useCompression, input.image, filePath)
  const writtenFile = ioModule.readFile(filePath, { encoding: 'binary' })
  ioModule.unlink(filePath)

  return new registerWebworker.TransferableResponse(writtenFile.buffer, [writtenFile.buffer])
}

async function readDICOMImageSeries (input) {
  const seriesReader = 'itkDICOMImageSeriesReaderJSBinding'
  if (!seriesReaderModule) {
    seriesReaderModule = loadEmscriptenModule(input.config.itkModulesPath, 'ImageIOs', seriesReader)
  }

  const mountpoint = '/work'
  seriesReaderModule.mkdirs(mountpoint)
  const filePaths = []
  for (let ii = 0; ii < input.fileDescriptions.length; ii++) {
    const filePath = `${mountpoint}/${input.fileDescriptions[ii].name}`
    seriesReaderModule.writeFile(filePath, new Uint8Array(input.fileDescriptions[ii].data))
    filePaths.push(filePath)
  }
  const image = readImageEmscriptenFSDICOMFileSeries(seriesReaderModule,
    filePaths, input.singleSortedSeries)
  for (let ii = 0; ii < filePaths.length; ii++) {
    seriesReaderModule.unlink(filePaths[ii])
  }

  return new registerWebworker.TransferableResponse(image, [image.data.buffer])
}

registerWebworker(async function (input) {
  if (input.operation === 'readImage') {
    return readImage(input)
  } else if (input.operation === 'writeImage') {
    return writeImage(input)
  } else if (input.operation === 'readDICOMImageSeries') {
    return readDICOMImageSeries(input)
  } else {
    throw new Error('Unknown worker operation')
  }
})
