// Generated file. To retain edits, remove this comment.

import { JsonCompatible, Transform } from 'itk-wasm'

interface MncReadTransformNodeResult {
  /** Whether the input could be read. If false, the output transform is not valid. */
  couldRead: JsonCompatible

  /** Output transform */
  transform: Transform

}

export default MncReadTransformNodeResult
