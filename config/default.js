const path = require('path')
let config = {
  'itk': {
    imageIOsPath: path.resolve(__dirname, '..', 'dist', 'itkImageIOs'),
    webWorkersPath: path.resolve(__dirname, '..', 'dist', 'itkWebWorkers')
  }
}

module.exports = config
