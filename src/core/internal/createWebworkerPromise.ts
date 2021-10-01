import WebworkerPromise from 'webworker-promise'

import config from '../../itkConfig.js'

// Internal function to create a web worker promise
function createWebworkerPromise(name: string, existingWorker: Worker | null) {
  if (existingWorker) {
    const webworkerPromise = new WebworkerPromise(existingWorker)
    return Promise.resolve({ webworkerPromise, worker: existingWorker })
  }

  const worker = new Worker(new URL(`${config.itkModulesPath}/web-workers/${name}.worker.js`, import.meta.url))
  const webworkerPromise = new WebworkerPromise(worker)
  return Promise.resolve({ webworkerPromise, worker })
}

export default createWebworkerPromise
