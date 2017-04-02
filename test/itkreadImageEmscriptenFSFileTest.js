const path = require('path')
const assert = require('chai').assert
const File = require('file-api').File

const itk = require(path.resolve(__dirname, '..', 'dist', 'itk.js'))

const testFilePath = path.resolve(__dirname, 'build', 'ExternalData', 'test', 'cthead1.png')

describe('readImageEmscriptenFSFile', function () {
  it('reads a file path given on the Emscripten filesystem', function () {
    const file = new File(testFilePath)
    const defaultImageType = new itk.ImageType()
    const image = itk.readImageFile(defaultImageType, file)
    assert.strictEqual(image.imageType.dimension, 2)
  })
})
