import registerWebworker from 'webworker-promise/lib/register.js'

import loadEmscriptenModule from '../core/internal/loadEmscriptenModuleWebWorker.js'

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
  operation: 'readDICOMImageSeries' | 'readDICOMTags'
  config: { imageIOUrl: string }
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
