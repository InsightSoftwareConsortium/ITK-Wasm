import createWebworkerPromise from './createWebworkerPromise'

import config from './itkConfig'

const writeImageArrayBuffer = (webWorker, useCompression, image, fileName, mimeType) => {
  let worker = webWorker
  return createWebworkerPromise('ImageIO', worker)
    .then(({ webworkerPromise, worker: usedWorker }) => {
      worker = usedWorker
      return webworkerPromise.postMessage(
        {
          operation: 'writeImage',
          name: fileName,
          type: mimeType,
          image: image,
          useCompression: useCompression,
          config: config
        },
        [image.data.buffer]
      ).then(function (arrayBuffer) {
        return Promise.resolve({ arrayBuffer, webWorker: worker })
      })
    })
}

export default writeImageArrayBuffer
