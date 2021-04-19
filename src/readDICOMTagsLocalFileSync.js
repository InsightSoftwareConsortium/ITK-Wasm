const path = require('path')

const loadEmscriptenModule = require('./loadEmscriptenModuleNode.js')
const readDICOMTagsEmscriptenFSFile = require('./readDICOMTagsEmscriptenFSFile.js')

/**
 * Reads DICOM tags from a series of DICOM files on the local filesystem in Node.js.
 * @param: filename DICOM object filepath on the local filesystem.
 * @param: tags Array of tags to extract.
 */
const readDICOMTagsLocalFileSync = (fileName, tags = null) => {
  const imageIOsPath = path.resolve(__dirname, 'ImageIOs')
  const tagReader = 'itkDICOMTagReaderJSBinding'
  const tagReaderPath = path.join(imageIOsPath, tagReader)
  const tagReaderModule = loadEmscriptenModule(tagReaderPath)
  const mountedFilePath = tagReaderModule.mountContainingDirectory(fileName)
  const mountedDir = path.dirname(mountedFilePath)
  const mountedFileName = path.join(mountedDir, path.basename(fileName))
  const result = readDICOMTagsEmscriptenFSFile(tagReaderModule,
    mountedFileName, tags)
  tagReaderModule.unmountContainingDirectory(mountedFilePath)
  return result
}

module.exports = readDICOMTagsLocalFileSync
