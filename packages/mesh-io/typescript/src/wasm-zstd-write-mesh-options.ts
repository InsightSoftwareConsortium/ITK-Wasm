// Generated file. To retain edits, remove this comment.

import { WorkerPoolFunctionOption } from 'itk-wasm'

interface WasmZstdWriteMeshOptions extends WorkerPoolFunctionOption {
  /** Only write mesh metadata -- do not write pixel data. */
  informationOnly?: boolean

  /** Use compression in the written file, if supported */
  useCompression?: boolean

  /** Use a binary file type in the written file, if supported */
  binaryFileType?: boolean

}

export default WasmZstdWriteMeshOptions
