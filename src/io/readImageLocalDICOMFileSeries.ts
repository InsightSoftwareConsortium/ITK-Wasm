import fs from 'fs'
import path from 'path'

import loadEmscriptenModule from '../core/internal/loadEmscriptenModuleNode.js'
import readImageEmscriptenFSDICOMFileSeries from './internal/readImageEmscriptenFSDICOMFileSeries.js'
import DICOMImageSeriesReaderEmscriptenModule from './internal/DICOMImageSeriesReaderEmscriptenModule.js'

import Image from '../core/Image.js'
import localPathRelativeToModule from './localPathRelativeToModule.js'

/**
 * Read an image from a series of DICOM files on the local filesystem in Node.js.
 *
 * @param: filenames Array of filepaths containing a DICOM study / series on the local filesystem.
 * @param: singleSortedSeries: it is known that the files are from a single
 * sorted series.
 */
async function readImageLocalDICOMFileSeries(fileNames: string[], singleSortedSeries: boolean = false): Promise<Image> {
    const imageIOsPath = localPathRelativeToModule(import.meta.url, '../image-io')
    if (!fs.existsSync(imageIOsPath)) {
      throw Error("Cannot find path to itk image IO's")
    }
    const seriesReader = 'itkDICOMImageSeriesReaderJSBinding'
    const seriesReaderPath = path.join(imageIOsPath, seriesReader + '.js')
    const wasmBinary = fs.readFileSync(path.join(imageIOsPath, seriesReader + '.wasm'))
    const seriesReaderModule = await loadEmscriptenModule(seriesReaderPath, wasmBinary) as DICOMImageSeriesReaderEmscriptenModule
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
