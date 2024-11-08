// Generated file. To retain edits, remove this comment.

import { JsonCompatible, TransformList } from 'itk-wasm'

interface WasmZstdReadTransformNodeResult {
  /** Whether the input could be read. If false, the output transform is not valid. */
  couldRead: JsonCompatible

  /** Output transform */
  transform: TransformList

}

export default WasmZstdReadTransformNodeResult
