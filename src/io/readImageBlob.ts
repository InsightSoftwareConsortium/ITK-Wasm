import { readAsArrayBuffer } from 'promise-file-reader'

import createWebWorkerPromise from '../core/internal/createWebWorkerPromise.js'
import Image from '../core/Image.js'

import config from '../itkConfig.js'

import ReadImageResult from './ReadImageResult.js'

async function readImageBlob (webWorker: Worker | null, blob: Blob, fileName: string, mimeType: string): Promise<ReadImageResult> {
  let worker = webWorker
  return await createWebWorkerPromise('image-io', worker)
    .then(async ({ webworkerPromise, worker: usedWorker }) => {
      worker = usedWorker
      return await readAsArrayBuffer(blob)
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
        }).then(async function (image: Image) {
          return await Promise.resolve({ image, webWorker: worker as Worker })
        })
    })
}

export default readImageBlob
