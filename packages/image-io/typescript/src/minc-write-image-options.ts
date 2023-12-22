// Generated file. To retain edits, remove this comment.

import { WorkerPoolFunctionOption } from 'itk-wasm'

interface MincWriteImageOptions extends WorkerPoolFunctionOption {
  /** Only write image metadata -- do not write pixel data. */
  informationOnly?: boolean

  /** Use compression in the written file */
  useCompression?: boolean

}

export default MincWriteImageOptions
