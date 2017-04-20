const Image = require('./itkImage.js')
const ImageType = require('./itkImageType.js')
const IntTypes = require('./itkIntTypes.js')
const FloatTypes = require('./itkFloatTypes.js')

const path = require('path')
const config = require('./itkConfig.js')

const internalReadImage = (module, imageType, filePath) => {
  const imageIO = new module.ITKPNGImageIO()
  imageIO.SetFileName(filePath)
  if (!imageIO.CanReadFile(filePath)) {
    return null
  }
  imageIO.ReadImageInformation()
  const ioDimensions = imageIO.GetNumberOfDimensions()
  const ioComponentType = imageIO.GetComponentType()
  let image = null
  if (imageType === null) {
    switch (ioComponentType) {
      case module.IOComponentType.UCHAR: {
        const type = new ImageType(IntTypes.UInt8, ioDimensions)
        image = new Image(type)
        break
      }
      case module.IOComponentType.CHAR: {
        const type = new ImageType(IntTypes.Int8, ioDimensions)
        image = new Image(type)
        break
      }
      case module.IOComponentType.USHORT: {
        const type = new ImageType(IntTypes.UInt16, ioDimensions)
        image = new Image(type)
        break
      }
      case module.IOComponentType.SHORT: {
        const type = new ImageType(IntTypes.Int16, ioDimensions)
        image = new Image(type)
        break
      }
      case module.IOComponentType.UINT: {
        const type = new ImageType(IntTypes.UInt32, ioDimensions)
        image = new Image(type)
        break
      }
      case module.IOComponentType.INT: {
        const type = new ImageType(IntTypes.Int32, ioDimensions)
        image = new Image(type)
        break
      }
      case module.IOComponentType.ULONG: {
        const type = new ImageType(IntTypes.UInt64, ioDimensions)
        image = new Image(type)
        break
      }
      case module.IOComponentType.LONG: {
        const type = new ImageType(IntTypes.Int64, ioDimensions)
        image = new Image(type)
        break
      }
      case module.IOComponentType.FLOAT: {
        const type = new ImageType(FloatTypes.Float32, ioDimensions)
        image = new Image(type)
        break
      }
      case module.IOComponentType.DOUBLE: {
        const type = new ImageType(FloatTypes.Float64, ioDimensions)
        image = new Image(type)
        break
      }
      default:
        return null
    }
  } else {
    image = new Image(imageType)
  }

  return image
}

const readImageLocalFile = (imageType, filePath) => {
  return new Promise(function (resolve, reject) {
    try {
      const modulePath = path.join(config.imageIOsURL, 'itkPNGImageIOJSBinding.js')
      const Module = require(modulePath)
      Module.mountContainingDirectory(filePath)
      const image = internalReadImage(Module, imageType, filePath)
      Module.unmountContainingDirectory(filePath)
      resolve(image)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = readImageLocalFile
