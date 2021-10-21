import createWebworkerPromise from '../core/internal/createWebworkerPromise.js'

import Image from '../core/Image.js'

import config from '../itkConfig.js'
import getTransferable from '../core/getTransferable.js'

import WriteArrayBufferResult from './WriteArrayBufferResult.js'

async function writeImageArrayBuffer (webWorker: Worker | null, useCompression: boolean, image: Image, fileName: string, mimeType: string): Promise<WriteArrayBufferResult> {
  let worker = webWorker
  return await createWebworkerPromise('image-io', worker)
    .then(({ webworkerPromise, worker: usedWorker }) => {
      worker = usedWorker
      const transferables = []
      const transferable = getTransferable(image.data)
      if (transferable != null) {
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
      ).then(async function (arrayBuffer: ArrayBuffer) {
        return await Promise.resolve({ arrayBuffer, webWorker: worker })
      })
    })
}

export default writeImageArrayBuffer
