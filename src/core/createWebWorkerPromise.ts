import axios from 'axios'
import WebworkerPromise from 'webworker-promise'

import config from '../itkConfig.js'

interface createWebWorkerPromiseResult {
  webworkerPromise: typeof WebworkerPromise
  worker: Worker
}

interface itkWorker extends Worker {
  workerPromise?: typeof WebworkerPromise
}

// Internal function to create a web worker promise
async function createWebWorkerPromise (existingWorker: Worker | null, pipelineWorkerUrl?: string | null): Promise<createWebWorkerPromiseResult> {
  let workerPromise: typeof WebworkerPromise
  if (existingWorker != null) {
    // See if we have a worker promise attached the worker, if so reuse it. This ensures
    // that we can safely reuse the worker without issues.
    const itkWebWorker = existingWorker as itkWorker
    if (itkWebWorker.workerPromise !== undefined) {
      workerPromise = itkWebWorker.workerPromise
    } else {
      workerPromise = new WebworkerPromise(existingWorker)
    }

    return await Promise.resolve({ webworkerPromise: workerPromise, worker: existingWorker })
  }

  const workerUrl = typeof pipelineWorkerUrl === 'undefined' ? config.pipelineWorkerUrl : pipelineWorkerUrl
  let worker = null
  // @ts-expect-error: error TS2339: Property 'webWorkersUrl' does not exist on type '{ pipelineWorkerUrl: string; imageIOUrl: string; meshIOUrl: string; pipelinesUrl: string; }
  const webWorkersUrl = config.webWorkersUrl
  if (typeof webWorkersUrl !== 'undefined') {
    console.warn('itkConfig webWorkersUrl is deprecated. Please use pipelineWorkerUrl with the full path to the pipeline worker.')
    const min = 'min-'
    // debug
    // const min = ''

    const webWorkerString = webWorkersUrl as string
    if (webWorkerString.startsWith('http')) {
      const response = await axios.get(`${webWorkerString}/${min}bundles/pipeline.worker.js`, { responseType: 'blob' })
      worker = new Worker(URL.createObjectURL(response.data as Blob))
    } else {
      worker = new Worker(`${webWorkerString}/${min}bundles/pipeline.worker.js`)
    }
  } else if (workerUrl === null) {
    // Use the version built with the bundler
    //
    // Bundlers, e.g. WebPack, see these paths at build time
    //
    // importScripts / UMD is required over dynamic ESM import until Firefox
    // adds worker dynamic import support:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1540913
    worker = new Worker(new URL('../web-workers/pipeline.worker.js', import.meta.url))
  } else {
    if (workerUrl.startsWith('http')) {
      const response = await axios.get(workerUrl, { responseType: 'blob' })
      worker = new Worker(URL.createObjectURL(response.data as Blob))
    } else {
      worker = new Worker(workerUrl)
    }
  }

  const webworkerPromise = new WebworkerPromise(worker)

  // Attach the worker promise to the worker, so if the worker is reused we can
  // also reuse the the worker promise.
  const itkWebWorker = (worker as itkWorker)
  itkWebWorker.workerPromise = webworkerPromise
  return { webworkerPromise, worker: itkWebWorker }
}

export default createWebWorkerPromise
