import EmscriptenModule from '../core/EmscriptenModule.js'

interface PipelineEmscriptenModule extends EmscriptenModule {
  callMain(args: string[]): number

  resetModuleStdout(): void
  resetModuleStderr(): void
  getModuleStdout(): string
  getModuleStderr(): string
  print(text: string): void
  printErr(text: string): void

}

export default PipelineEmscriptenModule
