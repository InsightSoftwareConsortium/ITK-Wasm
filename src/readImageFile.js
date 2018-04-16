import WebworkerPromise from 'webworker-promise'
import PromiseFileReader from 'promise-file-reader'

import config from './itkConfig'

const readImageFile = (webWorker, file) => {
  let worker = webWorker
  if (!worker) {
    worker = new window.Worker(
      config.itkModulesPath + '/WebWorkers/ImageIO.worker.js'
    )
  }
  const promiseWorker = new WebworkerPromise(worker)
  return PromiseFileReader.readAsArrayBuffer(file)
    .then((arrayBuffer) => {
      return promiseWorker.postMessage(
        {
          operation: 'readImage',
          name: file.name,
          type: file.type,
          data: arrayBuffer,
          config: config
        },
        [arrayBuffer]
      )
    }
    ).then(function (image) {
      return Promise.resolve({ image, webWorker: worker })
    })
}

export default readImageFile
