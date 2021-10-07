import createWebworkerPromise from "../core/internal/createWebworkerPromise.js"
import Image from "../core/Image.js"

import config from "../itkConfig.js"

import ReadImageResult from "./ReadImageResult.js"

async function readImageArrayBuffer(webWorker: Worker | null, arrayBuffer: ArrayBuffer, fileName: string, mimeType: string): Promise<ReadImageResult> {
  let worker = webWorker
  const { webworkerPromise, worker: usedWorker } = await createWebworkerPromise('image-io', worker)
  worker = usedWorker
  const image: Image = await webworkerPromise.postMessage(
        {
          operation: 'readImage',
          name: fileName,
          type: mimeType,
          data: arrayBuffer,
          config: config
        },
        [arrayBuffer]
      )
  return { image, webWorker: worker as Worker}
}

export default readImageArrayBuffer
