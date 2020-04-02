import createWebworkerPromise from './createWebworkerPromise'
import PromiseFileReader from 'promise-file-reader'
import WorkerPool from './WorkerPool'
import stackImages from './stackImages'

import config from './itkConfig'

const workerFunction = async (
  webWorker,
  fileDescriptions,
  singleSortedSeries = false
) => {
  let worker = webWorker
  const { webworkerPromise, worker: usedWorker } = await createWebworkerPromise(
    'ImageIO',
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
const numberOfWorkers = navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4
const workerPool = new WorkerPool(numberOfWorkers, workerFunction)

const seriesBlockSize = 8

const readImageDICOMFileSeries = async (
  fileList,
  singleSortedSeries = false
) => {
  const fetchFileDescriptions = Array.from(fileList, function (file) {
    return PromiseFileReader.readAsArrayBuffer(file).then(function (
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
    const results = await workerPool.runTasks(taskArgsArray)
    const images = results.map((result) => result.image)
    const stacked = stackImages(images)
    return { image: stacked, webWorkerPool: workerPool }
  } else {
    const taskArgsArray = [[fileDescriptions, singleSortedSeries]]
    const results = await workerPool.runTasks(taskArgsArray)
    return { image: results[0].image, webWorkerPool: workerPool }
  }
}

export default readImageDICOMFileSeries
