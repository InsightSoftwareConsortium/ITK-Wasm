const Image = require('./Image.js')
const ImageType = require('./ImageType.js')
const Matrix = require('./Matrix.js')

const imageIOComponentToJSComponent = require('./imageIOComponentToJSComponent.js')
const imageIOPixelTypeToJSPixelType = require('./imageIOPixelTypeToJSPixelType.js')

const readImageEmscriptenFSDICOMFileSeries = (imageIOModule, seriesReaderModule, directory, firstFile) => {
  const imageIO = new imageIOModule.ITKImageIO()
  imageIO.SetFileName(firstFile)
  if (!imageIO.CanReadFile(firstFile)) {
    throw new Error('Could not read file: ' + firstFile)
  }
  imageIO.ReadImageInformation()

  const dimension = 3
  let imageType = new ImageType(dimension)

  const ioComponentType = imageIO.GetComponentType()
  imageType.componentType = imageIOComponentToJSComponent(imageIOModule, ioComponentType)

  const ioPixelType = imageIO.GetPixelType()
  imageType.pixelType = imageIOPixelTypeToJSPixelType(imageIOModule, ioPixelType)

  imageType.components = imageIO.GetNumberOfComponents()

  let image = new Image(imageType)

  const seriesReader = new seriesReaderModule.ITKDICOMImageSeriesReader()
  seriesReader.SetIOComponentType(ioComponentType)
  seriesReader.SetIOPixelType(ioPixelType)
  seriesReader.SetDirectory(directory)
  if(seriesReader.Read()) {
    throw new Error('Could not read series')
  }

  for (let ii = 0; ii < dimension; ++ii) {
    image.spacing[ii] = seriesReader.GetSpacing(ii)
    image.size[ii] = seriesReader.GetSize(ii)
    image.origin[ii] = seriesReader.GetOrigin(ii)
    for (let jj = 0; jj < dimension; ++jj) {
      image.direction.setElement(ii, jj, seriesReader.GetDirection(ii, jj))
    }
  }
  image.data = seriesReader.GetPixelBufferData()

  return image
}

module.exports = readImageEmscriptenFSDICOMFileSeries
