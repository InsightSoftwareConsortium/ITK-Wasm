import DICOMTagsReaderJSBinding from "./DICOMTagsReaderJSBinding.js"

interface DICOMTagsReaderEmscriptenModule {
  ITKDICOMTagReader:  { new (): DICOMTagsReaderJSBinding }
}

export default DICOMTagsReaderEmscriptenModule
