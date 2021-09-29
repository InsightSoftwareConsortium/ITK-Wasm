import EmscriptenModule from '../core/EmscriptenModule.js'

interface PipelineEmscriptenModule extends EmscriptenModule {
  callMain(args: string[]): number
}

export default PipelineEmscriptenModule
