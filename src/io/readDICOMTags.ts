import createWebWorkerPromise from '../core/internal/createWebWorkerPromise.js'
import { readAsArrayBuffer } from 'promise-file-reader'

import config from '../itkConfig.js'

import ReadDICOMTagsResult from './ReadDICOMTagsResult.js'

async function readDICOMTags (webWorker: Worker, file: File, tags: string[] | null = null): Promise<ReadDICOMTagsResult> {
  let worker = webWorker
  const { webworkerPromise, worker: usedWorker } = await createWebWorkerPromise(
    'image-io',
    worker
  )
  worker = usedWorker
  const arrayBuffer = await readAsArrayBuffer(file)
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
  } catch (error: any) {
    throw Error(error.toString())
  }
}

export default readDICOMTags
