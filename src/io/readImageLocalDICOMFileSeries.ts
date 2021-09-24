import path from 'path'

import loadEmscriptenModule from '../core/internal/loadEmscriptenModuleNode.js'
import readImageEmscriptenFSDICOMFileSeries from './internal/readImageEmscriptenFSDICOMFileSeries.js'
import DICOMImageSeriesReaderEmscriptenModule from './internal/DICOMImageSeriesReaderEmscriptenModule.js'

import Image from '../core/Image.js'

/**
 * Read an image from a series of DICOM files on the local filesystem in Node.js.
 *
 * @param: filenames Array of filepaths containing a DICOM study / series on the local filesystem.
 * @param: singleSortedSeries: it is known that the files are from a single
 * sorted series.
 */
function readImageLocalDICOMFileSeries(fileNames: string[], singleSortedSeries: boolean = false): Promise<Image> {
  return new Promise(function (resolve, reject) {
    const imageIOsPath = path.resolve(__dirname, 'ImageIOs')
    const seriesReader = 'itkDICOMImageSeriesReaderJSBinding'
    try {
      const seriesReaderPath = path.join(imageIOsPath, seriesReader)
      const seriesReaderModule = loadEmscriptenModule(seriesReaderPath) as DICOMImageSeriesReaderEmscriptenModule
      const mountedFilePath = seriesReaderModule.mountContainingDirectory(fileNames[0])
      const mountedDir = path.dirname(mountedFilePath)

      const mountedFileNames = fileNames.map((fileName) => {
        return path.join(mountedDir, path.basename(fileName))
      })
      const image = readImageEmscriptenFSDICOMFileSeries(seriesReaderModule,
        mountedFileNames, singleSortedSeries)
      seriesReaderModule.unmountContainingDirectory(mountedFilePath)
      resolve(image)
    } catch (err) {
      reject(err)
    }
  })
}

export default readImageLocalDICOMFileSeries
