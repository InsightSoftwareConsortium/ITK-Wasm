import { readAsArrayBuffer } from 'promise-file-reader'

import createWebworkerPromise from "../core/internal/createWebworkerPromise.js"
import Image from "../core/Image.js"

import config from "../itkConfig.js"

import ReadImageResult from "./ReadImageResult.js"

function readImageBlob(webWorker: Worker | null, blob: Blob, fileName: string, mimeType: string): Promise<ReadImageResult> {
  let worker = webWorker
  return createWebworkerPromise('image-io', worker)
    .then(({ webworkerPromise, worker: usedWorker }) => {
      worker = usedWorker
      return readAsArrayBuffer(blob)
        .then((arrayBuffer) => {
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
          return Promise.resolve({ image, webWorker: worker as Worker })
        })
    })
}

export default readImageBlob
