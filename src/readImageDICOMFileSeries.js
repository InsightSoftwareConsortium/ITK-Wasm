import createWebworkerPromise from './createWebworkerPromise'
import PromiseFileReader from 'promise-file-reader'

import config from './itkConfig'

const readImageDICOMFileSeries = async (
  webWorker,
  fileList,
  singleSortedSeries = false
) => {
  let worker = webWorker
  const { webworkerPromise, worker: usedWorker } = await createWebworkerPromise(
    'ImageIO',
    worker
  )
  worker = usedWorker
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
  return Promise.resolve({ image, webWorker: worker })
}

export default readImageDICOMFileSeries
