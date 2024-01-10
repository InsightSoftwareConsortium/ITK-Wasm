// Generated file. To retain edits, remove this comment.

import { WorkerPoolFunctionOption } from 'itk-wasm'

interface ByuWriteMeshOptions extends WorkerPoolFunctionOption {
  /** Only write image metadata -- do not write pixel data. */
  informationOnly?: boolean

  /** Use compression in the written file, if supported */
  useCompression?: boolean

  /** Use a binary file type in the written file, if supported */
  binaryFileType?: boolean

}

export default ByuWriteMeshOptions
