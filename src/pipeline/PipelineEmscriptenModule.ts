interface PipelineEmscriptenModule {
  mountContainingDirectory(filePath: string): void
  unmountContainingDirectory(filePath: string): void
  mkdirs(dirs: string[]): void

  resetModuleStdout(): void
  resetModuleStderr(): void
  getModuleStdout(): string
  getModuleStderr(): string
  print(text: string): void
  printErr(text: string): void

  readFile(path: string, opts: { encoding?: string, flags?: string }): string | Uint8Array
  writeFile(path: string, data: string | Uint8Array, opts?: { flags?: string }): void
  unlink(path: string): void
  open(path: string, flags: string, mode?: string): object
  stat(path: string): { size: number }
  close(stream: object): void
  read(stream: object, buffer: ArrayBufferView, offset: number, length: number, position?: number): void

  callMain(args: string[]): number
}

export default PipelineEmscriptenModule
