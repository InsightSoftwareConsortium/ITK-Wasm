import registerWebworker from 'webworker-promise/lib/register.js'

import mimeToIO from '../io/internal/MimeToImageIO.js'
import getFileExtension from '../io/getFileExtension.js'
import extensionToIO from '../io/internal/extensionToImageIO.js'
import ImageIOIndex from '../io/internal/ImageIOIndex.js'
import loadEmscriptenModule from '../core/internal/loadEmscriptenModuleWebWorker.js'

import readImageEmscriptenFSFile from '../io/internal/readImageEmscriptenFSFile.js'
import writeImageEmscriptenFSFile from '../io/internal/writeImageEmscriptenFSFile.js'
import readDICOMTagsEmscriptenFSFile from '../io/internal/readDICOMTagsEmscriptenFSFile.js'
import PipelineEmscriptenModule from '../pipeline/PipelineEmscriptenModule.js'
import DICOMTagsReaderEmscriptenModule from '../io/internal/DICOMTagsReaderEmscriptenModule.js'
import ImageIOBaseEmscriptenModule from '../io/internal/ImageIOBaseEmscriptenModule.js'
import PipelineInput from '../pipeline/PipelineInput.js'
import runPipelineEmscripten from '../pipeline/internal/runPipelineEmscripten.js'

import Image from '../core/Image.js'
import BinaryFile from '../core/BinaryFile.js'
import InterfaceTypes from '../core/InterfaceTypes.js'

interface Input {
  operation: 'readImage' | 'writeImage' | 'readDICOMImageSeries' | 'readDICOMTags'
  config: { imageIOUrl: string }
}

export interface ReadImageInput extends Input {
  name: string
  type: string
  data: ArrayBuffer
}

export interface WriteImageInput extends Input {
  name: string
  type: string
  image: Image
  useCompression: boolean
}

export interface ReadDICOMImageSeriesInput extends Input {
  singleSortedSeries: boolean
  fileDescriptions: BinaryFile[]
}

export interface ReadDICOMTagsInput extends Input {
  name: string
  type: string
  data: ArrayBuffer
  tags: string[]
}

// To cache loaded io modules
const ioToModule: Map<string,ImageIOBaseEmscriptenModule> = new Map()
let seriesReaderModule: PipelineEmscriptenModule | null = null
let tagReaderModule: DICOMTagsReaderEmscriptenModule | null = null
const haveSharedArrayBuffer = typeof self.SharedArrayBuffer === 'function' // eslint-disable-line

async function * availableIOModules (input: Input) {
  for (let idx = 0; idx < ImageIOIndex.length; idx++) {
    const trialIO = ImageIOIndex[idx]
    const ioModule = await loadEmscriptenModule(trialIO, input.config.imageIOUrl) as ImageIOBaseEmscriptenModule
    yield ioModule
  }
}

export async function readImage (input: ReadImageInput) {
  const extension = getFileExtension(input.name)
  const mountpoint = '/work'

  let io = null
  if (mimeToIO.has(input.type)) {
    io = mimeToIO.get(input.type)
  } else if (extensionToIO.has(extension)) {
    io = extensionToIO.get(extension)
  } else {
    let idx = 0
    for await (const mod of availableIOModules(input)) {
      const trialIO = ImageIOIndex[idx]
      const imageIO = new mod.ITKImageIO()
      mod.fs_mkdirs(mountpoint)
      const filePath = `${mountpoint}/${input.name}`
      mod.fs_writeFile(filePath, new Uint8Array(input.data))
      imageIO.SetFileName(filePath)
      if (imageIO.CanReadFile(filePath)) {
        io = trialIO
        mod.fs_unlink(filePath)
        ioToModule.set(io, mod)
        break
      }
      mod.fs_unlink(filePath)
      idx++
    }
    if (io === null) {
      throw new Error('Could not find IO for: ' + input.name)
    }
  }

  function inputToResponse (ioModule: ImageIOBaseEmscriptenModule) {
    ioModule.fs_mkdirs(mountpoint)
    const filePath = `${mountpoint}/${input.name}`
    ioModule.fs_writeFile(filePath, new Uint8Array(input.data))
    const image = readImageEmscriptenFSFile(ioModule, filePath)
    ioModule.fs_unlink(filePath)

    // @ts-ignore: error TS2531: Object is possibly 'null'.
    if (haveSharedArrayBuffer && image.data.buffer instanceof SharedArrayBuffer) { // eslint-disable-line
      return new registerWebworker.TransferableResponse(image, [])
    } else {
      // @ts-ignore: error TS2531: Object is possibly 'null'.
      return new registerWebworker.TransferableResponse(image, [image.data.buffer])
    }
  }

  if (ioToModule.has(io as string)) {
    const ioModule = ioToModule.get(io as string) as ImageIOBaseEmscriptenModule
    return inputToResponse(ioModule)
  } else {
    const ioModule = await loadEmscriptenModule(io as string, input.config.imageIOUrl) as ImageIOBaseEmscriptenModule
    ioToModule.set(io as string, ioModule)
    return inputToResponse(ioModule)
  }
}

export async function writeImage(input: WriteImageInput) {
  const extension = getFileExtension(input.name)
  const mountpoint = '/work'

  let io = null
  if (mimeToIO.has(input.type)) {
    io = mimeToIO.get(input.type)
  } else if (extensionToIO.has(extension)) {
    io = extensionToIO.get(extension)
  } else {
    let idx = 0
    for await (const ioModule of availableIOModules(input)) {
      const trialIO = ImageIOIndex[idx]
      const imageIO = new ioModule.ITKImageIO()
      const filePath = mountpoint + '/' + input.name
      imageIO.SetFileName(filePath)
      if (imageIO.CanWriteFile(filePath)) {
        io = trialIO
        break
      }
      idx++
    }
  }
  if (io === null) {
    ioToModule.clear()
    throw new Error('Could not find IO for: ' + input.name)
  }

  let ioModule = null
  if (ioToModule.has(io as string)) {
    ioModule = ioToModule.get(io as string) as ImageIOBaseEmscriptenModule
  } else {
    ioToModule.set(io as string, await loadEmscriptenModule(io as string, input.config.imageIOUrl) as ImageIOBaseEmscriptenModule)
    ioModule = ioToModule.get(io as string) as ImageIOBaseEmscriptenModule
  }

  const filePath = mountpoint + '/' + input.name
  ioModule.fs_mkdirs(mountpoint)
  writeImageEmscriptenFSFile(ioModule, input.useCompression, input.image, filePath)
  const writtenFile = ioModule.fs_readFile(filePath, { encoding: 'binary' }) as Uint8Array
  ioModule.fs_unlink(filePath)

  if (haveSharedArrayBuffer && writtenFile.buffer instanceof SharedArrayBuffer) { // eslint-disable-line
    return new registerWebworker.TransferableResponse(writtenFile.buffer, [])
  } else {
    return new registerWebworker.TransferableResponse(writtenFile.buffer, [writtenFile.buffer])
  }
}

export async function readDICOMImageSeries(input: ReadDICOMImageSeriesInput) {
  const seriesReader = 'ReadImageDICOMFileSeries'
  if (!seriesReaderModule) {
    seriesReaderModule = await loadEmscriptenModule(seriesReader, input.config.imageIOUrl) as PipelineEmscriptenModule
  }

  const mountpoint = '/work'
  seriesReaderModule.fs_mkdirs(mountpoint)
  const filePaths = []
  for (let ii = 0; ii < input.fileDescriptions.length; ii++) {
    const filePath = `${mountpoint}/${input.fileDescriptions[ii].path}`
    seriesReaderModule.fs_writeFile(filePath, input.fileDescriptions[ii].data)
    filePaths.push(filePath)
  }
  const args = ['--memory-io', '--output-image', '0', '--input-images']
  filePaths.forEach((fn) => {
    args.push(fn)
  })
  if (input.singleSortedSeries) {
    args.push('--single-sorted-series')
  }
  const desiredOutputs = [
    { type: InterfaceTypes.Image }
  ]
  const inputs = [
  ] as PipelineInput[]
  const { outputs } = runPipelineEmscripten(seriesReaderModule, args, desiredOutputs, inputs)
  const image = outputs[0].data as Image
  for (let ii = 0; ii < filePaths.length; ii++) {
    seriesReaderModule.fs_unlink(filePaths[ii])
  }

  // @ts-ignore: error TS2531: Object is possibly 'null'.
  if (haveSharedArrayBuffer && image.data.buffer instanceof SharedArrayBuffer) { // eslint-disable-line
    return new registerWebworker.TransferableResponse(image, [])
  } else {
    // @ts-ignore: error TS2531: Object is possibly 'null'.
    return new registerWebworker.TransferableResponse(image, [image.data.buffer])
  }
}

export async function readDICOMTags(input: ReadDICOMTagsInput) {
  const tagReader = 'itkDICOMTagReaderJSBinding'
  if (!tagReaderModule) {
    tagReaderModule = await loadEmscriptenModule(tagReader, input.config.imageIOUrl) as DICOMTagsReaderEmscriptenModule
  }

  const mountpoint = '/work'
  tagReaderModule.fs_mkdirs(mountpoint)
  const filePath = `${mountpoint}/${input.name}`
  tagReaderModule.fs_writeFile(filePath, new Uint8Array(input.data))
  const tagValues = readDICOMTagsEmscriptenFSFile(tagReaderModule, filePath, input.tags)
  tagReaderModule.fs_unlink(filePath)

  return new registerWebworker.TransferableResponse(tagValues, [])
}
