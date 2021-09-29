import EmscriptenModule from "../../core/EmscriptenModule.js"

import DICOMTagsReaderJSBinding from "./DICOMTagsReaderJSBinding.js"

interface DICOMTagsReaderEmscriptenModule extends EmscriptenModule {
  ITKDICOMTagReader:  { new (): DICOMTagsReaderJSBinding }
}

export default DICOMTagsReaderEmscriptenModule
