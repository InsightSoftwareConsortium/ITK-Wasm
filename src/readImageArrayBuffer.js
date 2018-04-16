import WebworkerPromise from 'webworker-promise'

import config from './itkConfig'

const readImageArrayBuffer = (webWorker, arrayBuffer, fileName, mimeType) => {
  let worker = webWorker
  if (!worker) {
    worker = new window.Worker(
      config.itkModulesPath + '/WebWorkers/ImageIO.worker.js'
    )
  }
  const promiseWorker = new WebworkerPromise(worker)
  return promiseWorker.postMessage(
    {
      operation: 'readImage',
      name: fileName,
      type: mimeType,
      data: arrayBuffer,
      config: config
    },
    [arrayBuffer]
  ).then(function (image) {
    return Promise.resolve({ image, webWorker: worker })
  })
}

export default readImageArrayBuffer
