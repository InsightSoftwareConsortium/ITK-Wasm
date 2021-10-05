import createWebworkerPromise from "../core/internal/createWebworkerPromise.js"
import Image from "../core/Image.js"

import config from "../itkConfig.js"

import ReadImageResult from "./ReadImageResult.js"

function readImageArrayBuffer(webWorker: Worker | null, arrayBuffer: ArrayBuffer, fileName: string, mimeType: string): Promise<ReadImageResult> {
  let worker = webWorker
  return createWebworkerPromise('image-io', worker)
    .then(({ webworkerPromise, worker: usedWorker }) => {
      worker = usedWorker
      return webworkerPromise.postMessage(
        {
          operation: 'readImage',
          name: fileName,
          type: mimeType,
          data: arrayBuffer,
          config: config
        },
        [arrayBuffer]
      )
    }).then(function (image: Image) {
      return Promise.resolve({ image, webWorker: worker as Worker})
    })
}

export default readImageArrayBuffer
