import createWebworkerPromise from './createWebworkerPromise'

import config from './itkConfig'

const readImageArrayBuffer = (webWorker, arrayBuffer, fileName, mimeType) => {
  let worker = webWorker
  return createWebworkerPromise('ImageIO', worker)
    .then(({ webworkerPromise, worker: usedWorker }) => {
      worker = usedWorker
      webworkerPromise.postMessage(
        {
          operation: 'readImage',
          name: fileName,
          type: mimeType,
          data: arrayBuffer,
          config: config
        },
        [arrayBuffer]
      )
    }).then(function (image) {
      return Promise.resolve({ image, webWorker: worker })
    })
}

export default readImageArrayBuffer
