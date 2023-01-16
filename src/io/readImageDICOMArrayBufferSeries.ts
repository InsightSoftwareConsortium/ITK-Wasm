import createWebWorkerPromise from '../core/createWebWorkerPromise.js'
import WorkerPool from '../core/WorkerPool.js'
import Metadata from '../core/Metadata.js'
import stackImages from '../core/stackImages.js'
import BinaryFile from '../core/BinaryFile.js'
import InterfaceTypes from '../core/InterfaceTypes.js'
import Image from '../core/Image.js'
import castImage from '../core/castImage.js'

import config from '../itkConfig.js'

import ReadImageResult from './ReadImageResult.js'
import ReadImageFileSeriesResult from './ReadImageFileSeriesResult.js'
import ReadImageDICOMArrayBufferSeriesOptions from './ReadImageDICOMArrayBufferSeriesOptions.js'

const workerFunction = async (
  webWorker: Worker | null,
  fileDescriptions: BinaryFile[],
  singleSortedSeries: boolean = false
): Promise<ReadImageResult> => {
  let worker = webWorker
  const { webworkerPromise, worker: usedWorker } = await createWebWorkerPromise(
    worker
  )
  worker = usedWorker

  const args = ['--memory-io', '--output-image', '0', '--output-filenames', '1', '--input-images']
  fileDescriptions.forEach((desc) => {
    args.push(`./${desc.path}`)
  })
  if (singleSortedSeries) {
    args.push('--single-sorted-series')
  }
  const outputs = [
    { type: InterfaceTypes.Image },
    { type: InterfaceTypes.TextStream }
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
  const image: Image = result.outputs[0].data
  const filenames: string[] = result.outputs[1].data.data.split('\0')
  // remove the last element since we expect it to be empty
  filenames?.pop()

  if (image.metadata === undefined) {
    const metadata: Metadata = new Map()
    metadata.set('OrderedFileNames', filenames)
    image.metadata = metadata
  } else {
    image.metadata.set('OrderedFileNames', filenames)
  }

  return { image: result.outputs[0].data as Image, webWorker: worker }
}
const numberOfWorkers = typeof globalThis.navigator?.hardwareConcurrency === 'number' ? globalThis.navigator.hardwareConcurrency : 4
const workerPool = new WorkerPool(numberOfWorkers, workerFunction)

const seriesBlockSize = 8

const readImageDICOMArrayBufferSeries = async (
  arrayBuffers: ArrayBuffer[],
  options?: ReadImageDICOMArrayBufferSeriesOptions | boolean,
  fileNamesBackwardsCompatibility?: string[]
): Promise<ReadImageFileSeriesResult> => {
  let singleSortedSeries = false
  let fileNames: undefined | string[]
  if (typeof options === 'boolean') {
    // Backwards compatibility
    singleSortedSeries = options
  }
  if (typeof fileNamesBackwardsCompatibility !== 'undefined') {
    fileNames = fileNamesBackwardsCompatibility
  }
  if (typeof options === 'object') {
    if (typeof options.singleSortedSeries !== 'undefined') {
      singleSortedSeries = options.singleSortedSeries
    }
    if (typeof options.fileNames !== 'undefined') {
      fileNames = options.fileNames
    }
  }
  const validFileNames = (typeof fileNames !== 'undefined') && fileNames.length === arrayBuffers.length
  const fileDescriptions = arrayBuffers.map((ab, index) => {
    // @ts-expect-error: TS2532: Object is possibly 'undefined'.
    return { path: validFileNames ? fileNames[index] : `${index}.dcm`, data: new Uint8Array(ab) }
  })
  if (singleSortedSeries) {
    const taskArgsArray = []
    for (let index = 0; index < fileDescriptions.length; index += seriesBlockSize) {
      const block = fileDescriptions.slice(index, index + seriesBlockSize)
      taskArgsArray.push([block, singleSortedSeries])
    }
    const results = await workerPool.runTasks(taskArgsArray).promise
    const images = results.map((result) => result.image)
    let stacked = stackImages(images)
    if (typeof options === 'object' && (typeof options.componentType !== 'undefined' || typeof options.pixelType !== 'undefined')) {
      stacked = castImage(stacked, options)
    }
    return { image: stacked, webWorkerPool: workerPool }
  } else {
    const taskArgsArray = [[fileDescriptions, singleSortedSeries]]
    const results = await workerPool.runTasks(taskArgsArray).promise
    let image = results[0].image
    if (typeof options === 'object' && (typeof options.componentType !== 'undefined' || typeof options.pixelType !== 'undefined')) {
      image = castImage(image, options)
    }
    return { image, webWorkerPool: workerPool }
  }
}

export default readImageDICOMArrayBufferSeries
