import WebworkerPromise from 'webworker-promise'

import config from './itkConfig'

const writeImageArrayBuffer = (webWorker, useCompression, image, fileName, mimeType) => {
  let worker = webWorker
  if (!worker) {
    worker = new window.Worker(
      config.itkModulesPath + '/WebWorkers/ImageIO.worker.js'
    )
  }
  const promiseWorker = new WebworkerPromise(worker)
  return promiseWorker.postMessage(
    {
      operation: 'writeImage',
      name: fileName,
      type: mimeType,
      image: image,
      useCompression: useCompression,
      config: config
    },
    [image.data.buffer]
  ).then(function () {
    return Promise.resolve({ webWorker: worker })
  })
}

export default writeImageArrayBuffer
