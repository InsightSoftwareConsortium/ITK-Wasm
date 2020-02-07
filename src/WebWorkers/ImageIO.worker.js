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

//async function * availableIOModules (input) {
  //for (let idx = 0; idx < ImageIOIndex.length; idx++) {
    //const trialIO = ImageIOIndex[idx]
    //console.log(trialIO)
    //const ioModule = await loadEmscriptenModule(input.config.itkModulesPath, 'ImageIOs', trialIO)
    //console.log('yielding module');
    //console.log(ioModule);
    //yield ioModule
  //}
//}

async function readImage (input) {
  const extension = getFileExtension(input.name)
  const mountpoint = '/work'
  console.log('readImage')

  let io = null
  if (mimeToIO.has(input.type)) {
    console.log('mimeToIO')
    io = mimeToIO.get(input.type)
  } else if (extensionToIO.has(extension)) {
    console.log('extensionToIO')
    io = extensionToIO.get(extension)
    console.log(io)
  } else {
    //let idx = 0
    //for await (const mod of availableIOModules(input)) {
      //console.log(idx)
      //const trialIO = ImageIOIndex[idx]
      //console.log(trialIO)
      //const imageIO = new mod.ITKImageIO()
      //const blob = new Blob([input.data])
      //const blobs = [{ name: input.name, data: blob }]
      //console.log('mounting')
      //mod.mountBlobs(mountpoint, blobs)
      //const filePath = mountpoint + '/' + input.name
      //imageIO.SetFileName(filePath)
      //if (imageIO.CanReadFile(filePath)) {
        //io = trialIO
        //mod.unmountBlobs(mountpoint)
        //ioToModule[io] = mod
        //break
      //}
      //mod.unmountBlobs(mountpoint)
      //idx++
    //}
    //if (io === null) {
      //return new Error('Could not find IO for: ' + input.name)
    //}
  }

  function inputToResponse (ioModule) {
    const blob = new Blob([input.data])
    const blobs = [{ name: input.name, data: blob }]
    console.log('mounting blobs')
    ioModule.mountBlobs(mountpoint, blobs)
    const filePath = mountpoint + '/' + input.name
    const image = readImageEmscriptenFSFile(ioModule, filePath)
    console.log('unmounting blobs')
    ioModule.unmountBlobs(mountpoint)

    return new registerWebworker.TransferableResponse(image, [image.data.buffer])
  }

  console.log('looking for io ' + io)
  if (io in ioToModule) {
    const ioModule = ioToModule[io]
    return inputToResponse(ioModule)
  } else {
    console.log('loading io ' + io)
    // const ioModule = await loadEmscriptenModule(input.config.itkModulesPath, 'ImageIOs', io)
     const ioModule = loadEmscriptenModule(input.config.itkModulesPath, 'ImageIOs', io)
    //return loadEmscriptenModule(input.config.itkModulesPath, 'ImageIOs', io).then((loadResult) => {
      //console.log('LOAD RESULT: ');
      //console.log(loadResult);
      //console.log('io successfully loaded')
      //ioToModule[io] = ioModule
      //return inputToResponse(ioModule)
    //})
    console.log('io successfully loaded!')
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
    for await (const ioModule of availableIOModules(input)) {
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

async function readDICOMImageSeries (input) {
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
