const PromiseWorker = require('promise-worker-transferable')

const config = require('./itkConfig.js')

// const loadEmscriptenModule = require('./itkloadEmscriptenModule.js')
const ImageType = require('./itkImageType.js')
const Image = require('./itkImage.js')

const worker = new window.Worker(config.webWorkersPath + '/ImageIOWorker.js')
const promiseWorker = new PromiseWorker(worker)

const readImageFile = (file) => {
  return new Promise(function (resolve, reject) {
    try {
      if (!worker) {
        reject(Error('Could not create ImageIOWorker'))
      }
      promiseWorker.postMessage('File', [file]).then(function (image) {
        resolve(image)
      }).catch(function (error) {
        reject(error)
      })
      // const modulePath = path.join(config.imageIOsPath, 'itkPNGImageIOJSBinding.js')
      // const Module = loadEmscriptenModule(modulePath)
      // const image = readImageEmscriptenFSFile(Module, filePath)
      // resolve(image)
      let imageType = new ImageType(3)
      let image = new Image(imageType)
      resolve(image)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = readImageFile
