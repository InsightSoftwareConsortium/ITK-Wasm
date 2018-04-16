import createWebworkerPromise from './createWebworkerPromise'
import PromiseFileReader from 'promise-file-reader'

import config from './itkConfig'

const readImageBlob = (webWorker, blob, fileName, mimeType) => {
  let worker = webWorker
  return createWebworkerPromise('ImageIO', worker)
    .then(({ webworkerPromise, worker: usedWorker }) => {
      worker = usedWorker
      return PromiseFileReader.readAsArrayBuffer(blob)
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
        }).then(function (image) {
          return Promise.resolve({ image, webWorker: worker })
        })
    })
}

export default readImageBlob
