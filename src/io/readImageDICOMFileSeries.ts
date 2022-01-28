import { readAsArrayBuffer } from 'promise-file-reader'

import createWebWorkerPromise from '../core/internal/createWebWorkerPromise.js'
import WorkerPool from '../core/WorkerPool.js'
import stackImages from '../core/stackImages.js'
import BinaryFile from '../core/BinaryFile.js'
import InterfaceTypes from '../core/InterfaceTypes.js'
import Image from '../core/Image.js'

import config from '../itkConfig.js'

import ReadImageResult from './ReadImageResult.js'
import ReadImageFileSeriesResult from './ReadImageFileSeriesResult.js'

const workerFunction = async (
  webWorker: Worker | null,
  fileDescriptions: BinaryFile[],
  singleSortedSeries: boolean = false
): Promise<ReadImageResult> => {
  let worker = webWorker
  const { webworkerPromise, worker: usedWorker } = await createWebWorkerPromise(
    'pipeline',
    worker
  )
  worker = usedWorker

  const args = ['--memory-io', '--output-image', '0', '--input-images']
  fileDescriptions.forEach((desc) => {
    args.push(`./${desc.path}`)
  })
  if (singleSortedSeries) {
    args.push('--single-sorted-series')
  }
  const outputs = [
    { type: InterfaceTypes.Image }
  ]
  const inputs = fileDescriptions.map((fd) => {
    return { type: InterfaceTypes.BinaryFile, data: fd }
  })

  const transferables = fileDescriptions.map(description => {
    return description.data.buffer
  })
  interface PipelineResult {
    stdout: string
    stderr: string
    outputs: any[]
  }
  const message = {
    operation: 'readDICOMImageSeries',
    config: config,
    fileDescriptions: fileDescriptions,
    singleSortedSeries,
    pipelinePath: 'ReadDICOMImageFileSeries', // placeholder
    args,
    outputs,
    inputs
  }
  const result: PipelineResult = await webworkerPromise.postMessage(message, transferables)
  return { image: result.outputs[0].data as Image, webWorker: worker }
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
        path: file.name,
        type: file.type,
        data: new Uint8Array(arrayBuffer)
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
