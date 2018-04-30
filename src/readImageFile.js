import createWebworkerPromise from './createWebworkerPromise'
import PromiseFileReader from 'promise-file-reader'

import config from './itkConfig'

const readImageFile = (webWorker, file) => {
  let worker = webWorker
  return createWebworkerPromise('ImageIO', worker)
    .then(({ webworkerPromise, worker: usedWorker }) => {
      worker = usedWorker
      return PromiseFileReader.readAsArrayBuffer(file)
        .then((arrayBuffer) => {
          return webworkerPromise.postMessage(
            {
              operation: 'readImage',
              name: file.name,
              type: file.type,
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

export default readImageFile
