import imageJSComponentToIOComponent from './imageJSComponentToIOComponent.js'
import imageJSPixelTypeToIOPixelType from './imageJSPixelTypeToIOPixelType.js'

import ImageIOBaseEmscriptenModule from './ImageIOBaseEmscriptenModule.js'

import Image from '../../core/Image.js'
import getMatrixElement from '../../core/getMatrixElement.js'

function writeImageEmscriptenFSFile (emscriptenModule: ImageIOBaseEmscriptenModule, useCompression: boolean, image: Image, filePath: string): void {
  const imageIO = new emscriptenModule.ITKImageIO()
  imageIO.SetFileName(filePath)
  if (!imageIO.CanWriteFile(filePath)) {
    throw new Error('Could not write file: ' + filePath)
  }

  const dimension = image.imageType.dimension
  imageIO.SetNumberOfDimensions(dimension)

  const ioComponentType = imageJSComponentToIOComponent(emscriptenModule, image.imageType.componentType)
  if (ioComponentType === null) {
    throw Error('image component type cannot be unknown / null')
  }
  imageIO.SetComponentType(ioComponentType)

  const ioPixelType = imageJSPixelTypeToIOPixelType(emscriptenModule, image.imageType.pixelType)
  imageIO.SetPixelType(ioPixelType)

  imageIO.SetNumberOfComponents(image.imageType.components)

  for (let ii = 0; ii < dimension; ++ii) {
    imageIO.SetDimensions(ii, image.size[ii])
    imageIO.SetSpacing(ii, image.spacing[ii])
    imageIO.SetOrigin(ii, image.origin[ii])
    const directionColumn = new emscriptenModule.AxisDirectionType()
    directionColumn.resize(dimension, 0.0)
    for (let jj = 0; jj < dimension; ++jj) {
      directionColumn.set(jj, getMatrixElement(image.direction, dimension, jj, ii) as number)
    }
    imageIO.SetDirection(ii, directionColumn)
  }

  imageIO.SetUseCompression(useCompression)

  // Copy data to Emscripten heap (directly accessed from emscriptenModule.HEAPU8)
  if (image.data === null) {
    throw Error('image data cannot be null')
  }
  const numberOfBytes = image.data.length * image.data.BYTES_PER_ELEMENT
  const dataPtr = emscriptenModule._malloc(numberOfBytes)
  const dataHeap = new Uint8Array(emscriptenModule.HEAPU8.buffer, dataPtr, numberOfBytes)
  dataHeap.set(new Uint8Array(image.data.buffer))

  // The ImageIO's also call WriteImageInformation() because
  // itk::ImageFileWriter only calls Write()
  imageIO.Write(dataHeap.byteOffset)

  emscriptenModule._free(dataHeap.byteOffset)
}

export default writeImageEmscriptenFSFile
