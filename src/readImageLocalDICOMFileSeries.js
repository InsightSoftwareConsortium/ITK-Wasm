const path = require('path')
const fs = require('fs');

const ImageIOIndex = require('./ImageIOIndex.js')

const loadEmscriptenModule = require('./loadEmscriptenModule.js')
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
    const imageIOsPath = path.resolve(__dirname, '..', 'dist', 'ImageIOs')
    const io = 'itkDCMTKImageIOJSBinding'
    const seriesReader = 'itkDICOMImageSeriesReaderJSBinding'
    const files = fs.readdirSync(directory);
    try {
      const modulePath = path.join(imageIOsPath, io)
      const Module = loadEmscriptenModule(modulePath)
      const directoryWithFile = path.join(directory, 'myfile.dcm')
      Module.mountContainingDirectory(directoryWithFile)
      const seriesReaderPath = path.join(imageIOsPath, seriesReader)
      const seriesReaderModule = loadEmscriptenModule(seriesReaderPath)
      seriesReaderModule.mountContainingDirectory(directoryWithFile)
      const image = readImageEmscriptenFSDICOMFileSeries(Module, seriesReaderModule,
        directory, path.join(directory, files[0]))
      Module.unmountContainingDirectory(directoryWithFile)
      seriesReaderModule.unmountContainingDirectory(directoryWithFile)
      resolve(image)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = readImageLocalDICOMFileSeries
