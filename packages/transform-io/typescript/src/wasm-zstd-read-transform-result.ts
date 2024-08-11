// Generated file. To retain edits, remove this comment.

import { JsonCompatible, Transform, WorkerPoolFunctionResult } from 'itk-wasm'

interface WasmZstdReadTransformResult extends WorkerPoolFunctionResult {
  /** Whether the input could be read. If false, the output transform is not valid. */
  couldRead: JsonCompatible

  /** Output transform */
  transform: Transform

}

export default WasmZstdReadTransformResult
