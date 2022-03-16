import axios from 'axios'
import WebworkerPromise from 'webworker-promise'

import config from '../../itkConfig.js'

interface createWebWorkerPromiseResult {
  webworkerPromise: typeof WebworkerPromise
  worker: Worker
}

// Internal function to create a web worker promise
async function createWebWorkerPromise (existingWorker: Worker | null): Promise<createWebWorkerPromiseResult> {
  if (existingWorker != null) {
    const webworkerPromise = new WebworkerPromise(existingWorker)
    return await Promise.resolve({ webworkerPromise, worker: existingWorker })
  }

  let worker = null
  // Enable bundlers, e.g. WebPack, to see these paths at build time
  // importScripts / UMD is required over dynamic ESM import until Firefox
  // adds worker dynamic import support:
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1540913
  // worker = new Worker(new URL('../../web-workers/pipeline.worker.js', import.meta.url))
  const webWorkersUrl = config.webWorkersUrl
  const min = 'min-'
  // debug
  // const min = ''

  if (webWorkersUrl.startsWith('http')) {
    const response = await axios.get(`${webWorkersUrl}/${min}bundles/pipeline.worker.js`, { responseType: 'blob' })
    worker = new Worker(URL.createObjectURL(response.data as Blob))
  } else {
    worker = new Worker(`${webWorkersUrl}/${min}bundles/pipeline.worker.js`)
  }

  const webworkerPromise = new WebworkerPromise(worker)
  return { webworkerPromise, worker }
}

export default createWebWorkerPromise
