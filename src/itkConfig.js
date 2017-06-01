const config = require('config')

let itkConfig = {
  imageIOsPath: '/ImageIOs',
  webWorkersPath: '/WebWorkers'
}

if (typeof config.has === 'function') {
  if (config.has('itk.imageIOsPath')) {
    itkConfig['imageIOsPath'] = config.get('itk.imageIOsPath')
  }

  if (config.has('itk.webWorkersPath')) {
    itkConfig['webWorkersPath'] = config.get('itk.webWorkersPath')
  }
}

module.exports = itkConfig
