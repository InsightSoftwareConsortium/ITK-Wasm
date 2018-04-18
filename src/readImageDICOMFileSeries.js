import WebworkerPromise from 'webworker-promise'
import PromiseFileReader from 'promise-file-reader'

import config from './itkConfig'

const readImageDICOMFileSeries = (webWorker, fileList) => {
  let worker = webWorker
  if (!worker) {
    worker = new window.Worker(
      config.itkModulesPath + '/WebWorkers/ImageIO.worker.js'
    )
  }
  const promiseWorker = new WebworkerPromise(worker)
  const fetchFileDescriptions = Array.from(fileList, function (file) {
    return PromiseFileReader.readAsArrayBuffer(file).then(function (arrayBuffer) {
      const fileDescription = { name: file.name, type: file.type, data: arrayBuffer }
      return fileDescription
    })
  })

  return Promise.all(fetchFileDescriptions).then(function (fileDescriptions) {
    const transferables = fileDescriptions.map((description) => {
      return description.data
    })
    return promiseWorker.postMessage({ operation: 'readDICOMImageSeries', fileDescriptions: fileDescriptions, config: config },
      transferables)
  }
  ).then(function (image) {
    return Promise.resolve({ image, webWorker: worker })
  })
}

export default readImageDICOMFileSeries
