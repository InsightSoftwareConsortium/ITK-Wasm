const registerPromiseWorker = require('promise-worker-transferable/register')

const ImageType = require('../ImageType.js')
const Image = require('../Image.js')

const mimeToIO = require('../MimeToIO.js')
const getFileExtension = require('../getFileExtension.js')
const extensionToIO = require('../extensionToIO.js')
const ImageIOIndex = require('../ImageIOIndex.js')

const readImageEmscriptenFSFile = require('../readImageEmscriptenFSFile.js')
const writeImageEmscriptenFSFile = require('../writeImageEmscriptenFSFile.js')
const readImageEmscriptenFSDICOMFileSeries = require('../readImageEmscriptenFSDICOMFileSeries.js')

const loadEmscriptenModule = (imageIOsPath, io) => {
  let modulePath = imageIOsPath + '/' + io + '.js'
  if (typeof WebAssembly === 'object' && typeof WebAssembly.Memory === 'function') {
    modulePath = imageIOsPath + '/' + io + 'Wasm.js'
  }
  importScripts(modulePath)
  return Module
}

// To cache loaded io modules
let ioToModule = {}
let seriesReaderModule = null

const readImage = (input, withTransferList) => {
  const extension = getFileExtension(input.name)

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
        ioToModule[trialIO] = loadEmscriptenModule(input.config.imageIOsPath, trialIO)
        ioModule = ioToModule[trialIO]
      }
      const imageIO = new ioModule.ITKImageIO()
      const blob = new Blob([input.data])
      const blobs = [{ name: input.name, data: blob }]
      const mountpoint = '/work'
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
    return new Error('Could not find IO for: ' + input.name)
  }

  let ioModule = null
  if (io in ioToModule) {
    ioModule = ioToModule[io]
  } else {
    ioToModule[io] = loadEmscriptenModule(input.config.imageIOsPath, io)
    ioModule = ioToModule[io]
  }

  const blob = new Blob([input.data])
  const blobs = [{ name: input.name, data: blob }]
  const mountpoint = '/work'
  ioModule.mountBlobs(mountpoint, blobs)
  const filePath = mountpoint + '/' + input.name
  const image = readImageEmscriptenFSFile(ioModule, filePath)
  ioModule.unmountBlobs(mountpoint)

  return withTransferList(image, [image.data.buffer])
}

const writeImage = (input, withTransferList) => {
  const extension = getFileExtension(input.name)

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
        ioToModule[trialIO] = loadEmscriptenModule(input.config.imageIOsPath, trialIO)
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
    return new Error('Could not find IO for: ' + input.name)
  }

  let ioModule = null
  if (io in ioToModule) {
    ioModule = ioToModule[io]
  } else {
    ioToModule[io] = loadEmscriptenModule(input.config.imageIOsPath, io)
    ioModule = ioToModule[io]
  }

  const mountpoint = '/work'
  const filePath = mountpoint + '/' + input.name
  ioModule.mkdirs(mountpoint)
  writeImageEmscriptenFSFile(ioModule, input.useCompression, input.image, filePath)
  const writtenFile = ioModule.readFile(filePath, { encoding: "binary" })

  return withTransferList(writtenFile.buffer, [writtenFile.buffer])
}

const readDICOMImageSeries = (input, withTransferList) => {
  const seriesReader = 'itkDICOMImageSeriesReaderJSBinding'
  if(!seriesReaderModule) {
    seriesReaderModule = loadEmscriptenModule(input.config.imageIOsPath, seriesReader)
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

  return withTransferList(image, [image.data.buffer])
}

registerPromiseWorker(function (input, withTransferList) {
  if (input.operation === "readImage") {
    return readImage(input, withTransferList)
  } else if (input.operation === "writeImage") {
    return writeImage(input, withTransferList)
  } else if (input.operation === "readDICOMImageSeries") {
    return readDICOMImageSeries(input, withTransferList)
  } else {
    return new Error('Unknown worker operation')
  }
})
