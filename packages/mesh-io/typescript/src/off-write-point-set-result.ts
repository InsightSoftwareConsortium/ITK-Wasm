// Generated file. To retain edits, remove this comment.

import { JsonCompatible, BinaryFile, WorkerPoolFunctionResult } from 'itk-wasm'

interface OffWritePointSetResult extends WorkerPoolFunctionResult {
  /** Whether the input could be written. If false, the output mesh is not valid. */
  couldWrite: JsonCompatible

  /** Output point set */
  serializedPointSet: BinaryFile

}

export default OffWritePointSetResult
