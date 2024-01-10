import { WorkerPoolFunctionOption } from "itk-wasm"

interface WriteMeshOptions extends WorkerPoolFunctionOption {
  /** Use compression when writing the mesh if the IO formt supports it. */
  useCompression?: boolean

  /** Use a binary file type in the written file, if supported */
  binaryFileType?: boolean

  /** Mime type of the output mesh file. */
  mimeType?: string

  /** Only write the mesh information, not the pixel data. */
  informationOnly?: boolean
}

export default WriteMeshOptions
