const registerPromiseWorker = require('promise-worker-transferable/register')

// const loadEmscriptenModule = require('./itkloadEmscriptenModule.js')
const ImageType = require('../itkImageType.js')
const Image = require('../itkImage.js')

registerPromiseWorker(function (input, withTransferList) {
  console.log(input)
  // const modulePath = path.join(config.imageIOsPath, 'itkPNGImageIOJSBinding.js')
  // const Module = loadEmscriptenModule(modulePath)
  // const image = readImageEmscriptenFSFile(Module, filePath)
  // resolve(image)
  let imageType = new ImageType(3)
  let image = new Image(imageType)
  return withTransferList(image, [image.buffer])
})
console.log('in the web worker')
