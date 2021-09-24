import DICOMImageSeriesReaderJSBinding from "./DICOMImageSeriesReaderJSBinding.js"
import IOComponent from './IOComponent.js'
import IOPixel from './IOPixel.js'

interface DICOMImageSeriesReaderEmscriptenModule {
  ITKDICOMImageSeriesReader:  { new (): DICOMImageSeriesReaderJSBinding }
  IOComponentType: typeof IOComponent
  IOPixelType: typeof IOPixel
}

export default DICOMImageSeriesReaderEmscriptenModule
