import registerWebworker from 'webworker-promise/lib/register.js'

import loadEmscriptenModule from '../core/internal/loadEmscriptenModuleWebWorker.js'

import readDICOMTagsEmscriptenFSFile from '../io/internal/readDICOMTagsEmscriptenFSFile.js'
import DICOMTagsReaderEmscriptenModule from '../io/internal/DICOMTagsReaderEmscriptenModule.js'
import ImageIOBaseEmscriptenModule from '../io/internal/ImageIOBaseEmscriptenModule.js'

interface Input {
  operation: 'readDICOMTags'
  config: { imageIOUrl: string }
}

export interface ReadDICOMTagsInput extends Input {
  name: string
  type: string
  data: ArrayBuffer
  tags: string[]
}

// To cache loaded io modules
const ioToModule: Map<string,ImageIOBaseEmscriptenModule> = new Map()
let tagReaderModule: DICOMTagsReaderEmscriptenModule | null = null

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
