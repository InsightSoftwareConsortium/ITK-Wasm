import stackImages from './stackImages'
import readImageArrayBuffer from './readImageArrayBuffer'
import Matrix from './Matrix'
import WorkerPool from './WorkerPool'
import PromiseFileReader from 'promise-file-reader'

const numberOfWorkers = navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 6
const workerPool = new WorkerPool(numberOfWorkers, readImageArrayBuffer)

const readImageFileSeries = async (
  fileList,
  zSpacing = 1.0,
  zOrigin = 0.0,
  sortedSeries = false
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
  if (!sortedSeries) {
    fileDescriptions.sort((a, b) => {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    })
  }
  const taskArgsArray = []
  for (let index = 0; index < fileDescriptions.length; index++) {
    taskArgsArray.push([fileDescriptions[index].data, fileDescriptions[index].name])
  }
  const results = await workerPool.runTasks(taskArgsArray).promise
  const images = results.map((result) => {
    const image = result.image
    image.imageType.dimension = 3
    image.size.push(1)
    image.spacing.push(zSpacing)
    image.origin.push(zOrigin)
    image.direction = new Matrix(3, 3)
    image.direction.setIdentity()
    return image
  })
  const stacked = stackImages(images)
  return { image: stacked, webWorkerPool: workerPool }
}

export default readImageFileSeries
