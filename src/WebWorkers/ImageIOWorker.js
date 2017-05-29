const registerPromiseWorker = require('promise-worker-transferable/register')

const ImageType = require('../itkImageType.js')
const Image = require('../itkImage.js')

const mimeToIO = require('../itkMimeToIO.js')
const getFileExtension = require('../itkgetFileExtension.js')
const extensionToIO = require('../itkExtensionToIO.js')
const readImageEmscriptenFSFile = require('../itkreadImageEmscriptenFSFile.js')

// todo: How to make this configurable?
const config = require('../itkConfig.js')

// To cache loaded io modules
let ioToModule = {}

/**
 * input is an object with keys:
 *    name: fileNameString
 *    type: mimeTypeString
 *    buffer: fileContentsArrayBuffer
 **/
registerPromiseWorker(function (input, withTransferList) {
  const extension = getFileExtension(input.name)

  let io = null
  if (mimeToIO.hasOwnProperty(input.type)) {
    io = mimeToIO[input.type]
  } else if (extensionToIO.hasOwnProperty(extension)) {
    io = extensionToIO[extension]
  } else {
    // todo: Iterate through available IO's and have them run
    // .CanReadFile(filePath)
  }
  if (io === null) {
    return Error('Could not find IO for: ' + input.name)
  }

  let ioModule = null
  if (io in ioToModule) {
    ioModule = ioToModule[io]
  } else {
    const modulePath = config.imageIOsPath + '/' + io + '.js'
    importScripts(modulePath)
    ioToModule[io] = Module
    ioModule = Module
  }

  const blob = new Blob([input.buffer])
  const blobs = [{ name: input.name, data: blob }]
  const mountpoint = '/work'
  ioModule.mountBlobs(mountpoint, blobs)
  const filePath = mountpoint + '/' + input.name
  const image = readImageEmscriptenFSFile(ioModule, filePath)
  ioModule.unmountBlobs(mountpoint)

  return withTransferList(image, [image.buffer.buffer])
})
