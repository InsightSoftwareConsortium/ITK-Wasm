import fs from 'fs'
import path from 'path'

import loadEmscriptenModule from '../core/internal/loadEmscriptenModuleNode.js'
import readDICOMTagsEmscriptenFSFile from './internal/readDICOMTagsEmscriptenFSFile.js'
import localPathRelativeToModule from './localPathRelativeToModule.js'

import DICOMTagsReaderEmscriptenModule from './internal/DICOMTagsReaderEmscriptenModule.js'
import ReadDICOMTagsResult from './ReadDICOMTagsResult.js'

/**
 * Reads DICOM tags from a series of DICOM files on the local filesystem in Node.js.
 * @param: filename DICOM object filepath on the local filesystem.
 * @param: tags Array of tags to extract.
 */
async function readDICOMTagsLocalFile (fileName: string, tags: string[] | null = null): Promise<Map<string, string>> {
  const imageIOsPath = localPathRelativeToModule(import.meta.url, '../image-io')
  if (!fs.existsSync(imageIOsPath)) {
    throw Error("Cannot find path to itk image IO's")
  }
  const tagReader = 'itkDICOMTagReaderJSBinding'
  const tagReaderPath = path.join(imageIOsPath, tagReader + '.js')
  const tagReaderModule = await loadEmscriptenModule(tagReaderPath) as DICOMTagsReaderEmscriptenModule
  const mountedFilePath = tagReaderModule.mountContainingDir(fileName)
  const mountedDir = path.dirname(mountedFilePath)
  const mountedFileName = path.join(mountedDir, path.basename(fileName))
  const result = readDICOMTagsEmscriptenFSFile(tagReaderModule,
    mountedFileName, tags)
  tagReaderModule.unmountContainingDir(mountedFilePath)
  return result
}

export default readDICOMTagsLocalFile
