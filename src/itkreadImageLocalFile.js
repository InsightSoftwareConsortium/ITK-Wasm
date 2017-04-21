const Image = require('./itkImage.js')
const ImageType = require('./itkImageType.js')
const IntTypes = require('./itkIntTypes.js')
const FloatTypes = require('./itkFloatTypes.js')
const Matrix = require('./itkMatrix.js')

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

  let ioDirection = new Matrix(ioDimensions, ioDimensions)
  if (ioDimensions > image.imageType.dimension) {
    for (let ii = 0; ii < ioDimensions; ++ii) {
      let directionColumn = imageIO.GetDefaultDirection(ii)
      for (let jj = 0; jj < ioDimensions; ++jj) {
        ioDirection.setElement(jj, ii, directionColumn.get(jj))
      }
    }
  } else {
    for (let ii = 0; ii < ioDimensions; ++ii) {
      let directionColumn = imageIO.GetDirection(ii)
      for (let jj = 0; jj < ioDimensions; ++jj) {
        ioDirection.setElement(jj, ii, directionColumn.get(jj))
      }
    }
  }

  for (let ii = 0; ii < image.imageType.dimension; ++ii) {
    if (ii < ioDimensions) {
      image.size[ii] = imageIO.GetDimensions(ii)
      image.spacing[ii] = imageIO.GetSpacing(ii)
      image.origin[ii] = imageIO.GetOrigin(ii)
      for (let jj = 0; jj < image.imageType.dimension; ++jj) {
        if (jj < ioDimensions) {
          let element = ioDirection.getElement(jj, ii)
          image.direction.setElement(jj, ii, element)
        } else {
          image.direction.setElement(jj, ii, 0.0)
        }
      }
    } else {
      image.size[ii] = 0
      image.spacing[ii] = 1.0
      image.origin[ii] = 0.0
      image.direction.setIdentity()
    }
  }

  // Spacing is expected to be greater than 0
  // If negative, flip image direction along this axis.
  for (let ii = 0; ii < image.imageType.dimension; ++ii) {
    if (image.spacing[ii] < 0.0) {
      image.spacing[ii] = -image.spacing[ii]
      for (let jj = 0; jj < image.imageType.dimension; ++jj) {
        image.direction.setElement(ii, jj, -1 * image.direction.getElement(ii, jj))
      }
    }
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
