import { readAsArrayBuffer } from 'promise-file-reader'

import createWebworkerPromise from '../core/internal/createWebworkerPromise.js'
import WorkerPool from '../core/WorkerPool.js'
import stackImages from '../core/stackImages.js'

import config from '../itkConfig.js'

import ReadImageResult from './ReadImageResult.js'
import ReadImageFileSeriesResult from './ReadImageFileSeriesResult.js'

interface FileDescription {
  name: string
  type: string
  data: ArrayBuffer
}

const workerFunction = async (
  webWorker: Worker | null,
  fileDescriptions: FileDescription[],
  singleSortedSeries: boolean = false
): Promise<ReadImageResult> => {
  let worker = webWorker
  const { webworkerPromise, worker: usedWorker } = await createWebworkerPromise(
    'image-io',
    worker
  )
  worker = usedWorker

  const transferables = fileDescriptions.map(description => {
    return description.data
  })
  const message = {
    operation: 'readDICOMImageSeries',
    fileDescriptions: fileDescriptions,
    singleSortedSeries,
    config
  }
  const image = await webworkerPromise.postMessage(message, transferables)
  return { image, webWorker: worker }
}
const numberOfWorkers = typeof globalThis.navigator?.hardwareConcurrency === 'number' ? globalThis.navigator.hardwareConcurrency : 4
const workerPool = new WorkerPool(numberOfWorkers, workerFunction)

const seriesBlockSize = 8

const readImageDICOMFileSeries = async (
  fileList: FileList | File[],
  singleSortedSeries = false
): Promise<ReadImageFileSeriesResult> => {
  const fetchFileDescriptions = Array.from(fileList, async function (file) {
    return await readAsArrayBuffer(file).then(function (
      arrayBuffer
    ) {
      const fileDescription = {
        name: file.name,
        type: file.type,
        data: arrayBuffer
      }
      return fileDescription
    })
  })

  const fileDescriptions = await Promise.all(fetchFileDescriptions)
  if (singleSortedSeries) {
    const taskArgsArray = []
    for (let index = 0; index < fileDescriptions.length; index += seriesBlockSize) {
      const block = fileDescriptions.slice(index, index + seriesBlockSize)
      taskArgsArray.push([block, singleSortedSeries])
    }
    const results = await workerPool.runTasks(taskArgsArray).promise
    const images = results.map((result) => result.image)
    const stacked = stackImages(images)
    return { image: stacked, webWorkerPool: workerPool }
  } else {
    const taskArgsArray = [[fileDescriptions, singleSortedSeries]]
    const results = await workerPool.runTasks(taskArgsArray).promise
    return { image: results[0].image, webWorkerPool: workerPool }
  }
}

export default readImageDICOMFileSeries
