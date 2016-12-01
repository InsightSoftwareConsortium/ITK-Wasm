const path = require('path')
const assert = require('chai').assert
const fs = require('fs')

const itk = require(path.resolve(__dirname, '..', 'dist', 'itk.js'))

const testFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'cthead1.png')

describe('readImage', function () {
  it('reads a file path given on the ITK filesystem', function () {
    const buffer = fs.readFileSync(testFilePath)

    const fileSystem = itk.fileSystem
    const BrowserFS = require('browserfs')
    const inMemory = new BrowserFS.FileSystem.InMemory()
    fileSystem.mount('/', inMemory)
    const filePath = path.join('/', path.basename(testFilePath))
    const bfs = BrowserFS.BFSRequire('fs')
    bfs.writeFileSync(filePath, buffer)

    const defaultImageType = new itk.ImageType()
    console.log('reading image....')
    return itk.readImage(defaultImageType, fileSystem, filePath).then(function (image) {
      console.log('read image')
      console.log(image)
      assert.strictEqual(image.imageType.dimension, 2)
    })
  })
})
