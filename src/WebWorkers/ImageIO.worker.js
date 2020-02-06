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

async function* availableIOModules(input) {
  for (let idx = 0; idx < ImageIOIndex.length; idx++) {
    const trialIO = ImageIOIndex[idx]
    console.log(trialIO)
    const ioModule = await loadEmscriptenModule(input.config.itkModulesPath, 'ImageIOs', trialIO)
    console.log('yielding')
    yield ioModule
  }
}

async function readImage(input) {
  const extension = getFileExtension(input.name)
  const mountpoint = '/work'

  let io = null
  if (mimeToIO.has(input.type)) {
    io = mimeToIO.get(input.type)
  } else if (extensionToIO.has(extension)) {
    io = extensionToIO.get(extension)
  } else {
    let idx = 0;
    for await (let mod of availableIOModules(input)) {
      console.log(idx)
      const trialIO = ImageIOIndex[idx]
      console.log(trialIO)
      const imageIO = new mod.ITKImageIO()
      const blob = new Blob([input.data])
      const blobs = [{ name: input.name, data: blob }]
      console.log('mounting')
      mod.mountBlobs(mountpoint, blobs)
      const filePath = mountpoint + '/' + input.name
      imageIO.SetFileName(filePath)
      //if (imageIO.CanReadFile(filePath)) {
        //io = trialIO
        //mod.unmountBlobs(mountpoint)
        //break
      //}
      mod.unmountBlobs(mountpoint)
      idx++
    }
    if (io === null) {
      return new Error('Could not find IO for: ' + input.name)
    }
  }

  let ioModule = null
  if (ioModule === null) {
    if (io in ioToModule) {
      ioModule = ioToModule[io]
    } else {
      ioToModule[io] = await loadEmscriptenModule(input.config.itkModulesPath, 'ImageIOs', io)
      ioModule = ioToModule[io]
    }
  }

  const blob = new Blob([input.data])
  const blobs = [{ name: input.name, data: blob }]
  ioModule.mountBlobs(mountpoint, blobs)
  const filePath = mountpoint + '/' + input.name
  const image = readImageEmscriptenFSFile(ioModule, filePath)
  ioModule.unmountBlobs(mountpoint)

  return new registerWebworker.TransferableResponse(image, [image.data.buffer])
}

async function writeImage(input) {
  const extension = getFileExtension(input.name)
  const mountpoint = '/work'

  let io = null
  if (mimeToIO.has(input.type)) {
    io = mimeToIO.get(input.type)
  } else if (extensionToIO.has(extension)) {
    io = extensionToIO.get(extension)
  } else {
    for await (let ioModule of availableIOModules(input)) {
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
    return new Error('Could not find IO for: ' + input.name)
  }

  let ioModule = null
  if (io in ioToModule) {
    ioModule = ioToModule[io]
  } else {
    ioToModule[io] = await loadEmscriptenModule(input.config.itkModulesPath, 'ImageIOs', io)
    ioModule = ioToModule[io]
  }

  const filePath = mountpoint + '/' + input.name
  ioModule.mkdirs(mountpoint)
  writeImageEmscriptenFSFile(ioModule, input.useCompression, input.image, filePath)
  const writtenFile = ioModule.readFile(filePath, { encoding: 'binary' })

  return new registerWebworker.TransferableResponse(writtenFile.buffer, [writtenFile.buffer])
}

async function readDICOMImageSeries(input) {
  const seriesReader = 'itkDICOMImageSeriesReaderJSBinding'
  if (!seriesReaderModule) {
    seriesReaderModule = await loadEmscriptenModule(input.config.itkModulesPath, 'ImageIOs', seriesReader)
  }

  const blobs = input.fileDescriptions.map((fileDescription) => {
    const blob = new Blob([fileDescription.data])
    return { name: fileDescription.name, data: blob }
  })
  const mountpoint = '/work'
  seriesReaderModule.mountBlobs(mountpoint, blobs)
  const filePath = mountpoint + '/' + input.fileDescriptions[0].name
  const image = readImageEmscriptenFSDICOMFileSeries(seriesReaderModule,
    mountpoint, filePath)
  seriesReaderModule.unmountBlobs(mountpoint)

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
    return Promise.resolve(new Error('Unknown worker operation'))
  }
})
