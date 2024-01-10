// Generated file. To retain edits, remove this comment.

import { WorkerPoolFunctionOption } from 'itk-wasm'

interface CompressStringifyOptions extends WorkerPoolFunctionOption {
  /** Stringify the output */
  stringify?: boolean

  /** Compression level, typically 1-9 */
  compressionLevel?: number

  /** dataURL prefix */
  dataUrlPrefix?: string

}

export default CompressStringifyOptions
