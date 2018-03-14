import WebworkerPromise from 'webworker-promise'
import PromiseFileReader from 'promise-file-reader'

import config from './itkConfig'

const worker = new window.Worker(config.itkModulesPath + '/WebWorkers/ImageIO.worker.js')
const promiseWorker = new WebworkerPromise(worker)

const readImageFile = (file) => {
  return PromiseFileReader.readAsArrayBuffer(file)
    .then(arrayBuffer => {
      return promiseWorker.postMessage({ operation: 'readImage', name: file.name, type: file.type, data: arrayBuffer, config: config },
        [arrayBuffer])
    })
}

export default readImageFile
