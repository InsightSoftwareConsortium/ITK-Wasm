import ITKWASMEmscriptenModule from '../../core/ITKWASMEmscriptenModule.js'

import DICOMTagsReaderJSBinding from './DICOMTagsReaderJSBinding.js'

interface DICOMTagsReaderEmscriptenModule extends ITKWASMEmscriptenModule {
  ITKDICOMTagReader: new () => DICOMTagsReaderJSBinding
}

export default DICOMTagsReaderEmscriptenModule
