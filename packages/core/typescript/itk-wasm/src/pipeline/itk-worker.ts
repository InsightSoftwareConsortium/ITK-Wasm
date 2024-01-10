import WorkerProxy from './web-workers/worker-proxy.js'

interface ItkWorker extends Worker {
  terminated: boolean
  workerProxy: WorkerProxy
  originalTerminate: () => void
}

export default ItkWorker
