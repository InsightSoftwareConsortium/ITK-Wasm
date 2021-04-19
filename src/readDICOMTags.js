import createWebworkerPromise from './createWebworkerPromise'
import PromiseFileReader from 'promise-file-reader'

import config from './itkConfig'

const readDICOMTags = async (webWorker, file, tags = null) => {
  let worker = webWorker
  const { webworkerPromise, worker: usedWorker } = await createWebworkerPromise(
    'ImageIO',
    worker
  )
  worker = usedWorker
  const arrayBuffer = await PromiseFileReader.readAsArrayBuffer(file)
  try {
    const tagValues = await webworkerPromise.postMessage(
     {
        operation: 'readDICOMTags',
        name: file.name,
        type: file.type,
        data: arrayBuffer,
        tags: tags,
        config: config
      },
      [arrayBuffer]
    )
    return { tags: tagValues, webWorker: worker }
  } catch (error) {
    throw Error(error)
  }
}

export default readDICOMTags
