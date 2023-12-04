import axios from 'axios'
import * as Comlink from 'comlink'

import WorkerProxy from './web-workers/worker-proxy.js'

interface ItkWorker extends Worker {
  workerProxy: WorkerProxy
  originalTerminate: () => void
}

interface createWorkerProxyResult {
  workerProxy: WorkerProxy
  worker: ItkWorker
}

function workerToWorkerProxy (worker: Worker): createWorkerProxyResult {
  const workerProxy = Comlink.wrap(worker) as WorkerProxy
  const itkWebWorker = worker as ItkWorker
  itkWebWorker.workerProxy = workerProxy
  itkWebWorker.originalTerminate = itkWebWorker.terminate
  itkWebWorker.terminate = () => {
    itkWebWorker.workerProxy[Comlink.releaseProxy]()
    itkWebWorker.originalTerminate()
  }
  return { workerProxy, worker: itkWebWorker }
}

// Internal function to create a web worker promise
async function createWorkerProxy (existingWorker: Worker | null, pipelineWorkerUrl?: string | null): Promise<createWorkerProxyResult> {
  let workerProxy: WorkerProxy
  if (existingWorker != null) {
    // See if we have a worker promise attached the worker, if so reuse it. This ensures
    // that we can safely reuse the worker without issues.
    const itkWebWorker = existingWorker as ItkWorker
    if (itkWebWorker.workerProxy !== undefined) {
      workerProxy = itkWebWorker.workerProxy
      return { workerProxy, worker: itkWebWorker }
    } else {
      return workerToWorkerProxy(existingWorker)
    }
  }

  const workerUrl = pipelineWorkerUrl
  let worker = null
  if (workerUrl === null) {
    // Use the version built with the bundler
    //
    // Bundlers, e.g. WebPack, Vite, Rollup, see these paths at build time
    worker = new Worker(new URL('./web-workers/itk-wasm-pipeline.worker.js', import.meta.url), { type: 'module' })
  } else {
    if ((workerUrl as string).startsWith('http')) {
      const response = await axios.get((workerUrl as string), { responseType: 'blob' })
      const workerObjectUrl = URL.createObjectURL(response.data as Blob)
      worker = new Worker(workerObjectUrl, { type: 'module' })
    } else {
      worker = new Worker((workerUrl as string), { type: 'module' })
    }
  }

  return workerToWorkerProxy(worker)
}

export default createWorkerProxy
