// Generated file. To retain edits, remove this comment.

import { JsonCompatible, PointSet } from 'itk-wasm'

interface WasmZstdReadPointSetNodeResult {
  /** Whether the input could be read. If false, the output point set is not valid. */
  couldRead: JsonCompatible

  /** Output point set */
  pointSet: PointSet

}

export default WasmZstdReadPointSetNodeResult
