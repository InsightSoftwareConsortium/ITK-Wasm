import * as Comlink from 'comlink'

import WorkerProxy from './web-workers/worker-proxy.js'
import createWebWorker from './create-web-worker.js'
import ItkWorker from './itk-worker.js'
import RunPipelineOptions from './run-pipeline-options.js'

interface createWorkerProxyResult {
  workerProxy: WorkerProxy
  worker: ItkWorker
}

function workerToWorkerProxy (worker: Worker): createWorkerProxyResult {
  const workerProxy = Comlink.wrap(worker) as WorkerProxy
  const itkWebWorker = worker as ItkWorker
  itkWebWorker.terminated = false
  itkWebWorker.workerProxy = workerProxy
  itkWebWorker.originalTerminate = itkWebWorker.terminate
  itkWebWorker.terminate = () => {
    itkWebWorker.terminated = true
    itkWebWorker.workerProxy[Comlink.releaseProxy]()
    itkWebWorker.originalTerminate()
  }
  return { workerProxy, worker: itkWebWorker }
}

// Internal function to create a web worker proxy
async function createWorkerProxy (existingWorker: Worker | null, pipelineWorkerUrl?: string | null, queryParams?: RunPipelineOptions['pipelineQueryParams']): Promise<createWorkerProxyResult> {
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

  const worker = await createWebWorker(pipelineWorkerUrl, queryParams)

  return workerToWorkerProxy(worker)
}

export default createWorkerProxy
