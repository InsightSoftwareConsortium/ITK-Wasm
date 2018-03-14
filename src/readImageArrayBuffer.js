import WebworkerPromise from 'webworker-promise'

import config from './itkConfig'

const worker = new window.Worker(config.itkModulesPath + '/WebWorkers/ImageIO.worker.js')
const promiseWorker = new WebworkerPromise(worker)

/**
 * Read an image from a file ArrayBuffer in the browser.
 *
 * @param: data arrayBuffer that contains the file contents
 * @param: fileName string that contains the file name
 * @param: mimeType optional mime-type string
 */
const readImageArrayBuffer = (arrayBuffer, fileName, mimeType) => {
  return promiseWorker.postMessage({ operation: 'readImage', name: fileName, type: mimeType, data: arrayBuffer, config: config },
    [arrayBuffer])
}

export default readImageArrayBuffer
