import WebworkerPromise from 'webworker-promise'
import axios from 'axios'

import config from './itkConfig'

// Internal function to create a web worker promise
const createWebworkerPromise = (name, existingWorker) => {
  if (existingWorker) {
    const webworkerPromise = new WebworkerPromise(existingWorker)
    return Promise.resolve({ webworkerPromise, worker: existingWorker })
  }

  const webWorkerUrl = `${config.itkModulesPath}/WebWorkers/${name}.worker.js`
  if (webWorkerUrl.startsWith('http')) {
    return axios.get(webWorkerUrl, { responseType: 'blob' })
      .then(function (response) {
        const worker = new window.Worker(
          URL.createObjectURL(response.data)  // eslint-disable-line
        )
        const webworkerPromise = new WebworkerPromise(worker)
        return { webworkerPromise, worker }
      })
  }

  const worker = new window.Worker(webWorkerUrl)
  const webworkerPromise = new WebworkerPromise(worker)
  return Promise.resolve({ webworkerPromise, worker })
}

export default createWebworkerPromise
