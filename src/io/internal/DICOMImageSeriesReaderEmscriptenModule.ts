import DICOMImageSeriesReaderJSBinding from "./DICOMImageSeriesReaderJSBinding.js"
import VectorJSBinding from '../../core/internal/VectorJSBinding.js'

import IOComponent from './IOComponent.js'
import IOPixel from './IOPixel.js'

interface DICOMImageSeriesReaderEmscriptenModule {
  ITKDICOMImageSeriesReader:  { new (): DICOMImageSeriesReaderJSBinding }
  IOComponentType: typeof IOComponent
  IOPixelType: typeof IOPixel
  FileNamesContainerType: { new(): VectorJSBinding<string> }
  mountContainingDirectory(dir: string): string
  unmountContainingDirectory(dir: string): void
}

export default DICOMImageSeriesReaderEmscriptenModule
