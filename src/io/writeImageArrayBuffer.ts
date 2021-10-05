import createWebworkerPromise from '../core/internal/createWebworkerPromise.js'

import Image from '../core/Image.js'

import config from '../itkConfig.js'
import getTransferable from '../core/getTransferable.js'

import WriteArrayBufferResult from './WriteArrayBufferResult.js'

function writeImageArrayBuffer(webWorker: Worker | null, useCompression: boolean, image: Image, fileName: string, mimeType: string): Promise<WriteArrayBufferResult> {
  let worker = webWorker
  return createWebworkerPromise('image-io', worker)
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
      ).then(function (arrayBuffer: ArrayBuffer) {
        return Promise.resolve({ arrayBuffer, webWorker: worker })
      })
    })
}

export default writeImageArrayBuffer
