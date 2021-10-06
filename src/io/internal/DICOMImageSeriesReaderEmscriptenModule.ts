import EmscriptenModule from '../../core/EmscriptenModule.js'

import DICOMImageSeriesReaderJSBinding from "./DICOMImageSeriesReaderJSBinding.js"
import VectorJSBinding from '../../core/internal/VectorJSBinding.js'

import IOComponent from './IOComponent.js'
import IOPixel from './IOPixel.js'

interface DICOMImageSeriesReaderEmscriptenModule extends EmscriptenModule {
  ITKDICOMImageSeriesReader:  { new (): DICOMImageSeriesReaderJSBinding }
  IOComponentType: typeof IOComponent
  IOPixelType: typeof IOPixel
  FileNamesContainerType: { new(): VectorJSBinding<string> }
  mountContainingDirectory(dir: string): string
  unmountContainingDirectory(dir: string): void
  getExceptionMessage(num: number): string
}

export default DICOMImageSeriesReaderEmscriptenModule
