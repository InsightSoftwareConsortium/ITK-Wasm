import createWebworkerPromise from './createWebworkerPromise'
import PromiseFileReader from 'promise-file-reader'

import config from './itkConfig'

const readImageFile = async (webWorker, file) => {
  let worker = webWorker
  const { webworkerPromise, worker: usedWorker } = await createWebworkerPromise(
    'ImageIO',
    worker
  )
  worker = usedWorker
  const arrayBuffer = await PromiseFileReader.readAsArrayBuffer(file)
  try {
    console.log('readImageFile')
    const image = await webworkerPromise.postMessage(
      {
        operation: 'readImage',
        name: file.name,
        type: file.type,
        data: arrayBuffer,
        config: config
      },
      [arrayBuffer]
    )
    return { image, webWorker: worker }
  } catch (error) {
    throw Error(error)
  }
}

export default readImageFile
