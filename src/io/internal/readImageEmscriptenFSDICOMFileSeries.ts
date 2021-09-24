import Image from "../../core/Image.js"
import ImageType from "../../core/ImageType.js"

import imageIOComponentToJSComponent from "./imageIOComponentToJSComponent.js"
import imageIOPixelTypeToJSPixelType from "./imageIOPixelTypeToJSPixelType.js"

import DICOMImageSeriesReaderEmscriptenModule from "./DICOMImageSeriesReaderEmscriptenModule.js"

function readImageEmscriptenFSDICOMFileSeries(seriesReaderModule: DICOMImageSeriesReaderEmscriptenModule, fileNames: string[], singleSortedSeries: boolean) {
  const seriesReader = new seriesReaderModule.ITKDICOMImageSeriesReader()
  const firstFile = fileNames[0]
  if (!seriesReader.CanReadTestFile(firstFile)) {
    throw new Error('Could not read file: ' + firstFile)
  }
  seriesReader.SetTestFileName(firstFile)
  seriesReader.ReadTestImageInformation()

  const ioComponentType = seriesReader.GetIOComponentType()
  const componentType = imageIOComponentToJSComponent(seriesReaderModule, ioComponentType)

  const ioPixelType = seriesReader.GetIOPixelType()
  const pixelType = imageIOPixelTypeToJSPixelType(seriesReaderModule, ioPixelType)

  const components = seriesReader.GetNumberOfComponents()

  const dimension = 3
  const imageType = new ImageType(dimension, componentType, pixelType, components)

  const image = new Image(imageType)

  seriesReader.SetIOComponentType(ioComponentType)
  seriesReader.SetIOPixelType(ioPixelType)
  const fileNamesContainer = new seriesReaderModule.FileNamesContainerType()
  fileNames.forEach((fileName) => {
    fileNamesContainer.push_back(fileName)
  })
  if (singleSortedSeries) {
    seriesReader.SetFileNames(fileNamesContainer)
  } else {
    const directory = (fileNames[0].match(/.*\//) as string[])[0]
    seriesReader.SetDirectory(directory)
  }
  if (seriesReader.Read()) {
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
  seriesReader.DeleteImage()

  return image
}

export default readImageEmscriptenFSDICOMFileSeries
