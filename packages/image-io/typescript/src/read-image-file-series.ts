import { stackImages, WorkerPool, castImage, BinaryFile } from 'itk-wasm'

import readImage from './read-image.js'

import ReadImageFileSeriesResult from './read-image-file-series-result.js'
import ReadImageFileSeriesOptions from './read-image-file-series-options.js'

const numberOfWorkers = typeof globalThis.navigator?.hardwareConcurrency === 'number' ? globalThis.navigator.hardwareConcurrency : 6
const workerPool = new WorkerPool(numberOfWorkers, readImage)

async function readImageFileSeries (
  fileList: File[] | FileList | BinaryFile[],
  options: ReadImageFileSeriesOptions = {},
): Promise<ReadImageFileSeriesResult> {
  let zSpacing = 1.0
  let zOrigin = 0.0
  let sortedSeries = false
  if (typeof options === 'object') {
    if (typeof options.zSpacing !== 'undefined') {
      zSpacing = options.zSpacing
    }
    if (typeof options.zOrigin !== 'undefined') {
      zOrigin = options.zOrigin
    }
    if (typeof options.sortedSeries !== 'undefined') {
      sortedSeries = options.sortedSeries
    }
  }
  // @ts-ignore  error TS2769: No overload matches this call.
  const fetchFileDescriptions = Array.from(fileList, async function (file) {
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      return {
        path: file.name,
        data: new Uint8Array(arrayBuffer)
      }
    }
    return file as BinaryFile
  })

  const fileDescriptions = await Promise.all(fetchFileDescriptions) as BinaryFile[]
  if (!sortedSeries) {
    fileDescriptions.sort((a, b) => {
      if (a.path < b.path) {
        return -1
      }
      if (a.path > b.path) {
        return 1
      }
      return 0
    })
  }
  const taskArgsArray = []
  for (let index = 0; index < fileDescriptions.length; index++) {
    taskArgsArray.push([fileDescriptions[index], {}])
  }
  const results = await workerPool.runTasks(taskArgsArray).promise
  const images = results.map((result) => {
    const image = result.image
    image.imageType.dimension = 3
    image.size.push(1)
    image.spacing.push(zSpacing)
    image.origin.push(zOrigin)
    image.direction = new Float64Array(9)
    image.direction.fill(0.0)
    image.direction[0] = 1.0
    image.direction[4] = 1.0
    image.direction[8] = 1.0
    return image
  })
  let stacked = stackImages(images)
  if (typeof options === 'object' && (typeof options.componentType !== 'undefined' || typeof options.pixelType !== 'undefined')) {
    stacked = castImage(stacked, options)
  }
  return { image: stacked, webWorkerPool: workerPool }
}

export default readImageFileSeries
