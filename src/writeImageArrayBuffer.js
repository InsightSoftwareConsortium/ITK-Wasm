import createWebworkerPromise from './createWebworkerPromise'

import config from './itkConfig'
import getTransferable from './getTransferable'

const writeImageArrayBuffer = (webWorker, useCompression, image, fileName, mimeType) => {
  let worker = webWorker
  return createWebworkerPromise('ImageIO', worker)
    .then(({ webworkerPromise, worker: usedWorker }) => {
      worker = usedWorker
      const transferables = []
      const transferable = getTransferable(image.data)
      if (transferable) {
        transferables.push(transferable)
      }
      return webworkerPromise.postMessage(
        {
          operation: 'writeImage',
          name: fileName,
          type: mimeType,
          image: image,
          useCompression: useCompression,
          config: config
        },
        transferables
      ).then(function (arrayBuffer) {
        return Promise.resolve({ arrayBuffer, webWorker: worker })
      })
    })
}

export default writeImageArrayBuffer
