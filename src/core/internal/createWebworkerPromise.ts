import WebworkerPromise from 'webworker-promise'

import config from '../../itkConfig.js'

interface CreateWebworkerPromiseResult {
  webworkerPromise: typeof WebworkerPromise
  worker: Worker
}

// Internal function to create a web worker promise
async function createWebworkerPromise (name: 'image-io' | 'mesh-io' | 'pipeline', existingWorker: Worker | null): Promise<CreateWebworkerPromiseResult> {
  if (existingWorker != null) {
    const webworkerPromise = new WebworkerPromise(existingWorker)
    return await Promise.resolve({ webworkerPromise, worker: existingWorker })
  }

  let worker = null
  // Enable bundlers, e.g. WebPack, to see these paths at build time
  // importScripts / UMD is required over dynamic ESM import until Firefox
  // adds worker dynamic import support:
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1540913
  // switch (name) {
  // case 'image-io':
  // worker = new Worker(new URL('../../web-workers/image-io.worker.js', import.meta.url))
  // break
  // case 'mesh-io':
  // worker = new Worker(new URL('../../web-workers/mesh-io.worker.js', import.meta.url))
  // break
  // case 'pipeline':
  // worker = new Worker(new URL('../../web-workers/pipeline.worker.js', import.meta.url))
  // break
  // default:
  // throw Error('Unsupported web worker type')
  // }
  const itkModulesPath = config.itkModulesPath
  const min = 'min-'
  // debug
  // const min = ''
  switch (name) {
    case 'image-io':
      worker = new Worker(`${itkModulesPath}/web-workers/${min}bundles/image-io.worker.js`)
      break
    case 'mesh-io':
      worker = new Worker(`${itkModulesPath}/web-workers/${min}bundles/mesh-io.worker.js`)
      break
    case 'pipeline':
      worker = new Worker(`${itkModulesPath}/web-workers/${min}bundles/pipeline.worker.js`)
      break
    default:
      throw Error('Unsupported web worker type')
  }
  const webworkerPromise = new WebworkerPromise(worker)
  return { webworkerPromise, worker }
}

export default createWebworkerPromise
