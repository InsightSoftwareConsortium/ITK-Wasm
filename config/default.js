const path = require('path')
let config = {
  'itk': {
    imageIOsPath: path.resolve(__dirname, '..', 'dist', 'ImageIOs'),
    webWorkersPath: path.resolve(__dirname, '..', 'dist', 'WebWorkers')
  }
}

module.exports = config
