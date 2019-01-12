const path = require('path')
const fs = require('fs')

const loadEmscriptenModule = require('./loadEmscriptenModuleNode.js')
const readImageEmscriptenFSDICOMFileSeries = require('./readImageEmscriptenFSDICOMFileSeries.js')

/**
 * Read an image from a series of DICOM files on the local filesystem in Node.js.
 *
 * It is assumed that all the files are located in the same directory.
 *
 * @param: directory a directory containing a single study / series on the local filesystem.
 */
const readImageLocalDICOMFileSeriesSync = (directory) => {
  const imageIOsPath = path.resolve(__dirname, 'ImageIOs')
  const absoluteDirectory = path.resolve(directory)
  const seriesReader = 'itkDICOMImageSeriesReaderJSBinding'
  const files = fs.readdirSync(absoluteDirectory)
  const absoluteDirectoryWithFile = path.join(absoluteDirectory, 'myfile.dcm')
  const seriesReaderPath = path.join(imageIOsPath, seriesReader)
  const seriesReaderModule = loadEmscriptenModule(seriesReaderPath)
  seriesReaderModule.mountContainingDirectory(absoluteDirectoryWithFile)
  const image = readImageEmscriptenFSDICOMFileSeries(seriesReaderModule,
    absoluteDirectory, path.join(absoluteDirectory, files[0]))
  seriesReaderModule.unmountContainingDirectory(absoluteDirectoryWithFile)
  return image
}

module.exports = readImageLocalDICOMFileSeriesSync
