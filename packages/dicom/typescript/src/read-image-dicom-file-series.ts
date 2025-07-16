import {
  BinaryFile,
  stackImages,
  WorkerPool,
} from 'itk-wasm'

import ReadImageDicomFileSeriesOptions from './read-image-dicom-file-series-options.js'
import ReadImageDicomFileSeriesResult from './read-image-dicom-file-series-result.js'
import readImageDicomFileSeriesWorkerFunction from './read-image-dicom-file-series-worker-function.js'

const numberOfWorkers = typeof globalThis.navigator?.hardwareConcurrency === 'number' ? globalThis.navigator.hardwareConcurrency : 4
const seriesBlockSize = 8

/**
 * Read a DICOM image series and return the associated image volume
 *
 * @param {ReadImageDicomFileSeriesOptions} options - options object
 *
 * @returns {Promise<ReadImageDicomFileSeriesResult>} - result object
 */
async function readImageDicomFileSeries(
  options: ReadImageDicomFileSeriesOptions = { inputImages: [] as BinaryFile[] | File[] | string[], }
) : Promise<ReadImageDicomFileSeriesResult> {

  let workerPool = options.webWorkerPool ?? null
  if (workerPool === null) {
    workerPool = new WorkerPool(numberOfWorkers, readImageDicomFileSeriesWorkerFunction)
  }

  if(options.inputImages.length < 1) {
    throw new Error('"input-images" option must have a length > 1')
  }

  const inputs: Array<BinaryFile> = await Promise.all(options.inputImages.map(async (value) => {
    let valueFile = value
    if (value instanceof File) {
      const valueBuffer = await value.arrayBuffer()
      valueFile = { path: value.name, data: new Uint8Array(valueBuffer) }
    }
    return valueFile as BinaryFile
  }))

  if (options.singleSortedSeries) {
    const taskArgsArray = []
    for (let index = 0; index < inputs.length; index += seriesBlockSize) {
      const block = inputs.slice(index, index + seriesBlockSize)
      taskArgsArray.push([block, options.singleSortedSeries, {}])
    }
    const results = await workerPool.runTasks(taskArgsArray).promise
    const images = results.map((result) => result.outputImage)
    const sortedFilenames = results.reduce((a, v) => a.concat(v.sortedFilenames), [])
    let stacked = stackImages(images)
    return { outputImage: stacked, webWorkerPool: workerPool, sortedFilenames }
  } else {
    const taskArgsArray = [[inputs, options.singleSortedSeries, {}]]
    const results = await workerPool.runTasks(taskArgsArray).promise
    let image = results[0].outputImage
    return { outputImage: image, webWorkerPool: workerPool, sortedFilenames: results[0].sortedFilenames }
  }
}

export default readImageDicomFileSeries
