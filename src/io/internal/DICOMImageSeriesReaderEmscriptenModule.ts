import ITKWASMEmscriptenModule from '../../core/ITKWASMEmscriptenModule.js'

import DICOMImageSeriesReaderJSBinding from './DICOMImageSeriesReaderJSBinding.js'
import VectorJSBinding from '../../core/internal/VectorJSBinding.js'

import IOComponent from './IOComponent.js'
import IOPixel from './IOPixel.js'

interface DICOMImageSeriesReaderEmscriptenModule extends ITKWASMEmscriptenModule {
  ITKDICOMImageSeriesReader: new () => DICOMImageSeriesReaderJSBinding
  IOComponentType: typeof IOComponent
  IOPixelType: typeof IOPixel
  FileNamesContainerType: new() => VectorJSBinding<string>
  mountContainingDir: (dir: string) => string
  unmountContainingDir: (dir: string) => void
  getExceptionMessage: (num: number) => string
}

export default DICOMImageSeriesReaderEmscriptenModule
