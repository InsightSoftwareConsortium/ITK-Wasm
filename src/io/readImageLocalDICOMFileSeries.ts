import path from 'path'

import loadEmscriptenModule from '../core/internal/loadEmscriptenModuleNode.js'
import readImageEmscriptenFSDICOMFileSeries from './internal/readImageEmscriptenFSDICOMFileSeries.js'
import DICOMImageSeriesReaderEmscriptenModule from './internal/DICOMImageSeriesReaderEmscriptenModule.js'
import findLocalImageIOPath from './internal/findLocalImageIOPath.js'

import Image from '../core/Image.js'

/**
 * Read an image from a series of DICOM files on the local filesystem in Node.js.
 *
 * @param: filenames Array of filepaths containing a DICOM study / series on the local filesystem.
 * @param: singleSortedSeries: it is known that the files are from a single
 * sorted series.
 */
async function readImageLocalDICOMFileSeries (fileNames: string[], singleSortedSeries: boolean = false): Promise<Image> {
  const imageIOsPath = findLocalImageIOPath()
  const seriesReader = 'itkDICOMImageSeriesReaderJSBinding'
  const seriesReaderPath = path.join(imageIOsPath, seriesReader + '.js')
  const seriesReaderModule = await loadEmscriptenModule(seriesReaderPath) as DICOMImageSeriesReaderEmscriptenModule
  const mountedFilePath = seriesReaderModule.mountContainingDir(fileNames[0])
  const mountedDir = path.dirname(mountedFilePath)

  const mountedFileNames = fileNames.map((fileName) => {
    return path.join(mountedDir, path.basename(fileName))
  })
  const image = readImageEmscriptenFSDICOMFileSeries(seriesReaderModule,
    mountedFileNames, singleSortedSeries)
  seriesReaderModule.unmountContainingDir(mountedFilePath)
  return image
}
export default readImageLocalDICOMFileSeries
