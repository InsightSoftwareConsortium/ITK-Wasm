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
const readImageLocalDICOMFileSeries = (directory) => {
  return new Promise(function (resolve, reject) {
    const imageIOsPath = path.resolve(__dirname, 'ImageIOs')
    const absoluteDirectory = path.resolve(directory)
    const seriesReader = 'itkDICOMImageSeriesReaderJSBinding'
    const files = fs.readdirSync(absoluteDirectory)
    try {
      const absoluteDirectoryWithFile = path.join(absoluteDirectory, 'myfile.dcm')
      const seriesReaderPath = path.join(imageIOsPath, seriesReader)
      const seriesReaderModule = loadEmscriptenModule(seriesReaderPath)
      const mountedFilePath = seriesReaderModule.mountContainingDirectory(absoluteDirectoryWithFile)
      const mountedDir = path.dirname(mountedFilePath)
      const image = readImageEmscriptenFSDICOMFileSeries(seriesReaderModule,
        mountedDir, mountedDir + '/' + files[0])
      seriesReaderModule.unmountContainingDirectory(mountedFilePath)
      resolve(image)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = readImageLocalDICOMFileSeries
