const path = require('path')
const assert = require('chai').assert
const File = require('file-api').File

const itk = require(path.resolve(__dirname, '..', 'dist', 'itk.js'))

const testFilePath = path.resolve(__dirname, 'build', 'ExternalData', 'test', 'cthead1.png')

describe('readImage', function () {
  it('reads a file path given on the ITK filesystem', function () {
    // var SystemRegisterLoader = require('system-register-loader')

    // var loader = new SystemRegisterLoader()

    // loader.import('./ITKBridgeJavaScript/dist/ImageIOs/itkPNGImageIOJSBinding.js').then(function (imageIO) {
    // // ...
    // console.log(imageIO)
    // var BrowserFS = require('../../node_modules/browserfs/dist/browserfs.js')
    // var BFS = new BrowserFS.EmscriptenFS()
    // console.log(BFS)
    // // Module['BFS'] = BFS
    // })

    const file = new File(testFilePath)
    const defaultImageType = new itk.ImageType()
    const image = itk.readImageFile(defaultImageType, file)
    assert.strictEqual(image.imageType.dimension, 2)
  })
})
