import WebworkerPromise from 'webworker-promise'

// Internal function to create a web worker promise
function createWebworkerPromise(name: 'image-io' | 'mesh-io' | 'pipeline', existingWorker: Worker | null) {
  if (existingWorker) {
    const webworkerPromise = new WebworkerPromise(existingWorker)
    return Promise.resolve({ webworkerPromise, worker: existingWorker })
  }

  let worker = null
  // Enable bundlers, e.g. WebPack, to see these paths at build time
  switch (name) {
  case 'image-io':
    worker = new Worker(new URL('../../web-workers/image-io.worker.js', import.meta.url))
  case 'mesh-io':
    worker = new Worker(new URL('../../web-workers/mesh-io.worker.js', import.meta.url))
  case 'pipeline':
    worker = new Worker(new URL('../../web-workers/pipeline.worker.js', import.meta.url))
  default:
    throw Error(`Unsupported web worker type: ${name}`)
  }
  const webworkerPromise = new WebworkerPromise(worker)
  return Promise.resolve({ webworkerPromise, worker })
}

export default createWebworkerPromise
