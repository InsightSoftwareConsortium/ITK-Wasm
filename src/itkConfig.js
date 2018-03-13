// Note: For the WASM files to be loaded, imageIOsPath must have the path
// '../ImageIOs' relative to webWorkersPath
let itkConfig = {
  webWorkersPath: 'itk/WebWorkers',
  imageIOsPath: '../../itk/ImageIOs',
  meshIOsPath: '../../itk/MeshIOs',
}

module.exports = itkConfig
