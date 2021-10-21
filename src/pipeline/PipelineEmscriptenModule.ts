import EmscriptenModule from '../core/EmscriptenModule.js'

interface PipelineEmscriptenModule extends EmscriptenModule {
  callMain: (args: string[]) => number

  resetModuleStdout: () => void
  resetModuleStderr: () => void
  getModuleStdout: () => string
  getModuleStderr: () => string
  print: (text: string) => void
  printErr: (text: string) => void

  // Note: Only available if the module was built with CMAKE_BUILD_TYPE set to
  // Debug. For example:
  //  itk-js-cli build my/project -- -DCMAKE_BUILD_TYPE:STRING=Debug
  getExceptionMessage: (num: number) => string

}

export default PipelineEmscriptenModule
