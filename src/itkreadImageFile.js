const PromiseWorker = require('promise-worker-transferable')

const config = require('./itkConfig.js')

const worker = new window.Worker(config.webWorkersPath + '/ImageIOWorker.js')
const promiseWorker = new PromiseWorker(worker)

const readImageFile = (file) => {
  return new Promise(function (resolve, reject) {
    try {
      console.log('testing the worker')
      if (!worker) {
        reject(Error('Could not create ImageIOWorker'))
      }
      console.log('posting message')
      // Transfer with HTML5 structured clone algorithm
      // https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
      promiseWorker.postMessage(file).then(function (image) {
        console.log('resolving image')
        console.log(image)
        resolve(image)
      }).catch(function (error) {
        reject(error)
      })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = readImageFile
