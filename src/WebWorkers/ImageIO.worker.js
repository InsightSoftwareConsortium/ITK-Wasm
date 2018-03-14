import registerWebworker from 'webworker-promise/lib/register'

import mimeToIO from '../MimeToImageIO'
import getFileExtension from '../getFileExtension'
import extensionToIO from '../extensionToImageIO'
import ImageIOIndex from '../ImageIOIndex'

import readImageEmscriptenFSFile from '../readImageEmscriptenFSFile'
import writeImageEmscriptenFSFile from '../writeImageEmscriptenFSFile'
import readImageEmscriptenFSDICOMFileSeries from '../readImageEmscriptenFSDICOMFileSeries'

const loadEmscriptenModule = (itkModulesPath, io) => {
  let modulePath = itkModulesPath + '/ImageIOs/' + io + '.js'
  if (typeof WebAssembly === 'object' && typeof WebAssembly.Memory === 'function') {
    modulePath = itkModulesPath + '/ImageIOs/' + io + 'Wasm.js'
  }
  importScripts(modulePath)
  return Module
}

// To cache loaded io modules
let ioToModule = {}
let seriesReaderModule = null

const readImage = (input) => {
  const extension = getFileExtension(input.name)
  const mountpoint = '/work'

  let io = null
  if (mimeToIO.hasOwnProperty(input.type)) {
    io = mimeToIO[input.type]
  } else if (extensionToIO.hasOwnProperty(extension)) {
    io = extensionToIO[extension]
  } else {
    for (let idx = 0; idx < ImageIOIndex.length; ++idx) {
      let ioModule = null
      const trialIO = ImageIOIndex[idx]
      if (trialIO in ioToModule) {
        ioModule = ioToModule[trialIO]
      } else {
        ioToModule[trialIO] = loadEmscriptenModule(input.config.itkModulesPath, trialIO)
        ioModule = ioToModule[trialIO]
      }
      const imageIO = new ioModule.ITKImageIO()
      const blob = new Blob([input.data])
      const blobs = [{ name: input.name, data: blob }]
      ioModule.mountBlobs(mountpoint, blobs)
      const filePath = mountpoint + '/' + input.name
      imageIO.SetFileName(filePath)
      if (imageIO.CanReadFile(filePath)) {
        io = trialIO
        ioModule.unmountBlobs(mountpoint)
        break
      }
      ioModule.unmountBlobs(mountpoint)
    }
  }
  if (io === null) {
    ioToModule = {}
    return Promise.reject(new Error('Could not find IO for: ' + input.name))
  }

  let ioModule = null
  if (io in ioToModule) {
    ioModule = ioToModule[io]
  } else {
    ioToModule[io] = loadEmscriptenModule(input.config.itkModulesPath, io)
    ioModule = ioToModule[io]
  }

  const blob = new Blob([input.data])
  const blobs = [{ name: input.name, data: blob }]
  ioModule.mountBlobs(mountpoint, blobs)
  const filePath = mountpoint + '/' + input.name
  const image = readImageEmscriptenFSFile(ioModule, filePath)
  ioModule.unmountBlobs(mountpoint)

  return new registerWebworker.TransferableResponse(image, [image.data.buffer])
}

const writeImage = (input) => {
  const extension = getFileExtension(input.name)
  const mountpoint = '/work'

  let io = null
  if (mimeToIO.hasOwnProperty(input.type)) {
    io = mimeToIO[input.type]
  } else if (extensionToIO.hasOwnProperty(extension)) {
    io = extensionToIO[extension]
  } else {
    for (let idx = 0; idx < ImageIOIndex.length; ++idx) {
      let ioModule = null
      const trialIO = ImageIOIndex[idx]
      if (trialIO in ioToModule) {
        ioModule = ioToModule[trialIO]
      } else {
        ioToModule[trialIO] = loadEmscriptenModule(input.config.itkModulesPath, trialIO)
        ioModule = ioToModule[trialIO]
      }
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
    return Promise.reject(new Error('Could not find IO for: ' + input.name))
  }

  let ioModule = null
  if (io in ioToModule) {
    ioModule = ioToModule[io]
  } else {
    ioToModule[io] = loadEmscriptenModule(input.config.itkModulesPath, io)
    ioModule = ioToModule[io]
  }

  const filePath = mountpoint + '/' + input.name
  ioModule.mkdirs(mountpoint)
  writeImageEmscriptenFSFile(ioModule, input.useCompression, input.image, filePath)
  const writtenFile = ioModule.readFile(filePath, { encoding: 'binary' })

  return new registerWebworker.TransferableResponse(writtenFile.buffer, [writtenFile.buffer])
}

const readDICOMImageSeries = (input) => {
  const seriesReader = 'itkDICOMImageSeriesReaderJSBinding'
  if (!seriesReaderModule) {
    seriesReaderModule = loadEmscriptenModule(input.config.itkModulesPath, seriesReader)
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

registerWebworker(function (input) {
  if (input.operation === 'readImage') {
    return Promise.resolve(readImage(input))
  } else if (input.operation === 'writeImage') {
    return Promise.resolve(writeImage(input))
  } else if (input.operation === 'readDICOMImageSeries') {
    return Promise.resolve(readDICOMImageSeries(input))
  } else {
    return Promise.resolve(new Error('Unknown worker operation'))
  }
})
